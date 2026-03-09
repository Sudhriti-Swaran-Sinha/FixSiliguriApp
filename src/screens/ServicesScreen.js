import React from 'react'
import { View, Text, TouchableOpacity, StyleSheet, FlatList, StatusBar } from 'react-native'
import { COLORS, SERVICES, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

export default function ServicesScreen({ navigation }) {
  const { user } = useAuth()

  const handleBook = (service) => {
    if (!user) { navigation.navigate('Login'); return }
    navigation.navigate('Booking', { service })
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <View>
          <Text style={styles.headerTitle}>Our Services</Text>
          <Text style={styles.headerSub}>Choose what you need</Text>
        </View>
      </View>

      <FlatList
        data={SERVICES}
        numColumns={2}
        keyExtractor={i => i.name}
        contentContainerStyle={styles.grid}
        columnWrapperStyle={styles.row}
        renderItem={({ item: s }) => (
          <TouchableOpacity
            style={[styles.card, SHADOW.medium]}
            onPress={() => handleBook(s)}
            activeOpacity={0.85}
          >
            <View style={[styles.iconWrap, { backgroundColor: s.bg }]}>
              <Text style={styles.icon}>{s.icon}</Text>
            </View>
            <Text style={styles.name}>{s.name}</Text>
            <Text style={styles.desc}>{s.desc}</Text>
            <View style={styles.footer}>
              <View style={[styles.priceBadge, { backgroundColor: s.bg }]}>
                <Text style={[styles.price, { color: s.color }]}>From ₹{s.price}</Text>
              </View>
              <Text style={[styles.arrow, { color: s.color }]}>→</Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor:'#F8F9FC' },
  header: { flexDirection:'row', alignItems:'center', gap:12, backgroundColor: COLORS.navy, paddingTop:52, paddingBottom:20, paddingHorizontal:20 },
  backBtn: { width:38, height:38, borderRadius:19, backgroundColor:'rgba(255,255,255,0.1)', alignItems:'center', justifyContent:'center' },
  backText: { color:'white', fontSize:18, fontWeight:'700' },
  headerTitle: { color:'white', fontSize:20, fontWeight:'900' },
  headerSub: { color:'rgba(255,255,255,0.45)', fontSize:12, marginTop:2 },
  grid: { padding:16 },
  row: { gap:12, marginBottom:12 },
  card: { flex:1, backgroundColor:'white', borderRadius:16, padding:16, borderWidth:1, borderColor:'#F1F5F9' },
  iconWrap: { width:48, height:48, borderRadius:14, alignItems:'center', justifyContent:'center', marginBottom:10 },
  icon: { fontSize:24 },
  name: { fontSize:14, fontWeight:'800', color: COLORS.navy, marginBottom:4 },
  desc: { fontSize:11, color: COLORS.gray, lineHeight:16, marginBottom:10 },
  footer: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  priceBadge: { paddingHorizontal:8, paddingVertical:3, borderRadius:100 },
  price: { fontSize:11, fontWeight:'700' },
  arrow: { fontSize:16, fontWeight:'700' },
})
