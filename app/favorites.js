import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import { router } from 'expo-router';
import { useEvents } from '../context/EventContext';

export default function FavoritesScreen() {
  const { getFavoriteEvents, removeFavorite, clearAllFavorites, loading } = useEvents();
  const [clearing, setClearing] = useState(false);
  
  const favoriteEvents = getFavoriteEvents();

  const handleRemoveFavorite = (eventId, title) => {
    Alert.alert('Remove', `Remove "${title}" from favorites?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => removeFavorite(eventId) }
    ]);
  };

  const handleClearAll = () => {
    if (favoriteEvents.length === 0) {
      Alert.alert('No Favorites', 'Your favorites list is empty.');
      return;
    }

    Alert.alert(
      'Clear All',
      `Remove all ${favoriteEvents.length} favorites?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Clear All',
          style: 'destructive',
          onPress: async () => {
            setClearing(true);
            await clearAllFavorites();
            setClearing(false);
          }
        }
      ]
    );
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/event-details/${item.id}`)}
    >
      <View style={styles.eventInfo}>
        <Text style={styles.eventTitle}>{item.title}</Text>
        <Text style={styles.eventMeta}>
          📅 {formatDate(item.date)} • 📍 {item.location}
        </Text>
      </View>
      <TouchableOpacity 
        style={styles.removeBtn}
        onPress={() => handleRemoveFavorite(item.id, item.title)}
      >
        <Text style={styles.removeBtnText}>✕</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#007AFF" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Favorites</Text>
        {favoriteEvents.length > 0 ? (
          <TouchableOpacity onPress={handleClearAll} disabled={clearing}>
            {clearing ? (
              <ActivityIndicator size="small" color="#FF3B30" />
            ) : (
              <Text style={styles.clearText}>Clear All</Text>
            )}
          </TouchableOpacity>
        ) : (
          <View style={{ width: 60 }} />
        )}
      </View>

      {/* List */}
      <FlatList
        data={favoriteEvents}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          favoriteEvents.length > 0 ? (
            <Text style={styles.countText}>{favoriteEvents.length} saved events</Text>
          ) : null
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Favorites</Text>
            <Text style={styles.emptyText}>Events you favorite will appear here</Text>
            <TouchableOpacity style={styles.exploreBtn} onPress={() => router.replace('/home')}>
              <Text style={styles.exploreBtnText}>Explore Events</Text>
            </TouchableOpacity>
          </View>
        }
      />
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
  headerTitle: {
    fontSize: 17,
    fontWeight: '600',
  },
  clearText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '500',
  },
  listContainer: {
    padding: 15,
  },
  countText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 12,
  },
  eventCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventInfo: {
    flex: 1,
  },
  eventTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  eventMeta: {
    fontSize: 13,
    color: '#666',
  },
  removeBtn: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#FFE5E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  removeBtnText: {
    color: '#FF3B30',
    fontSize: 14,
    fontWeight: '600',
  },
  emptyContainer: {
    alignItems: 'center',
    padding: 40,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: '#666',
    marginBottom: 20,
  },
  exploreBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  exploreBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
});
