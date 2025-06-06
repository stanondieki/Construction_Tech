from rest_framework import viewsets, permissions, status
from rest_framework.response import Response
from rest_framework.decorators import action
from django.contrib.auth import get_user_model
from .serializers import UserSerializer, UserCreateSerializer, UserDetailSerializer

User = get_user_model()

class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    
    def get_serializer_class(self):
        if self.action == 'create':
            return UserCreateSerializer
        elif self.action in ['retrieve', 'me']:
            return UserDetailSerializer
        return UserSerializer
    
    def get_permissions(self):
        if self.action == 'create':
            return [permissions.AllowAny()]
        return [permissions.IsAuthenticated()]
    
    @action(detail=False, methods=['get'])
    def me(self, request):
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)
    
    @action(detail=False, methods=['get'])
    def by_user_type(self, request):
        user_type = request.query_params.get('type')
        if not user_type:
            return Response({'error': 'User type parameter is required'}, status=status.HTTP_400_BAD_REQUEST)
            
        users = User.objects.filter(user_type=user_type)
        serializer = UserSerializer(users, many=True)
        return Response(serializer.data)
