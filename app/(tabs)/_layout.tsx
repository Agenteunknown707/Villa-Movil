import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'report') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'incidents') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: '#E91E63',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          headerTitle: 'Villa App',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="report" 
        options={{ 
          title: 'Reportar',
          headerTitle: 'Reportar Incidencia',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="incidents" 
        options={{ 
          title: 'Mis Reportes',
          headerTitle: 'Mis Incidencias',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Mapa',
          headerTitle: 'Mapa de Incidencias',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: 'Cuenta',
          headerTitle: 'Mi Cuenta',
          headerShown: true,
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
});/*import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';
import { View, StyleSheet, Platform } from 'react-native';
import { BlurView } from 'expo-blur';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function TabsLayout() {
  const insets = useSafeAreaInsets();
  
  return (
    <Tabs
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'index') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'report') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'incidents') {
            iconName = focused ? 'list' : 'list-outline';
          } else if (route.name === 'map') {
            iconName = focused ? 'map' : 'map-outline';
          } else if (route.name === 'account') {
            iconName = focused ? 'person' : 'person-outline';
          }

          return (
            <View style={focused ? styles.activeIconContainer : null}>
              <Ionicons name={iconName} size={size} color={color} />
            </View>
          );
        },
        tabBarActiveTintColor: '#E91E63',
        tabBarInactiveTintColor: '#666',
        tabBarStyle: {
          position: 'absolute',
          borderTopWidth: 0,
          elevation: 0,
          backgroundColor: 'transparent',
          height: 60 + (Platform.OS === 'ios' ? insets.bottom : 0),
          paddingBottom: Platform.OS === 'ios' ? insets.bottom : 0,
        },
        tabBarBackground: () => (
          <BlurView
            tint="light"
            intensity={80}
            style={StyleSheet.absoluteFill}
          />
        ),
        tabBarLabelStyle: {
          fontFamily: 'Poppins-Medium',
          fontSize: 11,
        },
        headerStyle: {
          backgroundColor: '#E91E63',
          elevation: 0,
          shadowOpacity: 0,
          borderBottomWidth: 0,
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
          fontFamily: 'Poppins-Bold',
        },
        headerTitleAlign: 'center',
        headerShadowVisible: false,
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          headerTitle: 'Villa de Álvarez',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="report" 
        options={{ 
          title: 'Reportar',
          headerTitle: 'Reportar Incidencia',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="incidents" 
        options={{ 
          title: 'Mis Reportes',
          headerTitle: 'Mis Incidencias',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Mapa',
          headerTitle: 'Mapa de Incidencias',
          headerShown: true,
        }} 
      />
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: 'Cuenta',
          headerTitle: 'Mi Cuenta',
          headerShown: true,
        }} 
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  activeIconContainer: {
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    borderRadius: 12,
    padding: 8,
  },
});*/