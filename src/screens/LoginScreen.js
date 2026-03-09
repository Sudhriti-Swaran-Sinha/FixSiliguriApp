import React, { useState } from 'react'
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView, StatusBar, Alert } from 'react-native'
import { COLORS, SHADOW } from '../theme'
import { useAuth } from '../context/AuthContext'

export default function LoginScreen({ navigation }) {
  const { login } = useAuth()
  const [tab, setTab] = useState('login')
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'' })
  const [loading, setLoading] = useState(false)
  const [errors, setErrors] = useState({})

  const set = (k, v) => { setForm(f => ({...f, [k]:v})); setErrors(e => ({...e, [k]:''})) }

  const handleLogin = async () => {
    const e = {}
    if (!form.email) e.email = 'Required'
    if (!form.password) e.password = 'Required'
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    const res = await login(form.email.trim(), form.password)
    setLoading(false)
    if (res.success) navigation.goBack()
    else Alert.alert('Login Failed', res.error)
  }

  const { signup } = useAuth()
  const handleSignup = async () => {
    const e = {}
    if (!form.name) e.name = 'Required'
    if (!form.email) e.email = 'Required'
    if (!form.phone) e.phone = 'Required'
    if (!form.password || form.password.length < 6) e.password = 'Min 6 characters'
    if (Object.keys(e).length) { setErrors(e); return }
    setLoading(true)
    const res = await signup(form.name.trim(), form.email.trim(), form.phone.trim(), form.password)
    setLoading(false)
    if (res.success) navigation.goBack()
    else Alert.alert('Signup Failed', res.error)
  }

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.navy} />
      <ScrollView contentContainerStyle={styles.scroll} keyboardShouldPersistTaps="handled">

        {/* Header */}
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>

        <View style={styles.logoWrap}>
          <Text style={styles.logoIcon}>🔧</Text>
          <Text style={styles.logoText}>Fix Siliguri</Text>
          <Text style={styles.logoSub}>Expert Home Services</Text>
        </View>

        {/* Tabs */}
        <View style={styles.tabs}>
          <TouchableOpacity style={[styles.tab, tab==='login' && styles.tabActive]} onPress={() => setTab('login')}>
            <Text style={[styles.tabText, tab==='login' && styles.tabTextActive]}>Login</Text>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.tab, tab==='signup' && styles.tabActive]} onPress={() => setTab('signup')}>
            <Text style={[styles.tabText, tab==='signup' && styles.tabTextActive]}>Sign Up</Text>
          </TouchableOpacity>
        </View>

        <View style={[styles.card, SHADOW.medium]}>
          {tab === 'login' ? (
            <>
              <Text style={styles.cardTitle}>Welcome back!</Text>
              <Text style={styles.cardSub}>Login to book services</Text>
              <Field label="Email" value={form.email} onChange={v=>set('email',v)} error={errors.email} keyboard="email-address" placeholder="your@email.com" />
              <Field label="Password" value={form.password} onChange={v=>set('password',v)} error={errors.password} secure placeholder="Your password" />
              <TouchableOpacity style={styles.submitBtn} onPress={handleLogin} disabled={loading}>
                <Text style={styles.submitText}>{loading ? 'Logging in...' : 'Login →'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('signup')}>
                <Text style={styles.switchText}>Don't have an account? <Text style={styles.switchLink}>Sign Up Free</Text></Text>
              </TouchableOpacity>
            </>
          ) : (
            <>
              <Text style={styles.cardTitle}>Create Account</Text>
              <Text style={styles.cardSub}>Join 500+ customers in Siliguri</Text>
              <Field label="Full Name" value={form.name} onChange={v=>set('name',v)} error={errors.name} placeholder="Your full name" />
              <Field label="Email" value={form.email} onChange={v=>set('email',v)} error={errors.email} keyboard="email-address" placeholder="your@email.com" />
              <Field label="Phone" value={form.phone} onChange={v=>set('phone',v)} error={errors.phone} keyboard="phone-pad" placeholder="+91 XXXXX XXXXX" />
              <Field label="Password" value={form.password} onChange={v=>set('password',v)} error={errors.password} secure placeholder="Min 6 characters" />
              <TouchableOpacity style={styles.submitBtn} onPress={handleSignup} disabled={loading}>
                <Text style={styles.submitText}>{loading ? 'Creating account...' : 'Sign Up Free →'}</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={() => setTab('login')}>
                <Text style={styles.switchText}>Already have an account? <Text style={styles.switchLink}>Login</Text></Text>
              </TouchableOpacity>
            </>
          )}
        </View>
      </ScrollView>
    </View>
  )
}

function Field({ label, value, onChange, error, secure, keyboard, placeholder }) {
  return (
    <View style={fStyles.wrap}>
      <Text style={fStyles.label}>{label}</Text>
      <TextInput
        style={[fStyles.input, error && fStyles.inputError]}
        value={value} onChangeText={onChange}
        secureTextEntry={secure} keyboardType={keyboard||'default'}
        placeholder={placeholder} placeholderTextColor="#94A3B8"
        autoCapitalize="none"
      />
      {error && <Text style={fStyles.error}>{error}</Text>}
    </View>
  )
}

const fStyles = StyleSheet.create({
  wrap: { marginBottom:16 },
  label: { color: COLORS.navy, fontSize:13, fontWeight:'700', marginBottom:6 },
  input: { backgroundColor:'#F8FAFC', borderWidth:1.5, borderColor:'#E2E8F0', borderRadius:12, padding:14, fontSize:14, color: COLORS.navy },
  inputError: { borderColor: COLORS.red },
  error: { color: COLORS.red, fontSize:11, marginTop:4 },
})

const styles = StyleSheet.create({
  root: { flex:1, backgroundColor: COLORS.navy },
  scroll: { paddingBottom:40 },
  backBtn: { paddingHorizontal:20, paddingTop:52, paddingBottom:8 },
  backText: { color:'rgba(255,255,255,0.6)', fontSize:14, fontWeight:'600' },
  logoWrap: { alignItems:'center', paddingVertical:24 },
  logoIcon: { fontSize:44, marginBottom:8 },
  logoText: { color:'white', fontSize:26, fontWeight:'900' },
  logoSub: { color:'rgba(255,255,255,0.45)', fontSize:13, marginTop:4 },
  tabs: { flexDirection:'row', marginHorizontal:20, backgroundColor:'rgba(255,255,255,0.08)', borderRadius:14, padding:4, marginBottom:20 },
  tab: { flex:1, paddingVertical:10, alignItems:'center', borderRadius:10 },
  tabActive: { backgroundColor: COLORS.amber },
  tabText: { color:'rgba(255,255,255,0.5)', fontWeight:'700', fontSize:14 },
  tabTextActive: { color: COLORS.navy },
  card: { marginHorizontal:20, backgroundColor:'white', borderRadius:20, padding:24 },
  cardTitle: { fontSize:22, fontWeight:'900', color: COLORS.navy, marginBottom:4 },
  cardSub: { color: COLORS.gray, fontSize:13, marginBottom:20 },
  submitBtn: { backgroundColor: COLORS.amber, paddingVertical:15, borderRadius:14, alignItems:'center', marginTop:8, marginBottom:16 },
  submitText: { color: COLORS.navy, fontWeight:'800', fontSize:15 },
  switchText: { textAlign:'center', color: COLORS.gray, fontSize:13 },
  switchLink: { color: COLORS.blueBright, fontWeight:'700' },
})
