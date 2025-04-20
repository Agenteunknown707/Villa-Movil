import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image } from 'react-native';

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <View style={styles.container}>
        <Image
          source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CF5rtamPzmOvzKH9vtX77bM37exXIc.png' }}
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.title}>Esta pantalla no existe</Text>
        <Link href="/" style={styles.link}>
          <Text style={styles.linkText}>Volver a la pantalla de inicio</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  logo: {
    width: 200,
    height: 100,
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  link: {
    marginTop: 15,
    paddingVertical: 10,
  },
  linkText: {
    fontSize: 16,
    color: '#E91E63', // Rosa del logo
  },
});