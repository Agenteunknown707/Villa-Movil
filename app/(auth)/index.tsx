"use client"

import { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Animated,
  Dimensions,
  Easing,
  Alert
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import axios from "axios"
import { buildApiUrl, API_CONFIG } from "../../config/api"

const { width } = Dimensions.get("window")

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(50)).current
  const logoScale = useRef(new Animated.Value(0.8)).current

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
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
      Animated.spring(logoScale, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      }),
    ]).start()
  }, [])

  const handleLogin = async () => {
    // Validaciones básicas
    if (!email || !password) {
      Alert.alert('Error', 'Por favor ingresa tu correo y contraseña');
      return;
    }

    try {
      setIsLoading(true);
      
      // Primero obtenemos el usuario por email
      const emailUrl = buildApiUrl(`${API_CONFIG.ENDPOINTS.CIUDADANOS}/email/${email}`);
      console.log('Consultando usuario:', emailUrl);

      const response = await axios.get(emailUrl, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      if (response.data) {
        const ciudadano = response.data;
        console.log('Datos recibidos del servidor:', ciudadano);
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña en la base de datos:', ciudadano.contraseña);
        
        // Verificamos la contraseña
        if (ciudadano.contraseña === password) {
          // Login exitoso
          Alert.alert(
            'Éxito',
            'Inicio de sesión exitoso',
            [
              {
                text: 'OK',
                onPress: () => router.navigate("/(tabs)")
              }
            ]
          );
        } else {
          Alert.alert('Error', 'Contraseña incorrecta');
        }
      }
    } catch (error: unknown) {
      console.error('Error completo:', error);
      
      if (axios.isAxiosError(error)) {
        console.error('Detalles del error:', {
          status: error.response?.status,
          data: error.response?.data,
          message: error.message,
          code: error.code
        });
        
        if (error.response?.status === 404) {
          Alert.alert('Error', 'No existe una cuenta con este correo electrónico');
        } else if (error.code === 'ECONNABORTED') {
          Alert.alert('Error', 'La conexión al servidor tardó demasiado. Por favor, intenta de nuevo.');
        } else if (error.code === 'ERR_NETWORK') {
          Alert.alert(
            'Error de Conexión',
            'No se pudo conectar con el servidor. Por favor, verifica que:\n\n' +
            '1. El servidor esté corriendo\n' +
            '2. Estés conectado a la misma red WiFi\n' +
            '3. La IP del servidor sea correcta'
          );
        } else {
          Alert.alert(
            'Error',
            error.response?.data?.error || 
            error.response?.data?.message || 
            error.message || 
            'Error al iniciar sesión'
          );
        }
      } else {
        console.error('Error no relacionado con axios:', error);
        Alert.alert('Error', 'Error al iniciar sesión');
      }
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient colors={["rgba(233, 30, 99, 0.05)", "rgba(156, 39, 176, 0.05)"]} style={styles.gradient} />
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.keyboardAvoidingView}>
        <ScrollView contentContainerStyle={styles.scrollView}>
          <Animated.View
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }, { scale: logoScale }],
              },
            ]}
          >
            <Image
              source={{ uri: "https://2021-2024.villadealvarez.gob.mx/assets/img/2021/slider_7.png" }}
              style={styles.logo}
              resizeMode="contain"
            />
            <Text style={styles.appTitle}>Villa App</Text>
          </Animated.View>

          <Animated.View
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.formBlur}>
              <Text style={styles.welcomeText}>¡Bienvenido!</Text>
              <Text style={styles.welcomeSubtext}>Inicia sesión para continuar</Text>

              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#E91E63" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo electrónico"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  autoCapitalize="none"
                  keyboardType="email-address"
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#E91E63" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                />
                <TouchableOpacity style={styles.eyeIcon} onPress={() => setSecureTextEntry(!secureTextEntry)}>
                  <Ionicons name={secureTextEntry ? "eye-outline" : "eye-off-outline"} size={20} color="#999" />
                </TouchableOpacity>
              </View>

              <TouchableOpacity style={styles.forgotPasswordContainer} onPress={() => router.push("/forgot-password")}>
                <Text style={styles.forgotPasswordText}>¿Olvidaste tu contraseña?</Text>
              </TouchableOpacity>

              <TouchableOpacity 
                style={[styles.loginButtonContainer, isLoading && styles.disabledButton]} 
                onPress={handleLogin} 
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#E91E63", "#9C27B0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>
                    {isLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>

              <View style={styles.signupContainer}>
                <Text style={styles.signupText}>¿No tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push("/signup")}>
                  <Text style={styles.signupLink}>Regístrate</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  gradient: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  scrollView: {
    flexGrow: 1,
    justifyContent: "center",
    padding: 20,
  },
  logoContainer: {
    alignItems: "center",
    marginBottom: 30,
  },
  logo: {
    width: 300,
    height: 120,
    marginBottom: 10,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#E91E63",
    marginTop: 10,
  },
  formContainer: {
    width: "100%",
  },
  formBlur: {
    borderRadius: 20,
    overflow: "hidden",
    padding: 20,
    backgroundColor: "rgb(255, 255, 255)",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
    textAlign: "center",
  },
  welcomeSubtext: {
    fontSize: 16,
    color: "#666",
    marginBottom: 25,
    textAlign: "center",
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  eyeIcon: {
    padding: 8,
  },
  forgotPasswordContainer: {
    alignItems: "flex-end",
    marginBottom: 20,
  },
  forgotPasswordText: {
    color: "#E91E63",
    fontSize: 14,
    fontWeight: "500",
  },
  loginButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 10,
    shadowColor: "#E91E63",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    borderRadius: 12,
  },
  loginButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginRight: 8,
  },
  signupContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginTop: 25,
  },
  signupText: {
    color: "#666",
  },
  signupLink: {
    color: "#E91E63",
    fontWeight: "bold",
  },
  disabledButton: {
    opacity: 0.7,
  },
})