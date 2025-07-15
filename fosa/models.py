# fosa/models.py
from django.db import models

class FOSA(models.Model):
    nom = models.CharField(max_length=100)
    type = models.CharField(max_length=100)
    adresse = models.CharField(max_length=200)
    contact = models.CharField(max_length=100)
    latitude = models.FloatField()
    longitude = models.FloatField()

    def __str__(self):
        return self.nom
