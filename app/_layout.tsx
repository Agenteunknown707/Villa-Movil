import { Stack } from 'expo-router';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import * as SplashScreen from 'expo-splash-screen';

// Mantener visible la pantalla de splash hasta que se carguen las fuentes
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  useEffect(() => {
    // NOTA: Aquí se cargarían recursos iniciales, como fuentes, datos de usuario, etc.
    // Por ahora, solo ocultamos la pantalla de splash después de un breve retraso
    setTimeout(() => {
      SplashScreen.hideAsync();
    }, 500);
  }, []);

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <Stack 
        screenOptions={{ 
          headerShown: false,
          contentStyle: { backgroundColor: '#f8f9fa' },
          animation: 'slide_from_right',
          animationDuration: 200,
          presentation: 'card',
        }}
      >
        <Stack.Screen name="index" />
        <Stack.Screen name="signup" />
        <Stack.Screen name="forgot-password" />
        <Stack.Screen 
          name="(tabs)" 
          options={{ 
            headerShown: false,
            animation: 'fade',
          }} 
        />
      </Stack>
    </SafeAreaProvider>
  );
}