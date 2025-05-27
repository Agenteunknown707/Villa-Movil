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
import { useRouter, Link } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { Ionicons } from "@expo/vector-icons"
import { BlurView } from "expo-blur"
import axios from "axios"
import { buildApiUrl, API_CONFIG } from "../../config/api"
import { useAuth } from '../../context/AuthContext';

const { width } = Dimensions.get("window")

export default function LoginScreen() {
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [secureTextEntry, setSecureTextEntry] = useState(true)
  const router = useRouter()
  const { login, isLoading: authLoading, error: authError } = useAuth();

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
    if (!email || !password) {
      Alert.alert('Error', 'Por favor, ingrese correo y contraseña.');
      return;
    }

    try {
      console.log('Consultando usuario:', buildApiUrl(`${API_CONFIG.ENDPOINTS.CIUDADANOS}/email/${email}`));
      const response = await axios.get(buildApiUrl(`${API_CONFIG.ENDPOINTS.CIUDADANOS}/email/${email}`));

      if (response.data) {
        const userData = response.data;
        console.log('Datos recibidos del servidor:', userData);
        console.log('Contraseña ingresada:', password);
        console.log('Contraseña en la base de datos:', userData.contraseña);

        // Verificamos la contraseña
        if (userData.contraseña === password) {
          console.log('Contraseñas coinciden. Inicio de sesión exitoso.');

          // Llamar a la función login del contexto con los datos del usuario
          await login(userData); // Pasamos los datos del usuario
          // La redirección ahora la maneja el AuthContext

        } else {
          Alert.alert('Error', 'Contraseña incorrecta');
        }
      } else {
        Alert.alert('Error', 'Usuario no encontrado con ese correo electrónico.');
      }
    } catch (error: any) {
      console.error('Login API Error:', error);
      const errorMessage = error.response?.data?.error || 'Ocurrió un error al iniciar sesión.';
      Alert.alert('Error', errorMessage);
    }
  };

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
                style={[styles.loginButtonContainer, authLoading && styles.disabledButton]} 
                onPress={handleLogin} 
                disabled={authLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={["#E91E63", "#9C27B0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.loginButton}
                >
                  <Text style={styles.loginButtonText}>
                    {authLoading ? 'Iniciando sesión...' : 'Iniciar Sesión'}
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
  link: {
    color: '#E91E63',
    fontSize: 16,
  },
})