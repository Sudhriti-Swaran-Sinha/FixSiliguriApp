import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native'
import { COLORS, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

export default function ProfileScreen({ navigation }) {
  const { user, logout, getUserBookings } = useAuth()

  if (!user) {
    navigation.replace('Login')
    return null
  }

  const bookings = getUserBookings()
  const stats = {
    total: bookings.length,
    completed: bookings.filter(b=>b.status==='Completed').length,
    pending: bookings.filter(b=>b.status==='Pending').length,
  }

  const handleLogout = () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text:'Cancel', style:'cancel' },
      { text:'Logout', style:'destructive', onPress: async () => { await logout(); navigation.navigate('Home') } }
    ])
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Text style={styles.backText}>←</Text>
          </TouchableOpacity>
          <View style={styles.avatarWrap}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
            </View>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            {user.role==='admin' && (
              <View style={styles.adminBadge}><Text style={styles.adminBadgeText}>🛠️ Admin</Text></View>
            )}
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsRow}>
          {[
            ['📦', stats.total, 'Total'],
            ['⏳', stats.pending, 'Pending'],
            ['✅', stats.completed, 'Completed'],
          ].map(([icon,val,label]) => (
            <View key={label} style={[styles.statCard, SHADOW.small]}>
              <Text style={styles.statIcon}>{icon}</Text>
              <Text style={styles.statVal}>{val}</Text>
              <Text style={styles.statLabel}>{label}</Text>
            </View>
          ))}
        </View>

        {/* Menu */}
        <View style={styles.menu}>
          {[
            { icon:'🗂️', label:'My Bookings', onPress:() => navigation.navigate('MyBookings') },
            { icon:'📅', label:'Book a Service', onPress:() => navigation.navigate('Services') },
            ...(user.role==='admin' ? [{ icon:'🛠️', label:'Admin Panel', onPress:() => navigation.navigate('Admin') }] : []),
            { icon:'📞', label:'Contact Support', onPress:() => Alert.alert('Contact', 'Call: +91 70760 47532\nEmail: hello@fixsiliguri.com') },
            { icon:'ℹ️', label:'About Fix Siliguri', onPress:() => Alert.alert('About', 'Fix Siliguri — Expert Home Services\nVersion 1.0.0\n\nTrusted by 500+ customers in Siliguri since 2022.') },
          ].map(item => (
            <TouchableOpacity key={item.label} style={[styles.menuItem, SHADOW.small]} onPress={item.onPress}>
              <Text style={styles.menuIcon}>{item.icon}</Text>
              <Text style={styles.menuLabel}>{item.label}</Text>
              <Text style={styles.menuArrow}>→</Text>
            </TouchableOpacity>
          ))}
        </View>

        <TouchableOpacity style={styles.logoutBtn} onPress={handleLogout}>
          <Text style={styles.logoutText}>🚪 Logout</Text>
        </TouchableOpacity>

        <Text style={styles.version}>Fix Siliguri v1.0.0</Text>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor:'#F8F9FC' },
  header: { backgroundColor: COLORS.navy, paddingTop:52, paddingBottom:32, paddingHorizontal:20 },
  backBtn: { width:38, height:38, borderRadius:19, backgroundColor:'rgba(255,255,255,0.1)', alignItems:'center', justifyContent:'center', marginBottom:16 },
  backText: { color:'white', fontSize:18, fontWeight:'700' },
  avatarWrap: { alignItems:'center' },
  avatar: { width:72, height:72, borderRadius:36, backgroundColor: COLORS.amber, alignItems:'center', justifyContent:'center', marginBottom:12 },
  avatarText: { color: COLORS.navy, fontSize:30, fontWeight:'900' },
  userName: { color:'white', fontSize:20, fontWeight:'900', marginBottom:4 },
  userEmail: { color:'rgba(255,255,255,0.5)', fontSize:13 },
  adminBadge: { marginTop:8, backgroundColor:'rgba(245,158,11,0.2)', borderWidth:1, borderColor: COLORS.amber, paddingHorizontal:12, paddingVertical:4, borderRadius:100 },
  adminBadgeText: { color: COLORS.amber, fontSize:12, fontWeight:'700' },
  statsRow: { flexDirection:'row', gap:12, padding:16 },
  statCard: { flex:1, backgroundColor:'white', borderRadius:14, padding:14, alignItems:'center', borderWidth:1, borderColor:'#F1F5F9' },
  statIcon: { fontSize:22, marginBottom:6 },
  statVal: { color: COLORS.navy, fontSize:22, fontWeight:'900', marginBottom:2 },
  statLabel: { color: COLORS.gray, fontSize:11 },
  menu: { paddingHorizontal:16, gap:10, marginBottom:16 },
  menuItem: { flexDirection:'row', alignItems:'center', backgroundColor:'white', borderRadius:14, padding:16, borderWidth:1, borderColor:'#F1F5F9' },
  menuIcon: { fontSize:20, marginRight:14 },
  menuLabel: { flex:1, color: COLORS.navy, fontSize:15, fontWeight:'700' },
  menuArrow: { color: COLORS.gray, fontSize:16 },
  logoutBtn: { marginHorizontal:16, backgroundColor:'#FEE2E2', paddingVertical:14, borderRadius:14, alignItems:'center', marginBottom:12 },
  logoutText: { color:'#991B1B', fontWeight:'800', fontSize:14 },
  version: { textAlign:'center', color: COLORS.gray, fontSize:12, marginBottom:32 },
})
