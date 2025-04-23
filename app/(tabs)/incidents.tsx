import React, { useState, useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  FlatList, 
  TouchableOpacity, 
  Image,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

// Datos de ejemplo para incidencias
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
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
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
      })
    ]).start();
  }, []);

  // Filtrar incidencias según el filtro seleccionado
  const filteredIncidents = selectedFilter === 'all' 
    ? INCIDENTS 
    : INCIDENTS.filter(incident => incident.status === selectedFilter);

  const renderIncidentItem = ({ item, index }) => {
    let statusColor, statusText, statusGradient;
    
    switch(item.status) {
      case 'resolved':
        statusColor = '#8BC34A';
        statusText = 'Resuelto';
        statusGradient = ['#8BC34A', '#4CAF50'];
        break;
      case 'in_progress':
        statusColor = '#FF9800';
        statusText = 'En Proceso';
        statusGradient = ['#FF9800', '#FF5722'];
        break;
      case 'pending':
        statusColor = '#E91E63';
        statusText = 'Pendiente';
        statusGradient = ['#E91E63', '#9C27B0'];
        break;
      default:
        statusColor = '#999';
        statusText = 'Desconocido';
        statusGradient = ['#999', '#666'];
    }
    
    // Animación para cada elemento de la lista
    const itemFadeAnim = useRef(new Animated.Value(0)).current;
    const itemSlideAnim = useRef(new Animated.Value(50)).current;
    
    useEffect(() => {
      Animated.parallel([
        Animated.timing(itemFadeAnim, {
          toValue: 1,
          duration: 500,
          delay: index * 100,
          useNativeDriver: true,
        }),
        Animated.timing(itemSlideAnim, {
          toValue: 0,
          duration: 500,
          delay: index * 100,
          easing: Easing.out(Easing.exp),
          useNativeDriver: true,
        })
      ]).start();
    }, []);
    
    return (
      <Animated.View
        style={{
          opacity: itemFadeAnim,
          transform: [{ translateY: itemSlideAnim }]
        }}
      >
        <TouchableOpacity style={styles.incidentCard} activeOpacity={0.9}>
          <View style={styles.incidentHeader}>
            <Text style={styles.incidentType}>{item.type}</Text>
            <LinearGradient
              colors={statusGradient}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
              style={styles.statusBadge}
            >
              <Text style={styles.statusBadgeText}>{statusText}</Text>
            </LinearGradient>
          </View>
          
          <View style={styles.incidentContent}>
            <View style={styles.incidentImageContainer}>
              <Image
                source={{ uri: `https://placeholder.svg?height=80&width=80&text=Incidente${item.id}` }}
                style={styles.incidentImage}
              />
            </View>
            <View style={styles.incidentDetails}>
              <View style={styles.locationContainer}>
                <Ionicons name="location" size={16} color="#666" />
                <Text style={styles.incidentLocation}>{item.location}</Text>
              </View>
              <View style={styles.dateContainer}>
                <Ionicons name="calendar" size={16} color="#666" />
                <Text style={styles.incidentDate}>Reportado: {item.date}</Text>
              </View>
              <Text style={styles.incidentDescription} numberOfLines={2}>
                {item.description}
              </Text>
            </View>
          </View>
          
          <View style={styles.incidentFooter}>
            <TouchableOpacity style={styles.detailsButton}>
              <Text style={styles.detailsButtonText}>Ver Detalles</Text>
              <Ionicons name="chevron-forward" size={16} color="#E91E63" />
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Animated.View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View 
        style={[
          styles.filterContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <BlurView intensity={80} tint="light" style={styles.filterBlur}>
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
        </BlurView>
      </Animated.View>

      {filteredIncidents.length === 0 ? (
        <Animated.View 
          style={[
            styles.emptyContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.emptyIconContainer}>
            <Ionicons name="alert-circle-outline" size={60} color="#E91E63" />
          </View>
          <Text style={styles.emptyText}>No hay incidencias que mostrar</Text>
          <Text style={styles.emptySubtext}>
            Los reportes que realices aparecerán aquí
          </Text>
        </Animated.View>
      ) : (
        <FlatList
          data={filteredIncidents}
          renderItem={renderIncidentItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContainer}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  filterContainer: {
    padding: 12,
    marginBottom: 8,
  },
  filterBlur: {
    flexDirection: 'row',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  filterButtonActive: {
    borderBottomColor: '#E91E63',
  },
  filterText: {
    fontSize: 13,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  filterTextActive: {
    color: '#E91E63',
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  listContainer: {
    padding: 16,
    paddingTop: 8,
  },
  incidentCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  incidentHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    paddingBottom: 12,
  },
  incidentType: {
    fontSize: 16,
    fontWeight: 'bold',
    fontFamily: 'Poppins-SemiBold',
  },
  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  statusBadgeText: {
    color: 'white',
    fontSize: 12,
    fontFamily: 'Poppins-Medium',
  },
  incidentContent: {
    flexDirection: 'row',
    marginBottom: 12,
  },
  incidentImageContainer: {
    marginRight: 12,
  },
  incidentImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
  },
  incidentDetails: {
    flex: 1,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  incidentLocation: {
    fontSize: 14,
    fontWeight: '500',
    marginLeft: 4,
    fontFamily: 'Poppins-Medium',
    color: '#333',
  },
  dateContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  incidentDate: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
    fontFamily: 'Poppins-Regular',
  },
  incidentDescription: {
    fontSize: 13,
    color: '#666',
    lineHeight: 18,
    fontFamily: 'Poppins-Regular',
  },
  incidentFooter: {
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    paddingTop: 12,
    alignItems: 'flex-end',
  },
  detailsButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  detailsButtonText: {
    color: '#E91E63',
    fontSize: 14,
    marginRight: 4,
    fontFamily: 'Poppins-Medium',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyIconContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  emptyText: {
    marginTop: 10,
    fontSize: 18,
    color: '#333',
    textAlign: 'center',
    fontFamily: 'Poppins-SemiBold',
  },
  emptySubtext: {
    marginTop: 8,
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    fontFamily: 'Poppins-Regular',
  },
});