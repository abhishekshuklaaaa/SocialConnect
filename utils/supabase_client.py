from supabase import create_client, Client
from django.conf import settings
import os

def get_supabase_client() -> Client:
    """Get Supabase client instance"""
    url = settings.SUPABASE_URL
    key = settings.SUPABASE_KEY
    
    if not url or not key:
        raise ValueError("Supabase URL and Key must be configured")
    
    return create_client(url, key)

def upload_file_to_supabase(file, bucket_name: str, file_path: str):
    """Upload file to Supabase Storage"""
    try:
        supabase = get_supabase_client()
        
        # Upload file
        response = supabase.storage.from_(bucket_name).upload(
            file_path, 
            file.read()
        )
        
        if response.status_code == 200:
            # Get public URL
            public_url = supabase.storage.from_(bucket_name).get_public_url(file_path)
            return public_url
        else:
            raise Exception(f"Upload failed: {response.text}")
            
    except Exception as e:
        raise Exception(f"Supabase upload error: {str(e)}")

def delete_file_from_supabase(bucket_name: str, file_path: str):
    """Delete file from Supabase Storage"""
    try:
        supabase = get_supabase_client()
        response = supabase.storage.from_(bucket_name).remove([file_path])
        return response.status_code == 200
    except Exception as e:
        print(f"Supabase delete error: {str(e)}")
        return False