import React, { useEffect, useRef } from "react"
import {
  Animated,
  View,
  Text,
  TouchableOpacity,
  Image,
  Easing,
  StyleSheet,
} from "react-native"
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
  }
  index: number
}

export default function IncidentItem({ item, index }: IncidentItemProps) {
  const itemFadeAnim = useRef(new Animated.Value(0)).current
  const itemSlideAnim = useRef(new Animated.Value(50)).current

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

  return (
    <Animated.View
      style={{
        opacity: itemFadeAnim,
        transform: [{ translateY: itemSlideAnim }],
      }}
    >
      <TouchableOpacity style={styles.incidentCard} activeOpacity={0.9}>
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
              <Text style={styles.incidentDate}>
                Reportado: {item.date}
              </Text>
            </View>
            <Text style={styles.incidentDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>

        <View style={styles.incidentFooter}>
          <TouchableOpacity
            style={styles.detailsButton}
            onPress={() =>
              router.push({
                pathname: "/(tabs)/incident-details",
                params: { id: item.id },
              })
            }
          >
            <Text style={styles.detailsButtonText}>Ver Detalles</Text>
            <Ionicons name="chevron-forward" size={16} color="#E91E63" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
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
})
