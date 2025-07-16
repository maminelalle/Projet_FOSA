from django.db import models
from django.contrib.auth.models import User

class FOSA(models.Model):
    TYPE_CHOICES = [
        ('PS', 'Poste de Santé'),
        ('CS', 'Centre de Santé'),
        ('HP', 'Hôpital'),
        ('DRS', 'Direction Régionale de Santé'),
        ('DAF', 'Direction Administrative et Financière'),
    ]
    
    nom_fr = models.CharField(max_length=100, verbose_name="Nom (Français)")
    nom_ar = models.CharField(max_length=100, verbose_name="Nom (Arabe)", blank=True, null=True)
    type = models.CharField(max_length=50, choices=TYPE_CHOICES)
    code_etablissement = models.CharField(max_length=50, unique=True)
    longitude = models.FloatField()
    latitude = models.FloatField()
    adresse = models.CharField(max_length=200)
    responsable = models.CharField(max_length=100, blank=True, null=True)
    commune = models.CharField(max_length=100, blank=True, null=True)
    moughataa = models.CharField(max_length=100)
    wilaya = models.CharField(max_length=100)
    departement = models.CharField(max_length=100, blank=True, null=True)
    contact = models.CharField(max_length=100)
    
    class Meta:
        verbose_name = "FOSA"
        verbose_name_plural = "FOSAs"
        ordering = ['nom_fr']
    
    def __str__(self):
        return f"{self.nom_fr} ({self.code_etablissement})"

class FOSAHistory(models.Model):
    ACTION_CHOICES = [
        ('CREATE', 'Création'),
        ('UPDATE', 'Mise à jour'),
        ('DELETE', 'Suppression'),
    ]
    
    fosa = models.ForeignKey(FOSA, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.SET_NULL, null=True)
    action = models.CharField(max_length=10, choices=ACTION_CHOICES)
    changes = models.JSONField()
    timestamp = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        verbose_name = "Historique FOSA"
        verbose_name_plural = "Historiques FOSA"
        ordering = ['-timestamp']
    
    def __str__(self):
        return f"{self.get_action_display()} - {self.fosa.nom_fr}"