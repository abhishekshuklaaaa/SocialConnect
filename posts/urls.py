from django.urls import path
from .views import (
    PostListCreateView, PostDetailView, like_post, like_status,
    PostCommentsView, CommentDetailView, feed_view
)
from .upload_views import upload_image

urlpatterns = [
    path('', PostListCreateView.as_view(), name='post_list_create'),
    path('<int:pk>/', PostDetailView.as_view(), name='post_detail'),
    path('<int:post_id>/like/', like_post, name='like_post'),
    path('<int:post_id>/like-status/', like_status, name='like_status'),
    path('<int:post_id>/comments/', PostCommentsView.as_view(), name='post_comments'),
    path('comments/<int:pk>/', CommentDetailView.as_view(), name='comment_detail'),
    path('feed/', feed_view, name='feed'),
    path('upload-image/', upload_image, name='upload_image'),
]