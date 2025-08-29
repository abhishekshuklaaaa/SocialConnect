import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://nrlrzzpeirhmfrtnggon.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im5ybHJ6enBlaXJobWZydG5nZ29uIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTYwNDQ5OTYsImV4cCI6MjA3MTYyMDk5Nn0.OemMSSneH5gUaMU00HipAC_WPoP2IF9Sd-zs8JA6O2c'

export const supabase = createClient(supabaseUrl, supabaseKey)