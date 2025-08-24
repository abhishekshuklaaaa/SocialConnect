from django.urls import path
from .views import (
    UserProfileView, UserProfileUpdateView, follow_user,
    user_followers, user_following, UserListView
)

urlpatterns = [
    path('', UserListView.as_view(), name='user_list'),
    path('me/', UserProfileUpdateView.as_view(), name='user_profile_update'),
    path('<int:pk>/', UserProfileView.as_view(), name='user_profile'),
    path('<int:user_id>/follow/', follow_user, name='follow_user'),
    path('<int:user_id>/followers/', user_followers, name='user_followers'),
    path('<int:user_id>/following/', user_following, name='user_following'),
]