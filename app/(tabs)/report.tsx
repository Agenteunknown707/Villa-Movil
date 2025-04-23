import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  TextInput, 
  TouchableOpacity, 
  ScrollView, 
  Image, 
  Platform,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function ReportIncidentScreen() {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [imageSelected, setImageSelected] = useState(false);
  const router = useRouter();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

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
      })
    ]).start();
  }, []);

  const handleSubmit = () => {
    // En V0, solo navegamos a la pantalla de Mis Incidencias sin envío real
    router.push('/(tabs)/incidents');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Tipo de Incidencia</Text>
          <BlurView intensity={70} tint="light" style={styles.pickerContainer}>
            <Picker
              selectedValue={incidentType}
              onValueChange={(itemValue) => setIncidentType(itemValue)}
              style={styles.picker}
            >
              <Picker.Item label="Seleccione el tipo de incidencia" value="" />
              <Picker.Item label="Bache en calle" value="pothole" />
              <Picker.Item label="Alumbrado público" value="lighting" />
              <Picker.Item label="Acumulación de basura" value="garbage" />
              <Picker.Item label="Fuga de agua" value="water_leak" />
              <Picker.Item label="Señalización dañada" value="signage" />
              <Picker.Item label="Otro" value="other" />
            </Picker>
          </BlurView>
        </Animated.View>

        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Descripción</Text>
          <BlurView intensity={70} tint="light" style={styles.descriptionContainer}>
            <TextInput
              style={styles.descriptionInput}
              placeholder="Describa el problema con detalle..."
              value={description}
              onChangeText={setDescription}
              multiline
              numberOfLines={4}
              placeholderTextColor="#999"
            />
          </BlurView>
        </Animated.View>

        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Fotografía</Text>
          <TouchableOpacity 
            style={styles.imageUploadContainer}
            onPress={() => setImageSelected(true)}
          >
            {imageSelected ? (
              <Image
                source={{ uri: 'https://placeholder.svg?height=200&width=300&text=Imagen+Seleccionada' }}
                style={styles.selectedImage}
              />
            ) : (
              <LinearGradient
                colors={['rgba(233, 30, 99, 0.05)', 'rgba(156, 39, 176, 0.05)']}
                style={styles.uploadPlaceholder}
              >
                <View style={styles.cameraIconContainer}>
                  <Ionicons name="camera" size={40} color="#E91E63" />
                </View>
                <Text style={styles.uploadText}>Toque para agregar una fotografía</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>
        </Animated.View>

        <Animated.View 
          style={[
            styles.formSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.sectionTitle}>Ubicación</Text>
          <TouchableOpacity style={styles.mapContainer}>
            <Image
              source={{ uri: 'https://placeholder.svg?height=200&width=350&text=Mapa' }}
              style={styles.mapImage}
            />
            <View style={styles.mapOverlay}>
              <BlurView intensity={50} tint="dark" style={styles.mapTextContainer}>
                <Text style={styles.mapText}>Toque para seleccionar ubicación</Text>
              </BlurView>
            </View>
          </TouchableOpacity>
        </Animated.View>

        <TouchableOpacity 
          style={[
            styles.submitButtonContainer,
            (!incidentType || !description) ? styles.submitButtonDisabled : {}
          ]}
          onPress={handleSubmit}
          disabled={!incidentType || !description}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={(!incidentType || !description) ? ['#cccccc', '#999999'] : ['#E91E63', '#9C27B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.submitButton}
          >
            <Text style={styles.submitButtonText}>Enviar Reporte</Text>
            <Ionicons name="paper-plane" size={20} color="white" />
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    padding: 16,
  },
  formSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 8,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  pickerContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  descriptionContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  descriptionInput: {
    padding: 16,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 120,
    fontFamily: 'Poppins-Regular',
    color: '#333',
  },
  imageUploadContainer: {
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  uploadPlaceholder: {
    height: 180,
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 16,
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
  },
  uploadText: {
    color: '#666',
    fontFamily: 'Poppins-Medium',
  },
  selectedImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  mapContainer: {
    position: 'relative',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  mapImage: {
    width: '100%',
    height: 200,
    borderRadius: 16,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: 'hidden',
  },
  mapText: {
    color: 'white',
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  submitButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginTop: 16,
    marginBottom: 30,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginRight: 8,
    fontFamily: 'Poppins-Bold',
  },
});