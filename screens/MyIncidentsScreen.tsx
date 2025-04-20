import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

// Sample data for incidents
const INCIDENTS = [
  {
    id: '1',
    type: 'Bache en calle',
    location: 'Calle Constitución #123, Centro',
    date: '15/04/2023',
    status: 'resolved',
    description: 'Bache de aproximadamente 50cm de diámetro que dificulta el tránsito vehicular.',
  },
  {
    id: '2',
    type: 'Alumbrado público',
    location: 'Av. Benito Juárez #456, La Villa',
    date: '10/04/2023',
    status: 'in_progress',
    description: 'Lámpara de alumbrado público sin funcionar desde hace una semana.',
  },
  {
    id: '3',
    type: 'Acumulación de basura',
    location: 'Parque Municipal, Col. Jardines',
    date: '05/04/2023',
    status: 'pending',
    description: 'Acumulación de basura en la esquina norte del parque municipal.',
  },
  {
    id: '4',
    type: 'Fuga de agua',
    location: 'Calle Hidalgo #789, Centro',
    date: '01/04/2023',
    status: 'resolved',
    description: 'Fuga de agua en la tubería principal que causa encharcamiento en la vía pública.',
  },
  {
    id: '5',
    type: 'Señalización dañada',
    location: 'Cruce Av. México y Calle Colima',
    date: '28/03/2023',
    status: 'pending',
    description: 'Señal de alto doblada y con grafiti que dificulta su visibilidad.',
  },
];

export default function MyIncidentsScreen() {
  const [selectedFilter, setSelectedFilter] = useState('all');

  const filteredIncidents = selectedFilter === 'all' 
    ? INCIDENTS 
    : INCIDENTS.filter(incident => incident.status === selectedFilter);

  const renderIncidentItem = ({ item }) => {
    let statusColor, statusText;
    
    switch(item.status) {
      case 'resolved':
        statusColor = '#4CAF50';
        statusText = 'Resuelto';
        break;
      case 'in_progress':
        statusColor = '#FF9800';
        statusText = 'En Proceso';
        break;
      case 'pending':
        statusColor = '#F44336';
        statusText = 'Pendiente';
        break;
      default:
        statusColor = '#999';
        statusText = 'Desconocido';
    }
    
    return (
      <TouchableOpacity style={styles.incidentCard}>
        <View style={styles.incidentHeader}>
          <Text style={styles.incidentType}>{item.type}</Text>
          <View style={styles.statusContainer}>
            <View style={[styles.statusIndicator, { backgroundColor: statusColor }]} />
            <Text style={styles.statusText}>{statusText}</Text>
          </View>
        </View>
        
        <View style={styles.incidentContent}>
          <View style={styles.incidentImageContainer}>
            <Image
              source={{ uri: `https://placeholder.svg?height=80&width=80&text=Incidente${item.id}` }}
              style={styles.incidentImage}
            />
          </View>
          <View style={styles.incidentDetails}>
            <Text style={styles.incidentLocation}>{item.location}</Text>
            <Text style={styles.incidentDate}>Reportado: {item.date}</Text>
            <Text style={styles.incidentDescription} numberOfLines={2}>
              {item.description}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <View style={styles.filterContainer}>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'all' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('all')}
        >
          <Text style={[styles.filterText, selectedFilter === 'all' && styles.filterTextActive]}>
            Todos
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'pending' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('pending')}
        >
          <Text style={[styles.filterText, selectedFilter === 'pending' && styles.filterTextActive]}>
            Pendientes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'in_progress' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('in_progress')}
        >
          <Text style={[styles.filterText, selectedFilter === 'in_progress' && styles.filterTextActive]}>
            En Proceso
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.filterButton, selectedFilter === 'resolved' && styles.filterButtonActive]}
          onPress={() => setSelectedFilter('resolved')}
        >
          <Text style={[styles.filterText, selectedFilter === 'resolved' && styles.filterTextActive]}>
            Resueltos
          </Text>
        </TouchableOpacity>
      </View>

      {filteredIncidents.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#999" />
          <Text style={styles.emptyText}>No hay incidencias que mostrar</Text>
        </View>
      ) : (
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncidentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  filterContainer: {
    flexDirection: 'row',
    padding: 12,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterButtonActive: {
    borderBottomColor: '#0C6291',
  },
  filterText: {
    fontSize: 12,
    color: '#666',
  },
  filterTextActive: {
    color: '#0C6291',
    fontWeight: 'bold',
  },
  listContainer: {
    padding: 16,
  },
  incidentCard: {
    backgroundColor: 'white',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingBottom: 8,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  statusContainer: {
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
  incidentContent: {
    flexDirection: 'row',
  },
  incidentImageContainer: {
    marginRight: 12,
  },
  incidentImage: {
    width: 80,
    height: 80,
    borderRadius: 4,
  },
  incidentDetails: {
    flex: 1,
  },
  incidentLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 4,
  },
  incidentDate: {
    fontSize: 12,
    color: '#666',
    marginBottom: 4,
  },
  incidentDescription: {
    fontSize: 12,
    color: '#666',
    lineHeight: 18,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 16,
    color: '#999',
    textAlign: 'center',
  },
});