import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TouchableOpacity, 
  ScrollView,
  Animated,
  Easing
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

export default function MapScreen() {
  // Datos simulados de incidencias para mostrar en el mapa
  const mapIncidents = [
    { id: 1, type: 'Bache', lat: '19.2433', lng: '-103.7254', status: 'pending' },
    { id: 2, type: 'Alumbrado', lat: '19.2456', lng: '-103.7289', status: 'in_progress' },
    { id: 3, type: 'Basura', lat: '19.2410', lng: '-103.7230', status: 'resolved' },
    { id: 4, type: 'Fuga de agua', lat: '19.2478', lng: '-103.7265', status: 'pending' },
    { id: 5, type: 'Señalización', lat: '19.2445', lng: '-103.7210', status: 'in_progress' },
  ];
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const mapScaleAnim = useRef(new Animated.Value(0.95)).current;

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
      }),
      Animated.spring(mapScaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <Animated.View 
        style={[
          styles.mapContainer,
          {
            opacity: fadeAnim,
            transform: [{ scale: mapScaleAnim }]
          }
        ]}
      >
        <Image
          source={{ uri: 'https://placeholder.svg?height=400&width=400&text=Mapa+de+Villa+de+Álvarez' }}
          style={styles.mapImage}
          resizeMode="cover"
        />
        
        {/* Marcadores simulados en el mapa */}
        <View style={[styles.mapMarker, { top: '30%', left: '45%' }]}>
          <LinearGradient
            colors={['#E91E63', '#9C27B0']}
            style={styles.marker}
          />
        </View>
        <View style={[styles.mapMarker, { top: '40%', left: '60%' }]}>
          <LinearGradient
            colors={['#FF9800', '#FF5722']}
            style={styles.marker}
          />
        </View>
        <View style={[styles.mapMarker, { top: '50%', left: '35%' }]}>
          <LinearGradient
            colors={['#8BC34A', '#4CAF50']}
            style={styles.marker}
          />
        </View>
        <View style={[styles.mapMarker, { top: '25%', left: '55%' }]}>
          <LinearGradient
            colors={['#E91E63', '#9C27B0']}
            style={styles.marker}
          />
        </View>
        <View style={[styles.mapMarker, { top: '60%', left: '50%' }]}>
          <LinearGradient
            colors={['#FF9800', '#FF5722']}
            style={styles.marker}
          />
        </View>
        
        <TouchableOpacity style={styles.mapControlButton}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="locate" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.mapControlButton, { bottom: 80 }]}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="add" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
        
        <TouchableOpacity style={[styles.mapControlButton, { bottom: 130 }]}>
          <BlurView intensity={80} tint="light" style={styles.mapControlBlur}>
            <Ionicons name="remove" size={20} color="#E91E63" />
          </BlurView>
        </TouchableOpacity>
      </Animated.View>

      <Animated.View 
        style={[
          styles.legendContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <BlurView intensity={70} tint="light" style={styles.legendBlur}>
          <Text style={styles.legendTitle}>Leyenda</Text>
          <View style={styles.legendItems}>
            <View style={styles.legendItem}>
              <LinearGradient
                colors={['#E91E63', '#9C27B0']}
                style={styles.legendDot}
              />
              <Text style={styles.legendText}>Pendiente</Text>
            </View>
            <View style={styles.legendItem}>
              <LinearGradient
                colors={['#FF9800', '#FF5722']}
                style={styles.legendDot}
              />
              <Text style={styles.legendText}>En Proceso</Text>
            </View>
            <View style={styles.legendItem}>
              <LinearGradient
                colors={['#8BC34A', '#4CAF50']}
                style={styles.legendDot}
              />
              <Text style={styles.legendText}>Resuelto</Text>
            </View>
          </View>
        </BlurView>
      </Animated.View>

      <Animated.View 
        style={[
          { flex: 1 },
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }]
          }
        ]}
      >
        <Text style={styles.listTitle}>Incidencias en el Mapa</Text>
        
        <ScrollView 
          style={styles.incidentsListContainer}
          showsVerticalScrollIndicator={false}
        >
          {mapIncidents.map((incident, index) => {
            let statusGradient;
            switch(incident.status) {
              case 'resolved': statusGradient = ['#8BC34A', '#4CAF50']; break;
              case 'in_progress': statusGradient = ['#FF9800', '#FF5722']; break;
              case 'pending': statusGradient = ['#E91E63', '#9C27B0']; break;
              default: statusGradient = ['#999', '#666'];
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
                key={incident.id}
                style={{
                  opacity: itemFadeAnim,
                  transform: [{ translateY: itemSlideAnim }]
                }}
              >
                <TouchableOpacity style={styles.incidentItem} activeOpacity={0.8}>
                  <LinearGradient
                    colors={statusGradient}
                    style={styles.incidentDot}
                  />
                  <View style={styles.incidentInfo}>
                    <Text style={styles.incidentType}>{incident.type}</Text>
                    <Text style={styles.incidentLocation}>
                      Lat: {incident.lat}, Lng: {incident.lng}
                    </Text>
                  </View>
                  <View style={styles.incidentActions}>
                    <TouchableOpacity style={styles.incidentActionButton}>
                      <Ionicons name="navigate" size={18} color="#E91E63" />
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.incidentActionButton}>
                      <Ionicons name="information-circle" size={18} color="#E91E63" />
                    </TouchableOpacity>
                  </View>
                </TouchableOpacity>
              </Animated.View>
            );
          })}
        </ScrollView>
      </Animated.View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapContainer: {
    width: '100%',
    height: 300,
    position: 'relative',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
  mapControlButton: {
    position: 'absolute',
    right: 16,
    bottom: 30,
    width: 40,
    height: 40,
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  mapControlBlur: {
    width: 40,
    height: 40,
    alignItems: 'center',
    justifyContent: 'center',
  },
  legendContainer: {
    margin: 16,
    marginTop: 0,
    marginBottom: 8,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  legendBlur: {
    padding: 12,
  },
  legendTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
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
    fontFamily: 'Poppins-Regular',
  },
  listTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginHorizontal: 16,
    marginBottom: 8,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  incidentsListContainer: {
    flex: 1,
    paddingHorizontal: 16,
  },
  incidentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 16,
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
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
    fontFamily: 'Poppins-SemiBold',
  },
  incidentLocation: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  incidentActions: {
    flexDirection: 'row',
  },
  incidentActionButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
});