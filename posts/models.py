from django.db import models
from django.conf import settings

class Post(models.Model):
    CATEGORY_CHOICES = [
        ('general', 'General'),
        ('announcement', 'Announcement'),
        ('question', 'Question'),
    ]
    
    content = models.TextField(max_length=280)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    image_url = models.URLField(blank=True)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='general')
    is_active = models.BooleanField(default=True)
    like_count = models.PositiveIntegerField(default=0)
    comment_count = models.PositiveIntegerField(default=0)
    
    class Meta:
        ordering = ['-created_at']
        
    def __str__(self):
        return f'{self.author.username}: {self.content[:50]}'

class Like(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        unique_together = ('user', 'post')
        
    def __str__(self):
        return f'{self.user.username} likes {self.post.id}'

class Comment(models.Model):
    content = models.TextField(max_length=200)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    post = models.ForeignKey(Post, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    is_active = models.BooleanField(default=True)
    
    class Meta:
        ordering = ['created_at']
        
    def __str__(self):
        return f'{self.author.username}: {self.content[:30]}'
