import * as ImagePicker from 'expo-image-picker';

export async function pickAndUploadImage(): Promise<string | null> {
  // 1. Solicitud de permisos
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Es estrictamente necesario otorgar permisos a la galería.');
    return null;
  }

  // 2. Selección de imagen
  // FIX: mediaTypes acepta el string 'images' en expo-image-picker v15 (SDK 54).
  // MediaTypeOptions está deprecado y causa el error de cast en Android.
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  const asset = result.assets[0];
  const localUri = asset.uri;
  const fileName = localUri.split('/').pop() || 'foto.jpg';

  // Detectar mimeType real del asset
  const mimeType: string =
    (asset as any).mimeType ??
    (() => {
      const ext = fileName.split('.').pop()?.toLowerCase();
      if (ext === 'png') return 'image/png';
      if (ext === 'gif') return 'image/gif';
      if (ext === 'webp') return 'image/webp';
      if (ext === 'heic' || ext === 'heif') return 'image/heic';
      return 'image/jpeg';
    })();

  try {
    const API_URL = process.env.EXPO_PUBLIC_API_URL;
    if (!API_URL) {
      console.warn('[uploadImage] EXPO_PUBLIC_API_URL no definida.');
    }
    const baseUrl = API_URL ?? 'http://localhost:3000/api';

    const urlResponse = await fetch(`${baseUrl}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileType: mimeType }),
    });

    if (!urlResponse.ok) throw new Error('Fallo al obtener autorización del servidor');

    const { signedUrl, publicUrl } = await urlResponse.json();

    const imageResponse = await fetch(localUri);
    const blob = await imageResponse.blob();

    const s3Response = await fetch(signedUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': mimeType },
    });

    if (!s3Response.ok) throw new Error(`S3 rechazó la subida: ${s3Response.status}`);

    return publicUrl;

  } catch (error) {
    console.error('Error durante la transferencia:', error);
    return null;
  }
}
