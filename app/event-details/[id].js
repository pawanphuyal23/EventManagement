import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useAuth } from '../../context/AuthContext';
import { useEvents } from '../../context/EventContext';

export default function EventDetailScreen() {
  const { id } = useLocalSearchParams();
  const { user } = useAuth();
  const { getEventById, toggleFavorite, isFavorite, deleteEvent, isEventOwner } = useEvents();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const eventData = getEventById(id);
    setEvent(eventData);
    setLoading(false);
  }, [id, getEventById]);

  const handleToggleFavorite = async () => {
    const result = await toggleFavorite(id);
    if (result.success) {
      Alert.alert(result.isFavorite ? 'Added to Favorites' : 'Removed from Favorites');
    }
  };

  const handleDeleteEvent = () => {
    Alert.alert(
      'Delete Event',
      'Are you sure you want to delete this event?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            const result = await deleteEvent(id);
            if (result.success) {
              Alert.alert('Deleted', 'Event has been deleted.');
              router.back();
            } else {
              Alert.alert('Error', 'Failed to delete event.');
            }
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
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

  if (!event) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.errorContainer}>
          <Text style={styles.errorTitle}>Event Not Found</Text>
          <TouchableOpacity style={styles.backBtn} onPress={() => router.back()}>
            <Text style={styles.backBtnText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const isOwner = isEventOwner(id);
  const isEventFavorite = isFavorite(id);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleToggleFavorite}>
          <Text style={styles.favoriteIcon}>{isEventFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Badge */}
        <View style={styles.categoryBadge}>
          <Text style={styles.categoryText}>{event.category}</Text>
        </View>

        {/* Title */}
        <Text style={styles.title}>{event.title}</Text>

        {/* Price */}
        {event.price && (
          <Text style={styles.price}>
            {event.price === 'Free' || event.price === '0' ? 'Free Entry' : `$${event.price}`}
          </Text>
        )}

        {/* Info Section */}
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📅 Date</Text>
            <Text style={styles.infoValue}>{formatDate(event.date)}</Text>
          </View>

          {event.time && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>🕐 Time</Text>
              <Text style={styles.infoValue}>{event.time}</Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.infoLabel}>📍 Location</Text>
            <Text style={styles.infoValue}>{event.location}</Text>
          </View>

          {event.organizer && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👤 Organizer</Text>
              <Text style={styles.infoValue}>{event.organizer}</Text>
            </View>
          )}

          {event.capacity && (
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>👥 Capacity</Text>
              <Text style={styles.infoValue}>{event.capacity} attendees</Text>
            </View>
          )}
        </View>

        {/* Description */}
        <View style={styles.descSection}>
          <Text style={styles.descTitle}>About</Text>
          <Text style={styles.descText}>{event.description}</Text>
        </View>

        {/* Owner Actions */}
        {isOwner && (
          <View style={styles.ownerSection}>
            <Text style={styles.ownerBadge}>You created this event</Text>
            <View style={styles.ownerActions}>
              <TouchableOpacity 
                style={styles.editBtn}
                onPress={() => router.push(`/edit-event/${id}`)}
              >
                <Text style={styles.editBtnText}>Edit</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteBtn}
                onPress={handleDeleteEvent}
              >
                <Text style={styles.deleteBtnText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Bottom Bar */}
      <View style={styles.bottomBar}>
        <TouchableOpacity 
          style={styles.favoriteBtn}
          onPress={handleToggleFavorite}
        >
          <Text>{isEventFavorite ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.registerBtn}
          onPress={() => Alert.alert('Coming Soon', 'Registration will be available soon!')}
        >
          <Text style={styles.registerBtnText}>
            {event.price === 'Free' || event.price === '0' ? 'Register Free' : `Get Tickets - $${event.price}`}
          </Text>
        </TouchableOpacity>
      </View>
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
    fontSize: 18,
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
  backText: {
    color: '#007AFF',
    fontSize: 16,
  },
  favoriteIcon: {
    fontSize: 24,
  },
  content: {
    flex: 1,
    padding: 20,
  },
  categoryBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#007AFF',
    paddingVertical: 4,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginBottom: 12,
  },
  categoryText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    marginBottom: 8,
  },
  price: {
    fontSize: 18,
    fontWeight: '600',
    color: '#007AFF',
    marginBottom: 20,
  },
  infoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  infoRow: {
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  infoLabel: {
    fontSize: 13,
    color: '#666',
    marginBottom: 4,
  },
  infoValue: {
    fontSize: 15,
    color: '#333',
    fontWeight: '500',
  },
  descSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  descTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 10,
  },
  descText: {
    fontSize: 14,
    lineHeight: 22,
    color: '#666',
  },
  ownerSection: {
    backgroundColor: '#FFF9E6',
    borderRadius: 12,
    padding: 15,
    marginBottom: 20,
  },
  ownerBadge: {
    fontSize: 12,
    color: '#B8860B',
    fontWeight: '600',
    marginBottom: 12,
  },
  ownerActions: {
    flexDirection: 'row',
    gap: 10,
  },
  editBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  editBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  deleteBtn: {
    flex: 1,
    backgroundColor: '#FFE5E5',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteBtnText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    padding: 15,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#eee',
    gap: 10,
  },
  favoriteBtn: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  registerBtn: {
    flex: 1,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  registerBtnText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
});
