import React, { createContext, useContext, useState, useEffect } from 'react'
import AsyncStorage from '@react-native-async-storage/async-storage'
import { ADMIN_EMAIL, ADMIN_PASSWORD } from '../theme'

const AuthContext = createContext(null)

const SHEET_URL = 'https://script.google.com/macros/s/AKfycbw51ljNkA6qU3WsXM7GOeizeunZFO0tTZu1oonWArEQuFHiDve3PPZjWlNQfytH61hR1A/exec'

export function AuthProvider({ children }) {
  const [user,     setUser]     = useState(null)
  const [bookings, setBookings] = useState([])
  const [loading,  setLoading]  = useState(true)

  useEffect(() => {
    loadFromStorage()
  }, [])

  const loadFromStorage = async () => {
    try {
      const u = await AsyncStorage.getItem('fs_user')
      const b = await AsyncStorage.getItem('fs_bookings')
      if (u) setUser(JSON.parse(u))
      if (b) setBookings(JSON.parse(b))
    } catch(e) {}
    setLoading(false)
  }

  const login = async (email, password) => {
    if (email === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      const u = { name:'Admin', email, role:'admin' }
      setUser(u)
      await AsyncStorage.setItem('fs_user', JSON.stringify(u))
      return { success:true }
    }
    try {
      const users = JSON.parse(await AsyncStorage.getItem('fs_users') || '[]')
      const found = users.find(u => u.email===email && u.password===password)
      if (found) {
        const u = { name:found.name, email:found.email, phone:found.phone, role:'user' }
        setUser(u)
        await AsyncStorage.setItem('fs_user', JSON.stringify(u))
        return { success:true }
      }
      return { success:false, error:'Invalid email or password' }
    } catch(e) {
      return { success:false, error:'Login failed' }
    }
  }

  const signup = async (name, email, phone, password) => {
    try {
      const users = JSON.parse(await AsyncStorage.getItem('fs_users') || '[]')
      if (users.find(u => u.email===email)) return { success:false, error:'Email already registered' }
      const newUser = { name, email, phone, password, role:'user' }
      users.push(newUser)
      await AsyncStorage.setItem('fs_users', JSON.stringify(users))
      const u = { name, email, phone, role:'user' }
      setUser(u)
      await AsyncStorage.setItem('fs_user', JSON.stringify(u))
      return { success:true }
    } catch(e) {
      return { success:false, error:'Signup failed' }
    }
  }

  const logout = async () => {
    setUser(null)
    await AsyncStorage.removeItem('fs_user')
  }

  const addBooking = async (booking) => {
    const list = [...bookings, booking]
    setBookings(list)
    await AsyncStorage.setItem('fs_bookings', JSON.stringify(list))
    // Save to Google Sheets
    try {
      await fetch(SHEET_URL, {
        method:'POST', mode:'no-cors',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify(booking)
      })
    } catch(e) {}
  }

  const updateBooking = async (id, changes) => {
    const list = bookings.map(b => b.id===id ? {...b,...changes} : b)
    setBookings(list)
    await AsyncStorage.setItem('fs_bookings', JSON.stringify(list))
  }

  const getUserBookings = () => {
    if (!user) return []
    if (user.role==='admin') return bookings
    return bookings.filter(b => b.email===user.email)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, signup, logout, bookings, addBooking, updateBooking, getUserBookings }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
