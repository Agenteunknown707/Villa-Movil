import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { API_CONFIG, buildApiUrl } from '../config/api';
import { useRouter, useSegments } from 'expo-router';
import AsyncStorage from '@react-native-async-storage/async-storage';

interface Ciudadano {
  idCiudadano: number;
  primerNombre: string;
  segundoNombre: string | null;
  primerApellido: string;
  segundoApellido: string | null;
  correo: string;
  numero: string;
}

interface AuthContextType {
  user: Ciudadano | null;
  isLoading: boolean;
  error: string | null;
  login: (userData: Ciudadano) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<Ciudadano>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<Ciudadano | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const segments = useSegments();
  const inAuthGroup = segments[0] === '(auth)';

  console.log('AuthContext State Update: isLoading=', isLoading, ', user=', user ? 'Exists' : 'null', ', segment=', segments.join('/'));

  // Efecto para cargar el usuario almacenado al inicio de la aplicación
  useEffect(() => {
    const loadStoredUser = async () => {
      console.log('AuthContext useEffect[[]]: Loading stored user...');
      try {
        const storedUser = await AsyncStorage.getItem('user');
        if (storedUser) {
          const userData = JSON.parse(storedUser);
          console.log('AuthContext useEffect[[]]: Stored user found.', userData);
          setUser(userData);
        } else {
          console.log('AuthContext useEffect[[]]: No stored user found.');
        }
      } catch (err) {
        console.error('AuthContext useEffect[[]] Error loading stored user:', err);
        setError('Error al cargar el usuario');
      } finally {
        console.log('AuthContext useEffect[[]]: Finished loading stored user. Setting isLoading=false.');
        setIsLoading(false);
      }
    };

    loadStoredUser();
  }, []); // Se ejecuta solo una vez al montar el proveedor

  // Efecto para redirigir basado en el estado de autenticación
  useEffect(() => {
    console.log('AuthContext useEffect[user, isLoading, inAuthGroup]: Running redirection logic.', { user: user ? 'Exists' : 'null', isLoading, inAuthGroup, segments: segments.join('/') });
    // Esperar a que la carga inicial termine
    if (!isLoading) {
      if (user) {
        console.log('AuthContext useEffect[redir]: User exists and not loading.');
        // Si hay usuario y estamos en el grupo auth, redirigir a tabs
        if (inAuthGroup) {
          console.log('AuthContext useEffect[redir]: User exists, in auth group. Redirecting to /tabs.');
          router.replace('/(tabs)');
        }
      } else {
        console.log('AuthContext useEffect[redir]: No user and not loading.');
        // Si no hay usuario y NO estamos en el grupo auth, redirigir a auth
        if (!inAuthGroup) {
          console.log('AuthContext useEffect[redir]: No user, not in auth group. Redirecting to /auth.');
          router.replace('/(auth)');
        }
      }
    } else {
        console.log('AuthContext useEffect[redir]: Still loading, waiting...');
    }
  }, [user, isLoading, inAuthGroup, router, segments]); // Depende de user, isLoading, inAuthGroup, router y segments

  const login = async (userData: Ciudadano) => {
    console.log('AuthContext: Attempting login with data...', userData);
    try {
      setIsLoading(true);
      setError(null);

      // Usamos los datos pasados como parámetro
      setUser(userData);
      await AsyncStorage.setItem('user', JSON.stringify(userData));

      console.log('AuthContext: User state set and stored. Redirection will be handled by effect.');
      // La redirección a tabs ahora la maneja el segundo useEffect al cambiar el estado 'user'

    } catch (err: any) {
      console.error('AuthContext Login Error:', err);
      setError(err.response?.data?.error || 'Error al iniciar sesión');
      // Aunque el error aquí es menos probable ya que la validación ocurrió antes,
      // mantenemos el manejo básico de errores.
      throw err;
    } finally {
      console.log('AuthContext: Login process finished. Setting isLoading=false.');
      setIsLoading(false);
    }
  };

  const logout = async () => {
    console.log('AuthContext: Attempting logout...');
    try {
      await AsyncStorage.removeItem('user');
      setUser(null);
      console.log('AuthContext: User removed from state and storage. Redirection will be handled by effect.');
      // La redirección a auth ahora la maneja el segundo useEffect al cambiar el estado 'user'
    } catch (err) {
      console.error('AuthContext Logout Error:', err);
      setError('Error al cerrar sesión');
    }
  };

  const updateUser = async (userData: Partial<Ciudadano>) => {
    console.log('AuthContext: Attempting to update user...', userData);
    try {
      setIsLoading(true);
      setError(null);

      // TODO: Implementar la actualización real en el backend

      if (user) {
        const updatedUser = { ...user, ...userData };
        setUser(updatedUser);
        await AsyncStorage.setItem('user', JSON.stringify(updatedUser));
        console.log('AuthContext: User state and storage updated.', updatedUser);
      }
    } catch (err) {
      console.error('AuthContext Update user Error:', err);
      setError('Error al actualizar los datos del usuario');
      throw err;
    } finally {
      setIsLoading(false);
      console.log('AuthContext: Update user process finished. Setting isLoading=false.');
    }
  };

  return (
    <AuthContext.Provider value={{ user, isLoading, error, login, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}