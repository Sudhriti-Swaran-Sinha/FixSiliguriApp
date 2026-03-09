import React, { useState } from 'react'
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput, StatusBar, Alert } from 'react-native'
import { COLORS, SERVICES, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

const TIME_SLOTS = ['8:00 AM','9:00 AM','10:00 AM','11:00 AM','12:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM']

function getNext7Days() {
  const days = [], today = new Date()
  const D = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat']
  const M = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']
  for (let i=1; i<=7; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() + i)
    days.push({ label:`${D[d.getDay()]} ${d.getDate()} ${M[d.getMonth()]}`, full:d.toDateString() })
  }
  return days
}

export default function BookingScreen({ route, navigation }) {
  const { user, addBooking } = useAuth()
  const preservice = route.params?.service || null
  const [step, setStep] = useState(preservice ? 2 : 1)
  const [form, setForm] = useState({
    service: preservice,
    date: null, time: null,
    name: user?.name||'', phone: user?.phone||'', email: user?.email||'',
    address:'', pincode:''
  })
  const [errors, setErrors] = useState({})
  const [submitting, setSubmitting] = useState(false)
  const [bookingId] = useState('FS' + Math.floor(10000 + Math.random()*90000))
  const days = getNext7Days()
  const set = (k,v) => { setForm(f=>({...f,[k]:v})); setErrors(e=>({...e,[k]:''})) }

  const validateStep2 = () => {
    const e = {}
    if (!form.date) e.date = 'Select a date'
    if (!form.time) e.time = 'Select a time'
    if (Object.keys(e).length) { setErrors(e); return false }
    return true
  }

  const validateStep3 = () => {
    const e = {}
    if (!form.name) e.name = 'Required'
    if (!form.phone || form.phone.length < 10) e.phone = 'Valid phone required'
    if (!form.address) e.address = 'Required'
    if (Object.keys(e).length) { setErrors(e); return false }
    return true
  }

  const confirm = async () => {
    if (!validateStep3()) return
    setSubmitting(true)
    const booking = {
      id: bookingId,
      service: form.service.name,
      serviceIcon: form.service.icon,
      price: form.service.price,
      date: form.date,
      time: form.time,
      name: form.name,
      phone: form.phone,
      email: form.email || user?.email || '',
      address: form.address,
      pincode: form.pincode,
      status: 'Pending',
      provider: null,
      bookedAt: new Date().toISOString(),
    }
    await addBooking(booking)
    setSubmitting(false)
    setStep(4)
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => step > 1 ? setStep(s=>s-1) : navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>←</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book a Service</Text>
      </View>

      {/* Progress */}
      {step < 4 && (
        <View style={styles.progress}>
          {['Service','Date & Time','Your Details'].map((l,i) => (
            <View key={l} style={styles.progressItem}>
              <View style={[styles.progressDot, step>i+1 && styles.progressDone, step===i+1 && styles.progressActive]}>
                <Text style={[styles.progressNum, (step>i+1||step===i+1) && styles.progressNumActive]}>{step>i+1?'✓':i+1}</Text>
              </View>
              <Text style={[styles.progressLabel, step===i+1 && styles.progressLabelActive]}>{l}</Text>
              {i<2 && <View style={[styles.progressLine, step>i+1 && styles.progressLineDone]} />}
            </View>
          ))}
        </View>
      )}

      <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">

        {/* ── STEP 1: Choose Service ── */}
        {step===1 && (
          <View>
            <Text style={styles.stepTitle}>What do you need help with?</Text>
            <View style={styles.servicesGrid}>
              {SERVICES.map(s => (
                <TouchableOpacity key={s.name} style={[styles.serviceOption, form.service?.name===s.name && styles.serviceSelected]} onPress={() => set('service', s)}>
                  <Text style={styles.serviceOptIcon}>{s.icon}</Text>
                  <Text style={styles.serviceOptName}>{s.name}</Text>
                  <Text style={styles.serviceOptPrice}>₹{s.price}+</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={[styles.nextBtn, !form.service && styles.nextBtnDisabled]} onPress={() => form.service && setStep(2)} disabled={!form.service}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Date & Time ── */}
        {step===2 && (
          <View>
            <Text style={styles.stepTitle}>Pick a date & time</Text>
            <View style={[styles.selectedService, { backgroundColor: form.service?.bg }]}>
              <Text style={styles.selectedServiceIcon}>{form.service?.icon}</Text>
              <View>
                <Text style={[styles.selectedServiceName, { color: form.service?.color }]}>{form.service?.name}</Text>
                <Text style={styles.selectedServicePrice}>Starting from ₹{form.service?.price}</Text>
              </View>
            </View>
            <Text style={styles.fieldLabel}>Select Date</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.datesScroll}>
              {days.map(d => (
                <TouchableOpacity key={d.full} style={[styles.dateChip, form.date===d.full && styles.dateChipActive]} onPress={() => set('date', d.full)}>
                  <Text style={[styles.dateChipText, form.date===d.full && styles.dateChipTextActive]}>{d.label}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
            {errors.date && <Text style={styles.error}>{errors.date}</Text>}
            <Text style={styles.fieldLabel}>Select Time</Text>
            <View style={styles.timesGrid}>
              {TIME_SLOTS.map(t => (
                <TouchableOpacity key={t} style={[styles.timeChip, form.time===t && styles.timeChipActive]} onPress={() => set('time', t)}>
                  <Text style={[styles.timeChipText, form.time===t && styles.timeChipTextActive]}>{t}</Text>
                </TouchableOpacity>
              ))}
            </View>
            {errors.time && <Text style={styles.error}>{errors.time}</Text>}
            <TouchableOpacity style={styles.nextBtn} onPress={() => validateStep2() && setStep(3)}>
              <Text style={styles.nextBtnText}>Next →</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 3: Details ── */}
        {step===3 && (
          <View>
            <Text style={styles.stepTitle}>Your contact details</Text>
            {[
              { key:'name', label:'Full Name', placeholder:'Your full name', keyboard:'default' },
              { key:'phone', label:'Phone Number', placeholder:'+91 XXXXX XXXXX', keyboard:'phone-pad' },
              { key:'email', label:'Email (optional)', placeholder:'your@email.com', keyboard:'email-address' },
              { key:'address', label:'Service Address', placeholder:'House no, street, area, Siliguri', keyboard:'default' },
              { key:'pincode', label:'Pincode', placeholder:'734001', keyboard:'number-pad' },
            ].map(({ key, label, placeholder, keyboard }) => (
              <View key={key} style={styles.fieldWrap}>
                <Text style={styles.fieldLabel}>{label}</Text>
                <TextInput
                  style={[styles.input, errors[key] && styles.inputError]}
                  value={form[key]} onChangeText={v => set(key, v)}
                  placeholder={placeholder} placeholderTextColor="#94A3B8"
                  keyboardType={keyboard} autoCapitalize="none"
                  multiline={key==='address'}
                />
                {errors[key] && <Text style={styles.error}>{errors[key]}</Text>}
              </View>
            ))}
            <View style={styles.summaryCard}>
              <Text style={styles.summaryTitle}>Booking Summary</Text>
              {[
                ['Service', `${form.service?.icon} ${form.service?.name}`],
                ['Date', form.date],
                ['Time', form.time],
                ['Est. Cost', `₹${form.service?.price}+`],
              ].map(([k,v]) => (
                <View key={k} style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>{k}</Text>
                  <Text style={styles.summaryVal}>{v}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={confirm} disabled={submitting}>
              <Text style={styles.nextBtnText}>{submitting ? 'Confirming...' : '✅ Confirm Booking'}</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 4: Confirmed ── */}
        {step===4 && (
          <View style={styles.confirmed}>
            <Text style={styles.confirmedIcon}>🎉</Text>
            <Text style={styles.confirmedTitle}>Booking Confirmed!</Text>
            <Text style={styles.confirmedId}>Booking ID: #{bookingId}</Text>
            <Text style={styles.confirmedSub}>Our team will contact you shortly to confirm your appointment.</Text>
            <View style={styles.confirmedDetails}>
              {[
                ['Service', `${form.service?.icon} ${form.service?.name}`],
                ['Date', form.date],
                ['Time', form.time],
                ['Address', form.address],
                ['Est. Cost', `₹${form.service?.price}+`],
              ].map(([k,v]) => (
                <View key={k} style={styles.summaryRow}>
                  <Text style={styles.summaryKey}>{k}</Text>
                  <Text style={styles.summaryVal}>{v}</Text>
                </View>
              ))}
            </View>
            <TouchableOpacity style={styles.nextBtn} onPress={() => navigation.navigate('MyBookings')}>
              <Text style={styles.nextBtnText}>View My Bookings →</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.homeBtn} onPress={() => navigation.navigate('Home')}>
              <Text style={styles.homeBtnText}>Back to Home</Text>
            </TouchableOpacity>
          </View>
        )}
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
  progress: { flexDirection:'row', alignItems:'center', backgroundColor:'white', paddingHorizontal:20, paddingVertical:14, borderBottomWidth:1, borderBottomColor:'#F1F5F9' },
  progressItem: { flexDirection:'row', alignItems:'center', flex:1 },
  progressDot: { width:28, height:28, borderRadius:14, backgroundColor:'#E2E8F0', alignItems:'center', justifyContent:'center', marginRight:6 },
  progressActive: { backgroundColor: COLORS.amber },
  progressDone: { backgroundColor: COLORS.green },
  progressNum: { color:'#94A3B8', fontSize:12, fontWeight:'800' },
  progressNumActive: { color:'white' },
  progressLabel: { color:'#94A3B8', fontSize:10, fontWeight:'600', flex:1 },
  progressLabelActive: { color: COLORS.navy, fontWeight:'800' },
  progressLine: { flex:1, height:2, backgroundColor:'#E2E8F0', marginHorizontal:4 },
  progressLineDone: { backgroundColor: COLORS.green },
  body: { padding:20, paddingBottom:40 },
  stepTitle: { fontSize:20, fontWeight:'900', color: COLORS.navy, marginBottom:20 },
  servicesGrid: { flexDirection:'row', flexWrap:'wrap', gap:12, marginBottom:24 },
  serviceOption: { width:'47%', backgroundColor:'white', borderRadius:14, padding:14, alignItems:'center', borderWidth:1.5, borderColor:'#E2E8F0' },
  serviceSelected: { borderColor: COLORS.amber, backgroundColor:'#FFFBEB' },
  serviceOptIcon: { fontSize:28, marginBottom:6 },
  serviceOptName: { fontSize:13, fontWeight:'800', color: COLORS.navy, marginBottom:2 },
  serviceOptPrice: { fontSize:11, color: COLORS.amber, fontWeight:'700' },
  selectedService: { flexDirection:'row', alignItems:'center', gap:12, padding:14, borderRadius:14, marginBottom:20 },
  selectedServiceIcon: { fontSize:28 },
  selectedServiceName: { fontSize:15, fontWeight:'800' },
  selectedServicePrice: { fontSize:12, color: COLORS.gray, marginTop:2 },
  fieldLabel: { fontSize:13, fontWeight:'700', color: COLORS.navy, marginBottom:8, marginTop:4 },
  datesScroll: { marginBottom:8, marginHorizontal:-4 },
  dateChip: { paddingHorizontal:14, paddingVertical:10, backgroundColor:'white', borderRadius:12, marginHorizontal:4, borderWidth:1.5, borderColor:'#E2E8F0' },
  dateChipActive: { backgroundColor: COLORS.amber, borderColor: COLORS.amber },
  dateChipText: { color: COLORS.navy, fontSize:12, fontWeight:'700' },
  dateChipTextActive: { color: COLORS.navy },
  timesGrid: { flexDirection:'row', flexWrap:'wrap', gap:10, marginBottom:8 },
  timeChip: { paddingHorizontal:14, paddingVertical:10, backgroundColor:'white', borderRadius:12, borderWidth:1.5, borderColor:'#E2E8F0' },
  timeChipActive: { backgroundColor: COLORS.navy, borderColor: COLORS.navy },
  timeChipText: { color: COLORS.navy, fontSize:12, fontWeight:'700' },
  timeChipTextActive: { color:'white' },
  fieldWrap: { marginBottom:14 },
  input: { backgroundColor:'white', borderWidth:1.5, borderColor:'#E2E8F0', borderRadius:12, padding:14, fontSize:14, color: COLORS.navy },
  inputError: { borderColor: COLORS.red },
  error: { color: COLORS.red, fontSize:11, marginTop:4 },
  summaryCard: { backgroundColor:'white', borderRadius:14, padding:16, marginVertical:16, borderWidth:1, borderColor:'#F1F5F9' },
  summaryTitle: { fontSize:13, fontWeight:'800', color: COLORS.navy, marginBottom:12 },
  summaryRow: { flexDirection:'row', justifyContent:'space-between', paddingVertical:6, borderBottomWidth:1, borderBottomColor:'#F8FAFC' },
  summaryKey: { color: COLORS.gray, fontSize:13 },
  summaryVal: { color: COLORS.navy, fontSize:13, fontWeight:'700' },
  nextBtn: { backgroundColor: COLORS.amber, paddingVertical:15, borderRadius:14, alignItems:'center', marginTop:8 },
  nextBtnDisabled: { opacity:0.5 },
  nextBtnText: { color: COLORS.navy, fontWeight:'800', fontSize:15 },
  homeBtn: { backgroundColor:'white', paddingVertical:13, borderRadius:14, alignItems:'center', marginTop:12, borderWidth:1.5, borderColor:'#E2E8F0' },
  homeBtnText: { color: COLORS.navy, fontWeight:'700', fontSize:14 },
  confirmed: { alignItems:'center', paddingTop:20 },
  confirmedIcon: { fontSize:64, marginBottom:16 },
  confirmedTitle: { fontSize:26, fontWeight:'900', color: COLORS.navy, marginBottom:8 },
  confirmedId: { fontSize:14, color: COLORS.amber, fontWeight:'700', marginBottom:8 },
  confirmedSub: { color: COLORS.gray, fontSize:13, textAlign:'center', lineHeight:20, marginBottom:20 },
  confirmedDetails: { backgroundColor:'white', borderRadius:14, padding:16, width:'100%', marginBottom:20, borderWidth:1, borderColor:'#F1F5F9' },
})
