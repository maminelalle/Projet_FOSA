# fosa/views.py
from rest_framework import viewsets, generics, status
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework.permissions import AllowAny
from rest_framework.serializers import ModelSerializer
from .models import FOSA
from .serializers import FOSASerializer
from django.db.models import Q


class FOSAViewSet(viewsets.ModelViewSet):
    queryset = FOSA.objects.all()
    serializer_class = FOSASerializer
    permission_classes = [AllowAny]
    
class RegisterSerializer(ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        user = User(username=validated_data['username'])
        user.set_password(validated_data['password'])
        user.save()
        return user

class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print("🚨 ERREURS REGISTER :", serializer.errors)
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        self.perform_create(serializer)
        return Response({"message": "Compte créé avec succès"}, status=status.HTTP_201_CREATED)




class FOSAList(generics.ListCreateAPIView):
    serializer_class = FOSASerializer

    def get_queryset(self):
        queryset = FOSA.objects.all()
        search_query = self.request.query_params.get('search', None)
        
        if search_query:
            queryset = queryset.filter(
                Q(nom__icontains=search_query) |
                Q(adresse__icontains=search_query) |
                Q(type__icontains=search_query)
            )
        return queryset