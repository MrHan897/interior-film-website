import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://temp.supabase.co'
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'temp_anon_key'

if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
  console.error('Supabase 환경 변수가 설정되지 않았습니다.')
  console.error('NEXT_PUBLIC_SUPABASE_URL:', process.env.NEXT_PUBLIC_SUPABASE_URL)
  console.error('NEXT_PUBLIC_SUPABASE_ANON_KEY:', process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY ? '설정됨' : '설정되지 않음')
}

export const supabase = createClient(supabaseUrl, supabaseKey)

export interface BookingRecord {
  id?: string
  building_type: string
  area_size: string
  home_condition: string
  reason: string
  spaces: string[]
  budget: string
  timeline: string
  consult_date: string
  consult_time: string
  customer_name: string
  customer_phone: string
  customer_address: string
  customer_requirements: string
  privacy_consent: boolean
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled'
  created_at?: string
  updated_at?: string
}