# Projet FOSA

[![Django](https://img.shields.io/badge/Backend-Django-092E20?logo=django&logoColor=white)](https://www.djangoproject.com/)
[![React](https://img.shields.io/badge/Frontend-React-61DAFB?logo=react&logoColor=0b0f14)](https://react.dev/)
[![REST API](https://img.shields.io/badge/API-REST-0ea5e9)](#api-principales)
[![Documentation](https://img.shields.io/badge/README-Complete-success)](#sommaire)

Application web de gestion des Formations Sanitaires (FOSA), avec un backend Django REST, un frontend React, une carte interactive et un historique des modifications.

## Sommaire

- [Apercu](#apercu)
- [Fonctionnalites](#fonctionnalites)
- [Stack technique](#stack-technique)
- [Architecture du projet](#architecture-du-projet)
- [Demarrage rapide](#demarrage-rapide)
- [API principales](#api-principales)
- [Captures d'ecran](#captures-decran)
- [Ameliorations futures](#ameliorations-futures)
- [Auteur](#auteur)
- [Licence](#licence)

## Apercu

Le projet permet de centraliser, visualiser et maintenir les informations des FOSA:
- consultation et recherche des etablissements
- creation, modification et suppression
- geolocalisation sur carte
- import/export de donnees
- tracabilite des actions via historique

## Fonctionnalites

- Authentification JWT (connexion/inscription)
- Tableau de bord synthese
- Liste des FOSA avec recherche
- Ajout et modification d'une FOSA
- Carte interactive des FOSA
- Historique des operations (`CREATE`, `UPDATE`, `DELETE`)
- Import/export de donnees (Excel/CSV)

## Stack technique

- Backend: Django, Django REST Framework, SimpleJWT, django-import-export
- Frontend: React, React Router, Axios, React Leaflet, Mapbox GL
- Base de donnees: SQLite (developpement)

## Architecture du projet

```text
Projet_FOSA/
  backend/        # Configuration Django (settings, urls, wsgi, asgi)
  fosa/           # App metier (models, views, serializers, routes)
  frontend/       # Interface React
  screenshots/    # Captures d'ecran pour la documentation
  manage.py
```

## Demarrage rapide

### Prerequis

- Python 3.10+
- Node.js 18+
- npm

### 1) Lancer le backend (Django)

```bash
# Depuis la racine du projet
python -m venv .venv
.venv\Scripts\activate
pip install django djangorestframework django-cors-headers django-import-export djangorestframework-simplejwt
python manage.py migrate
python manage.py runserver
```

Backend: http://127.0.0.1:8000

### 2) Lancer le frontend (React)

```bash
# Dans un autre terminal
cd frontend
npm install
npm start
```

Frontend: http://127.0.0.1:3000

## API principales

- `GET/POST /api/fosas/`
- `GET/PUT/PATCH/DELETE /api/fosas/{id}/`
- `POST /api/fosas/import_data/`
- `GET /api/fosas/export_data/`
- `GET /api/history/`
- `POST /api/auth/register/`
- `POST /api/auth/token/`
- `POST /api/auth/token/refresh/`

## Captures d'ecran

### Connexion

![Connexion](screenshots/auth.png)

### Tableau de bord

![Dashboard](screenshots/dashboard.png)

### Liste des FOSA

![Liste FOSA 1](screenshots/list.png)

![Liste FOSA 2](screenshots/list_1.png)

### Formulaire FOSA

![Formulaire FOSA](screenshots/form.png)

### Vue carte

![Carte FOSA](screenshots/map.png)

## Ameliorations futures

- Deploiement cloud (backend + frontend)
- Gestion des roles et permissions avancees
- Tests automatises (backend/frontend)
- Filtrage geospatial avance et clustering sur carte

## Auteur

Projet realise par Mamine Lalle.

## Licence

Licence a definir.
