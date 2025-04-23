import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { View, StyleSheet, Platform, Text, Image, TouchableOpacity } from "react-native"
import { BlurView } from "expo-blur"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { LinearGradient } from "expo-linear-gradient"

export default function TabsLayout() {
  const insets = useSafeAreaInsets()

  // Componente personalizado para el header de la aplicación
  const CustomHeader = ({ title }) => (
    <LinearGradient
      colors={["#E91E63", "#9C27B0"]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
      style={[styles.headerGradient, { paddingTop: insets.top + 10 }]} // +10 para darle algo de aire extra
    >
      <View style={styles.headerContainer}>
        <View style={styles.headerLeft}>
          <Image
            source={{
              uri: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CF5rtamPzmOvzKH9vtX77bM37exXIc.png",
            }}
            style={styles.headerLogo}
            resizeMode="contain"
          />
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
  
        <View style={styles.headerRight}>
          <TouchableOpacity style={styles.headerIconButton}>
            <Ionicons name="notifications-outline" size={24} color="white" />
            <View style={styles.notificationBadge}>
              <Text style={styles.notificationBadgeText}>3</Text>
            </View>
          </TouchableOpacity>
        </View>
      </View>
    </LinearGradient>
  )
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName

          if (route.name === "index") {
            iconName = focused ? "home" : "home-outline"
          } else if (route.name === "report") {
            iconName = focused ? "add-circle" : "add-circle-outline"
          } else if (route.name === "incidents") {
            iconName = focused ? "list" : "list-outline"
          } else if (route.name === "map") {
            iconName = focused ? "map" : "map-outline"
          } else if (route.name === "account") {
            iconName = focused ? "person" : "person-outline"
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          )
        },
        tabBarActiveTintColor: "#E91E63",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "transparent",
          height: 60 + (Platform.OS === "ios" ? insets.bottom : 0),
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
        },
        tabBarBackground: () => <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        header: ({ route, options }) => {
          return <CustomHeader title={options.headerTitle || route.name} />
        },
      })}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Inicio",
          headerTitle: "Villa App",
        }}
      />
      <Tabs.Screen
        name="report"
        options={{
          title: "Reportar",
          headerTitle: "Reportar",
        }}
      />
      <Tabs.Screen
        name="incidents"
        options={{
          title: "Mis Reportes",
          headerTitle: "Mis Reportes",
        }}
      />
      <Tabs.Screen
        name="map"
        options={{
          title: "Mapa",
          headerTitle: "Mapa",
        }}
      />
      <Tabs.Screen
        name="account"
        options={{
          title: "Cuenta",
          headerTitle: "Mi Cuenta",
        }}
      />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: "rgba(233, 30, 99, 0.1)",
    borderRadius: 12,
    padding: 8,
  },
  headerGradient: {
    paddingTop: Platform.OS === "ios" ? 44 : 8,
    paddingBottom: 8,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    height: 40,
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 100,
    height: 40,
    marginRight: 8,
  },
  headerTitle: {
    color: "white",
    fontSize: 18,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerIconButton: {
    padding: 8,
    position: "relative",
  },
  notificationBadge: {
    position: "absolute",
    top: 4,
    right: 4,
    backgroundColor: "#FF3D00",
    borderRadius: 10,
    width: 16,
    height: 16,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "white",
  },
  notificationBadgeText: {
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
})
