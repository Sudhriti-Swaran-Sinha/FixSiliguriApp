import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, StatusBar } from 'react-native'
import { COLORS, STATUS_COLORS, SHADOW } from '../theme'

export default function BookingDetailScreen({ route, navigation }) {
  const { booking: b } = route.params
  const sc = STATUS_COLORS[b.status] || STATUS_COLORS['Pending']

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Booking Details</Text>
      </View>
      <ScrollView contentContainerStyle={styles.body}>
        {/* ID + Status */}
        <View style={[styles.card, SHADOW.small]}>
          <View style={styles.idRow}>
            <Text style={styles.bookingId}>#{b.id}</Text>
            <View style={[styles.statusBadge, { backgroundColor: sc.bg }]}>
              <Text style={[styles.statusText, { color: sc.color }]}>{b.status}</Text>
            </View>
          </View>
          <View style={[styles.serviceBanner, { backgroundColor: b.bg || '#F8F9FC' }]}>
            <Text style={styles.serviceIcon}>{b.serviceIcon}</Text>
            <View>
              <Text style={styles.serviceName}>{b.service}</Text>
              <Text style={styles.servicePrice}>₹{b.price}+ &nbsp;·&nbsp; {b.date} &nbsp;·&nbsp; {b.time}</Text>
            </View>
          </View>
        </View>

        {/* Customer Info */}
        <View style={[styles.card, SHADOW.small]}>
          <Text style={styles.cardTitle}>👤 Customer Details</Text>
          {[['Name', b.name],['Phone', b.phone],['Email', b.email||'—'],['Address', b.address],['Pincode', b.pincode||'—']].map(([k,v]) => (
            <View key={k} style={styles.infoRow}>
              <Text style={styles.infoKey}>{k}</Text>
              <Text style={styles.infoVal}>{v}</Text>
            </View>
          ))}
        </View>

        {/* Provider */}
        {b.provider && (
          <View style={[styles.card, SHADOW.small]}>
            <Text style={styles.cardTitle}>👷 Assigned Provider</Text>
            <View style={styles.providerBadge}>
              <Text style={styles.providerText}>{b.provider}</Text>
            </View>
          </View>
        )}

        <TouchableOpacity style={styles.backToBookings} onPress={() => navigation.goBack()}>
          <Text style={styles.backToBookingsText}>← Back to My Bookings</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor:'#F8F9FC' },
  header: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor: COLORS.navy, paddingTop:52, paddingBottom:16, paddingHorizontal:20 },
  backBtn: { width:38, height:38, borderRadius:19, backgroundColor:'rgba(255,255,255,0.1)', alignItems:'center', justifyContent:'center' },
  backText: { color:'white', fontSize:18, fontWeight:'700' },
  headerTitle: { color:'white', fontSize:18, fontWeight:'900' },
  body: { padding:16, gap:14 },
  card: { backgroundColor:'white', borderRadius:16, padding:16, borderWidth:1, borderColor:'#F1F5F9' },
  idRow: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', marginBottom:14 },
  bookingId: { color: COLORS.gray, fontSize:13, fontWeight:'700' },
  statusBadge: { paddingHorizontal:12, paddingVertical:5, borderRadius:100 },
  statusText: { fontSize:12, fontWeight:'800' },
  serviceBanner: { flexDirection:'row', alignItems:'center', gap:12, padding:12, borderRadius:12 },
  serviceIcon: { fontSize:28 },
  serviceName: { color: COLORS.navy, fontSize:16, fontWeight:'800' },
  servicePrice: { color: COLORS.gray, fontSize:12, marginTop:2 },
  cardTitle: { color: COLORS.amber, fontSize:11, fontWeight:'800', letterSpacing:1, textTransform:'uppercase', marginBottom:12 },
  infoRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:8, borderBottomWidth:1, borderBottomColor:'#F8FAFC' },
  infoKey: { color: COLORS.gray, fontSize:13 },
  infoVal: { color: COLORS.navy, fontSize:13, fontWeight:'700', flex:1, textAlign:'right' },
  providerBadge: { backgroundColor:'#D1FAE5', padding:12, borderRadius:10 },
  providerText: { color:'#065F46', fontWeight:'700', fontSize:14 },
  backToBookings: { backgroundColor:'white', paddingVertical:14, borderRadius:14, alignItems:'center', borderWidth:1.5, borderColor:'#E2E8F0' },
  backToBookingsText: { color: COLORS.navy, fontWeight:'700', fontSize:14 },
})
