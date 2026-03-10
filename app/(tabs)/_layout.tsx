import { Tabs } from "expo-router"
import { Ionicons } from "@expo/vector-icons"
import { View, StyleSheet, Platform, Text, Image, TouchableOpacity, StatusBar } from "react-native"
import { BlurView } from "expo-blur"
import { useSafeAreaInsets } from "react-native-safe-area-context"
import { useState } from "react"
import React from "react"

export default function TabLayout() {
  const insets = useSafeAreaInsets()

  const CustomHeader = ({ title }: { title: string }) => {
    const [showNotifications, setShowNotifications] = useState(false)

    const toggleNotifications = () => {
      setShowNotifications(!showNotifications)
    }

    return (
      <>
        <StatusBar barStyle="dark-content" backgroundColor="transparent" translucent />
        <BlurView intensity={80} tint="light" style={[styles.headerContainer, { marginTop: insets.top }]}>
          <View style={styles.headerInner}>
            <View style={styles.headerLeft}>
              <Image
                source={require("../../assets/images/colima.png")}
                style={styles.headerLogo}
                resizeMode="contain"
              />
              <Text style={styles.headerTitle}>{title}</Text>
            </View>

            <View style={styles.headerRight}>
              <TouchableOpacity style={styles.headerIconButton} onPress={toggleNotifications}>
                <Ionicons name="notifications-outline" size={26} color="#002D72" />
                <View style={styles.notificationBadge}>
                  <Text style={styles.notificationBadgeText}>3</Text>
                </View>
              </TouchableOpacity>

              {showNotifications && (
                <View style={styles.notificationDropdown}>
                  <Text style={styles.notificationItem}>🔔 Nueva actualización disponible</Text>
                  <Text style={styles.notificationItem}>📢 Tu reporte fue recibido</Text>
                  <Text style={styles.notificationItem}>✅ Tu reporte fue resuelto</Text>
                </View>
              )}
            </View>
          </View>
        </BlurView>
      </>
    )
  }

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
              <Ionicons name={iconName as any} size={size} color={color} />
            </View>
          )
        },
        tabBarActiveTintColor: "#002D72",
        tabBarInactiveTintColor: "#666",
        tabBarStyle: {
          position: "absolute",
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: "rgba(255, 255, 255, 0.9)",
          height: 60 + (Platform.OS === "ios" ? insets.bottom : 0),
          paddingBottom: Platform.OS === "ios" ? insets.bottom : 0,
          backdropFilter: "blur(10px)",
        },
        tabBarBackground: () => <BlurView tint="light" intensity={80} style={StyleSheet.absoluteFill} />,
        tabBarLabelStyle: {
          fontSize: 11,
        },
        header: ({ route, options }) => {
          return <CustomHeader title={options.headerTitle as string || route.name} />
        },
      })}
    >
      <Tabs.Screen name="index" options={{ title: "Inicio", headerTitle: "Villa App" }} />
      <Tabs.Screen name="report" options={{ title: "Reportar", headerTitle: "Reportar" }} />
      <Tabs.Screen name="incidents" options={{ title: "Mis Reportes", headerTitle: "Mis Reportes" }} />
      <Tabs.Screen name="map" options={{ title: "Mapa", headerTitle: "Mapa" }} />
      <Tabs.Screen name="account" options={{ title: "Cuenta", headerTitle: "Mi Cuenta" }} />
    </Tabs>
  )
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: "rgba(30, 67, 233, 0.15)",
    borderRadius: 12,
    padding: 2,
    transform: [{ scale: 1.1 }],
  },
  headerContainer: {
    paddingHorizontal: 16,
    paddingBottom: 8,
    height: 70,
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
  },
  headerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  headerLeft: {
    flexDirection: "row",
    alignItems: "center",
  },
  headerLogo: {
    width: 120,
    height: 60,
    marginRight: 6,
  },
  headerTitle: {
    color: "#002D72",
    fontSize: 20,
    fontWeight: "bold",
  },
  headerRight: {
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
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
  notificationDropdown: {
    position: "absolute",
    top: 40,
    right: -10,
    backgroundColor: "#fff",
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
    zIndex: 1000,
    width: 270,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  notificationItem: {
    fontSize: 14,
    paddingVertical: 10,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flexDirection: "row",
    alignItems: "center",
    color: "#333",
  },
})
