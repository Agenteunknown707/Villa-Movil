"use client"

import { useRef, useEffect, useState } from "react"
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Dimensions,
  FlatList,
} from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { Ionicons } from "@expo/vector-icons"
import { useRouter } from "expo-router"
import { LinearGradient } from "expo-linear-gradient"
import Carousel from "react-native-reanimated-carousel"
import * as Location from "expo-location" // Importar la librería para obtener la ubicación
import React from "react"

const { width } = Dimensions.get("window")

const CATEGORIES = [
  { id: "1", name: "Baches", icon: "construct" },
  { id: "2", name: "Alumbrado", icon: "flashlight" },
  { id: "3", name: "Basura", icon: "trash" },
  { id: "4", name: "Agua", icon: "water" },
  { id: "5", name: "Seguridad", icon: "shield" },
]

export default function HomeScreen() {
  const router = useRouter()
  const [activeSlide, setActiveSlide] = useState(0)

  const [weatherData, setWeatherData] = useState({
    temperature: 0, // Inicia con 0
    description: "", // Inicia vacío
    icon: "", // Inicia vacío
  })
  const [isLoading, setIsLoading] = useState(true)

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

  const images = [
    {
      id: 1,
      source: require("../../assets/images/imagen1.jpg"), 
    },
    {
      id: 2,
      source: require("../../assets/images/imagen2.jpg"), 
    },
    {
      id: 3,
      source: require("../../assets/images/imagen3.jpg"), 
    },
  ]

  const fadeAnim = useRef(new Animated.Value(0)).current
  const slideAnim = useRef(new Animated.Value(30)).current

  useEffect(() => {
    // Primero pedir permiso para acceder a la ubicación
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync()
      if (status === "granted") {
        setLocationPermissionGranted(true)
        
        // Obtener las coordenadas del usuario
        const location = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.High })
        const { latitude, longitude } = location.coords
        
        getWeatherData(latitude, longitude) // Pasar las coordenadas a la API
      } else {
        console.log("Permiso de ubicación denegado.")
      }
    })()
  
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

  const getWeatherData = async (latitude: number, longitude: number) => {
    try {
      setIsLoading(true)
      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=21be192e8239bc79149166622e90cd30&units=metric&lang=es`
      );
  
      const data = await response.json();
  
      // Mostrar toda la respuesta para debug
      console.log("Respuesta completa de la API:", data);
  
      if (data.main && data.weather && data.weather.length > 0) {
        setWeatherData({
          temperature: data.main.temp,
          description: data.weather[0].description,
          icon: `http://openweathermap.org/img/wn/${data.weather[0].icon}.png`,
        });
      } else {
        console.error("No se pudo obtener el clima: respuesta incompleta");
      }
    } catch (error) {
      console.error("Error al obtener los datos del clima:", error);
    } finally {
      setIsLoading(false)
    }
  };
  

  const renderCategoryItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.categoryItem} activeOpacity={0.7}>
      <View style={styles.categoryIconContainer}>
        <Ionicons name={item.icon} size={24} color="#E91E63" />
      </View>
      <Text style={styles.categoryName}>{item.name}</Text>
    </TouchableOpacity>
  )

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        
        {/* Hero Section */}
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
              {/* Sección del clima */}
            <View style={styles.weatherContainer}>
              {isLoading ? (
                <View style={styles.loadingContainer}>
                  <Text style={styles.loadingText}>Cargando clima...</Text>
                </View>
              ) : (
                <>
                  <Image source={{ uri: weatherData.icon }} style={{ width: 36, height: 36 }} />
                  <View style={{ marginLeft: 12 }}>
                    <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
                    <Text style={styles.weatherDesc}>{weatherData.description}</Text>
                  </View>
                </>
              )}
            </View>
          </Animated.View>
        </LinearGradient>

        {/* Carrusel de imágenes */}
        <View style={styles.carouselWrapper}>
          <Carousel
            loop
            width={width}
            height={350}
            autoPlay={true}
            data={images}
            scrollAnimationDuration={1000}
            onProgressChange={(_, absoluteProgress) => {
              setActiveSlide(Math.round(absoluteProgress) % images.length)
            }}
            renderItem={({ item }) => (
              <View style={styles.carouselItem}>
                <Image source={ item.source } style={styles.carouselImage} resizeMode="cover" />
                <LinearGradient colors={["transparent", "rgba(0,0,0,0.3)"]} style={styles.carouselGradient} />
              </View>
            )}
          />

          {/* Paginación */}
          <View style={styles.paginationContainer}>
            {images.map((_, index) => (
              <View
                key={index}
                style={[
                  styles.paginationDot,
                  activeSlide === index ? styles.paginationDotActive : {},
                ]}
              />
            ))}
          </View>
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

        {/* Botón Reportar */}
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
    paddingBottom: 15,
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
    marginBottom: 0,
  },
  carouselWrapper: {
    marginTop: 20,
    position: "relative",
  },
  carouselItem: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden",
    marginHorizontal: 16,
    position: "relative",
  },
  carouselImage: {
    width: "100%",
    height: "100%",
    borderRadius: 10,
  },
  carouselGradient: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    height: 80,
  },
  paginationContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    bottom: 10,
    left: 0,
    right: 0,
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    marginHorizontal: 4,
  },
  paginationDotActive: {
    backgroundColor: "white",
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  weatherContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#ffffff",
    marginHorizontal: 20,
    marginTop: 10,
    padding: 10,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
  },
  weatherTemp: {
    fontSize: 22,
    fontWeight: "bold",
    color: "#333",
  },
  weatherDesc: {
    fontSize: 16,
    color: "#666",
  },
  sectionContainer: {
    marginTop: 30,
  },
  categoriesList: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: "center",
    marginRight: 20,
  },
  categoryIconContainer: {
    backgroundColor: "#f8bbd0",
    padding: 16,
    borderRadius: 50,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: "500",
    color: "#333",
  },
  reportButtonContainer: {
    marginTop: 30,
    marginHorizontal: 16,
    marginBottom: 40,
  },
  reportButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingVertical: 14,
    borderRadius: 30,

  },
  reportButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
    marginLeft: 8,
  },
  loadingContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 10,
  },
  loadingText: {
    fontSize: 16,
    color: '#666',
    fontStyle: 'italic',
  },
})
