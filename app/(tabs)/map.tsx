"use client"

import { useRef, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Animated,
  Dimensions,
  PanResponder,
} from "react-native"
import MapView, { Marker } from "react-native-maps"
import { Ionicons } from "@expo/vector-icons"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"

const { width, height } = Dimensions.get("window")

export default function MapScreen() {
  const [selectedFilter, setSelectedFilter] = useState("pending")
  const [drawerVisible, setDrawerVisible] = useState(false)

  const mapIncidents = [
    { id: 1, type: "Bache", lat: 19.2433, lng: -103.7254, status: "pending", date: "15/04/2023" },
    { id: 2, type: "Alumbrado", lat: 19.2456, lng: -103.7289, status: "in_progress", date: "10/04/2023" },
    { id: 3, type: "Basura", lat: 19.2410, lng: -103.7230, status: "resolved", date: "05/04/2023" },
    { id: 4, type: "Fuga de agua", lat: 19.2478, lng: -103.7265, status: "pending", date: "01/04/2023" },
    { id: 5, type: "Señalización", lat: 19.2445, lng: -103.7210, status: "in_progress", date: "28/03/2023" },
  ]

  const filteredIncidents =
    selectedFilter === "all" ? mapIncidents : mapIncidents.filter((incident) => incident.status === selectedFilter)

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current
  const mapScaleAnim = useRef(new Animated.Value(0.95)).current

  const drawerHeight = 250
  const drawerMinHeight = 60
  const drawerAnim = useRef(new Animated.Value(drawerVisible ? 0 : drawerHeight - drawerMinHeight)).current

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (_, gestureState) => {
        if (gestureState.dy > 0) {
          drawerAnim.setValue(Math.min(drawerHeight - drawerMinHeight, gestureState.dy))
        } else {
          drawerAnim.setValue(Math.max(0, gestureState.dy))
        }
      },
      onPanResponderRelease: (_, gestureState) => {
        if (gestureState.dy > 50) {
          Animated.spring(drawerAnim, { toValue: drawerHeight - drawerMinHeight, useNativeDriver: true }).start(() => setDrawerVisible(false))
        } else {
          Animated.spring(drawerAnim, { toValue: 0, useNativeDriver: true }).start(() => setDrawerVisible(true))
        }
      },
    }),
  ).current

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, { toValue: 1, duration: 800, useNativeDriver: true }),
      Animated.timing(slideAnim, { toValue: 0, duration: 800, useNativeDriver: true }),
      Animated.spring(mapScaleAnim, { toValue: 1, friction: 8, tension: 40, useNativeDriver: true }),
    ]).start()
  }, [])

  useEffect(() => {
    Animated.spring(drawerAnim, { toValue: drawerVisible ? 0 : drawerHeight - drawerMinHeight, useNativeDriver: true }).start()
  }, [drawerVisible])

  const handleFilterChange = (filter) => {
    setSelectedFilter(filter)
  }

  const toggleDrawer = () => {
    setDrawerVisible(!drawerVisible)
  }

  return (
    <View style={styles.container}>
      {/* Filtros arriba */}
      <Animated.View style={[styles.filtersContainer, { opacity: fadeAnim, transform: [{ translateY: slideAnim }] }]}>
        {["pending", "in_progress", "resolved", "all"].map((filter) => (
          <TouchableOpacity
            key={filter}
            style={[styles.filterButton, selectedFilter === filter && styles.filterButtonActive]}
            onPress={() => handleFilterChange(filter)}
          >
            <Text style={[styles.filterText, selectedFilter === filter && styles.filterTextActive]}>
              {filter === "pending" ? "Pendiente" : filter === "in_progress" ? "En proceso" : filter === "resolved" ? "Resuelto" : "Todos"}
            </Text>
          </TouchableOpacity>
        ))}
      </Animated.View>

      {/* Mapa real con react-native-maps */}
      <Animated.View style={[styles.mapContainer, { opacity: fadeAnim, transform: [{ scale: mapScaleAnim }] }]}>
        <MapView
          style={StyleSheet.absoluteFillObject}
          initialRegion={{
            latitude: 19.2676,
            longitude: -103.7373,
            latitudeDelta: 0.02,
            longitudeDelta: 0.02,
          }}
        >
          {filteredIncidents.map((incident) => (
            <Marker
              key={incident.id}
              coordinate={{ latitude: incident.lat, longitude: incident.lng }}
              title={incident.type}
              description={`Estado: ${incident.status}`}
              pinColor={
                incident.status === "resolved"
                  ? "green"
                  : incident.status === "in_progress"
                  ? "orange"
                  : "red"
              }
            />
          ))}
        </MapView>

        {/* Botones flotantes */}
        <TouchableOpacity style={styles.mapControlButton}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="locate" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mapControlButton, { bottom: 130 }]}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="add" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.mapControlButton, { bottom: 80 }]}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="remove" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      {/* Drawer deslizable */}
      <Animated.View style={[styles.drawerContainer, { transform: [{ translateY: drawerAnim }] }]} {...panResponder.panHandlers}>
        <View style={styles.drawerHandle}>
          <View style={styles.drawerHandleBar} />
        </View>

        <View style={styles.drawerHeader}>
          <Ionicons name="time-outline" size={20} color="#E91E63" style={styles.drawerHeaderIcon} />
          <Text style={styles.drawerTitle}> {filteredIncidents.length} incidencias recientes</Text>
        </View>

        <ScrollView style={styles.incidentsListContainer} showsVerticalScrollIndicator={false} contentContainerStyle={styles.incidentsListContent}>
          {filteredIncidents.map((incident) => (
            <TouchableOpacity key={incident.id} style={styles.incidentItem} activeOpacity={0.8}>
              <LinearGradient colors={["#E91E63", "#9C27B0"]} style={styles.incidentDot} />
              <View style={styles.incidentInfo}>
                <Text style={styles.incidentType}>{incident.type}</Text>
                <Text style={styles.incidentLocation}>Lat: {incident.lat}, Lng: {incident.lng}</Text>
                <Text style={styles.incidentDate}>Reportado: {incident.date}</Text>
              </View>
              <View style={styles.incidentStatus}>
                <Text style={styles.incidentStatusText}>
                  {incident.status === "resolved" ? "Resuelto" : incident.status === "in_progress" ? "En proceso" : "Pendiente"}
                </Text>
              </View>
              <View style={styles.incidentActions}>
                <TouchableOpacity style={styles.incidentActionButton}>
                  <Ionicons name="navigate" size={18} color="#E91E63" />
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </Animated.View>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
    position: "relative",
    zIndex: 1, // Asegura que el contenido esté por encima de la barra de navegación
  },
  filtersContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    paddingHorizontal: 10,
    paddingVertical: 10,
    backgroundColor: "white",
    borderRadius: 20,
    marginHorizontal: 10,
    marginTop: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    zIndex: 2,
  },
  filterButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: "white",
  },
  filterButtonActive: {
    backgroundColor: "#f0f0f0",
  },
  filterText: {
    fontSize: 14,
    color: "#666",
    fontWeight: "500",
  },
  filterTextActive: {
    color: "#E91E63",
    fontWeight: "bold",
  },
  mapContainer: {
    flex: 1,
    position: "relative",
    borderRadius: 0,
    overflow: "hidden",
    zIndex: 1,
  },
  mapImage: {
    width: "100%",
    height: "100%",
  },
  mapMarker: {
    position: "absolute",
    alignItems: "center",
    justifyContent: "center",
    zIndex: 2,
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: "white",
  },
  mapControlButton: {
    position: "absolute",
    right: 16,
    bottom: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    zIndex: 3,
  },
  mapControlBlur: {
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 310, // Altura fija para el drawer
    backgroundColor: "white",
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
    zIndex: 10, // Valor alto para asegurar que esté por encima de todo
  },
  drawerHandle: {
    width: "100%",
    height: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  drawerHandleBar: {
    width: 40,
    height: 5,
    borderRadius: 3,
    backgroundColor: "#ddd",
  },
  drawerHeader: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
  drawerHeaderIcon: {
    marginRight: 10,
  },
  drawerTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
  },
  incidentsListContainer: {
    flex: 1,
  },
  incidentsListContent: {
    paddingHorizontal: 16,
    paddingVertical: 10,
    paddingBottom: 120, // Espacio adicional en la parte inferior para evitar que el contenido quede detrás de la barra de navegación
  },
  incidentItem: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  incidentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
  },
  incidentLocation: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
  incidentDate: {
    fontSize: 11,
    color: "#999",
    marginTop: 2,
  },
  incidentStatus: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
    backgroundColor: "#f0f0f0",
    marginRight: 8,
  },
  incidentStatusText: {
    fontSize: 10,
    color: "#666",
    fontWeight: "500",
  },
  incidentActions: {
    flexDirection: "row",
  },
  incidentActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    alignItems: "center",
    justifyContent: "center",
  },
})
