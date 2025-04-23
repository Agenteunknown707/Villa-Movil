import React, { useRef, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  Image,
  Animated,
  Dimensions
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

export default function HomeScreen() {
  const router = useRouter();
  
  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const scaleAnim = useRef(new Animated.Value(0.9)).current;

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
      Animated.spring(scaleAnim, {
        toValue: 1,
        friction: 8,
        tension: 40,
        useNativeDriver: true,
      })
    ]).start();
  }, []);

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Animated.View 
          style={[
            styles.logoContainer,
            {
              opacity: fadeAnim,
              transform: [{ scale: scaleAnim }]
            }
          ]}
        >
          <Image
            source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-CF5rtamPzmOvzKH9vtX77bM37exXIc.png' }}
            style={styles.logo}
            resizeMode="contain"
          />
        </Animated.View>
        
        <Animated.View 
          style={[
            styles.welcomeSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <Text style={styles.welcomeText}>Bienvenido a</Text>
          <Text style={styles.cityName}>Villa de Álvarez</Text>
          <Text style={styles.appDescription}>
            Ayúdanos a mejorar nuestra ciudad reportando incidencias urbanas
          </Text>
        </Animated.View>

        <Animated.View 
          style={[
            styles.statsContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <BlurView intensity={70} tint="light" style={styles.statCard}>
            <Ionicons name="checkmark-circle" size={24} color="#8BC34A" />
            <Text style={styles.statNumber}>24</Text>
            <Text style={styles.statLabel}>Resueltos</Text>
          </BlurView>
          <BlurView intensity={70} tint="light" style={styles.statCard}>
            <Ionicons name="time" size={24} color="#FF9800" />
            <Text style={styles.statNumber}>12</Text>
            <Text style={styles.statLabel}>En Proceso</Text>
          </BlurView>
          <BlurView intensity={70} tint="light" style={styles.statCard}>
            <Ionicons name="alert-circle" size={24} color="#E91E63" />
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Pendientes</Text>
          </BlurView>
        </Animated.View>

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
                      item === 1 ? '#8BC34A' : 
                      item === 2 ? '#FF9800' : '#E91E63' 
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
          style={styles.reportButtonContainer}
          onPress={() => router.push('/(tabs)/report')}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={['#E91E63', '#9C27B0']}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.reportButton}
          >
            <Ionicons name="add-circle" size={20} color="white" />
            <Text style={styles.reportButtonText}>Reportar Nueva Incidencia</Text>
          </LinearGradient>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  scrollView: {
    padding: 16,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 10,
  },
  logo: {
    width: 180,
    height: 90,
  },
  welcomeSection: {
    marginBottom: 24,
  },
  welcomeText: {
    fontSize: 16,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  cityName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#E91E63',
    marginBottom: 8,
    fontFamily: 'Poppins-Bold',
  },
  appDescription: {
    fontSize: 14,
    color: '#666',
    lineHeight: 20,
    fontFamily: 'Poppins-Regular',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statCard: {
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
    width: '30%',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
    overflow: 'hidden',
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    marginVertical: 4,
    fontFamily: 'Poppins-Bold',
  },
  statLabel: {
    fontSize: 12,
    color: '#666',
    fontFamily: 'Poppins-Regular',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
    fontFamily: 'Poppins-SemiBold',
  },
  recentReportsContainer: {
    marginBottom: 24,
  },
  reportCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    marginBottom: 12,
    flexDirection: 'row',
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
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
    fontFamily: 'Poppins-SemiBold',
  },
  reportLocation: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
    fontFamily: 'Poppins-Regular',
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
    fontFamily: 'Poppins-Regular',
  },
  reportButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 20,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  reportButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
  },
  reportButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontFamily: 'Poppins-Bold',
  },
});