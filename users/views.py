from rest_framework import generics, status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from django.shortcuts import get_object_or_404
from .models import Follow
from .serializers import UserSerializer, UserProfileUpdateSerializer, FollowSerializer
from notifications.models import Notification

User = get_user_model()

class UserProfileView(generics.RetrieveAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]

class UserProfileUpdateView(generics.UpdateAPIView):
    serializer_class = UserProfileUpdateSerializer
    permission_classes = [IsAuthenticated]
    
    def get_object(self):
        return self.request.user

@api_view(['POST', 'DELETE'])
@permission_classes([IsAuthenticated])
def follow_user(request, user_id):
    user_to_follow = get_object_or_404(User, id=user_id)
    
    if user_to_follow == request.user:
        return Response({"error": "Cannot follow yourself"}, status=status.HTTP_400_BAD_REQUEST)
    
    if request.method == 'POST':
        follow, created = Follow.objects.get_or_create(
            follower=request.user,
            following=user_to_follow
        )
        
        if created:
            # Create notification
            Notification.objects.create(
                recipient=user_to_follow,
                sender=request.user,
                notification_type='follow',
                message=f'{request.user.username} started following you'
            )
            return Response({"message": "Successfully followed user"}, status=status.HTTP_201_CREATED)
        else:
            return Response({"message": "Already following this user"}, status=status.HTTP_200_OK)
    
    elif request.method == 'DELETE':
        try:
            follow = Follow.objects.get(follower=request.user, following=user_to_follow)
            follow.delete()
            return Response({"message": "Successfully unfollowed user"}, status=status.HTTP_200_OK)
        except Follow.DoesNotExist:
            return Response({"error": "Not following this user"}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_followers(request, user_id):
    user = get_object_or_404(User, id=user_id)
    followers = Follow.objects.filter(following=user)
    serializer = FollowSerializer(followers, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_following(request, user_id):
    user = get_object_or_404(User, id=user_id)
    following = Follow.objects.filter(follower=user)
    serializer = FollowSerializer(following, many=True)
    return Response(serializer.data)

class UserListView(generics.ListAPIView):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        # Only admins can see all users
        if self.request.user.role == 'admin':
            return User.objects.all()
        # Regular users can search for users
        search = self.request.query_params.get('search', '')
        if search:
            return User.objects.filter(
                username__icontains=search
            )[:10]
        return User.objects.none()
