"use client"

import React, { useState, useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Image,
  Animated,
  ActivityIndicator,
  Alert,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Picker } from "@react-native-picker/picker"
import { Ionicons } from "@expo/vector-icons"
import { useRouter, useLocalSearchParams } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import * as ImagePicker from "expo-image-picker"
import MapView, { Marker, PROVIDER_GOOGLE, Region } from "react-native-maps"
import * as Location from "expo-location"
import { buildApiUrl, API_CONFIG } from "../../config/api"
import * as FileSystem from 'expo-file-system'

// Definir interfaces para los tipos
interface LocationState {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
}

interface SelectedLocation {
  latitude: number;
  longitude: number;
}

interface MapPressEvent {
  nativeEvent: {
    coordinate: {
      latitude: number;
      longitude: number;
    }
  }
}

export default function ReportIncidentScreen() {
  const params = useLocalSearchParams()
  const [userLocation, setUserLocation] = useState<LocationState | null>(null)
  const [selectedLocation, setSelectedLocation] = useState<SelectedLocation | null>(null)
  const [incidentType, setIncidentType] = useState(params.category ? String(params.category) : "")
  const [description, setDescription] = useState("")
  const [imageSelected, setImageSelected] = useState<string | null>(null)
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Mapeo de categorías recibidas como parámetro
  const categoryMapping: Record<string, string> = {
    "1": "bache",
    "2": "alumbrado",
    "3": "basura",
    "4": "agua",
    "5": "señal",
  }

  // Asignar tipo de incidencia si viene por parámetros
  useEffect(() => {
    const category = String(params.category)
    if (category && categoryMapping[category]) {
      setIncidentType(categoryMapping[category])
    }
  }, [params.category])

  // Animación de entrada
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
    ]).start()
  }, [])

  // Solicitar permiso para galería
  useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permiso requerido", "Se necesita acceso a la galería para seleccionar una imagen.")
      }
    })()
  }, [])

  // Obtener ubicación del usuario al iniciar
  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync()
      if (status !== "granted") {
        Alert.alert("Permiso denegado", "No se pudo acceder a tu ubicación actual.")
        return
      }

      const location = await Location.getCurrentPositionAsync({})
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.01,
        longitudeDelta: 0.01,
      })
    })()
  }, [])

  // Al hacer tap en el mapa, guardar coordenadas seleccionadas
    const handleMapPress = (event: MapPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setSelectedLocation({ latitude, longitude })
    setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)

    fetchAddressFromCoordinates(latitude, longitude) // ← Aquí
  }

  // Seleccionar imagen desde galería
  const pickImage = async () => {
    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        quality: 1,
      })

      if (!result.canceled && result.assets.length > 0) {
        setImageSelected(result.assets[0].uri)
      }
    } catch (error) {
      console.error("Error seleccionando imagen:", error)
    }
  }

  // Función para subir la imagen
  const uploadImage = async (uri: string): Promise<string> => {
    try {
      const formData = new FormData()
      const filename = uri.split('/').pop()
      const match = /\.(\w+)$/.exec(filename || '')
      const type = match ? `image/${match[1]}` : 'image'

      // Crear el objeto de archivo
      const file = {
        uri,
        type,
        name: filename,
      }

      formData.append('image', file as any)

      const uploadUrl = buildApiUrl(API_CONFIG.ENDPOINTS.UPLOAD_IMAGE)
      console.log('Uploading to URL:', uploadUrl) // Para debugging

      const uploadResponse = await fetch(uploadUrl, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
          'Accept': 'application/json',
        },
      })

      // Log para debugging
      console.log('Response status:', uploadResponse.status)
      const responseText = await uploadResponse.text()
      console.log('Response text:', responseText)

      if (!uploadResponse.ok) {
        throw new Error(`Error al subir la imagen: ${uploadResponse.status} ${uploadResponse.statusText}`)
      }

      let data
      try {
        data = JSON.parse(responseText)
      } catch (e) {
        console.error('Error parsing response:', e)
        throw new Error('Respuesta del servidor inválida')
      }

      if (!data.imageUrl) {
        throw new Error('No se recibió la URL de la imagen')
      }

      return data.imageUrl
    } catch (error) {
      console.error('Error uploading image:', error)
      throw new Error(error instanceof Error ? error.message : 'Error al subir la imagen')
    }
  }

  // Función para crear el reporte
  const createReport = async (imageUrl: string) => {
    try {
      const reportData = {
        categoria: incidentType,
        descripcionCiudadano: description,
        ubicacion: location,
        calle: addressDetails.street,
        colonia: addressDetails.district,
        codigoPostal: addressDetails.postalCode,
        ciudad: addressDetails.city,
        estadoUbicacion: addressDetails.region,
        latitud: selectedLocation?.latitude || 0,
        longitud: selectedLocation?.longitude || 0,
        imagenUrl: imageUrl,
        estadoReporte: 'pendiente',
        prioridad: 1,
        idCiudadano: 1,
      }

      const apiUrl = buildApiUrl(API_CONFIG.ENDPOINTS.REPORTES);
      console.log('=== REPORT CREATION REQUEST ===');
      console.log('URL:', apiUrl);
      console.log('Method: POST');
      console.log('Headers:', {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      });
      console.log('Body:', JSON.stringify(reportData, null, 2));

      let response;
      try {
        response = await fetch(apiUrl, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
          },
          body: JSON.stringify(reportData),
        });
      } catch (fetchError) {
        console.error('Network error:', fetchError);
        throw new Error(`Error de conexión: ${fetchError instanceof Error ? fetchError.message : 'Error desconocido'}`);
      }

      console.log('=== REPORT CREATION RESPONSE ===');
      console.log('Status:', response.status);
      console.log('Status Text:', response.statusText);
      console.log('Headers:', JSON.stringify(Object.fromEntries(response.headers.entries())));

      let responseText;
      try {
        responseText = await response.text();
        console.log('Response Body:', responseText);
      } catch (textError) {
        console.error('Error reading response:', textError);
        throw new Error(`Error al leer la respuesta: ${textError instanceof Error ? textError.message : 'Error desconocido'}`);
      }

      if (!response.ok) {
        let errorMessage = `Error al crear el reporte: ${response.status} ${response.statusText}`;
        try {
          const errorData = JSON.parse(responseText);
          errorMessage += `\nDetalles: ${JSON.stringify(errorData)}`;
        } catch (e) {
          errorMessage += `\nRespuesta: ${responseText}`;
        }
        throw new Error(errorMessage);
      }

      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (parseError) {
        console.error('Error parsing response:', parseError);
        throw new Error(`Error al procesar la respuesta: ${responseText}`);
      }

      console.log('Parsed Response:', responseData);
      return responseData;
    } catch (error) {
      console.error('Error creating report:', error);
      throw error;
    }
  }

  // Modificar la función handleSubmit
  const handleSubmit = async () => {
    if (!incidentType || !description || !selectedLocation || !imageSelected) {
      Alert.alert('Error', 'Por favor complete todos los campos requeridos')
      return
    }

    setIsSubmitting(true)

    try {
      console.log('=== STARTING REPORT SUBMISSION ===');
      console.log('Selected location:', selectedLocation);
      console.log('Incident type:', incidentType);
      console.log('Description:', description);

      // 1. Subir la imagen
      console.log('=== UPLOADING IMAGE ===');
      let imageUrl;
      try {
        imageUrl = await uploadImage(imageSelected);
        console.log('Image uploaded successfully:', imageUrl);
      } catch (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Error al subir la imagen: ${uploadError instanceof Error ? uploadError.message : 'Error desconocido'}`);
      }

      // 2. Crear el reporte
      console.log('=== CREATING REPORT ===');
      try {
        const reportResponse = await createReport(imageUrl);
        console.log('Report created successfully:', reportResponse);
      } catch (reportError) {
        console.error('Error creating report:', reportError);
        throw new Error(`Error al crear el reporte: ${reportError instanceof Error ? reportError.message : 'Error desconocido'}`);
      }

      // 3. Mostrar mensaje de éxito
      Alert.alert(
        "Reporte enviado",
        "Tu reporte ha sido enviado con éxito. Te notificaremos cuando haya actualizaciones.",
        [
          {
            text: "Ver mis reportes",
            onPress: () => router.push("/(tabs)/incidents"),
          },
          {
            text: "Nuevo reporte",
            onPress: () => {
              setIncidentType("")
              setDescription("")
              setImageSelected(null)
              setLocation("")
              setSelectedLocation(null)
            },
            style: "cancel",
          },
        ]
      )
    } catch (error) {
      console.error('Error in handleSubmit:', error);
      Alert.alert(
        "Error",
        `Hubo un error al enviar el reporte: ${error instanceof Error ? error.message : 'Error desconocido'}`
      )
    } finally {
      setIsSubmitting(false)
    }
  }
  
  // Función para obtener la dirección a partir de las coordenadas
  //estado para la dirección completa
  const [addressDetails, setAddressDetails] = useState<{
    street?: string
    district?: string
    postalCode?: string
    city?: string
    region?: string
  }>({})

  const fetchAddressFromCoordinates = async (latitude: number, longitude: number) => {
  try {
    const geocode = await Location.reverseGeocodeAsync({ latitude, longitude })

    if (geocode.length > 0) {
      const info = geocode[0]
      setAddressDetails({
        street: info.street || '',
        district: info.district || '',
        postalCode: info.postalCode || '',
        city: info.city || '',
        region: info.region || '',
      })

      // Opcionalmente actualiza el campo de texto de ubicación
      setLocation(`${info.street || ''}, ${info.district || ''}, ${info.postalCode || ''}, ${info.city || ''}, ${info.region || ''}`)
    }
  } catch (error) {
    console.error('Error fetching address:', error)
  }
}

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["rgba(216, 232, 248, 0.8)", "rgba(216, 232, 248, 0.8)"]}
          style={styles.gradientBackground}
        />

        <Animated.View style={[styles.formContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
          {/* Título */}
          <View style={styles.formHeader}>
            <Text style={styles.formTitle}>Nuevo Reporte</Text>
            <Text style={styles.formSubtitle}>Completa la información para reportar una incidencia</Text>
          </View>

          {/* Selector de incidencia */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="alert-circle-outline" size={20} color="#002D72" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Tipo de Incidencia</Text>
            </View>
            <BlurView intensity={70} tint="light" style={styles.pickerContainer}>
              <Picker
                selectedValue={incidentType}
                onValueChange={(itemValue) => setIncidentType(itemValue)}
                style={styles.picker}
                dropdownIconColor="#002D72"
              >
                <Picker.Item label="Seleccione el tipo de incidencia" value="" />
                <Picker.Item label="Bache en calle" value="bache" />
                <Picker.Item label="Alumbrado público" value="alumbrado" />
                <Picker.Item label="Acumulación de basura" value="basura" />
                <Picker.Item label="Fuga de agua" value="agua" />
                <Picker.Item label="Señalización dañada" value="señal" />
                <Picker.Item label="Otro" value="otro" />
              </Picker>
            </BlurView>
          </View>

          {/* Descripción */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="document-text-outline" size={20} color="#002D72" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Descripción</Text>
            </View>
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
            <Text style={styles.characterCount}>{description.length}/500 caracteres</Text>
          </View>

          {/* Imagen */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="camera-outline" size={20} color="#002D72" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Fotografía</Text>
            </View>
            <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage} activeOpacity={0.8}>
              {imageSelected ? (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: imageSelected }} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageSelected(null)}>
                    <Ionicons name="close-circle" size={24} color="#002D72" />
                  </TouchableOpacity>
                </View>
              ) : (
                <LinearGradient
                  colors={["rgba(209, 207, 219, 0.43)", "rgba(246, 249, 251, 0.32)"]}
                  style={styles.uploadPlaceholder}
                >
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={40} color="#002D72" />
                  </View>
                  <Text style={styles.uploadText}>Toque para agregar una fotografía</Text>
                  <Text style={styles.uploadSubtext}>Formatos: JPG, PNG (máx. 5MB)</Text>
                </LinearGradient>
              )}
            </TouchableOpacity>
          </View>

          {/* Ubicación */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="location-outline" size={20} color="#002D72" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Ubicación</Text>
            </View>
            <TouchableOpacity style={styles.mapContainer} activeOpacity={0.8}>
              {userLocation && (
                <MapView
                  style={styles.mapImage}
                  provider={PROVIDER_GOOGLE}
                  initialRegion={userLocation}
                  onPress={handleMapPress}
                >
                  {selectedLocation && <Marker coordinate={selectedLocation} />}
                </MapView>
              )}
               {/* Coordenadas seleccionadas debajo del mapa */}
                {selectedLocation && (
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: "rgba(253, 253, 253, 0.8)", borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, color: "#333" }}>
                      Coordenadas seleccionadas: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
                    </Text>
                  </View>
                )}
                {addressDetails && (
                <View style={{ marginTop: 8, padding: 8, backgroundColor: "rgba(221, 216, 239, 0.2)", borderRadius: 8 }}>
                  <Text style={{ fontSize: 14, color: "#333" }}>
                    Dirección: {addressDetails.street}, {addressDetails.district}, {addressDetails.postalCode}, {addressDetails.city}, {addressDetails.region}
                  </Text>
                </View>
                )}
              <View style={styles.mapOverlay}>
                <BlurView intensity={50} tint="dark" style={styles.mapTextContainer}>
                  <Text style={styles.mapText}>Toque para seleccionar ubicación</Text>
                </BlurView>
              </View>
            </TouchableOpacity>
          </View>
          {/* agregar lógica con expo-location o mapas aquí luego */}

          {/* Botón de enviar */}
          <TouchableOpacity
            style={[styles.submitButtonContainer, !incidentType || !description ? styles.submitButtonDisabled : {}]}
            onPress={handleSubmit}
            disabled={!incidentType || !description || isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!incidentType || !description ? ["#9992ac", "#8a8b97"] : ["#002D72", "#064ba1"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.submitButton}
            >
              {isSubmitting ? (
                <ActivityIndicator color="white" size="small" />
              ) : (
                <>
                  <Text style={styles.submitButtonText}>Enviar Reporte</Text>
                  <Ionicons name="paper-plane" size={20} color="white" />
                </>
              )}
            </LinearGradient>
          </TouchableOpacity>
        </Animated.View>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#d8e8f8",
  },
  scrollView: {
    paddingBottom: 30,
  },
  gradientBackground: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
  },
  formContainer: {
    padding: 16,
  },
  formHeader: {
    marginBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    paddingBottom: 16,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: "#666",
    lineHeight: 22,
  },
  formSection: {
    marginBottom: 24,
  },
  sectionTitleContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  pickerContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(67, 30, 233, 0.2)",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  descriptionContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(67, 30, 233, 0.2)",
  },
  descriptionInput: {
    padding: 16,
    fontSize: 16,
    textAlignVertical: "top",
    minHeight: 120,
    color: "#333",
  },
  characterCount: {
    fontSize: 12,
    color: "#3c3d42",
    textAlign: "right",
    marginTop: 4,
  },
  imageUploadContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(67, 30, 233, 0.2)",
  },
  uploadPlaceholder: {
    height: 180,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 16,
  },
  cameraIconContainer: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: "rgba(72, 43, 202, 0.2)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#3c3d42",
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubtext: {
    color: "#3c3d42",
    fontSize: 12,
  },
  selectedImageContainer: {
    position: 'relative',
    width: 100,
    height: 100,
  },
  selectedImage: {
    width: 100,
    height: 100,
    borderRadius: 8,
    resizeMode: 'cover',
  },
  removeImageButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(67, 30, 233, 0.2)",
    borderRadius: 15,
    width: 30,
    height: 30,
    justifyContent: "center",
    alignItems: "center",
  },
  mapContainer: {
    position: "relative",
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(74, 30, 233, 0.2)",
  },
  mapImage: {
    width: "100%",
    height: 400,
    borderRadius: 16,
  },
  mapOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  mapTextContainer: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    overflow: "hidden",
  },
  mapText: {
    color: "white",
    fontWeight: "bold",
  },
  locationInfoContainer: {
    position: "absolute",
    bottom: 12,
    left: 12,
    right: 12,
    backgroundColor: "rgba(67, 30, 233, 0.2)",
    borderRadius: 8,
    padding: 8,
    flexDirection: "row",
    alignItems: "center",
  },
  locationText: {
    marginLeft: 4,
    fontSize: 12,
    color: "#333",
    flex: 1,
  },
  formSummary: {
    backgroundColor: "rgba(233, 30, 99, 0.05)",
    borderRadius: 12,
    padding: 12,
    marginBottom: 5,
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.1)",
  },
  summaryItem: {
    flexDirection: "row",
    marginBottom: 4,
  },
  summaryLabel: {
    fontWeight: "bold",
    color: "#666",
    width: 90,
  },
  summaryValue: {
    color: "#333333",
    flex: 1,
  },
  submitButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginTop: 1,
    marginBottom: 20,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    borderRadius: 12,
  },
  submitButtonText: {
    color: "white",
    fontWeight: "bold",
    fontSize: 16,
    marginRight: 8,
  },
})
