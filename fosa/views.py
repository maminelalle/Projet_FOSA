from rest_framework import viewsets, permissions, serializers, generics, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.http import HttpResponse
from import_export import resources
from tablib import Dataset
from django.contrib.auth.models import User
from .models import FOSA, FOSAHistory
import logging

# Configuration du logger
logger = logging.getLogger(__name__)

class FOSASerializer(serializers.ModelSerializer):
    class Meta:
        model = FOSA
        fields = '__all__'
        extra_kwargs = {
            'code_etablissement': {'required': True},
            'nom_fr': {'required': True},
            'type': {'required': True},
            'longitude': {'required': True},
            'latitude': {'required': True},
            'adresse': {'required': True},
            'moughataa': {'required': True},
            'wilaya': {'required': True},
            'contact': {'required': True}
        }

    def validate(self, data):
        """Validation approfondie des données"""
        errors = {}
        
        if not data.get('code_etablissement'):
            errors['code_etablissement'] = "Ce champ est obligatoire"
        if not data.get('nom_fr'):
            errors['nom_fr'] = "Ce champ est obligatoire"
        if not data.get('type'):
            errors['type'] = "Ce champ est obligatoire"
        
        if errors:
            raise serializers.ValidationError(errors)
        
        return data

class RegisterSerializer(serializers.ModelSerializer):
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
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        self.perform_create(serializer)
        return Response(
            {"message": "Utilisateur créé avec succès"},
            status=status.HTTP_201_CREATED
        )

class FOSAResource(resources.ModelResource):
    class Meta:
        model = FOSA
        fields = ('id', 'nom_fr', 'nom_ar', 'type', 'code_etablissement',
                 'longitude', 'latitude', 'adresse', 'responsable',
                 'commune', 'moughataa', 'wilaya', 'departement', 'contact')
        import_id_fields = ['code_etablissement']
        skip_unchanged = True
        report_skipped = True

    def before_import_row(self, row, **kwargs):
        """Pré-validation des lignes"""
        required_fields = ['nom_fr', 'code_etablissement', 'type', 
                          'longitude', 'latitude', 'wilaya', 'moughataa']
        
        for field in required_fields:
            if not row.get(field):
                raise ValueError(f"Le champ {field} est obligatoire")

class FOSAViewSet(viewsets.ModelViewSet):
    queryset = FOSA.objects.all()
    serializer_class = FOSASerializer
    permission_classes = [permissions.AllowAny]

    def create(self, request, *args, **kwargs):
        try:
            response = super().create(request, *args, **kwargs)
            logger.info(f"FOSA créée : {request.data}")
            return response
        except Exception as e:
            logger.error(f"Erreur création FOSA : {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_400_BAD_REQUEST
            )

    @action(detail=False, methods=['post'])
    def import_data(self, request):
        try:
            if 'file' not in request.FILES:
                return Response(
                    {"error": "Aucun fichier fourni"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            file = request.FILES['file']
            
            if not file.name.endswith(('.xlsx', '.xls')):
                return Response(
                    {"error": "Seuls les fichiers Excel sont acceptés"},
                    status=status.HTTP_400_BAD_REQUEST
                )

            fosa_resource = FOSAResource()
            dataset = Dataset()
            
            # Détection automatique du format
            file_format = 'xlsx' if file.name.endswith('.xlsx') else 'xls'
            imported_data = dataset.load(file.read(), format=file_format)
            
            result = fosa_resource.import_data(dataset, dry_run=False, raise_errors=True)
            
            return Response({
                'status': 'success',
                'imported': result.totals['new'],
                'updated': result.totals['updated'],
                'total': len(imported_data)
            })

        except Exception as e:
            logger.error(f"Erreur import FOSA : {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    @action(detail=False, methods=['get'])
    def export_data(self, request):
        try:
            fosa_resource = FOSAResource()
            dataset = fosa_resource.export()
            
            response = HttpResponse(
                dataset.xlsx,
                content_type='application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
            )
            response['Content-Disposition'] = 'attachment; filename="fosas_export.xlsx"'
            return response
            
        except Exception as e:
            logger.error(f"Erreur export FOSA : {str(e)}")
            return Response(
                {"error": str(e)},
                status=status.HTTP_500_INTERNAL_SERVER_ERROR
            )

    def _create_history(self, instance, action):
        """Journalisation des actions"""
        FOSAHistory.objects.create(
            fosa=instance,
            user=self.request.user if self.request.user.is_authenticated else None,
            action=action,
            changes=self._get_changes_data(instance)
        )

    def _get_changes_data(self, instance):
        """Capture des données importantes pour l'historique"""
        return {
            'nom_fr': instance.nom_fr,
            'type': instance.type,
            'code_etablissement': instance.code_etablissement,
            'wilaya': instance.wilaya,
            'moughataa': instance.moughataa
        }
    
    def create(self, request, *args, **kwargs):
       response = super().create(request, *args, **kwargs)
       instance = self.get_object()
       self._create_history(instance, 'CREATE')
       return response

    def update(self, request, *args, **kwargs):
       response = super().update(request, *args, **kwargs)
       instance = self.get_object()
       self._create_history(instance, 'UPDATE')
       return response

    def destroy(self, request, *args, **kwargs):
      instance = self.get_object()
      self._create_history(instance, 'DELETE')
      return super().destroy(request, *args, **kwargs)




# ✅ views.py (ajout après ta classe FOSAViewSet)
from rest_framework import viewsets
from .models import FOSAHistory
from rest_framework import serializers

class FOSAHistorySerializer(serializers.ModelSerializer):
    fosa_id = serializers.ReadOnlyField(source='fosa.id')
    fosa_nom_fr = serializers.ReadOnlyField(source='fosa.nom_fr')
    fosa_nom_ar = serializers.ReadOnlyField(source='fosa.nom_ar')
    username = serializers.ReadOnlyField(source='user.username')

    class Meta:
        model = FOSAHistory
        fields = ['id', 'fosa_id', 'fosa_nom_fr', 'fosa_nom_ar',
                  'username', 'action', 'changes', 'timestamp']

class FOSAHistoryViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = FOSAHistory.objects.select_related('fosa', 'user').all()
    serializer_class = FOSAHistorySerializer
    permission_classes = [permissions.AllowAny]
