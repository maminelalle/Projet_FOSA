from rest_framework import serializers
from .models import FOSA, FOSAHistory
from django.contrib.auth.models import User

class FOSASerializer(serializers.ModelSerializer):
    class Meta:
        model = FOSA
        fields = '__all__'

class FOSAHistorySerializer(serializers.ModelSerializer):
    fosa_id = serializers.ReadOnlyField(source='fosa.id')
    fosa_nom_fr = serializers.ReadOnlyField(source='fosa.nom_fr')
    fosa_nom_ar = serializers.ReadOnlyField(source='fosa.nom_ar')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = FOSAHistory
        fields = ['id', 'fosa_id', 'fosa_nom_fr', 'fosa_nom_ar',
                  'username', 'action', 'changes', 'timestamp']
