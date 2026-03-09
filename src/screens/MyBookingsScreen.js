import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native'
import { COLORS, STATUS_COLORS, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

const FILTERS = ['All','Pending','Confirmed','In Progress','Completed','Cancelled']

export default function MyBookingsScreen({ navigation }) {
  const { user, getUserBookings } = useAuth()
  const [filter, setFilter] = useState('All')

  if (!user) {
    return (
      <View style={styles.root}>
        <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Bookings</Text>
        </View>
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>🔐</Text>
          <Text style={styles.emptyTitle}>Login Required</Text>
          <Text style={styles.emptySub}>Please login to view your bookings</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>Login Now →</Text>
          </TouchableOpacity>
        </View>
      </View>
    )
  }

  const allBookings = getUserBookings()
  const filtered = filter==='All' ? allBookings : allBookings.filter(b => b.status===filter)
  const sorted = [...filtered].reverse()

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Bookings</Text>
        <Text style={styles.headerSub}>{allBookings.length} total bookings</Text>
      </View>

      {/* Filter chips */}
      <View style={styles.filterWrap}>
        <FlatList
          horizontal data={FILTERS} keyExtractor={i=>i}
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.filterList}
          renderItem={({item}) => (
            <TouchableOpacity style={[styles.filterChip, filter===item && styles.filterChipActive]} onPress={() => setFilter(item)}>
              <Text style={[styles.filterChipText, filter===item && styles.filterChipTextActive]}>{item}</Text>
            </TouchableOpacity>
          )}
        />
      </View>

      {sorted.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyIcon}>📭</Text>
          <Text style={styles.emptyTitle}>No bookings yet</Text>
          <Text style={styles.emptySub}>Book your first service and it will appear here</Text>
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Services')}>
            <Text style={styles.loginBtnText}>Book a Service →</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <FlatList
          data={sorted} keyExtractor={b=>b.id}
          contentContainerStyle={styles.list}
          renderItem={({item:b}) => {
            const sc = STATUS_COLORS[b.status] || STATUS_COLORS['Pending']
            return (
              <TouchableOpacity style={[styles.card, SHADOW.small]} onPress={() => navigation.navigate('BookingDetail', { booking:b })} activeOpacity={0.85}>
                <View style={styles.cardTop}>
                  <View style={styles.cardLeft}>
                    <Text style={styles.cardId}>#{b.id}</Text>
                    <Text style={styles.cardService}>{b.serviceIcon} {b.service}</Text>
                  </View>
                  <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
                    <Text style={[styles.statusText, { color: sc.color }]}>{b.status}</Text>
                  </View>
                </View>
                <View style={styles.cardMeta}>
                  <Text style={styles.cardMetaText}>📅 {b.date}</Text>
                  <Text style={styles.cardMetaText}>⏰ {b.time}</Text>
                  <Text style={styles.cardMetaText}>💰 ₹{b.price}+</Text>
                </View>
                {b.provider && (
                  <View style={styles.providerBadge}>
                    <Text style={styles.providerText}>👷 Assigned: {b.provider}</Text>
                  </View>
                )}
                <Text style={styles.cardAddress}>📍 {b.address}</Text>
              </TouchableOpacity>
            )
          }}
        />
      )}
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor:'#F8F9FC' },
  header: { backgroundColor: COLORS.navy, paddingTop:52, paddingBottom:20, paddingHorizontal:20 },
  headerTitle: { color:'white', fontSize:22, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:4 },
  filterWrap: { backgroundColor:'white', borderBottomWidth:1, borderBottomColor:'#F1F5F9' },
  filterList: { paddingHorizontal:16, paddingVertical:12, gap:8 },
  filterChip: { paddingHorizontal:14, paddingVertical:7, borderRadius:100, borderWidth:1.5, borderColor:'#E2E8F0', backgroundColor:'white' },
  filterChipActive: { backgroundColor: COLORS.amber, borderColor: COLORS.amber },
  filterChipText: { color: COLORS.gray, fontSize:12, fontWeight:'700' },
  filterChipTextActive: { color: COLORS.navy },
  list: { padding:16, gap:12 },
  card: { backgroundColor:'white', borderRadius:16, padding:16, borderWidth:1, borderColor:'#F1F5F9' },
  cardTop: { flexDirection:'row', justifyContent:'space-between', alignItems:'flex-start', marginBottom:10 },
  cardLeft: {},
  cardId: { color: COLORS.gray, fontSize:11, fontWeight:'700', marginBottom:2 },
  cardService: { color: COLORS.navy, fontSize:16, fontWeight:'900' },
  statusBadge: { paddingHorizontal:10, paddingVertical:4, borderRadius:100 },
  statusText: { fontSize:11, fontWeight:'800' },
  cardMeta: { flexDirection:'row', gap:12, marginBottom:8 },
  cardMetaText: { color: COLORS.gray, fontSize:12 },
  providerBadge: { backgroundColor:'#D1FAE5', paddingHorizontal:10, paddingVertical:5, borderRadius:8, alignSelf:'flex-start', marginBottom:8 },
  providerText: { color:'#065F46', fontSize:12, fontWeight:'700' },
  cardAddress: { color: COLORS.gray, fontSize:12, marginTop:4 },
  empty: { flex:1, alignItems:'center', justifyContent:'center', padding:40 },
  emptyIcon: { fontSize:56, marginBottom:16 },
  emptyTitle: { fontSize:20, fontWeight:'900', color: COLORS.navy, marginBottom:8 },
  emptySub: { color: COLORS.gray, fontSize:14, textAlign:'center', lineHeight:20, marginBottom:24 },
  loginBtn: { backgroundColor: COLORS.amber, paddingHorizontal:24, paddingVertical:13, borderRadius:14 },
  loginBtnText: { color: COLORS.navy, fontWeight:'800', fontSize:14 },
})
