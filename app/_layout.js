import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { AuthProvider } from "../context/AuthContext";
import { EventProvider } from "../context/EventContext";

export default function RootLayout() {
  return (
    <AuthProvider>
      <EventProvider>
        <StatusBar style="dark" />
        <Stack 
          screenOptions={{ 
            headerShown: false,
            contentStyle: { backgroundColor: '#f5f5f5' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="home" />
          <Stack.Screen name="favorites" />
          <Stack.Screen name="new-event" />
          <Stack.Screen name="edit-event/[id]" />
          <Stack.Screen name="event-details/[id]" />
        </Stack>
      </EventProvider>
    </AuthProvider>
  );
}
