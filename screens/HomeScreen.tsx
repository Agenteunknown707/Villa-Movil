import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen({ navigation }) {
  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.welcomeSection}>
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.cityName}>Villa de Álvarez</Text>
          <Text style={styles.appDescription}>
            Ayúdanos a mejorar nuestra ciudad reportando incidencias urbanas
          </Text>
        </View>

        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#4CAF50" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Resueltos</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="time" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>En Proceso</Text>
          </View>
          <View style={styles.statCard}>
            <Ionicons name="alert-circle" size={24} color="#F44336" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Reportes Recientes</Text>
        
        <View style={styles.recentReportsContainer}>
          {[1, 2, 3].map((item) => (
            <TouchableOpacity key={item} style={styles.reportCard}>
              <Image
                source={{ uri: `https://placeholder.svg?height=80&width=80&text=Reporte${item}` }}
                style={styles.reportImage}
              />
              <View style={styles.reportInfo}>
                <Text style={styles.reportTitle}>
                  {item === 1 ? 'Bache en Calle Principal' : 
                   item === 2 ? 'Alumbrado Dañado' : 'Acumulación de Basura'}
                </Text>
                <Text style={styles.reportLocation}>
                  {item === 1 ? 'Colonia Centro' : 
                   item === 2 ? 'Av. Constitución' : 'Parque Municipal'}
                </Text>
                <View style={styles.reportStatus}>
                  <View style={[
                    styles.statusIndicator, 
                    { backgroundColor: 
                      item === 1 ? '#4CAF50' : 
                      item === 2 ? '#FF9800' : '#F44336' 
                    }
                  ]} />
                  <Text style={styles.statusText}>
                    {item === 1 ? 'Resuelto' : 
                     item === 2 ? 'En Proceso' : 'Pendiente'}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity 
          style={styles.reportButton}
          onPress={() => navigation.navigate('ReportIncident')}
        >
          <Ionicons name="add-circle" size={20} color="white" />
          <Text style={styles.reportButtonText}>Reportar Nueva Incidencia</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollView: {
    padding: 16,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0C6291',
    marginBottom: 8,
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  recentReportsContainer: {
    marginBottom: 24,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  reportImage: {
    width: 80,
    height: 80,
  },
  reportInfo: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  reportTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  reportLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  reportStatus: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusIndicator: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginRight: 6,
  },
  statusText: {
    fontSize: 12,
    color: '#666',
  },
  reportButton: {
    backgroundColor: '#0C6291',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
  },
});