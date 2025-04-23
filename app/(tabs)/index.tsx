"use client"

import { useRef, useEffect } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  TextInput,
  FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import { BlurView } from "expo-blur"
import Carousel from "react-native-reanimated-carousel"

const { width } = Dimensions.get("window")

// Datos de ejemplo para categorías
const CATEGORIES = [
  { id: "1", name: "Baches", icon: "construct" },
  { id: "2", name: "Alumbrado", icon: "flashlight" },
  { id: "3", name: "Basura", icon: "trash" },
  { id: "4", name: "Agua", icon: "water" },
  { id: "5", name: "Seguridad", icon: "shield" },
]




export default function HomeScreen() {
  const router = useRouter()

  const images = [
    { id: 1, uri: "https://elpulsodecolima.com/wp-content/uploads/2023/03/vacaciones-en-la-villa2-e1680027446934.jpg" },
    { id: 2, uri: "https://aventurateamexico.com/wp-content/uploads/2022/08/jardin-de-la-villa-al-1920x1440.jpg" },
    { id: 3, uri: "http://www.colimanoticias.com/wp-content/uploads/2016/08/ayuntamiento-de-villa-de-alvarez-agosto.jpg" },
  ]

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

  const renderCategoryItem = ({ item }) => (
    <TouchableOpacity style={styles.categoryItem}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#E91E63" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  
  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        {/* Hero Section con Gradiente */}
       
        <LinearGradient
          colors={["#E91E63", "#9C27B0"]}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroSection}
        >
          <Animated.View
            style={[
              styles.heroContent,
              {
                opacity: fadeAnim,
                transform: [{ translateY: slideAnim }],
              },
            ]}
          >
            <Text style={styles.heroTitle}>Aplicación de reportes ciudadanos</Text>
            <Text style={styles.heroSubtitle}>Ayúdanos a mejorar nuestra ciudad</Text>

            
          </Animated.View>
        </LinearGradient>

        <View style={{ marginTop: 20 }}>
          <Carousel
            loop
            width={width}
            height={350}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            renderItem={({ item }) => (
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                  alignItems: "center",
                  borderRadius: 12,
                  overflow: "hidden",
                  marginHorizontal: 16,
                }}
              >
                <Image
                  source={{ uri: item.uri }}
                  style={{ width: "100%", height: "100%", borderRadius: 12 }}
                  resizeMode="cover"
                />
              </View>
            )}
          />
        </View>
        {/* Categorías */}
        <View style={styles.sectionContainer}>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategoryItem}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        <TouchableOpacity
          style={styles.reportButtonContainer}
          onPress={() => router.push("/(tabs)/report")}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#E91E63", "#9C27B0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reportButton}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.reportButtonText}>Reportar Nueva Incidencia</Text>
          </LinearGradient>
        </TouchableOpacity>
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
    paddingBottom: 20,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  heroContent: {
    width: "100%",
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
    marginBottom: 8,
  },
  heroSubtitle: {
    fontSize: 16,
    color: "rgba(255, 255, 255, 0.8)",
    marginBottom: 20,
  },
  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "white",
    borderRadius: 12,
    paddingHorizontal: 15,
    height: 50,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  sectionContainer: {
    marginTop: 20,
    paddingHorizontal: 16,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
  },
  sectionLink: {
    color: "#E91E63",
    fontWeight: "500",
  },
  categoriesList: {
    paddingVertical: 8,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 12,
    color: "#333",
    textAlign: "center",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    paddingHorizontal: 16,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: "center",
    width: "30%",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },
  statNumber: {
    fontSize: 20,
    fontWeight: "bold",
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: "#666",
  },
  reportCard: {
    backgroundColor: "white",
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: "row",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  reportImage: {
    width: 80,
    height: 80,
  },
  reportInfo: {
    flex: 1,
    padding: 12,
    justifyContent: "space-between",
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: "bold",
    marginBottom: 4,
  },
  reportLocation: {
    fontSize: 14,
    color: "#666",
    marginBottom: 8,
  },
  reportStatus: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: "#666",
  },
  reportButtonContainer: {
    borderRadius: 12,
    overflow: "hidden",
    marginHorizontal: 16,
    marginTop: 20,
    shadowColor: "#E91E63",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reportButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 55,
    borderRadius: 12,
  },
  reportButtonText: {
    color: "white",
    fontWeight: "bold",
    marginLeft: 8,
  },
})
