"use client"

import { useState, useRef, useEffect } from "react"
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, Animated, Easing, ColorValue, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import MapView, { Marker } from "react-native-maps"
import IncidentItem from "../../components/IncidentItem"
import axios from "axios"
import { API_CONFIG, buildApiUrl } from "../../config/api"

interface Ciudadano {
  nombre: string;
  apellido: string;
  email: string;
}

interface IncidentItem {
  idIncidencia: number;
  categoria: string;
  descripcionCiudadano?: string;
  descripcionDependencia?: string;
  descripcionAyuntamiento?: string;
  ubicacion?: string;
  calle?: string;
  colonia?: string;
  codigoPostal?: string;
  ciudad?: string;
  estadoUbicacion?: string;
  latitud: number;
  longitud: number;
  imagenUrl: string;
  estadoReporte: 'pendiente' | 'en_proceso' | 'resuelto' | 'rechazado';
  prioridad: number;
  idCiudadano: number;
  fechaCreacion: string;
  fechaActualizacion: string;
  ciudadano: Ciudadano;
}

const AnimatedIncidentItem = ({ item, index }: { item: IncidentItem; index: number }) => {
  const itemFadeAnim = useRef(new Animated.Value(0)).current
  const itemSlideAnim = useRef(new Animated.Value(50)).current
  const expandAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current
  const [expanded, setExpanded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const [showPlaceholder, setShowPlaceholder] = useState(false)

  useEffect(() => {
    Animated.parallel([
      Animated.timing(itemFadeAnim, {
        toValue: 1,
        duration: 500,
        delay: index * 100,
        useNativeDriver: true,
      }),
      Animated.timing(itemSlideAnim, {
        toValue: 0,
        duration: 500,
        delay: index * 100,
        easing: Easing.out(Easing.exp),
        useNativeDriver: true,
      }),
    ]).start()
  }, [index])

  // Animación para expandir/colapsar
  useEffect(() => {
    Animated.parallel([
      Animated.timing(expandAnim, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: false,
      }),
      Animated.timing(rotateAnim, {
        toValue: expanded ? 1 : 0,
        duration: 300,
        useNativeDriver: true,
      }),
    ]).start()
  }, [expanded])

  // Interpolaciones para animaciones
  const detailsHeight = expandAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [0, 300],
  })

  const iconRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  })

  let statusColor, statusText, statusGradient

  switch (item.estadoReporte) {
    case "resuelto":
      statusColor = "#8BC34A"
      statusText = "Resuelto"
      statusGradient = ["#8BC34A", "#4CAF50"]
      break
    case "en_proceso":
      statusColor = "#FF9800"
      statusText = "En Proceso"
      statusGradient = ["#FF9800", "#FF5722"]
      break
    case "pendiente":
      statusColor = "#E91E63"
      statusText = "Pendiente"
      statusGradient = ["#E91E63", "#9C27B0"]
      break
    case "rechazado":
      statusColor = "#999"
      statusText = "Rechazado"
      statusGradient = ["#999", "#666"]
      break
    default:
      statusColor = "#999"
      statusText = "Desconocido"
      statusGradient = ["#999", "#666"]
  }

  // Función para alternar la expansión
  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  return (
    <Animated.View
      style={{
        opacity: itemFadeAnim,
        transform: [{ translateY: itemSlideAnim }],
      }}
    >
      <TouchableOpacity style={styles.incidentCard} activeOpacity={0.9}>
        <View style={styles.incidentHeader}>
          <Text style={styles.incidentType}>{item.categoria}</Text>
          <LinearGradient
            colors={statusGradient as [ColorValue, ColorValue, ...ColorValue[]]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusBadge}
          >
            <Text style={styles.statusBadgeText}>{statusText}</Text>
          </LinearGradient>
        </View>

        <View style={styles.incidentContent}>
          <View style={styles.incidentImageContainer}>
            {item.imagenUrl ? (
              <Image
                source={{ uri: `http://192.168.1.8:4000${item.imagenUrl}` }}
                style={styles.incidentImage}
                onError={(e) => {
                  console.error('Error loading image:', e.nativeEvent.error);
                  // Si hay error, mostrar el placeholder
                  setShowPlaceholder(true);
                }}
              />
            ) : (
              <View style={[styles.incidentImage, styles.noImageContainer]}>
                <Ionicons name="image-outline" size={24} color="#999" />
                <Text style={styles.noImageText}>Sin imagen</Text>
              </View>
            )}
          </View>
          <View style={styles.incidentDetails}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.incidentLocation}>
                {[item.calle, item.colonia, item.ciudad].filter(Boolean).join(", ")}
              </Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.incidentDate}>
                Reportado: {new Date(item.fechaCreacion).toLocaleDateString()}
              </Text>
            </View>
            <Text style={styles.incidentDescription} numberOfLines={expanded ? undefined : 2}>
              {item.descripcionCiudadano}
            </Text>
          </View>
        </View>

        {/* Sección expandible con ubicación e imágenes */}
        <Animated.View style={[styles.expandedDetails, { height: detailsHeight }]}>
          <View style={styles.expandedContent}>
            {/* Mapa de ubicación */}
            <View style={styles.mapSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="map-outline" size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Ubicación en mapa</Text>
              </View>
              <View style={styles.mapContainer}>
                <MapView
                  style={styles.map}
                  initialRegion={{
                    latitude: item.latitud,
                    longitude: item.longitud,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                  }}
                  scrollEnabled={false}
                  zoomEnabled={false}
                >
                  <Marker
                    coordinate={{
                      latitude: item.latitud,
                      longitude: item.longitud
                    }}
                    title={item.categoria}
                    description={item.descripcionCiudadano}
                    pinColor={
                      item.estadoReporte === "resuelto"
                        ? "green"
                        : item.estadoReporte === "en_proceso"
                        ? "orange"
                        : "red"
                    }
                  />
                </MapView>
              </View>
            </View>

            
          </View>
        </Animated.View>

        <View style={styles.incidentFooter}>
          <TouchableOpacity style={styles.detailsButton} onPress={toggleExpand}>
            <Text style={styles.detailsButtonText}>
              {expanded ? "Ocultar Detalles" : "Ver Detalles"}
            </Text>
            <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
              <Ionicons name="chevron-forward" size={16} color="#E91E63" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </Animated.View>
  )
}

export default function MyIncidentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState("all")
  const [incidents, setIncidents] = useState<IncidentItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

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

  // Función para obtener incidencias
  const fetchIncidents = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const response = await axios.get(buildApiUrl(API_CONFIG.ENDPOINTS.INCIDENCIAS))
      console.log('Incidents data:', response.data) // Debug log
      setIncidents(response.data)
    } catch (err) {
      console.error('Error fetching incidents:', err)
      setError('No se pudieron cargar las incidencias')
    } finally {
      setIsLoading(false)
    }
  }

  // Cargar incidencias al montar el componente
  useEffect(() => {
    fetchIncidents()
  }, [])

  // Filtrar incidencias según el filtro seleccionado
  const filteredIncidents =
    selectedFilter === "all" ? incidents : incidents.filter((incident) => incident.estadoReporte === selectedFilter)

  const renderIncidentItem = ({ item, index }: { item: IncidentItem; index: number }) => {
    return <AnimatedIncidentItem item={item} index={index} />
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <Animated.View
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <BlurView intensity={80} tint="light" style={styles.filterBlur}>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "all" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("all")}
          >
            <Text style={[styles.filterText, selectedFilter === "all" && styles.filterTextActive]}>Todos</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "pendiente" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("pendiente")}
          >
            <Text style={[styles.filterText, selectedFilter === "pendiente" && styles.filterTextActive]}>Pendientes</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "en_proceso" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("en_proceso")}
          >
            <Text style={[styles.filterText, selectedFilter === "en_proceso" && styles.filterTextActive]}>
              En Proceso
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, selectedFilter === "resuelto" && styles.filterButtonActive]}
            onPress={() => setSelectedFilter("resuelto")}
          >
            <Text style={[styles.filterText, selectedFilter === "resuelto" && styles.filterTextActive]}>Resueltos</Text>
          </TouchableOpacity>
        </BlurView>
      </Animated.View>

      {isLoading ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Cargando incidencias...</Text>
        </View>
      ) : error ? (
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#E91E63" />
          <Text style={styles.errorText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={fetchIncidents}>
            <Text style={styles.retryButtonText}>Reintentar</Text>
          </TouchableOpacity>
        </View>
      ) : filteredIncidents.length === 0 ? (
        <Animated.View
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <View style={styles.emptyIconContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#E91E63" />
          </View>
          <Text style={styles.emptyText}>No hay incidencias que mostrar</Text>
          <Text style={styles.emptySubtext}>Los reportes que realices aparecerán aquí</Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredIncidents}
          keyExtractor={(item) => item.idIncidencia.toString()}
          renderItem={renderIncidentItem}
          contentContainerStyle={styles.listContainer}
          refreshing={isLoading}
          onRefresh={fetchIncidents}
        />
      )}
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  filterContainer: {
    padding: 12,
    marginBottom: 8,
  },
  filterBlur: {
    flexDirection: "row",
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "#f8f9fa",
    //shadowColor: "#000",
    //shadowOffset: { width: 0, height: 4 },
    //shadowOpacity: 0.1,
    //shadowRadius: 8,
    elevation: 10,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderBottomWidth: 2,
    borderBottomColor: "transparent",
  },
  filterButtonActive: {
    borderBottomColor: "#E91E63",
  },
  filterText: {
    fontSize: 13,
    color: "#666",
  },
  filterTextActive: {
    color: "#E91E63",
    fontWeight: "bold",
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  incidentCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  incidentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
    paddingBottom: 12,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: "bold",
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: "white",
    fontSize: 12,
  },
  incidentContent: {
    flexDirection: "row",
    marginBottom: 12,
  },
  incidentImageContainer: {
    marginRight: 12,
  },
  incidentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f0f0f0', // Add background color for better visibility
  },
  incidentDetails: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  incidentLocation: {
    fontSize: 14,
    fontWeight: "500",
    marginLeft: 4,
    color: "#333",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 6,
  },
  incidentDate: {
    fontSize: 12,
    color: "#666",
    marginLeft: 4,
  },
  incidentDescription: {
    fontSize: 13,
    color: "#666",
    lineHeight: 18,
  },
  incidentFooter: {
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
    paddingTop: 12,
    alignItems: "flex-end",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#E91E63",
    fontSize: 14,
    marginRight: 4,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: "#333",
    textAlign: "center",
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: "#E91E63",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#E91E63",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "500",
  },
  // Estilos para la sección expandible
  expandedDetails: {
    overflow: "hidden",
    marginTop: 10,
  },
  expandedContent: {
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "#f0f0f0",
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginLeft: 8,
  },
  // Estilos para el mapa
  mapSection: {
    marginBottom: 16,
  },
  mapContainer: {
    height: 200,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
    backgroundColor: "#f0f0f0",
  },
  map: {
    width: "100%",
    height: "100%",
  },
  // Estilos para el carrusel de imágenes
  imagesSection: {
    marginBottom: 16,
  },
  imageCarouselContainer: {
    position: "relative",
    height: 150,
    borderRadius: 12,
    overflow: "hidden",
  },
  mainImage: {
    width: '100%',
    height: '100%',
    borderRadius: 12,
    backgroundColor: '#f0f0f0', // Add background color for better visibility
  },
  noImageContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
  },
  noImageText: {
    marginTop: 4,
    color: '#999',
    fontSize: 12,
    textAlign: 'center',
  },
})
