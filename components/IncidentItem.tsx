"use client"

import { useEffect, useRef, useState } from "react"
import { Animated, View, Text, TouchableOpacity, Image, Easing, StyleSheet, FlatList } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { useRouter } from "expo-router"

type IncidentItemProps = {
  item: {
    id: string
    type: string
    location: string
    date: string
    description: string
    status: "resolved" | "in_progress" | "pending" | string
    // Añadimos imágenes y coordenadas para la versión expandida
    images?: string[]
    coordinates?: { lat: number; lng: number }
  }
  index: number
}

export default function IncidentItem({ item, index }: IncidentItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [activeImageIndex, setActiveImageIndex] = useState(0)
  const itemFadeAnim = useRef(new Animated.Value(0)).current
  const itemSlideAnim = useRef(new Animated.Value(50)).current
  const expandAnim = useRef(new Animated.Value(0)).current
  const rotateAnim = useRef(new Animated.Value(0)).current

  // Imágenes de ejemplo si no se proporcionan
  const images = item.images || [
    `https://via.placeholder.com/300x200.png?text=Imagen+${item.id}+1`,
    `https://via.placeholder.com/300x200.png?text=Imagen+${item.id}+2`,
    `https://via.placeholder.com/300x200.png?text=Imagen+${item.id}+3`,
  ]

  // Coordenadas de ejemplo si no se proporcionan
  const coordinates = item.coordinates || { lat: 19.2433, lng: -103.7254 }

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
        useNativeDriver: false, // No podemos usar useNativeDriver para height
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
    outputRange: [0, 300], // Aumentamos la altura máxima para las imágenes
  })

  const iconRotation = rotateAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "90deg"],
  })

  let statusColor, statusText, statusGradient

  switch (item.status) {
    case "resolved":
      statusColor = "#8BC34A"
      statusText = "Resuelto"
      statusGradient = ["#8BC34A", "#4CAF50"]
      break
    case "in_progress":
      statusColor = "#FF9800"
      statusText = "En Proceso"
      statusGradient = ["#FF9800", "#FF5722"]
      break
    case "pending":
      statusColor = "#E91E63"
      statusText = "Pendiente"
      statusGradient = ["#E91E63", "#9C27B0"]
      break
    default:
      statusColor = "#999"
      statusText = "Desconocido"
      statusGradient = ["#999", "#666"]
  }

  const router = useRouter()

  // Función para alternar la expansión
  const toggleExpand = () => {
    setExpanded(!expanded)
  }

  // Renderizar miniatura de imagen
  const renderImageThumbnail = ({ item, index }) => (
    <TouchableOpacity
      style={[styles.thumbnailContainer, activeImageIndex === index && styles.activeThumbnail]}
      onPress={() => setActiveImageIndex(index)}
    >
      <Image source={{ uri: item }} style={styles.thumbnailImage} />
    </TouchableOpacity>
  )

  return (
    <Animated.View
      style={{
        opacity: itemFadeAnim,
        transform: [{ translateY: itemSlideAnim }],
      }}
    >
      <View style={styles.incidentCard}>
        <View style={styles.incidentHeader}>
          <Text style={styles.incidentType}>{item.type}</Text>
          <LinearGradient
            colors={statusGradient}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.statusBadge}
          >
            <Text style={styles.statusBadgeText}>{statusText}</Text>
          </LinearGradient>
        </View>

        <View style={styles.incidentContent}>
          <View style={styles.incidentImageContainer}>
            <Image
              source={{
                uri: `https://via.placeholder.com/80x80.png?text=${item.id}`,
              }}
              style={styles.incidentImage}
            />
          </View>
          <View style={styles.incidentDetails}>
            <View style={styles.locationContainer}>
              <Ionicons name="location" size={16} color="#666" />
              <Text style={styles.incidentLocation}>{item.location}</Text>
            </View>
            <View style={styles.dateContainer}>
              <Ionicons name="calendar" size={16} color="#666" />
              <Text style={styles.incidentDate}>Reportado: {item.date}</Text>
            </View>
            <Text style={styles.incidentDescription} numberOfLines={expanded ? undefined : 2}>
              {item.description}
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
                
                <View style={styles.mapMarker}>
                  <LinearGradient colors={statusGradient} style={styles.mapMarkerDot} />
                </View>
              </View>
            </View>

            {/* Carrusel de imágenes */}
            <View style={styles.imagesSection}>
              <View style={styles.sectionHeader}>
                <Ionicons name="images-outline" size={20} color="#E91E63" />
                <Text style={styles.sectionTitle}>Imágenes</Text>
              </View>
              <View style={styles.imageCarouselContainer}>
                <Image source={{ uri: images[activeImageIndex] }} style={styles.mainImage} resizeMode="cover" />

                <View style={styles.imageCounter}>
                  <Text style={styles.imageCounterText}>
                    {activeImageIndex + 1} / {images.length}
                  </Text>
                </View>

                {/* Miniaturas de imágenes */}
                <View style={styles.thumbnailsContainer}>
                  <FlatList
                    data={images}
                    renderItem={renderImageThumbnail}
                    keyExtractor={(item, index) => `thumb-${index}`}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={styles.thumbnailsList}
                  />
                </View>
              </View>
            </View>
          </View>
        </Animated.View>

        <View style={styles.incidentFooter}>
          <TouchableOpacity style={styles.detailsButton} onPress={toggleExpand}>
            <Text style={styles.detailsButtonText}>{expanded ? "Ocultar Detalles" : "Ver Detalles"}</Text>
            <Animated.View style={{ transform: [{ rotate: iconRotation }] }}>
              <Ionicons name="chevron-forward" size={16} color="#E91E63" />
            </Animated.View>
          </TouchableOpacity>
        </View>
      </View>
    </Animated.View>
  )
}

const styles = StyleSheet.create({
  incidentCard: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  incidentHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  statusBadge: {
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  statusBadgeText: {
    fontSize: 12,
    color: "#fff",
    fontWeight: "600",
  },
  incidentContent: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginTop: 8,
  },
  incidentImageContainer: {
    width: 80,
    height: 80,
    borderRadius: 10,
    overflow: "hidden",
    marginRight: 12,
  },
  incidentImage: {
    width: "100%",
    height: "100%",
    resizeMode: "cover",
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
    color: "#555",
    marginLeft: 6,
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 4,
  },
  incidentDate: {
    fontSize: 13,
    color: "#777",
    marginLeft: 6,
  },
  incidentDescription: {
    fontSize: 14,
    color: "#444",
    marginTop: 6,
  },
  incidentFooter: {
    marginTop: 10,
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
  },
  detailsButtonText: {
    color: "#E91E63",
    fontWeight: "600",
    marginRight: 4,
  },
  listContainer: {
    paddingBottom: 20,
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
    height: 120,
    borderRadius: 12,
    overflow: "hidden",
    position: "relative",
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapMarker: {
    position: "absolute",
    top: "50%",
    left: "50%",
    marginLeft: -8,
    marginTop: -8,
  },
  mapMarkerDot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
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
    width: "100%",
    height: "100%",
    borderRadius: 12,
  },
  imageCounter: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(0,0,0,0.6)",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  imageCounterText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  thumbnailsContainer: {
    position: "absolute",
    bottom: 8,
    left: 0,
    right: 0,
  },
  thumbnailsList: {
    paddingHorizontal: 8,
  },
  thumbnailContainer: {
    width: 40,
    height: 40,
    borderRadius: 6,
    marginRight: 6,
    borderWidth: 2,
    borderColor: "rgba(255,255,255,0.5)",
    overflow: "hidden",
  },
  activeThumbnail: {
    borderColor: "#E91E63",
  },
  thumbnailImage: {
    width: "100%",
    height: "100%",
  },
})
