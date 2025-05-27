"use client"

import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, TextInput, Alert, Animated, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { useAuth } from '../../context/AuthContext';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function AccountScreen() {
  const router = useRouter();
  const { user, isLoading: authLoading, error: authError, logout, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editedUser, setEditedUser] = useState(user);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    if (user) {
      setEditedUser(user);
    } else {
      setEditedUser(null);
    }
  }, [user]);

  // Animaciones
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(30)).current;
  const avatarScaleAnim = useRef(new Animated.Value(0.8)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }),
      Animated.spring(avatarScaleAnim, {
        toValue: 1,
        friction: 8,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const handleLogout = () => {
    Alert.alert("Cerrar Sesión", "¿Estás seguro que deseas cerrar sesión?", [
      {
        text: "Cancelar",
        style: "cancel",
      },
      {
        text: "Sí, cerrar sesión",
        onPress: () => {
          logout();
        },
      },
    ]);
  };

  const handleSaveChanges = async () => {
    if (!editedUser) return;
    
    try {
      await updateUser(editedUser);
      setIsEditing(false);
      Alert.alert('Éxito', 'Datos actualizados correctamente');
    } catch (error) {
      console.error('Error saving user data:', error);
      Alert.alert('Error', 'No se pudieron actualizar los datos');
    }
  };

  const handleChangePassword = () => {
    Alert.alert("Cambiar Contraseña", "Esta funcionalidad estará disponible próximamente");
  };

  const getFullName = (userToDisplay: typeof user) => {
    if (!userToDisplay) return '';
    const names = [userToDisplay.primerNombre, userToDisplay.segundoNombre].filter(Boolean).join(' ');
    const lastNames = [userToDisplay.primerApellido, userToDisplay.segundoApellido].filter(Boolean).join(' ');
    return `${names} ${lastNames}`.trim();
  };

  const getInitials = (userToDisplay: typeof user) => {
    if (!userToDisplay) return '';
    const firstInitial = userToDisplay.primerNombre.charAt(0);
    const lastInitial = userToDisplay.primerApellido.charAt(0);
    return `${firstInitial}${lastInitial}`.toUpperCase();
  };

  if (authLoading) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#E91E63" />
          <Text style={styles.loadingText}>Cargando datos...</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (authError) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#E91E63" />
          <Text style={styles.errorText}>{authError}</Text>
        </View>
      </SafeAreaView>
    );
  }

  if (!user) {
    return (
      <SafeAreaView style={styles.container} edges={["bottom"]}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={60} color="#E91E63" />
          <Text style={styles.errorText}>No hay datos de usuario disponibles</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      <ScrollView contentContainerStyle={styles.scrollView} showsVerticalScrollIndicator={false}>
        <Animated.View
          style={[
            styles.profileHeader,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <BlurView intensity={120} tint="light" style={styles.profileHeaderBlur}>
            <Animated.View
              style={[
                styles.avatarContainer,
                {
                  transform: [{ scale: avatarScaleAnim }],
                },
              ]}
            >
              <LinearGradient
                colors={["rgba(233, 30, 99, 0.7)", "rgba(156, 39, 176, 0.7)"]}
                style={styles.avatarGradient}
              >
                <Text style={styles.avatarText}>{getInitials(user)}</Text>
              </LinearGradient>
              {!isEditing && (
                <TouchableOpacity style={styles.editAvatarButton}>
                  <LinearGradient colors={["#E91E63", "#9C27B0"]} style={styles.editAvatarGradient}>
                    <Ionicons name="camera" size={18} color="white" />
                  </LinearGradient>
                </TouchableOpacity>
              )}
            </Animated.View>

            <View style={styles.profileInfo}>
              <Text style={styles.profileName}>{getFullName(user)}</Text>
              <View style={styles.profileRoleContainer}>
                <LinearGradient
                  colors={["#E91E63", "#9C27B0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.profileRoleBadge}
                >
                  <Text style={styles.profileRoleText}>Ciudadano</Text>
                </LinearGradient>
              </View>
            </View>

            {!isEditing ? (
              <TouchableOpacity style={styles.editButton} onPress={() => setIsEditing(true)}>
                <BlurView intensity={70} tint="light" style={styles.editButtonBlur}>
                  <Ionicons name="create-outline" size={20} color="#E91E63" />
                  <Text style={styles.editButtonText}>Editar</Text>
                </BlurView>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity style={styles.saveButtonContainer} onPress={handleSaveChanges} activeOpacity={0.8}>
                <LinearGradient
                  colors={["#E91E63", "#9C27B0"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                  style={styles.saveButton}
                >
                  <Ionicons name="checkmark" size={20} color="white" />
                  <Text style={styles.saveButtonText}>Guardar</Text>
                </LinearGradient>
              </TouchableOpacity>
            )}
          </BlurView>
        </Animated.View>

        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <BlurView intensity={70} tint="light" style={styles.sectionBlur}>
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
                    value={getFullName(editedUser)}
                    onChangeText={(text) => {
                      const parts = text.split(" ").filter(Boolean);
                      const primerNombre = parts[0] || "";
                      const primerApellido = parts[parts.length - 1] || "";
                      const segundoNombre = parts.length > 2 ? parts.slice(1, -1).join(" ") : "";
                      const segundoApellido = parts.length > 1 ? "" : "";

                      if (editedUser) {
                        setEditedUser({
                          ...editedUser,
                          primerNombre: primerNombre,
                          segundoNombre: segundoNombre || null,
                          primerApellido: primerApellido,
                          segundoApellido: segundoApellido || null
                        });
                      }
                    }}
                  />
                ) : (
                  <Text style={styles.infoValue}>{getFullName(user)}</Text>
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
                    value={editedUser?.correo || ''}
                    onChangeText={(text) => editedUser && setEditedUser({ ...editedUser, correo: text })}
                    keyboardType="email-address"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.correo}</Text>
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
                    value={editedUser?.numero || ''}
                    onChangeText={(text) => editedUser && setEditedUser({ ...editedUser, numero: text })}
                    keyboardType="phone-pad"
                  />
                ) : (
                  <Text style={styles.infoValue}>{user.numero}</Text>
                )}
              </View>
            </View>
          </BlurView>
        </Animated.View>

        <Animated.View
          style={[
            styles.sectionContainer,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }],
            },
          ]}
        >
          <BlurView intensity={70} tint="light" style={styles.sectionBlur}>
            <Text style={styles.sectionTitle}>Seguridad</Text>

            <TouchableOpacity style={styles.securityItem} onPress={handleChangePassword}>
              <View style={styles.securityIcon}>
                <Ionicons name="key" size={20} color="#E91E63" />
              </View>
              <View style={styles.securityContent}>
                <Text style={styles.securityLabel}>Cambiar Contraseña</Text>
                <Text style={styles.securityDescription}>Actualiza tu contraseña para mayor seguridad</Text>
              </View>
              <Ionicons name="chevron-forward" size={20} color="#999" />
            </TouchableOpacity>
          </BlurView>
        </Animated.View>

        <TouchableOpacity style={styles.logoutButtonContainer} onPress={handleLogout} activeOpacity={0.8}>
          <LinearGradient
            colors={["#E91E63", "#9C27B0"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
            style={styles.logoutButton}
          >
            <Ionicons name="log-out" size={20} color="white" />
            <Text style={styles.logoutButtonText}>Cerrar Sesión</Text>
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
    paddingTop: 10,
  },
  profileHeader: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    elevation: 10,
  },
  profileHeaderBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 16,
  },
  avatarGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    padding: 3,
    justifyContent: 'center',
    alignItems: 'center',
  },
  avatarText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
  },
  editAvatarButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    borderRadius: 15,
    overflow: 'hidden',
  },
  editAvatarGradient: {
    width: 30,
    height: 30,
    borderRadius: 15,
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  profileRoleContainer: {
    flexDirection: 'row',
  },
  profileRoleBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  profileRoleText: {
    color: 'white',
    fontSize: 12,
  },
  editButton: {
    borderRadius: 20,
    overflow: 'hidden',
  },
  editButtonBlur: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  editButtonText: {
    color: '#E91E63',
    marginLeft: 4,
    fontWeight: '500',
  },
  saveButtonContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
  },
  saveButtonText: {
    color: 'white',
    marginLeft: 4,
    fontWeight: '500',
  },
  sectionContainer: {
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 20,
    backgroundColor: '#f8f9fa',
    elevation: 10,
  },
  sectionBlur: {
    padding: 16,
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
    width: 40,
    height: 40,
    borderRadius: 20,
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
    color: '#333',
  },
  securityItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  securityIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
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
  logoutButtonContainer: {
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 30,
    shadowColor: '#E91E63',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  logoutButton: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    height: 55,
    borderRadius: 12,
  },
  logoutButtonText: {
    color: 'white',
    fontWeight: 'bold',
    marginLeft: 8,
    fontSize: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: '#666',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorText: {
    marginTop: 10,
    fontSize: 16,
    color: '#E91E63',
    textAlign: 'center',
    marginBottom: 20,
  },
});
