import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, Image, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Picker } from '@react-native-picker/picker';
import { Ionicons } from '@expo/vector-icons';

export default function ReportIncidentScreen({ navigation }) {
  const [incidentType, setIncidentType] = useState('');
  const [description, setDescription] = useState('');
  const [imageSelected, setImageSelected] = useState(false);

  const handleSubmit = () => {
    // In V0, we just navigate to the MyIncidents screen without actual submission
    navigation.navigate('MyIncidents');
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView contentContainerStyle={styles.scrollView}>
        <Text style={styles.sectionTitle}>Tipo de Incidencia</Text>
        <View style={styles.pickerContainer}>
          <Picker
            selectedValue={incidentType}
            onValueChange={(itemValue) => setIncidentType(itemValue)}
            style={styles.picker}
          >
            <Picker.Item label="Seleccione el tipo de incidencia" value="" />
            <Picker.Item label="Bache en calle" value="pothole" />
            <Picker.Item label="Alumbrado público" value="lighting" />
            <Picker.Item label="Acumulación de basura" value="garbage" />
            <Picker.Item label="Fuga de agua" value="water_leak" />
            <Picker.Item label="Señalización dañada" value="signage" />
            <Picker.Item label="Otro" value="other" />
          </Picker>
        </View>

        <Text style={styles.sectionTitle}>Descripción</Text>
        <TextInput
          style={styles.descriptionInput}
          placeholder="Describa el problema con detalle..."
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
        />

        <Text style={styles.sectionTitle}>Fotografía</Text>
        <TouchableOpacity 
          style={styles.imageUploadContainer}
          onPress={() => setImageSelected(true)}
        >
          {imageSelected ? (
            <Image
              source={{ uri: 'https://placeholder.svg?height=200&width=300&text=Imagen+Seleccionada' }}
              style={styles.selectedImage}
            />
          ) : (
            <View style={styles.uploadPlaceholder}>
              <Ionicons name="camera" size={40} color="#0C6291" />
              <Text style={styles.uploadText}>Toque para agregar una fotografía</Text>
            </View>
          )}
        </TouchableOpacity>

        <Text style={styles.sectionTitle}>Ubicación</Text>
        <TouchableOpacity style={styles.mapContainer}>
          <Image
            source={{ uri: 'https://placeholder.svg?height=200&width=350&text=Mapa' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay}>
            <Text style={styles.mapText}>Toque para seleccionar ubicación</Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity 
          style={[
            styles.submitButton,
            (!incidentType || !description) ? styles.submitButtonDisabled : {}
          ]}
          onPress={handleSubmit}
          disabled={!incidentType || !description}
        >
          <Text style={styles.submitButtonText}>Enviar Reporte</Text>
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
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 16,
  },
  pickerContainer: {
    backgroundColor: 'white',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
    marginBottom: 8,
  },
  picker: {
    height: 50,
    width: '100%',
  },
  descriptionInput: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    textAlignVertical: 'top',
    minHeight: 100,
  },
  imageUploadContainer: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
  },
  uploadPlaceholder: {
    height: 150,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f9f9f9',
  },
  uploadText: {
    marginTop: 8,
    color: '#666',
  },
  selectedImage: {
    width: '100%',
    height: 200,
  },
  mapContainer: {
    position: 'relative',
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 24,
  },
  mapImage: {
    width: '100%',
    height: 200,
  },
  mapOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.1)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapText: {
    color: 'white',
    fontWeight: 'bold',
    backgroundColor: 'rgba(0,0,0,0.5)',
    padding: 8,
    borderRadius: 4,
  },
  submitButton: {
    backgroundColor: '#0C6291',
    borderRadius: 8,
    padding: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  submitButtonDisabled: {
    backgroundColor: '#cccccc',
  },
  submitButtonText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
});