export const COLORS = {
  navy:       '#0B1B3A',
  navyLight:  '#122248',
  blue:       '#1560BD',
  blueBright: '#2174E8',
  amber:      '#F59E0B',
  amberLight: '#FCD34D',
  white:      '#FFFFFF',
  offWhite:   '#F8F9FC',
  gray:       '#64748B',
  grayLight:  '#E2E8F0',
  green:      '#10B981',
  red:        '#EF4444',
  card:       '#FFFFFF',
  bg:         '#F8F9FC',
}

export const FONTS = {
  regular:  'System',
  medium:   'System',
  bold:     'System',
  display:  'System',
}

export const SHADOW = {
  small: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  medium: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 16,
    elevation: 6,
  },
  large: {
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 24,
    elevation: 10,
  },
}

export const SERVICES = [
  { icon:'⚡', name:'Electrician', price:299, desc:'Fan installation, wiring, switchboard repair.',       bg:'#EEF4FF', color:'#2174E8' },
  { icon:'🚿', name:'Plumber',     price:249, desc:'Pipe leaks, tap repairs, bathroom fittings.',          bg:'#E0F7FF', color:'#0369A1' },
  { icon:'🎨', name:'Painter',     price:499, desc:'Interior & exterior painting, waterproofing.',         bg:'#FDF2F8', color:'#BE185D' },
  { icon:'🔨', name:'Carpenter',   price:349, desc:'Furniture repair, woodwork, door & window fitting.',   bg:'#FFFBEB', color:'#B45309' },
  { icon:'❄️', name:'AC Repair',   price:399, desc:'AC servicing, gas refilling, installation.',           bg:'#ECFEFF', color:'#0E7490' },
  { icon:'💧', name:'RO Repair',   price:299, desc:'Water purifier servicing, filter replacement.',        bg:'#F5F3FF', color:'#6D28D9' },
]

export const ADMIN_EMAIL    = 'admin@fixsiliguri.com'
export const ADMIN_PASSWORD = 'FixSiliguri@2025'

export const STATUS_COLORS = {
  'Pending':     { bg:'#FEF9C3', color:'#92400E' },
  'Confirmed':   { bg:'#DBEAFE', color:'#1D4ED8' },
  'In Progress': { bg:'#EDE9FE', color:'#6D28D9' },
  'Completed':   { bg:'#D1FAE5', color:'#065F46' },
  'Cancelled':   { bg:'#FEE2E2', color:'#991B1B' },
}
