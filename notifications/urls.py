from django.urls import path
from .views import NotificationListView, mark_notification_read, mark_all_notifications_read, unread_count, mark_notifications_seen

urlpatterns = [
    path('', NotificationListView.as_view(), name='notification_list'),
    path('unread-count/', unread_count, name='unread_count'),
    path('mark-seen/', mark_notifications_seen, name='mark_notifications_seen'),
    path('<int:notification_id>/read/', mark_notification_read, name='mark_notification_read'),
    path('mark-all-read/', mark_all_notifications_read, name='mark_all_notifications_read'),
]