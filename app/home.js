import React, { useState } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Alert,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl
} from 'react-native';
import { router } from 'expo-router';
import { useAuth } from '../context/AuthContext';
import { useEvents } from '../context/EventContext';

export default function HomeScreen() {
  const { user, signOut } = useAuth();
  const { events, loading, toggleFavorite, isFavorite, seedDatabase } = useEvents();
  const [refreshing, setRefreshing] = useState(false);
  const [seeding, setSeeding] = useState(false);

  const handleSignOut = () => {
    Alert.alert('Sign Out', 'Are you sure?', [
      { text: 'Cancel', style: 'cancel' },
      { 
        text: 'Sign Out', 
        style: 'destructive',
        onPress: async () => {
          await signOut();
          router.replace('/');
        }
      }
    ]);
  };

  const handleSeedDatabase = async () => {
    setSeeding(true);
    const result = await seedDatabase();
    setSeeding(false);
    
    if (result.success && result.count > 0) {
      Alert.alert('Success', `Added ${result.count} sample events!`);
    } else if (result.error) {
      Alert.alert('Error', result.error);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
  };

  const renderEventItem = ({ item }) => (
    <TouchableOpacity
      style={styles.eventCard}
      onPress={() => router.push(`/event-details/${item.id}`)}
    >
      <View style={styles.eventHeader}>
        <View style={[styles.categoryDot, { backgroundColor: getCategoryColor(item.category) }]} />
        <Text style={styles.categoryText}>{item.category}</Text>
        <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
          <Text style={styles.favoriteIcon}>{isFavorite(item.id) ? '❤️' : '🤍'}</Text>
        </TouchableOpacity>
      </View>
      
      <Text style={styles.eventTitle}>{item.title}</Text>
      
      <View style={styles.eventMeta}>
        <Text style={styles.metaText}>📅 {formatDate(item.date)}</Text>
        {item.time && <Text style={styles.metaText}> • {item.time}</Text>}
      </View>
      
      <Text style={styles.locationText}>📍 {item.location}</Text>
      
      {item.price && (
        <Text style={styles.priceText}>
          {item.price === 'Free' || item.price === '0' ? 'Free' : `$${item.price}`}
        </Text>
      )}
    </TouchableOpacity>
  );

  const getCategoryColor = (category) => {
    const colors = {
      Music: '#E85D4C',
      Technology: '#1D9BF0',
      Food: '#F5A623',
      Art: '#7856FF',
      Health: '#00BA7C',
      Sports: '#FF6B35',
      Business: '#4B5563',
      Entertainment: '#EC4899',
      Education: '#06B6D4',
      Community: '#8B5CF6',
    };
    return colors[category] || '#007AFF';
  };

  if (loading && events.length === 0) {
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
        <View>
          <Text style={styles.greeting}>Hello, {user?.displayName?.split(' ')[0] || 'User'}</Text>
          <Text style={styles.headerTitle}>Events</Text>
        </View>
        <TouchableOpacity style={styles.signOutBtn} onPress={handleSignOut}>
          <Text style={styles.signOutText}>Sign Out</Text>
        </TouchableOpacity>
      </View>
      
      {/* Action Buttons */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={() => router.push('/favorites')}>
          <Text>❤️ Favorites</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.primaryBtn]} onPress={() => router.push('/new-event')}>
          <Text style={styles.primaryBtnText}>+ Create Event</Text>
        </TouchableOpacity>
      </View>
      
      {/* Events List */}
      <FlatList
        data={events}
        renderItem={renderEventItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyTitle}>No Events</Text>
            <Text style={styles.emptyText}>Create an event or load sample data</Text>
            <TouchableOpacity style={styles.emptyBtn} onPress={() => router.push('/new-event')}>
              <Text style={styles.emptyBtnText}>Create Event</Text>
            </TouchableOpacity>
            <TouchableOpacity 
              style={[styles.emptyBtn, styles.secondaryBtn]} 
              onPress={handleSeedDatabase}
              disabled={seeding}
            >
              {seeding ? (
                <ActivityIndicator color="#007AFF" size="small" />
              ) : (
                <Text style={styles.secondaryBtnText}>Load Sample Events</Text>
              )}
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
    padding: 20,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  greeting: {
    fontSize: 14,
    color: '#666',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
  },
  signOutBtn: {
    padding: 8,
  },
  signOutText: {
    color: '#FF3B30',
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    padding: 15,
    gap: 10,
  },
  actionBtn: {
    flex: 1,
    padding: 12,
    backgroundColor: '#fff',
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  primaryBtn: {
    backgroundColor: '#007AFF',
    borderColor: '#007AFF',
  },
  primaryBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  listContainer: {
    padding: 15,
    paddingTop: 5,
  },
  eventCard: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  eventHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  categoryDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 6,
  },
  categoryText: {
    fontSize: 12,
    color: '#666',
    flex: 1,
  },
  favoriteIcon: {
    fontSize: 18,
  },
  eventTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 6,
  },
  eventMeta: {
    flexDirection: 'row',
    marginBottom: 4,
  },
  metaText: {
    fontSize: 13,
    color: '#666',
  },
  locationText: {
    fontSize: 13,
    color: '#666',
    marginBottom: 6,
  },
  priceText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#007AFF',
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
  emptyBtn: {
    backgroundColor: '#007AFF',
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 8,
    marginBottom: 10,
    minWidth: 180,
    alignItems: 'center',
  },
  emptyBtnText: {
    color: '#fff',
    fontWeight: '600',
  },
  secondaryBtn: {
    backgroundColor: '#fff',
    borderWidth: 1,
    borderColor: '#007AFF',
  },
  secondaryBtnText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});
