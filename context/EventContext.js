import React, { createContext, useState, useEffect, useContext } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  onSnapshot,
  arrayUnion,
  arrayRemove,
  getDoc,
  setDoc,
  limit
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import { sampleEvents } from '../utils/seedData';

const EventContext = createContext({});

export const useEvents = () => useContext(EventContext);

export const EventProvider = ({ children }) => {
  const [events, setEvents] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  // Listen to events collection
  useEffect(() => {
    const eventsRef = collection(db, 'events');
    const q = query(eventsRef, orderBy('date', 'asc'));
    
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const eventsData = snapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      setEvents(eventsData);
      setLoading(false);
    }, (error) => {
      console.error('Error fetching events:', error);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  // Listen to user's favorites
  useEffect(() => {
    if (!user?.uid) {
      setFavorites([]);
      return;
    }

    const userRef = doc(db, 'users', user.uid);
    
    const unsubscribe = onSnapshot(userRef, (doc) => {
      if (doc.exists()) {
        setFavorites(doc.data().favorites || []);
      }
    }, (error) => {
      console.error('Error fetching favorites:', error);
    });

    return unsubscribe;
  }, [user?.uid]);

  const addEvent = async (eventData) => {
    try {
      const eventsRef = collection(db, 'events');
      const newEvent = {
        ...eventData,
        createdBy: user.uid,
        createdByEmail: user.email,
        createdAt: new Date().toISOString()
      };
      
      const docRef = await addDoc(eventsRef, newEvent);
      return { success: true, id: docRef.id };
    } catch (error) {
      console.error('Error adding event:', error);
      return { success: false, error: error.message };
    }
  };

  const updateEvent = async (eventId, eventData) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await updateDoc(eventRef, {
        ...eventData,
        updatedAt: new Date().toISOString()
      });
      return { success: true };
    } catch (error) {
      console.error('Error updating event:', error);
      return { success: false, error: error.message };
    }
  };

  const deleteEvent = async (eventId) => {
    try {
      const eventRef = doc(db, 'events', eventId);
      await deleteDoc(eventRef);
      return { success: true };
    } catch (error) {
      console.error('Error deleting event:', error);
      return { success: false, error: error.message };
    }
  };

  const toggleFavorite = async (eventId) => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const userRef = doc(db, 'users', user.uid);
      const userDoc = await getDoc(userRef);
      
      if (!userDoc.exists()) {
        // Create user document if it doesn't exist
        await setDoc(userRef, {
          uid: user.uid,
          email: user.email,
          favorites: [eventId],
          createdAt: new Date().toISOString()
        });
        return { success: true, isFavorite: true };
      }
      
      const currentFavorites = userDoc.data().favorites || [];
      const isFavorite = currentFavorites.includes(eventId);
      
      if (isFavorite) {
        await updateDoc(userRef, {
          favorites: arrayRemove(eventId)
        });
      } else {
        await updateDoc(userRef, {
          favorites: arrayUnion(eventId)
        });
      }
      
      return { success: true, isFavorite: !isFavorite };
    } catch (error) {
      console.error('Error toggling favorite:', error);
      return { success: false, error: error.message };
    }
  };

  const removeFavorite = async (eventId) => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favorites: arrayRemove(eventId)
      });
      return { success: true };
    } catch (error) {
      console.error('Error removing favorite:', error);
      return { success: false, error: error.message };
    }
  };

  const clearAllFavorites = async () => {
    if (!user?.uid) return { success: false, error: 'User not authenticated' };

    try {
      const userRef = doc(db, 'users', user.uid);
      await updateDoc(userRef, {
        favorites: []
      });
      return { success: true };
    } catch (error) {
      console.error('Error clearing favorites:', error);
      return { success: false, error: error.message };
    }
  };

  const getEventById = (eventId) => {
    return events.find(event => event.id === eventId);
  };

  const getFavoriteEvents = () => {
    return events.filter(event => favorites.includes(event.id));
  };

  const isFavorite = (eventId) => {
    return favorites.includes(eventId);
  };

  const isEventOwner = (eventId) => {
    const event = getEventById(eventId);
    return event?.createdBy === user?.uid;
  };

  // Seed database with sample events
  const seedDatabase = async () => {
    try {
      // Check if events already exist
      const eventsRef = collection(db, 'events');
      const existingEvents = await getDocs(query(eventsRef, limit(1)));
      
      if (!existingEvents.empty) {
        return { success: true, message: 'Events already exist', count: 0 };
      }

      // Add sample events
      const addedEvents = [];
      for (const event of sampleEvents) {
        const docRef = await addDoc(eventsRef, {
          ...event,
          createdBy: 'system',
          createdByEmail: 'system@eventorganizer.app',
          createdAt: new Date().toISOString()
        });
        addedEvents.push(docRef.id);
      }

      return { success: true, message: 'Database seeded successfully', count: addedEvents.length };
    } catch (error) {
      console.error('Error seeding database:', error);
      return { success: false, error: error.message };
    }
  };

  const value = {
    events,
    favorites,
    loading,
    addEvent,
    updateEvent,
    deleteEvent,
    toggleFavorite,
    removeFavorite,
    clearAllFavorites,
    getEventById,
    getFavoriteEvents,
    isFavorite,
    isEventOwner,
    seedDatabase
  };

  return (
    <EventContext.Provider value={value}>
      {children}
    </EventContext.Provider>
  );
};

