import React, { useEffect, useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  Button, 
  StyleSheet, 
  Alert, 
  TouchableOpacity, 
  ScrollView, 
  Switch 
} from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../App';
import { useMenu, Course, MenuItem } from '../src/context/MenuContext';

type Props = NativeStackScreenProps<RootStackParamList, 'AddDish'>;

const COURSES: Course[] = ['Starters', 'Mains', 'Dessert'];

// Quick presets the chef can add with one tap
const PRESETS: Omit<MenuItem, 'id'>[] = [
  { name: 'Cheese Toast', description: 'Crispy and cheesy', course: 'Starters', price: 25 },
  { name: 'Seasonal Soup', description: 'Comforting soup', course: 'Starters', price: 35 },
  { name: 'Grilled Lemon Chicken', description: 'With roasted veg', course: 'Mains', price: 95 },
  { name: 'Spaghetti Bolognese', description: 'Classic Ragu', course: 'Mains', price: 85 },
  { name: 'Chocolate Brownie', description: 'Decadent dessert', course: 'Dessert', price: 30 },
  { name: 'Fruit Salad', description: 'Fresh seasonal fruit', course: 'Dessert', price: 28 },
];

export default function AddDishScreen({ navigation, route }: Props) {
  const { menu, addDish, updateDish } = useMenu();
  const editId = route.params?.id;
  const editing = !!editId;
  const editingDish = editing ? menu.find(m => m.id === editId) : undefined;

  const [name, setName] = useState('');
  const [desc, setDesc] = useState('');
  const [course, setCourse] = useState<Course>('Starters');
  const [price, setPrice] = useState('');
  const [recommended, setRecommended] = useState(false);

  useEffect(() => {
    if (editingDish) {
      setName(editingDish.name);
      setDesc(editingDish.description);
      setCourse(editingDish.course);
      setPrice(editingDish.price.toString());
      setRecommended(!!editingDish.recommended);
    }
  }, [editingDish]);

  const handleSave = () => {
    const p = parseFloat(price);
    if (!name.trim() || isNaN(p) || p <= 0) {
      Alert.alert('Validation', 'Please enter a name and a valid price (greater than 0).');
      return;
    }
    
    const payload: Omit<MenuItem, 'id'> = { 
      name: name.trim(), 
      description: desc.trim(), 
      course, 
      price: p, 
      recommended 
    };

    if (editing && editId) {
      updateDish(editId, payload);
      Alert.alert('Saved', 'Dish updated successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() }
      ]);
    } else {
      addDish(payload);
      Alert.alert('Added', `${name} added to the menu.`, [
        { 
          text: 'OK', 
          onPress: () => {
            // Clear form only for new dishes, not when editing
            setName('');
            setDesc('');
            setCourse('Starters');
            setPrice('');
            setRecommended(false);
          }
        }
      ]);
    }
  };

  const addPreset = (d: Omit<MenuItem, 'id'>) => {
    addDish(d);
    Alert.alert('Preset added', `${d.name} added to the menu.`);
  };

  const showPriceWarning = () => {
    Alert.alert(
      'Price Notice',
      '⚠️ Please note: Prices are subject to change based on market conditions and ingredient availability. Final pricing will be confirmed at time of booking.',
      [{ text: 'I Understand' }]
    );
  };

  return (
    <ScrollView style={styles.container}>
      <TouchableOpacity style={styles.warningBanner} onPress={showPriceWarning}>
        <Text style={styles.warningText}>⚠️ Prices may change based on market conditions</Text>
      </TouchableOpacity>

      <Text style={styles.title}>{editing ? 'Edit Dish' : 'Add Dish'}</Text>

      <Text style={styles.label}>Name</Text>
      <TextInput 
        style={styles.input} 
        value={name} 
        onChangeText={setName} 
        placeholder="Dish name" 
      />

      <Text style={styles.label}>Description</Text>
      <TextInput 
        style={styles.input} 
        value={desc} 
        onChangeText={setDesc} 
        placeholder="e.g. lemon chicken with herbs" 
      />

      <Text style={styles.label}>Course</Text>
      <View style={styles.courseRow}>
        {COURSES.map(c => (
          <TouchableOpacity 
            key={c} 
            onPress={() => setCourse(c)} 
            style={[styles.courseBtn, course === c && styles.activeBtn]}
          >
            <Text style={course === c ? styles.activeText : styles.courseText}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <Text style={styles.label}>Price (R)</Text>
      <TextInput 
        style={styles.input} 
        value={price} 
        onChangeText={setPrice} 
        keyboardType="numeric" 
        placeholder="e.g. 85" 
      />

      <View style={styles.row}>
        <Text style={{ fontWeight: '600' }}>Recommended</Text>
        <Switch value={recommended} onValueChange={setRecommended} />
      </View>

      <View style={{ marginTop: 12 }}>
        <Button 
          title={editing ? 'Save changes' : 'Add to menu'} 
          color="#2E7D32" 
          onPress={handleSave} 
        />
      </View>

      {!editing && (
        <>
          <Text style={[styles.label, { marginTop: 20 }]}>Quick Presets</Text>
          {PRESETS.map((p, idx) => (
            <TouchableOpacity 
              key={idx} 
              style={styles.presetBtn} 
              onPress={() => addPreset(p)}
            >
              <Text style={styles.presetText}>{p.name} — R{p.price.toFixed(2)}</Text>
              <Text style={styles.presetDesc}>{p.description}</Text>
            </TouchableOpacity>
          ))}
        </>
      )}

      <View style={{ height: 30 }} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#fff' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#2E7D32', marginBottom: 12 },
  label: { fontWeight: '700', color: '#2E7D32', marginTop: 8 },
  input: { 
    borderWidth: 1, 
    borderColor: '#ddd', 
    borderRadius: 8, 
    padding: 10, 
    marginTop: 6 
  },
  courseRow: { 
    flexDirection: 'row', 
    marginTop: 8, 
    flexWrap: 'wrap' 
  },
  courseBtn: { 
    paddingHorizontal: 12, 
    paddingVertical: 6, 
    borderWidth: 1, 
    borderColor: '#FF9800', 
    borderRadius: 20, 
    marginRight: 8, 
    marginBottom: 8 
  },
  activeBtn: { backgroundColor: '#FF9800' },
  courseText: { color: '#333' },
  activeText: { color: '#fff' },
  row: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginTop: 12 
  },
  presetBtn: { 
    backgroundColor: '#F1F8E9', 
    padding: 10, 
    borderRadius: 8, 
    marginTop: 8, 
    borderLeftWidth: 6, 
    borderLeftColor: '#2E7D32' 
  },
  presetText: { fontWeight: '700', color: '#2E7D32' },
  presetDesc: { color: '#555', marginTop: 4 },
  warningBanner: {
    backgroundColor: '#FFF3CD',
    padding: 10,
    borderRadius: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#FFA000',
    marginBottom: 12,
  },
  warningText: {
    color: '#856404',
    fontWeight: '600',
    textAlign: 'center',
    fontSize: 12,
  },
});