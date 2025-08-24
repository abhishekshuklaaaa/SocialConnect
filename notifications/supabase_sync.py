import requests
from django.conf import settings

def sync_to_supabase(notification):
    """Sync notification to Supabase for real-time"""
    try:
        supabase_url = getattr(settings, 'SUPABASE_URL', None)
        supabase_key = getattr(settings, 'SUPABASE_SERVICE_KEY', None)
        
        if not supabase_url or not supabase_key:
            print("Supabase credentials not configured")
            return
            
        url = f"{supabase_url}/rest/v1/notifications_notification"
        headers = {
            'apikey': supabase_key,
            'Authorization': f'Bearer {supabase_key}',
            'Content-Type': 'application/json',
            'Prefer': 'return=minimal'
        }
        
        data = {
            'recipient_id': notification.recipient.id,
            'sender_id': notification.sender.id if notification.sender else None,
            'notification_type': notification.notification_type,
            'post_id': notification.post.id if notification.post else None,
            'message': notification.message,
            'is_read': notification.is_read,
            'created_at': notification.created_at.isoformat()
        }
        
        response = requests.post(url, json=data, headers=headers, timeout=10)
        if response.status_code in [200, 201]:
            print(f"SUCCESS: Notification synced to Supabase: {notification.notification_type}")
        else:
            print(f"ERROR: Supabase sync failed: {response.status_code} - {response.text}")
        
    except Exception as e:
        print(f"ERROR: Supabase sync error: {e}")