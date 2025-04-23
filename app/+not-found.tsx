import React, { useRef, useEffect } from 'react';
import { Link, Stack } from 'expo-router';
import { StyleSheet, Text, View, Image, Animated, Easing } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function NotFoundScreen() {
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const logoScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
      Animated.spring(logoScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <>
      <Stack.Screen options={{ title: 'Página no encontrada' }} />
      <View style={styles.container}>
        <LinearGradient
          colors={['rgba(233, 30, 99, 0.05)', 'rgba(156, 39, 176, 0.05)']}
          style={styles.gradient}
        />
        
        <Animated.View 
          style={[
            styles.contentContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <BlurView intensity={70} tint="light" style={styles.blurContainer}>
            <Animated.View 
              style={[
                styles.logoContainer,
                {
                  transform: [{ scale: logoScaleAnim }]
                }
              ]}
            >
              <Image
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CF5rtamPzmOvzKH9vtX77bM37exXIc.png' }}
                style={styles.logo}
                resizeMode="contain"
              />
            </Animated.View>
            
            <Text style={styles.title}>Esta pantalla no existe</Text>
            <Text style={styles.subtitle}>La página que estás buscando no se encuentra disponible</Text>
            
            <Link href="/" style={styles.linkContainer}>
              <LinearGradient
                colors={['#E91E63', '#9C27B0']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                style={styles.linkButton}
              >
                <Text style={styles.linkText}>Volver a la pantalla de inicio</Text>
              </LinearGradient>
            </Link>
          </BlurView>
        </Animated.View>
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
    backgroundColor: '#f8f9fa',
  },
  gradient: {
    position: 'absolute',
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  contentContainer: {
    width: '100%',
    maxWidth: 400,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  blurContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 30,
  },
  logoContainer: {
    marginBottom: 20,
  },
  logo: {
    width: 200,
    height: 100,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#333',
    fontFamily: 'Poppins-Bold',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 30,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  linkContainer: {
    width: '100%',
    borderRadius: 12,
    overflow: 'hidden',
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  linkButton: {
    paddingVertical: 15,
    paddingHorizontal: 20,
    alignItems: 'center',
    borderRadius: 12,
  },
  linkText: {
    fontSize: 16,
    color: 'white',
    fontFamily: 'Poppins-SemiBold',
  },
});