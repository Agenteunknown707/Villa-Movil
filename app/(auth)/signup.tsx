import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  KeyboardAvoidingView, 
  Platform, 
  ScrollView, 
  Image,
  Animated,
  Easing,
  Alert
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import axios from 'axios';
import { buildApiUrl, API_CONFIG } from '../../config/api';

export default function SignupScreen() {
  const [name, setName] = useState('');
  const [name2, setName2] = useState('');
  const [ApellidoPaterno, setApellidoPaterno] = useState('');
  const [ApellidoMaterno, setApellidoMaterno] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [secureTextEntry, setSecureTextEntry] = useState(true);
  const [secureConfirmTextEntry, setSecureConfirmTextEntry] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

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
      })
    ]).start();
  }, []);

  const handleSignup = async () => {
    // Validaciones básicas
    if (!name || !ApellidoPaterno || !email || !phone || !password || !confirmPassword) {
      Alert.alert('Error', 'Por favor completa todos los campos obligatorios');
      return;
    }

    if (password !== confirmPassword) {
      Alert.alert('Error', 'Las contraseñas no coinciden');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'La contraseña debe tener al menos 6 caracteres');
      return;
    }

    try {
      setIsLoading(true);
      
      const ciudadanoData = {
        primerNombre: name,
        segundoNombre: name2 || null,
        primerApellido: ApellidoPaterno,
        segundoApellido: ApellidoMaterno || null,
        correo: email,
        numero: phone,
        contraseña: password
      };

      console.log('Enviando datos:', ciudadanoData);
      const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.CIUDADANOS);
      console.log('URL:', apiUrl);

      const response = await axios.post(apiUrl, ciudadanoData, {
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        timeout: 10000
      });

      console.log('Respuesta:', response.data);

      if (response.status === 201) {
        Alert.alert(
          'Éxito',
          'Cuenta creada correctamente',
          [
            {
              text: 'OK',
              onPress: () => router.push('/')
            }
          ]
        );
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
        
        if (error.code === 'ECONNABORTED') {
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
            'Error al crear la cuenta'
          );
        }
      } else {
        console.error('Error no relacionado con axios:', error);
        Alert.alert('Error', 'Error al crear la cuenta');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <LinearGradient
        colors={['rgba(233, 30, 99, 0.05)', 'rgba(156, 39, 176, 0.05)']}
        style={styles.gradient}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardAvoidingView}
      >
        <ScrollView contentContainerStyle={styles.scrollView}>
          <TouchableOpacity 
            style={styles.backButton} 
            onPress={() => router.back()}
          >
            <LinearGradient
              colors={['rgba(255,255,255,0.8)', 'rgba(255,255,255,0.6)']}
              style={styles.backButtonGradient}
            >
              <Ionicons name="arrow-back" size={24} color="#002D72" />
            </LinearGradient>
          </TouchableOpacity>
          
          <Animated.View 
            style={[
              styles.logoContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
           {/**<Image
              source={require('../../assets/images/colima.png')}
              style={styles.logo}
              resizeMode="contain"
            />**/}
            <Text style={styles.appTitle}>Colima App</Text>
          </Animated.View>
          
          <Animated.View 
            style={[
              styles.formContainer,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }]
              }
            ]}
          >
            <BlurView intensity={30} tint="light" style={styles.formBlur}>
              <Text style={styles.headerTitle}>Crear Cuenta</Text>
              <Text style={styles.headerSubtitle}>Regístrate para reportar incidencias</Text>
              
              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Primer Nombre"
                  placeholderTextColor="#999"
                  value={name}
                  onChangeText={setName}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Segundo Nombre"
                  placeholderTextColor="#999"
                  value={name2}
                  onChangeText={setName2}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Apellido Paterno"
                  placeholderTextColor="#999"
                  value={ApellidoPaterno}
                  onChangeText={setApellidoPaterno}
                />
              </View>

              <View style={styles.inputContainer}>
                <Ionicons name="person-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Apellido Materno"
                  placeholderTextColor="#999"
                  value={ApellidoMaterno}
                  onChangeText={setApellidoMaterno}
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="mail-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Correo Electrónico"
                  placeholderTextColor="#999"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="call-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Número de Teléfono"
                  placeholderTextColor="#999"
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Contraseña"
                  placeholderTextColor="#999"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={secureTextEntry}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setSecureTextEntry(!secureTextEntry)}
                >
                  <Ionicons 
                    name={secureTextEntry ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              
              <View style={styles.inputContainer}>
                <Ionicons name="lock-closed-outline" size={20} color="#002D72" style={styles.inputIcon} />
                <TextInput
                  style={styles.input}
                  placeholder="Confirmar Contraseña"
                  placeholderTextColor="#999"
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  secureTextEntry={secureConfirmTextEntry}
                />
                <TouchableOpacity 
                  style={styles.eyeIcon}
                  onPress={() => setSecureConfirmTextEntry(!secureConfirmTextEntry)}
                >
                  <Ionicons 
                    name={secureConfirmTextEntry ? "eye-outline" : "eye-off-outline"} 
                    size={20} 
                    color="#999" 
                  />
                </TouchableOpacity>
              </View>
              
              <TouchableOpacity 
                style={[styles.signupButtonContainer, isLoading && styles.disabledButton]} 
                onPress={handleSignup}
                disabled={isLoading}
                activeOpacity={0.8}
              >
                <LinearGradient
                  colors={['#002D72', '#064ba1']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.signupButton}
                >
                  <Text style={styles.signupButtonText}>
                    {isLoading ? 'Registrando...' : 'Registrarse'}
                  </Text>
                </LinearGradient>
              </TouchableOpacity>
              
              <View style={styles.loginContainer}>
                <Text style={styles.loginText}>¿Ya tienes una cuenta? </Text>
                <TouchableOpacity onPress={() => router.push('/')}>
                  <Text style={styles.loginLink}>Iniciar Sesión</Text>
                </TouchableOpacity>
              </View>
            </BlurView>
          </Animated.View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#d8e8f8',
  },
  appTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#002D72',
    marginTop: 10,
  },
  gradient: {
    position: 'absolute',
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
    padding: 20,
  },
  backButton: {
    marginBottom: 10,
    borderRadius: 20,
    overflow: 'hidden',
    width: 40,
    height: 40,
  },
  backButtonGradient: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: 20,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  logo: {
    width: 300,
    height: 100,
  },
  formContainer: {
    width: '100%',
  },
  formBlur: {
    borderRadius: 20,
    overflow: 'hidden',
    padding: 20,
    backgroundColor: 'rgb(255, 255, 255)',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 5,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
    textAlign: 'center',
    fontFamily: 'Poppins-Bold',
  },
  headerSubtitle: {
    fontSize: 16,
    color: '#666',
    marginBottom: 25,
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    marginBottom: 16,
    paddingHorizontal: 15,
    height: 55,
    shadowColor: '#000',
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
    color: '#333',
    fontFamily: 'Poppins-Regular',
  },
  eyeIcon: {
    padding: 8,
  },
  signupButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 10,
    shadowColor: '#002D72',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  signupButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
  },
  signupButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
    marginRight: 8,
    fontFamily: 'Poppins-Bold',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: 25,
    marginBottom: 10,
  },
  loginText: {
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  loginLink: {
    color: '#2c77e8',
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  disabledButton: {
    opacity: 0.7,
  },
});