"use client"

import { useState, useRef, useEffect } from "react"
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
import MapView, { Marker, PROVIDER_GOOGLE } from "react-native-maps"
import * as Location from "expo-location"

export default function ReportIncidentScreen() {
  const params = useLocalSearchParams()
  const [userLocation, setUserLocation] = useState(null)
  const [selectedLocation, setSelectedLocation] = useState(null)
  const [incidentType, setIncidentType] = useState(params.category ? String(params.category) : "")
  const [description, setDescription] = useState("")
  const [imageSelected, setImageSelected] = useState(null)
  const [location, setLocation] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const router = useRouter()

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  // Mapeo de categorías recibidas como parámetro
  const categoryMapping = {
    "1": "pothole",
    "2": "lighting",
    "3": "garbage",
    "4": "water_leak",
    "5": "signage",
  }

  // Asignar tipo de incidencia si viene por parámetros
  useEffect(() => {
    if (params.category && categoryMapping[params.category]) {
      setIncidentType(categoryMapping[params.category])
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
  const handleMapPress = (event) => {
    const { latitude, longitude } = event.nativeEvent.coordinate
    setSelectedLocation({ latitude, longitude })
    setLocation(`${latitude.toFixed(6)}, ${longitude.toFixed(6)}`)
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

  // Enviar el reporte simulado con feedback visual
  const handleSubmit = () => {
    if (!incidentType || !description) return

    setIsSubmitting(true)

    setTimeout(() => {
      setIsSubmitting(false)
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
            },
            style: "cancel",
          },
        ]
      )
    }, 1500)
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <LinearGradient
          colors={["rgba(233, 30, 99, 0.05)", "rgba(156, 39, 176, 0.05)"]}
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
              <Ionicons name="alert-circle-outline" size={20} color="#E91E63" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Tipo de Incidencia</Text>
            </View>
            <BlurView intensity={70} tint="light" style={styles.pickerContainer}>
              <Picker
                selectedValue={incidentType}
                onValueChange={(itemValue) => setIncidentType(itemValue)}
                style={styles.picker}
                dropdownIconColor="#E91E63"
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
          </View>

          {/* Descripción */}
          <View style={styles.formSection}>
            <View style={styles.sectionTitleContainer}>
              <Ionicons name="document-text-outline" size={20} color="#E91E63" style={styles.sectionIcon} />
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
              <Ionicons name="camera-outline" size={20} color="#E91E63" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Fotografía</Text>
            </View>
            <TouchableOpacity style={styles.imageUploadContainer} onPress={pickImage} activeOpacity={0.8}>
              {imageSelected ? (
                <View style={styles.selectedImageContainer}>
                  <Image source={{ uri: imageSelected }} style={styles.selectedImage} />
                  <TouchableOpacity style={styles.removeImageButton} onPress={() => setImageSelected(null)}>
                    <Ionicons name="close-circle" size={24} color="#E91E63" />
                  </TouchableOpacity>
                </View>
              ) : (
                <LinearGradient
                  colors={["rgba(233, 30, 99, 0.05)", "rgba(156, 39, 176, 0.05)"]}
                  style={styles.uploadPlaceholder}
                >
                  <View style={styles.cameraIconContainer}>
                    <Ionicons name="camera" size={40} color="#E91E63" />
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
              <Ionicons name="location-outline" size={20} color="#E91E63" style={styles.sectionIcon} />
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
                  <View style={{ marginTop: 8, padding: 8, backgroundColor: "rgba(255,255,255,0.8)", borderRadius: 8 }}>
                    <Text style={{ fontSize: 14, color: "#333" }}>
                      Coordenadas seleccionadas: {selectedLocation.latitude.toFixed(6)}, {selectedLocation.longitude.toFixed(6)}
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
          {/* Puedes agregar lógica con expo-location o mapas aquí luego */}

          {/* Botón de enviar */}
          <TouchableOpacity
            style={[styles.submitButtonContainer, !incidentType || !description ? styles.submitButtonDisabled : {}]}
            onPress={handleSubmit}
            disabled={!incidentType || !description || isSubmitting}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={!incidentType || !description ? ["#cccccc", "#999999"] : ["#E91E63", "#9C27B0"]}
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
    backgroundColor: "#f8f9fa",
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
    borderColor: "rgba(233, 30, 99, 0.2)",
  },
  picker: {
    height: 50,
    width: "100%",
  },
  descriptionContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.2)",
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
    color: "#999",
    textAlign: "right",
    marginTop: 4,
  },
  imageUploadContainer: {
    borderRadius: 16,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "rgba(233, 30, 99, 0.2)",
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
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 16,
  },
  uploadText: {
    color: "#666",
    fontSize: 16,
    marginBottom: 4,
  },
  uploadSubtext: {
    color: "#999",
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
    backgroundColor: "rgba(255,255,255,0.8)",
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
    borderColor: "rgba(233, 30, 99, 0.2)",
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
    backgroundColor: "rgba(255,255,255,0.9)",
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
    color: "#333",
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
