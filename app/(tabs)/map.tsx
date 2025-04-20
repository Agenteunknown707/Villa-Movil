import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function MapScreen() {
  // Datos simulados de incidencias para mostrar en el mapa
  const mapIncidents = [
    { id: 1, type: 'Bache', lat: '19.2433', lng: '-103.7254', status: 'pending' },
    { id: 2, type: 'Alumbrado', lat: '19.2456', lng: '-103.7289', status: 'in_progress' },
    { id: 3, type: 'Basura', lat: '19.2410', lng: '-103.7230', status: 'resolved' },
    { id: 4, type: 'Fuga de agua', lat: '19.2478', lng: '-103.7265', status: 'pending' },
    { id: 5, type: 'Señalización', lat: '19.2445', lng: '-103.7210', status: 'in_progress' },
  ];

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.mapContainer}>
        <Image
          source={{ uri: 'https://placeholder.svg?height=400&width=400&text=Mapa+de+Villa+de+Álvarez' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Marcadores simulados en el mapa */}
        <View style={[styles.mapMarker, { top: '30%', left: '45%' }]}>
          <View style={[styles.marker, { backgroundColor: '#E91E63' }]} />
        </View>
        <View style={[styles.mapMarker, { top: '40%', left: '60%' }]}>
          <View style={[styles.marker, { backgroundColor: '#FF9800' }]} />
        </View>
        <View style={[styles.mapMarker, { top: '50%', left: '35%' }]}>
          <View style={[styles.marker, { backgroundColor: '#8BC34A' }]} />
        </View>
        <View style={[styles.mapMarker, { top: '25%', left: '55%' }]}>
          <View style={[styles.marker, { backgroundColor: '#E91E63' }]} />
        </View>
        <View style={[styles.mapMarker, { top: '60%', left: '50%' }]}>
          <View style={[styles.marker, { backgroundColor: '#FF9800' }]} />
        </View>
      </View>

      <View style={styles.legendContainer}>
        <Text style={styles.legendTitle}>Leyenda</Text>
        <View style={styles.legendItems}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#E91E63' }]} />
            <Text style={styles.legendText}>Pendiente</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#FF9800' }]} />
            <Text style={styles.legendText}>En Proceso</Text>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, { backgroundColor: '#8BC34A' }]} />
            <Text style={styles.legendText}>Resuelto</Text>
          </View>
        </View>
      </View>

      <ScrollView style={styles.incidentsListContainer}>
        <Text style={styles.listTitle}>Incidencias en el Mapa</Text>
        
        {mapIncidents.map(incident => {
          let statusColor;
          switch(incident.status) {
            case 'resolved': statusColor = '#8BC34A'; break;
            case 'in_progress': statusColor = '#FF9800'; break;
            case 'pending': statusColor = '#E91E63'; break;
            default: statusColor = '#999';
          }
          
          return (
            <TouchableOpacity key={incident.id} style={styles.incidentItem}>
              <View style={[styles.incidentDot, { backgroundColor: statusColor }]} />
              <View style={styles.incidentInfo}>
                <Text style={styles.incidentType}>{incident.type}</Text>
                <Text style={styles.incidentLocation}>
                  Lat: {incident.lat}, Lng: {incident.lng}
                </Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapMarker: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  marker: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: 'white',
  },
  legendContainer: {
    backgroundColor: 'white',
    padding: 12,
    margin: 12,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
  },
  legendItems: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 6,
  },
  legendText: {
    fontSize: 12,
    color: '#666',
  },
  incidentsListContainer: {
    flex: 1,
    padding: 12,
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 12,
    color: '#333',
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  incidentDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  incidentInfo: {
    flex: 1,
  },
  incidentType: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  incidentLocation: {
    fontSize: 12,
    color: '#666',
  },
});