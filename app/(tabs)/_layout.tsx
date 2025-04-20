import { Tabs } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

export default function TabsLayout() {
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

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#E91E63', // Rosa del logo
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#E91E63', // Rosa del logo
        },
        headerTitleStyle: {
          color: 'white',
          fontWeight: 'bold',
        },
      })}
    >
      <Tabs.Screen 
        name="index" 
        options={{ 
          title: 'Inicio',
          headerTitle: 'Villa de Álvarez'
        }} 
      />
      <Tabs.Screen 
        name="report" 
        options={{ 
          title: 'Reportar',
          headerTitle: 'Reportar Incidencia'
        }} 
      />
      <Tabs.Screen 
        name="incidents" 
        options={{ 
          title: 'Mis Reportes',
          headerTitle: 'Mis Incidencias'
        }} 
      />
      <Tabs.Screen 
        name="map" 
        options={{ 
          title: 'Mapa',
          headerTitle: 'Mapa de Incidencias'
        }} 
      />
      <Tabs.Screen 
        name="account" 
        options={{ 
          title: 'Cuenta',
          headerTitle: 'Mi Cuenta'
        }} 
      />
    </Tabs>
  );
}