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

  const [locationPermissionGranted, setLocationPermissionGranted] = useState(false)

  const images = [
    {
      id: 1,
      uri: "https://scontent.fgdl9-1.fna.fbcdn.net/v/t39.30808-6/492003718_1106351618202533_2222435723951026490_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=T6X_CWbos-gQ7kNvwHeefkj&_nc_oc=AdkdLatTGHdghbMclDwbe8M51CvLrdu8MUQMvdO80ODjG-We5pq-9wnM6UVBw2B4nPFRfuG0FTdRWZ2vHZY2280B&_nc_zt=23&_nc_ht=scontent.fgdl9-1.fna&_nc_gid=cIdqK3XxngcO7PDAqMGHiQ&oh=00_AfH-7fq7Qy4Rc9DFiSfTsLKdFoy_pJGyzMHSl7iXGCbvIQ&oe=6814B196",
    },
    {
      id: 2,
      uri: "https://scontent.fgdl9-1.fna.fbcdn.net/v/t39.30808-6/488656982_1091664526337909_2397491388117157064_n.jpg?_nc_cat=111&ccb=1-7&_nc_sid=833d8c&_nc_ohc=iA2XGupBH7AQ7kNvwFzuMAk&_nc_oc=AdmN2vnoPZBS6MIwyRGvrcEzy2LaqoY8V0kqcSIIhp0RBh5d5p2OWVjZ4uEeg-nLD1B4LwuFm4v0b7I1i6vYdJPe&_nc_zt=23&_nc_ht=scontent.fgdl9-1.fna&_nc_gid=UDyJCK-52N4EHr5YGOPNFg&oh=00_AfFc_D1Hv1I0tgZiE8ytwMbYkDfEbp4_YOC-4lKnoSfhag&oe=6814C324",
    },
    {
      id: 3,
      uri: "https://scontent.fgdl9-1.fna.fbcdn.net/v/t39.30808-6/492131183_1107246674779694_329804417320292654_n.jpg?_nc_cat=102&ccb=1-7&_nc_sid=833d8c&_nc_ohc=M8mGGlBQ1KQQ7kNvwGmsuKO&_nc_oc=Adm6oLDKrnoHrtfoXExcojd9Lr7KbN30p0Xhpmlz0-AOYNCNmi6S33HJXth1SOf0xDCmhv6U2FtWBrAJgFT-bbjN&_nc_zt=23&_nc_ht=scontent.fgdl9-1.fna&_nc_gid=VWdqEzlhymAnZMC-EPE4TA&oh=00_AfEPlFGDM3Exr6ivwWhl7-sa6RyegtW7oZMcE8VnvugJiQ&oe=6814CB34",
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

  const getWeatherData = async (latitude, longitude) => {
    try {
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
    }
  };
  

  const renderCategoryItem = ({ item }) => (
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
              <Image source={{ uri: weatherData.icon }} style={{ width: 36, height: 36 }} />
              <View style={{ marginLeft: 12 }}>
                <Text style={styles.weatherTemp}>{weatherData.temperature}°C</Text>
                <Text style={styles.weatherDesc}>{weatherData.description}</Text>
              </View>
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
                <Image source={{ uri: item.uri }} style={styles.carouselImage} resizeMode="cover" />
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
})
