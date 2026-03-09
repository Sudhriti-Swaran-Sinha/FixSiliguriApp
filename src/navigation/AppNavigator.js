import React from 'react'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs'
import { Text } from 'react-native'
import { COLORS } from '../theme'
import { useAuth } from '../context/AuthContext'

import HomeScreen        from '../screens/HomeScreen'
import ServicesScreen    from '../screens/ServicesScreen'
import BookingScreen     from '../screens/BookingScreen'
import MyBookingsScreen  from '../screens/MyBookingsScreen'
import BookingDetailScreen from '../screens/BookingDetailScreen'
import ProfileScreen     from '../screens/ProfileScreen'
import LoginScreen       from '../screens/LoginScreen'

const Stack = createNativeStackNavigator()
const Tab   = createBottomTabNavigator()

function TabIcon({ name, focused }) {
  const icons = { Home:'🏠', Services:'🔧', Bookings:'🗂️', Profile:'👤' }
  return <Text style={{ fontSize: focused ? 22 : 18, opacity: focused ? 1 : 0.5 }}>{icons[name]}</Text>
}

function MainTabs() {
  const { user } = useAuth()
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarStyle: {
          backgroundColor: COLORS.navy,
          borderTopColor: 'rgba(255,255,255,0.08)',
          height: 70,
          paddingBottom: 10,
          paddingTop: 8,
        },
        tabBarActiveTintColor: COLORS.amber,
        tabBarInactiveTintColor: 'rgba(255,255,255,0.4)',
        tabBarLabelStyle: { fontSize: 11, fontWeight: '700' },
        tabBarIcon: ({ focused }) => <TabIcon name={route.name} focused={focused} />,
      })}
    >
      <Tab.Screen name="Home"     component={HomeScreen}       options={{ tabBarLabel:'Home' }} />
      <Tab.Screen name="Services" component={ServicesScreen}   options={{ tabBarLabel:'Services' }} />
      <Tab.Screen name="Bookings" component={MyBookingsScreen} options={{ tabBarLabel:'Bookings' }} />
      <Tab.Screen name="Profile"  component={ProfileScreen}    options={{ tabBarLabel: user ? user.name.split(' ')[0] : 'Profile' }} />
    </Tab.Navigator>
  )
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Main"          component={MainTabs} />
        <Stack.Screen name="Login"         component={LoginScreen} />
        <Stack.Screen name="Booking"       component={BookingScreen} />
        <Stack.Screen name="BookingDetail" component={BookingDetailScreen} />
        <Stack.Screen name="MyBookings"    component={MyBookingsScreen} />
      </Stack.Navigator>
    </NavigationContainer>
  )
}
