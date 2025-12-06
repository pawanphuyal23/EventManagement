import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useEvents } from '../../context/EventContext';

const categories = ['Music', 'Technology', 'Food', 'Art', 'Health', 'Sports', 'Business', 'Entertainment', 'Education', 'Community'];

export default function EditEventScreen() {
  const { id } = useLocalSearchParams();
  const { getEventById, updateEvent, isEventOwner } = useEvents();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: '',
    time: '',
    location: '',
    category: 'Entertainment',
    price: '',
    capacity: '',
    organizer: '',
  });

  useEffect(() => {
    const event = getEventById(id);
    if (event) {
      setFormData({
        title: event.title || '',
        description: event.description || '',
        date: event.date || '',
        time: event.time || '',
        location: event.location || '',
        category: event.category || 'Entertainment',
        price: event.price?.toString() || '',
        capacity: event.capacity?.toString() || '',
        organizer: event.organizer || '',
      });
    }
    setLoading(false);
  }, [id, getEventById]);

  const validateForm = () => {
    if (!formData.title.trim()) {
      Alert.alert('Error', 'Please enter event title');
      return false;
    }
    if (!formData.description.trim()) {
      Alert.alert('Error', 'Please enter description');
      return false;
    }
    if (!formData.date.trim()) {
      Alert.alert('Error', 'Please enter date (YYYY-MM-DD)');
      return false;
    }
    if (!formData.location.trim()) {
      Alert.alert('Error', 'Please enter location');
      return false;
    }
    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) return;
    
    setIsSubmitting(true);
    
    const eventData = {
      title: formData.title.trim(),
      description: formData.description.trim(),
      date: formData.date.trim(),
      time: formData.time.trim() || null,
      location: formData.location.trim(),
      category: formData.category,
      price: formData.price.trim() || 'Free',
      capacity: formData.capacity ? parseInt(formData.capacity) : null,
      organizer: formData.organizer.trim() || 'Anonymous',
    };
    
    const result = await updateEvent(id, eventData);
    setIsSubmitting(false);
    
    if (result.success) {
      Alert.alert('Success', 'Event updated!', [
        { text: 'OK', onPress: () => router.back() }
      ]);
    } else {
      Alert.alert('Error', result.error || 'Failed to update event');
    }
  };

  const updateField = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  if (!isEventOwner(id)) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Access Denied</Text>
          <Text style={styles.errorText}>You can only edit your own events.</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>← Cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Edit Event</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView 
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <Text style={styles.label}>Title *</Text>
          <TextInput
            style={styles.input}
            placeholder="Event title"
            value={formData.title}
            onChangeText={(v) => updateField('title', v)}
          />

          <Text style={styles.label}>Description *</Text>
          <TextInput
            style={[styles.input, styles.textArea]}
            placeholder="Describe your event"
            value={formData.description}
            onChangeText={(v) => updateField('description', v)}
            multiline
            numberOfLines={4}
          />

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Date * (YYYY-MM-DD)</Text>
              <TextInput
                style={styles.input}
                placeholder="2025-12-25"
                value={formData.date}
                onChangeText={(v) => updateField('date', v)}
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Time (HH:MM)</Text>
              <TextInput
                style={styles.input}
                placeholder="14:00"
                value={formData.time}
                onChangeText={(v) => updateField('time', v)}
              />
            </View>
          </View>

          <Text style={styles.label}>Location *</Text>
          <TextInput
            style={styles.input}
            placeholder="Event venue"
            value={formData.location}
            onChangeText={(v) => updateField('location', v)}
          />

          <Text style={styles.label}>Category</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryScroll}>
            {categories.map((cat) => (
              <TouchableOpacity
                key={cat}
                style={[styles.categoryChip, formData.category === cat && styles.categoryChipActive]}
                onPress={() => updateField('category', cat)}
              >
                <Text style={[styles.categoryChipText, formData.category === cat && styles.categoryChipTextActive]}>
                  {cat}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>

          <View style={styles.row}>
            <View style={styles.halfField}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                placeholder="Free"
                value={formData.price}
                onChangeText={(v) => updateField('price', v)}
                keyboardType="decimal-pad"
              />
            </View>
            <View style={styles.halfField}>
              <Text style={styles.label}>Capacity</Text>
              <TextInput
                style={styles.input}
                placeholder="100"
                value={formData.capacity}
                onChangeText={(v) => updateField('capacity', v)}
                keyboardType="number-pad"
              />
            </View>
          </View>

          <Text style={styles.label}>Organizer</Text>
          <TextInput
            style={styles.input}
            placeholder="Your name"
            value={formData.organizer}
            onChangeText={(v) => updateField('organizer', v)}
          />

          <TouchableOpacity 
            style={[styles.submitBtn, isSubmitting && styles.submitBtnDisabled]}
            onPress={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <ActivityIndicator color="#fff" />
            ) : (
              <Text style={styles.submitBtnText}>Save Changes</Text>
            )}
          </TouchableOpacity>

          <View style={{ height: 40 }} />
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  backBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  backBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 15,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  cancelText: {
    color: '#007AFF',
    fontSize: 16,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    padding: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666',
    marginBottom: 6,
    marginTop: 12,
  },
  input: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    padding: 12,
    fontSize: 15,
  },
  textArea: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  row: {
    flexDirection: 'row',
    gap: 12,
  },
  halfField: {
    flex: 1,
  },
  categoryScroll: {
    marginTop: 6,
  },
  categoryChip: {
    paddingVertical: 8,
    paddingHorizontal: 14,
    backgroundColor: '#fff',
    borderRadius: 20,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  categoryChipActive: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  categoryChipText: {
    fontSize: 13,
    color: '#333',
  },
  categoryChipTextActive: {
    color: '#fff',
  },
  submitBtn: {
    backgroundColor: '#007AFF',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 24,
  },
  submitBtnDisabled: {
    opacity: 0.7,
  },
  submitBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
