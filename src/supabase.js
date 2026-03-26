import { createClient } from '@supabase/supabase-js'

const SUPABASE_URL = 'https://qcgrnxzmyykwnidpjqbc.supabase.co'
const SUPABASE_ANON_KEY = 'sb_publishable_zPzgQ7p4LmbAnvfrKIUFPQ_FE6y2NNx'

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
