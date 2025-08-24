from django.urls import path
from .admin_views import (
    AdminUserListView, AdminUserDetailView, deactivate_user,
    AdminPostListView, admin_delete_post, admin_stats
)

urlpatterns = [
    path('users/', AdminUserListView.as_view(), name='admin_user_list'),
    path('users/<int:pk>/', AdminUserDetailView.as_view(), name='admin_user_detail'),
    path('users/<int:user_id>/deactivate/', deactivate_user, name='admin_deactivate_user'),
    path('posts/', AdminPostListView.as_view(), name='admin_post_list'),
    path('posts/<int:post_id>/delete/', admin_delete_post, name='admin_delete_post'),
    path('stats/', admin_stats, name='admin_stats'),
]