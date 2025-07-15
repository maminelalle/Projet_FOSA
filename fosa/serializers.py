# fosa/serializers.py
from rest_framework import serializers
from .models import FOSA

class FOSASerializer(serializers.ModelSerializer):
    class Meta:
        model = FOSA
        fields = '__all__'
