import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Image, TextInput, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';

export default function AccountScreen() {
  const router = useRouter();
  const [isEditing, setIsEditing] = useState(false);
  
  // Datos simulados del usuario
  const [userData, setUserData] = useState({
    name: 'Juan Pérez González',
    email: 'juan.perez@ejemplo.com',
    phone: '312 123 4567',
  });

  const handleLogout = () => {
    // En V0, solo navegamos a la pantalla de login sin cerrar sesión real
    router.replace('/');
  };

  const handleSaveChanges = () => {
    setIsEditing(false);
    Alert.alert('Éxito', 'Información actualizada correctamente');
  };

  const handleChangePassword = () => {
    Alert.alert('Cambiar Contraseña', 'Esta funcionalidad estará disponible próximamente');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <Image
              source={{ uri: 'https://placeholder.svg?height=100&width=100&text=JP' }}
              style={styles.avatar}
            />
            {!isEditing && (
              <TouchableOpacity style={styles.editAvatarButton}>
                <Ionicons name="camera" size={18} color="white" />
              </TouchableOpacity>
            )}
          </View>
          
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>{userData.name}</Text>
            <Text style={styles.profileRole}>Ciudadano</Text>
          </View>
          
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton}
              onPress={() => setIsEditing(true)}
            >
              <Ionicons name="create-outline" size={20} color="#E91E63" />
              <Text style={styles.editButtonText}>Editar</Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity 
              style={styles.saveButton}
              onPress={handleSaveChanges}
            >
              <Ionicons name="checkmark" size={20} color="white" />
              <Text style={styles.saveButtonText}>Guardar</Text>
            </TouchableOpacity>
          )}
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Información Personal</Text>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="person" size={20} color="#E91E63" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Nombre Completo</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.name}
                  onChangeText={(text) => setUserData({...userData, name: text})}
                />
              ) : (
                <Text style={styles.infoValue}>{userData.name}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="mail" size={20} color="#E91E63" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Correo Electrónico</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.email}
                  onChangeText={(text) => setUserData({...userData, email: text})}
                  keyboardType="email-address"
                />
              ) : (
                <Text style={styles.infoValue}>{userData.email}</Text>
              )}
            </View>
          </View>
          
          <View style={styles.infoItem}>
            <View style={styles.infoIcon}>
              <Ionicons name="call" size={20} color="#E91E63" />
            </View>
            <View style={styles.infoContent}>
              <Text style={styles.infoLabel}>Número de Teléfono</Text>
              {isEditing ? (
                <TextInput
                  style={styles.infoInput}
                  value={userData.phone}
                  onChangeText={(text) => setUserData({...userData, phone: text})}
                  keyboardType="phone-pad"
                />
              ) : (
                <Text style={styles.infoValue}>{userData.phone}</Text>
              )}
            </View>
          </View>
        </View>

        <View style={styles.sectionContainer}>
          <Text style={styles.sectionTitle}>Seguridad</Text>
          
          <TouchableOpacity 
            style={styles.securityItem}
            onPress={handleChangePassword}
          >
            <View style={styles.securityIcon}>
              <Ionicons name="key" size={20} color="#E91E63" />
            </View>
            <View style={styles.securityContent}>
              <Text style={styles.securityLabel}>Cambiar Contraseña</Text>
              <Text style={styles.securityDescription}>
                Actualiza tu contraseña para mayor seguridad
              </Text>
            </View>
            <Ionicons name="chevron-forward" size={20} color="#999" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity 
          style={styles.logoutButton}
          onPress={handleLogout}
        >
          <Ionicons name="log-out" size={20} color="white" />
          <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatar: {
    width: 70,
    height: 70,
    borderRadius: 35,
    backgroundColor: '#f0f0f0',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: '#E91E63',
    borderRadius: 12,
    width: 24,
    height: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  profileRole: {
    fontSize: 14,
    color: '#666',
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 8,
  },
  editButtonText: {
    color: '#E91E63',
    marginLeft: 4,
    fontWeight: '500',
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E91E63',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  sectionContainer: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  infoItem: {
    flexDirection: 'row',
    marginBottom: 16,
    alignItems: 'flex-start',
  },
  infoIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  infoContent: {
    flex: 1,
  },
  infoLabel: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 16,
    color: '#333',
  },
  infoInput: {
    fontSize: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E91E63',
    paddingVertical: 4,
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(233, 30, 99, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  securityContent: {
    flex: 1,
  },
  securityLabel: {
    fontSize: 16,
    color: '#333',
  },
  securityDescription: {
    fontSize: 14,
    color: '#666',
  },
  logoutButton: {
    backgroundColor: '#E91E63',
    borderRadius: 8,
    padding: 16,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 30,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
});