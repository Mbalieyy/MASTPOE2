import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  TouchableOpacity, 
  StyleSheet, 
  Button, 
  Alert, 
  Switch, 
  ScrollView 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useMenu, MenuItem } from '../src/context/MenuContext';
import MenuItemCard from '../components/MenuItemCard';

type Props = NativeStackScreenProps<RootStackParamList, 'Home'>;

export default function HomeScreen({ navigation }: Props) {
  const { 
    menu, 
    savedMenus, 
    removeDish, 
    saveCurrentMenu, 
    loadSnapshot, 
    suggestMenu, 
    isSaved,
    chefAvailability 
  } = useMenu();
  const [adminMode, setAdminMode] = useState(false);

  const handleSuggest = () => {
    const suggestion = suggestMenu();
    const lines = [
      suggestion.starter ? `Starter: ${suggestion.starter.name}` : 'Starter: (none available)',
      suggestion.main ? `Main: ${suggestion.main.name}` : 'Main: (none available)',
      suggestion.dessert ? `Dessert: ${suggestion.dessert.name}` : 'Dessert: (none available)',
    ];
    Alert.alert('Suggested menu', lines.join('\n'), [
      { text: 'Cancel' },
      {
        text: 'Save as tonight menu',
        onPress: () => saveCurrentMenu(`Suggested ${new Date().toLocaleString()}`),
      },
    ]);
  };

  const handleSave = () => {
    saveCurrentMenu(`Menu saved ${new Date().toLocaleString()}`);
    Alert.alert('Saved', 'Current menu has been saved.');
  };

  const showPriceWarning = () => {
    Alert.alert(
      'Price Notice',
      '⚠️ Please note: All prices are subject to change based on market conditions and ingredient availability. Final pricing will be confirmed at time of booking.',
      [{ text: 'I Understand' }]
    );
  };

  const showChefAvailability = () => {
    const status = chefAvailability.isAvailable ? 'Available' : 'Not Available';
    const availabilityText = chefAvailability.isAvailable 
      ? `Available from ${chefAvailability.availableFrom} to ${chefAvailability.availableUntil}`
      : 'Currently not taking bookings';
    
    Alert.alert(
      'Chef Christoffel - Availability & Services',
      `
Status: ${status}
${availabilityText}

Booking Cost: R${chefAvailability.bookingCost}

Specialities:
${chefAvailability.specialities.map(spec => `• ${spec}`).join('\n')}

Notes: ${chefAvailability.notes}
      `.trim(),
      [{ text: 'Close' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.headerRow}>
        <Text style={styles.title}>Christoffel's Pantry — Menu</Text>
        <View style={{ alignItems: 'center' }}>
          <Text style={{ fontSize: 12 }}>Admin</Text>
          <Switch value={adminMode} onValueChange={setAdminMode} />
        </View>
      </View>

      {/* Chef Availability & Price Warning Banner */}
      <TouchableOpacity style={styles.warningBanner} onPress={showPriceWarning}>
        <Text style={styles.warningText}>⚠️ Prices may change - Tap for details</Text>
      </TouchableOpacity>

      <View style={styles.chefInfo}>
        <Text style={styles.chefStatus}>
          Chef is {chefAvailability.isAvailable ? 'Available' : 'Not Available'}
        </Text>
        <TouchableOpacity onPress={showChefAvailability}>
          <Text style={styles.chefDetailsLink}>View Chef Details & Booking</Text>
        </TouchableOpacity>
      </View>

      <View style={{ marginVertical: 8 }}>
        <Text style={{ color: isSaved ? '#2E7D32' : '#555' }}>
          {isSaved ? 'Menu is saved' : 'Menu has unsaved changes'}
        </Text>
      </View>

      {adminMode && (
        <View style={{ marginBottom: 12 }}>
          <Button title="Add new dish" color="#FF9800" onPress={() => navigation.navigate('AddDish')} />
          <View style={{ height: 8 }} />
          <Button title="Save current menu" color="#2E7D32" onPress={handleSave} />
          <View style={{ height: 8 }} />
          <Button title="Chef Settings" color="#2196F3" onPress={() => navigation.navigate('ChefSettings')} />
        </View>
      )}

      <View style={{ marginVertical: 8 }}>
        <Button title="Suggest a 3-course menu" color="#2E7D32" onPress={handleSuggest} />
      </View>

      <Text style={styles.sectionTitle}>Current Menu</Text>
      {menu.length === 0 ? (
        <Text style={{ color: '#777', marginBottom: 16 }}>No dishes in the menu yet.</Text>
      ) : (
        <FlatList
          data={menu}
          scrollEnabled={false}
          keyExtractor={item => item.id}
          renderItem={({ item }) => (
            <MenuItemCard
              item={item}
              adminMode={adminMode}
              onEdit={() => navigation.navigate('AddDish', { id: item.id })}
              onRemove={() => {
                Alert.alert('Remove dish', `Remove ${item.name}?`, [
                  { text: 'Cancel' },
                  { text: 'Remove', style: 'destructive', onPress: () => removeDish(item.id) },
                ]);
              }}
            />
          )}
        />
      )}

      <Text style={[styles.sectionTitle, { marginTop: 12 }]}>Saved Menus</Text>
      {savedMenus.length === 0 && <Text style={{ color: '#777' }}>No saved menus yet.</Text>}
      {savedMenus.map(s => (
        <View key={s.id} style={styles.savedItem}>
          <Text style={{ flex: 1 }}>{s.name}</Text>
          <Button title="Load" onPress={() => loadSnapshot(s.id)} />
        </View>
      ))}

      <View style={{ height: 40 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  headerRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center',
    marginBottom: 8 
  },
  title: { fontSize: 20, fontWeight: 'bold', color: '#2E7D32' },
  sectionTitle: { fontSize: 18, fontWeight: '700', marginTop: 12, marginBottom: 6 },
  savedItem: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingVertical: 6, 
    borderBottomWidth: 1, 
    borderBottomColor: '#eee' 
  },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
    marginBottom: 12,
  },
  warningText: {
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
  },
  chefInfo: {
    backgroundColor: '#E8F5E8',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#2E7D32',
  },
  chefStatus: {
    color: '#2E7D32',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  chefDetailsLink: {
    color: '#1B5E20',
    textDecorationLine: 'underline',
    fontWeight: '600',
  },
});