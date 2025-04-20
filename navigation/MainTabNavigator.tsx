import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { Ionicons } from '@expo/vector-icons';
import HomeScreen from '../screens/HomeScreen';
import ReportIncidentScreen from '../screens/ReportIncidentScreen';
import MyIncidentsScreen from '../screens/MyIncidentsScreen';
import { StyleSheet } from 'react-native';

const Tab = createBottomTabNavigator();

export default function MainTabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;

          if (route.name === 'Home') {
            iconName = focused ? 'home' : 'home-outline';
          } else if (route.name === 'ReportIncident') {
            iconName = focused ? 'add-circle' : 'add-circle-outline';
          } else if (route.name === 'MyIncidents') {
            iconName = focused ? 'list' : 'list-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#0C6291',
        tabBarInactiveTintColor: 'gray',
        headerStyle: styles.header,
        headerTitleStyle: styles.headerTitle,
      })}
    >
      <Tab.Screen 
        name="Home" 
        component={HomeScreen} 
        options={{ 
          title: 'Inicio',
          headerTitle: 'Villa de Álvarez'
        }} 
      />
      <Tab.Screen 
        name="ReportIncident" 
        component={ReportIncidentScreen} 
        options={{ 
          title: 'Reportar',
          headerTitle: 'Reportar Incidencia'
        }} 
      />
      <Tab.Screen 
        name="MyIncidents" 
        component={MyIncidentsScreen} 
        options={{ 
          title: 'Mis Reportes',
          headerTitle: 'Mis Incidencias'
        }} 
      />
    </Tab.Navigator>
  );
}

const styles = StyleSheet.create({
  header: {
    backgroundColor: '#0C6291',
  },
  headerTitle: {
    color: 'white',
    fontWeight: 'bold',
  }
});