from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from django.contrib.auth.password_validation import validate_password
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer

User = get_user_model()

class UserRegistrationSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True, validators=[validate_password])
    password_confirm = serializers.CharField(write_only=True)
    
    class Meta:
        model = User
        fields = ['email', 'username', 'password', 'password_confirm', 'first_name', 'last_name']
        
    def validate(self, attrs):
        if attrs['password'] != attrs['password_confirm']:
            raise serializers.ValidationError("Passwords don't match")
        return attrs
    
    def validate_username(self, value):
        if len(value) < 3 or len(value) > 30:
            raise serializers.ValidationError("Username must be between 3-30 characters")
        if not value.replace('_', '').isalnum():
            raise serializers.ValidationError("Username can only contain letters, numbers, and underscores")
        return value
    
    def create(self, validated_data):
        validated_data.pop('password_confirm')
        user = User.objects.create_user(**validated_data)
        return user

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    username_field = 'login'
    
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self.fields['login'] = serializers.CharField()
        self.fields.pop('username', None)
    
    def validate(self, attrs):
        login = attrs.get('login')
        password = attrs.get('password')
        
        user = authenticate(request=self.context.get('request'), username=login, password=password)
            
        if not user:
            raise serializers.ValidationError('Invalid credentials')
            
        attrs['username'] = user.email
        return super().validate(attrs)

class ChangePasswordSerializer(serializers.Serializer):
    old_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, validators=[validate_password])
    
    def validate_old_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError("Old password is incorrect")
        return value