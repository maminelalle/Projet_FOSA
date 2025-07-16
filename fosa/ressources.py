from import_export import resources
from .models import FOSA

class FOSAResource(resources.ModelResource):
    class Meta:
        model = FOSA
        import_id_fields = ['code_etablissement']
        fields = ('nom_fr', 'nom_ar', 'type', 'code_etablissement', 
                 'longitude', 'latitude', 'adresse', 'responsable',
                 'commune', 'moughataa', 'wilaya', 'departement', 'contact')