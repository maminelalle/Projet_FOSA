
# Register your models here.
from django.contrib import admin
from import_export import resources
from import_export.admin import ImportExportModelAdmin
from .models import FOSA, FOSAHistory

class FOSAResource(resources.ModelResource):
    class Meta:
        model = FOSA
        skip_unchanged = True
        report_skipped = True
        import_id_fields = ['code_etablissement']

@admin.register(FOSA)
class FOSAAdmin(ImportExportModelAdmin):
    resource_class = FOSAResource
    list_display = ('nom_fr', 'type', 'wilaya', 'moughataa', 'contact')
    list_filter = ('type', 'wilaya', 'departement')
    search_fields = ('nom_fr', 'nom_ar', 'code_etablissement')

@admin.register(FOSAHistory)
class FOSAHistoryAdmin(admin.ModelAdmin):
    list_display = ('fosa', 'user', 'action', 'timestamp')
    readonly_fields = ('fosa', 'user', 'action', 'changes', 'timestamp')