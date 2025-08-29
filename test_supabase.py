#!/usr/bin/env python
import os
from dotenv import load_dotenv

load_dotenv()

try:
    from supabase import create_client, Client
    
    url = os.getenv('SUPABASE_URL')
    key = os.getenv('SUPABASE_KEY')
    
    print(f"Supabase URL: {url}")
    print(f"Supabase Key: {key[:20]}...")
    
    supabase: Client = create_client(url, key)
    
    # Test connection
    response = supabase.table('test').select('*').limit(1).execute()
    print("✅ Supabase connection successful!")
    
except Exception as e:
    print(f"❌ Supabase connection failed: {e}")