import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  Switch, 
  ScrollView,
  TouchableOpacity 
} from 'react-native';
import { useMenu } from '../src/context/MenuContext';

export default function ChefSettingsScreen() {
  const { chefAvailability, updateChefAvailability } = useMenu();
  
  const [isAvailable, setIsAvailable] = useState(chefAvailability.isAvailable);
  const [availableFrom, setAvailableFrom] = useState(chefAvailability.availableFrom);
  const [availableUntil, setAvailableUntil] = useState(chefAvailability.availableUntil);
  const [bookingCost, setBookingCost] = useState(chefAvailability.bookingCost.toString());
  const [specialities, setSpecialities] = useState(chefAvailability.specialities.join(', '));
  const [notes, setNotes] = useState(chefAvailability.notes);

  const handleSave = () => {
    const cost = parseFloat(bookingCost);
    if (isNaN(cost) || cost < 0) {
      Alert.alert('Error', 'Please enter a valid booking cost');
      return;
    }

    updateChefAvailability({
      isAvailable,
      availableFrom,
      availableUntil,
      bookingCost: cost,
      specialities: specialities.split(',').map(s => s.trim()).filter(s => s),
      notes
    });

    Alert.alert('Saved', 'Chef availability updated successfully');
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Chef Availability Settings</Text>

      <View style={styles.row}>
        <Text style={styles.label}>Available for Bookings</Text>
        <Switch value={isAvailable} onValueChange={setIsAvailable} />
      </View>

      <Text style={styles.label}>Available From</Text>
      <TextInput 
        style={styles.input} 
        value={availableFrom} 
        onChangeText={setAvailableFrom} 
        placeholder="e.g. 18:00" 
      />

      <Text style={styles.label}>Available Until</Text>
      <TextInput 
        style={styles.input} 
        value={availableUntil} 
        onChangeText={setAvailableUntil} 
        placeholder="e.g. 22:00" 
      />

      <Text style={styles.label}>Booking Cost (R)</Text>
      <TextInput 
        style={styles.input} 
        value={bookingCost} 
        onChangeText={setBookingCost} 
        keyboardType="numeric" 
        placeholder="e.g. 500" 
      />

      <Text style={styles.label}>Specialities (comma separated)</Text>
      <TextInput 
        style={styles.input} 
        value={specialities} 
        onChangeText={setSpecialities} 
        placeholder="e.g. Italian Cuisine, Grilled Dishes, Desserts" 
        multiline
      />

      <Text style={styles.label}>Notes for Customers</Text>
      <TextInput 
        style={[styles.input, { height: 80 }]} 
        value={notes} 
        onChangeText={setNotes} 
        placeholder="Additional information for customers..." 
        multiline
      />

      <View style={{ marginTop: 20 }}>
        <Button title="Save Settings" color="#2E7D32" onPress={handleSave} />
      </View>

      <View style={styles.preview}>
        <Text style={styles.previewTitle}>Customer View Preview:</Text>
        <Text style={styles.previewText}>
          Status: {isAvailable ? 'Available' : 'Not Available'}
          {'\n'}Available: {availableFrom} - {availableUntil}
          {'\n'}Booking Cost: R{parseFloat(bookingCost) || 0}
          {'\n'}Specialities: {specialities}
          {'\n'}Notes: {notes}
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 20 },
  label: { fontWeight: '700', color: '#2E7D32', marginTop: 12 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10, 
    marginTop: 6 
  },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  preview: {
    backgroundColor: '#F5F5F5',
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  previewTitle: {
    fontWeight: 'bold',
    color: '#2E7D32',
    marginBottom: 8,
  },
  previewText: {
    color: '#333',
    lineHeight: 20,
  },
});