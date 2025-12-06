import { collection, addDoc, getDocs, query, limit } from 'firebase/firestore';
import { db } from '../config/firebase';

// Sample event data
export const sampleEvents = [
  {
    title: "Biraj bhatta 2025",
    description: "Join us for an unforgettable weekend of live music from top artists. Food trucks, art installations, and more!",
    date: "2025-07-15",
    time: "16:00",
    location: "Central Park, Kathmandu, Nepal",
    category: "Music",
    price: "89.99",
    capacity: 5000,
    organizer: "City Events Inc."
  },
  {
    title: "Tech Innovation Summit",
    description: "Network with tech leaders and learn about the latest trends in AI, blockchain, and cloud computing.",
    date: "2025-06-20",
    time: "09:00",
    location: "Moscone Center, Mumbai, India",
    category: "Technology",
    price: "299.99",
    capacity: 2000,
    organizer: "Tech Innovators Association"
  },
  {
    title: "football match",
    description: "nepal vs india",
    date: "2025-08-10",
    time: "11:00",
    location: "dasraath stadium",
    category: "Sports",
    price: "75.00",
    capacity: 3000,
    organizer: "Global Culinary Arts Society"
  },
  {
    title: "Contemporary Art Exhibition",
    description: "Opening night featuring works from local and international artists. Wine and appetizers served.",
    date: "2025-07-30",
    time: "19:00",
    location: "MOCA, Los Angeles, CA",
    category: "Art",
    price: "25.00",
    capacity: 200,
    organizer: "Modern Art Collective"
  },
  {
    title: "Mountain Wellness Retreat",
    description: "A weekend retreat focused on yoga, meditation, and healthy living in a beautiful natural setting.",
    date: "2025-09-05",
    time: "07:00",
    location: "Aspen Mountain Resort, Colorado",
    category: "Health",
    price: "449.99",
    capacity: 50,
    organizer: "Mindful Living Foundation"
  },
  {
    title: "Basketball Skills Camp",
    description: "Learn basketball skills from professional coaches. Includes drills, scrimmages, and personal coaching.",
    date: "2025-08-20",
    time: "08:00",
    location: "Madison Square Garden, New York, NY",
    category: "Sports",
    price: "199.99",
    capacity: 100,
    organizer: "Elite Sports Academy"
  },
  {
    title: "Startup Pitch Night",
    description: "Watch innovative startups pitch to top venture capitalists. Network with entrepreneurs and investors.",
    date: "2025-06-28",
    time: "18:30",
    location: "WeWork, Austin, TX",
    category: "Business",
    price: "Free",
    capacity: 150,
    organizer: "Austin Entrepreneurs Club"
  },
  {
    title: "Broadway Musical Night",
    description: "Experience the magic of Broadway with this spectacular production featuring full orchestra.",
    date: "2025-07-22",
    time: "20:00",
    location: "Richard Rodgers Theatre, New York, NY",
    category: "Entertainment",
    price: "149.99",
    capacity: 1300,
    organizer: "Broadway Productions Inc."
  },
  {
    title: "Data Science Bootcamp",
    description: "Intensive 2-day bootcamp covering Python, machine learning, and data visualization.",
    date: "2025-08-02",
    time: "09:00",
    location: "MIT Media Lab, Cambridge, MA",
    category: "Education",
    price: "399.99",
    capacity: 40,
    organizer: "DataTech Academy"
  },
  {
    title: "Community Beach Cleanup",
    description: "Join volunteers in making our beaches cleaner! Free t-shirt and refreshments for participants.",
    date: "2025-06-15",
    time: "08:00",
    location: "Santa Monica Beach, California",
    category: "Community",
    price: "Free",
    capacity: 500,
    organizer: "Ocean Conservation Alliance"
  },
  {
    title: "Electronic Music Festival",
    description: "Three days of electronic music featuring world-renowned DJs. Multiple stages and light shows.",
    date: "2025-09-12",
    time: "14:00",
    location: "Las Vegas Motor Speedway, NV",
    category: "Music",
    price: "249.99",
    capacity: 10000,
    organizer: "Electric Dreams Entertainment"
  },
  {
    title: "Vintage Car Show",
    description: "Admire over 200 classic automobiles from the 1920s to 1970s. Live auction and family activities.",
    date: "2025-10-05",
    time: "10:00",
    location: "Pebble Beach, California",
    category: "Entertainment",
    price: "35.00",
    capacity: 2500,
    organizer: "Classic Car Enthusiasts Club"
  }
];

// Function to seed the database
export const seedDatabase = async () => {
  try {
    const eventsRef = collection(db, 'events');
    const existingEvents = await getDocs(query(eventsRef, limit(1)));
    
    if (!existingEvents.empty) {
      return { success: true, message: 'Events already exist', count: 0 };
    }

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

    return { success: true, message: 'Database seeded', count: addedEvents.length };
  } catch (error) {
    console.error('Error seeding database:', error);
    return { success: false, error: error.message };
  }
};
