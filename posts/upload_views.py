from rest_framework import status
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.core.files.storage import default_storage
from django.core.files.base import ContentFile
from PIL import Image
import uuid
import os

@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def upload_image(request):
    """Upload image for posts"""
    if 'image' not in request.FILES:
        return Response({"error": "No image provided"}, status=status.HTTP_400_BAD_REQUEST)
    
    image_file = request.FILES['image']
    
    # Validate file type
    allowed_types = ['image/jpeg', 'image/png', 'image/jpg']
    if image_file.content_type not in allowed_types:
        return Response({"error": "Only JPEG and PNG images are allowed"}, status=status.HTTP_400_BAD_REQUEST)
    
    # Validate file size (2MB max)
    if image_file.size > 2 * 1024 * 1024:
        return Response({"error": "Image size must be less than 2MB"}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Validate image
        img = Image.open(image_file)
        img.verify()
        
        # Generate unique filename
        file_extension = os.path.splitext(image_file.name)[1]
        filename = f"posts/{uuid.uuid4()}{file_extension}"
        
        # Save file locally (in production, use Supabase Storage)
        file_path = default_storage.save(filename, ContentFile(image_file.read()))
        file_url = default_storage.url(file_path)
        
        return Response({
            "image_url": request.build_absolute_uri(file_url),
            "message": "Image uploaded successfully"
        }, status=status.HTTP_201_CREATED)
        
    except Exception as e:
        return Response({"error": "Invalid image file"}, status=status.HTTP_400_BAD_REQUEST)