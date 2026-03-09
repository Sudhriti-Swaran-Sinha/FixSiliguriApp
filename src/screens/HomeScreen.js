import React, { useRef } from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions, StatusBar } from 'react-native'
import { COLORS, SERVICES, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

const { width } = Dimensions.get('window')

export default function HomeScreen({ navigation }) {
  const { user } = useAuth()

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* ── NAVBAR ── */}
      <View style={styles.navbar}>
        <View>
          <Text style={styles.logo}>🔧 Fix Siliguri</Text>
          <Text style={styles.logoSub}>Expert Home Services</Text>
        </View>
        {user ? (
          <TouchableOpacity style={styles.avatarBtn} onPress={() => navigation.navigate('Profile')}>
            <Text style={styles.avatarText}>{user.name[0].toUpperCase()}</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.loginBtn} onPress={() => navigation.navigate('Login')}>
            <Text style={styles.loginBtnText}>Login</Text>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* ── HERO ── */}
        <View style={styles.hero}>
          <View style={styles.heroBadge}>
            <View style={styles.heroDot} />
            <Text style={styles.heroBadgeText}>TRUSTED IN SILIGURI SINCE 2022</Text>
          </View>
          <Text style={styles.heroTitle}>Expert Home{'\n'}Services,</Text>
          <Text style={styles.heroTitleAmber}>At Your Doorstep</Text>
          <Text style={styles.heroSub}>Get verified, background-checked professionals in Siliguri. Booked in 60 seconds.</Text>

          <View style={styles.heroActions}>
            <TouchableOpacity style={styles.bookBtn} onPress={() => navigation.navigate('Services')}>
              <Text style={styles.bookBtnText}>📅 Book a Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.howBtn} onPress={() => navigation.navigate('HowItWorks')}>
              <Text style={styles.howBtnText}>▶ How it works</Text>
            </TouchableOpacity>
          </View>

          {/* Stats */}
          <View style={styles.statsRow}>
            {[['500+','Happy customers'],['4.9★','Average rating'],['6+','Service types']].map(([v,l]) => (
              <View key={l} style={styles.statItem}>
                <Text style={styles.statVal}>{v}</Text>
                <Text style={styles.statLabel}>{l}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* ── SERVICES GRID ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>OUR SERVICES</Text>
          <Text style={styles.sectionTitle}>What do you need{'\n'}help with?</Text>
          <View style={styles.servicesGrid}>
            {SERVICES.map(s => (
              <TouchableOpacity
                key={s.name}
                style={[styles.serviceCard, SHADOW.medium]}
                onPress={() => navigation.navigate('Booking', { service: s })}
                activeOpacity={0.85}
              >
                <View style={[styles.serviceIconWrap, { backgroundColor: s.bg }]}>
                  <Text style={styles.serviceIcon}>{s.icon}</Text>
                </View>
                <Text style={styles.serviceName}>{s.name}</Text>
                <Text style={styles.serviceDesc}>{s.desc}</Text>
                <View style={styles.serviceFooter}>
                  <View style={[styles.servicePriceBadge, { backgroundColor: s.bg }]}>
                    <Text style={[styles.servicePrice, { color: s.color }]}>From ₹{s.price}</Text>
                  </View>
                  <Text style={[styles.serviceArrow, { color: s.color }]}>→</Text>
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── HOW IT WORKS ── */}
        <View style={[styles.section, styles.sectionDark]}>
          <Text style={[styles.sectionLabel, { color: COLORS.amber }]}>SIMPLE PROCESS</Text>
          <Text style={[styles.sectionTitle, { color: 'white' }]}>How It Works</Text>
          {[
            ['1', 'Choose a Service', 'Browse our 6 expert service categories'],
            ['2', 'Pick Date & Time', 'Select any slot in the next 7 days'],
            ['3', 'Enter Details', 'Your address and contact info'],
            ['4', 'Expert Arrives', 'Verified professional at your doorstep'],
          ].map(([n, t, d]) => (
            <View key={n} style={styles.stepRow}>
              <View style={styles.stepNum}><Text style={styles.stepNumText}>{n}</Text></View>
              <View style={styles.stepInfo}>
                <Text style={styles.stepTitle}>{t}</Text>
                <Text style={styles.stepDesc}>{d}</Text>
              </View>
            </View>
          ))}
        </View>

        {/* ── REVIEWS ── */}
        <View style={styles.section}>
          <Text style={styles.sectionLabel}>TESTIMONIALS</Text>
          <Text style={styles.sectionTitle}>What our customers say</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.reviewsScroll}>
            {[
              ['Priya Sharma', 'Electrician', 'Very professional service! The electrician arrived on time and fixed everything perfectly.', '⭐⭐⭐⭐⭐'],
              ['Rohit Das', 'AC Repair', 'Got my AC serviced quickly. Affordable and reliable. Highly recommend Fix Siliguri!', '⭐⭐⭐⭐⭐'],
              ['Meena Roy', 'Plumber', 'Excellent work! Pipe leak fixed in under an hour. Will definitely use again.', '⭐⭐⭐⭐⭐'],
            ].map(([name, service, review, stars]) => (
              <View key={name} style={[styles.reviewCard, SHADOW.small]}>
                <Text style={styles.reviewStars}>{stars}</Text>
                <Text style={styles.reviewText}>"{review}"</Text>
                <View style={styles.reviewFooter}>
                  <View style={styles.reviewAvatar}>
                    <Text style={styles.reviewAvatarText}>{name[0]}</Text>
                  </View>
                  <View>
                    <Text style={styles.reviewName}>{name}</Text>
                    <Text style={styles.reviewService}>{service} Customer</Text>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* ── CTA ── */}
        <View style={styles.cta}>
          <Text style={styles.ctaTitle}>Ready to Book?</Text>
          <Text style={styles.ctaSub}>Join 500+ happy customers in Siliguri</Text>
          <TouchableOpacity style={styles.ctaBtn} onPress={() => navigation.navigate('Services')}>
            <Text style={styles.ctaBtnText}>Book a Service Now →</Text>
          </TouchableOpacity>
        </View>

        {/* ── FOOTER ── */}
        <View style={styles.footer}>
          <Text style={styles.footerLogo}>🔧 Fix Siliguri</Text>
          <Text style={styles.footerText}>Expert Home Services in Siliguri, West Bengal</Text>
          <Text style={styles.footerText}>📞 +91 70760 47532 &nbsp;|&nbsp; ✉️ hello@fixsiliguri.com</Text>
          <Text style={styles.footerCopy}>© 2024 Fix Siliguri. All rights reserved.</Text>
        </View>

      </ScrollView>
    </View>
  )
}

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor: COLORS.navy },
  navbar: { flexDirection:'row', justifyContent:'space-between', alignItems:'center', paddingHorizontal:20, paddingTop:50, paddingBottom:14, backgroundColor: COLORS.navy },
  logo: { color:'white', fontSize:18, fontWeight:'900' },
  logoSub: { color:'rgba(255,255,255,0.4)', fontSize:10, marginTop:1 },
  loginBtn: { backgroundColor: COLORS.amber, paddingHorizontal:16, paddingVertical:8, borderRadius:20 },
  loginBtnText: { color: COLORS.navy, fontWeight:'700', fontSize:13 },
  avatarBtn: { width:38, height:38, borderRadius:19, backgroundColor: COLORS.amber, alignItems:'center', justifyContent:'center' },
  avatarText: { color: COLORS.navy, fontWeight:'900', fontSize:16 },

  hero: { paddingHorizontal:20, paddingTop:24, paddingBottom:32 },
  heroBadge: { flexDirection:'row', alignItems:'center', backgroundColor:'rgba(255,255,255,0.08)', borderWidth:1, borderColor:'rgba(255,255,255,0.12)', borderRadius:100, paddingHorizontal:14, paddingVertical:6, alignSelf:'flex-start', marginBottom:20 },
  heroDot: { width:7, height:7, borderRadius:4, backgroundColor: COLORS.amber, marginRight:8 },
  heroBadgeText: { color:'rgba(255,255,255,0.7)', fontSize:10, fontWeight:'700', letterSpacing:1 },
  heroTitle: { color:'white', fontSize:38, fontWeight:'900', lineHeight:44 },
  heroTitleAmber: { color: COLORS.amber, fontSize:38, fontWeight:'900', lineHeight:44, marginBottom:16 },
  heroSub: { color:'rgba(255,255,255,0.6)', fontSize:14, lineHeight:22, marginBottom:24 },
  heroActions: { flexDirection:'row', gap:12, marginBottom:28 },
  bookBtn: { flex:1, backgroundColor: COLORS.amber, paddingVertical:14, borderRadius:14, alignItems:'center' },
  bookBtnText: { color: COLORS.navy, fontWeight:'800', fontSize:14 },
  howBtn: { flex:1, backgroundColor:'rgba(255,255,255,0.08)', borderWidth:1, borderColor:'rgba(255,255,255,0.15)', paddingVertical:14, borderRadius:14, alignItems:'center' },
  howBtnText: { color:'white', fontWeight:'700', fontSize:14 },
  statsRow: { flexDirection:'row', justifyContent:'space-between' },
  statItem: { alignItems:'center' },
  statVal: { color:'white', fontSize:22, fontWeight:'900' },
  statLabel: { color:'rgba(255,255,255,0.45)', fontSize:11, marginTop:2 },

  section: { paddingHorizontal:20, paddingVertical:36, backgroundColor:'white' },
  sectionDark: { backgroundColor: COLORS.navyLight },
  sectionLabel: { fontSize:10, fontWeight:'800', letterSpacing:2, color: COLORS.amber, marginBottom:8 },
  sectionTitle: { fontSize:26, fontWeight:'900', color: COLORS.navy, marginBottom:24, lineHeight:32 },

  servicesGrid: { flexDirection:'row', flexWrap:'wrap', gap:12 },
  serviceCard: { width:(width-52)/2, backgroundColor:'white', borderRadius:16, padding:16, borderWidth:1, borderColor:'#F1F5F9' },
  serviceIconWrap: { width:48, height:48, borderRadius:14, alignItems:'center', justifyContent:'center', marginBottom:10 },
  serviceIcon: { fontSize:24 },
  serviceName: { fontSize:14, fontWeight:'800', color: COLORS.navy, marginBottom:4 },
  serviceDesc: { fontSize:11, color: COLORS.gray, lineHeight:16, marginBottom:10 },
  serviceFooter: { flexDirection:'row', justifyContent:'space-between', alignItems:'center' },
  servicePriceBadge: { paddingHorizontal:8, paddingVertical:3, borderRadius:100 },
  servicePrice: { fontSize:11, fontWeight:'700' },
  serviceArrow: { fontSize:16, fontWeight:'700' },

  stepRow: { flexDirection:'row', alignItems:'flex-start', marginBottom:20 },
  stepNum: { width:40, height:40, borderRadius:20, backgroundColor: COLORS.amber, alignItems:'center', justifyContent:'center', marginRight:16 },
  stepNumText: { color: COLORS.navy, fontWeight:'900', fontSize:16 },
  stepInfo: { flex:1 },
  stepTitle: { color:'white', fontSize:15, fontWeight:'800', marginBottom:4 },
  stepDesc: { color:'rgba(255,255,255,0.5)', fontSize:13, lineHeight:19 },

  reviewsScroll: { marginHorizontal:-20, paddingLeft:20 },
  reviewCard: { width:width*0.75, backgroundColor:'white', borderRadius:16, padding:18, marginRight:14, borderWidth:1, borderColor:'#F1F5F9' },
  reviewStars: { fontSize:14, marginBottom:10 },
  reviewText: { color: COLORS.navy, fontSize:13, lineHeight:20, fontStyle:'italic', marginBottom:14 },
  reviewFooter: { flexDirection:'row', alignItems:'center', gap:10 },
  reviewAvatar: { width:36, height:36, borderRadius:18, backgroundColor: COLORS.amber, alignItems:'center', justifyContent:'center' },
  reviewAvatarText: { color: COLORS.navy, fontWeight:'900', fontSize:14 },
  reviewName: { color: COLORS.navy, fontWeight:'700', fontSize:13 },
  reviewService: { color: COLORS.gray, fontSize:11 },

  cta: { backgroundColor: COLORS.amber, padding:32, alignItems:'center' },
  ctaTitle: { color: COLORS.navy, fontSize:26, fontWeight:'900', marginBottom:8 },
  ctaSub: { color: COLORS.navy, fontSize:14, opacity:0.7, marginBottom:20 },
  ctaBtn: { backgroundColor: COLORS.navy, paddingHorizontal:28, paddingVertical:14, borderRadius:14 },
  ctaBtnText: { color:'white', fontWeight:'800', fontSize:14 },

  footer: { backgroundColor:'#060F22', padding:24, alignItems:'center' },
  footerLogo: { color:'white', fontSize:18, fontWeight:'900', marginBottom:8 },
  footerText: { color:'rgba(255,255,255,0.4)', fontSize:12, marginBottom:4, textAlign:'center' },
  footerCopy: { color:'rgba(255,255,255,0.2)', fontSize:11, marginTop:12 },
})
