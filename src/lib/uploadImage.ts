import * as ImagePicker from 'expo-image-picker';

export async function pickAndUploadImage() {
  // 1. Solicitud de permisos al sistema operativo
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Es estrictamente necesario otorgar permisos a la galería.');
    return null;
  }

  // 2. Despliegue de la interfaz de selección
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ImagePicker.MediaTypeOptions.Images,
    allowsEditing: true,
    aspect: [1, 1],
    quality: 0.8,
  });

  if (result.canceled) return null;

  const localUri = result.assets[0].uri;
  const fileName = localUri.split('/').pop() || 'foto.jpg';

  try {
    // 3. Conexión con tu servidor backend para obtener el pase de AWS
    // Reemplaza localhost con la IP de tu PC si pruebas en un dispositivo físico
    const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api'; 
    
    const urlResponse = await fetch(`${API_URL}/upload`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fileName, fileType: 'image/jpeg' }),
    });

    if (!urlResponse.ok) throw new Error('Fallo al obtener la autorización del servidor');

    const { signedUrl, publicUrl } = await urlResponse.json();

    // 4. Transformación del archivo local y transferencia directa a Amazon S3
    const imageResponse = await fetch(localUri);
    const blob = await imageResponse.blob();

    await fetch(signedUrl, {
      method: 'PUT',
      body: blob,
      headers: { 'Content-Type': 'image/jpeg' },
    });

    // 5. La URL pública finalizada está lista para guardarse en el perfil del usuario
    return publicUrl;

  } catch (error) {
    console.error('Anomalía detectada durante la transferencia:', error);
    return null;
  }
}
