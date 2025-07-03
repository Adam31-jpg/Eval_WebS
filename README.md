# Eval_WebS
# Comment lancer et tester le projet Eval_WebS

Ce guide explique comment démarrer l'environnement de développement et exécuter les tests du projet.

## Prérequis

- Node.js (version 18 ou supérieure)
- Docker et Docker Compose
- Git

## Architecture du projet

Le projet utilise :
- **NestJS** - Framework backend
- **PostgreSQL** - Base de données
- **Keycloak** - Authentification et autorisation
- **MinIO** - Stockage d'objets (pour les fichiers CSV)
- **GraphQL + REST + gRPC** - APIs multiples

---

## 🚀 Étape 1 : Démarrer les services Docker

Lancez les services externes (base de données, Keycloak, MinIO) :

```bash
docker-compose up -d
```

### Ce qui se passe :
- PostgreSQL démarre sur le port `5432`
- Keycloak démarre sur le port `8080`
- MinIO démarre sur les ports `9000` (API) et `9090` (Console)

### Résultat attendu :

```text
✅ Logs Docker attendus :

adam@MacBook-Air-de-Adam Eval_WebS % docker-compose up -d 
[+] Running 4/4
 ✔ Network eval_webs_default       Created                                                                      0.1s 
 ✔ Container eval_webs-db-1        Started                                                                      1.0s 
 ✔ Container eval_webs-keycloak-1  Started                                                                      1.0s 
 ✔ Container eval_webs-minio-1     Started  

```

---

## 🔐 Étape 2 : Initialiser Keycloak

Configurez Keycloak avec les utilisateurs et rôles nécessaires :

```bash
node init-keycloak.js
```

### Ce qui se passe :
- Création du realm `myrealm`
- Création du client `myclient`
- Création des rôles `user` et `admin`
- Création de 2 utilisateurs de test :
  - `testuser1@example.com` (rôle: user)
  - `testuser2@example.com` (rôle: admin)

### Résultat attendu :

```text
✅ Logs Keycloak attendus :
adam@MacBook-Air-de-Adam Eval_WebS % node init-keycloak.js        
Realm myrealm created.
Client myclient created.
Role user created.
Role user created.
User test1 created.
{ id: '6fe29e32-940b-41a3-b5b1-61e5d6be2de5' }
User test2 created.
{ id: '9c79b855-8b34-4a0c-a567-358dbbdd3ed3' }
```

### Vérification dans l'interface Keycloak :
1. Allez sur http://localhost:8080
2. Connectez-vous avec `admin` / `admin`
3. Vérifiez que le realm `myrealm` existe

---

## 🚄 Étape 3 : Démarrer le serveur NestJS

Installez les dépendances et démarrez le serveur en mode développement :

```bash
# Installer les dépendances (si pas encore fait)
npm install

# Démarrer le serveur
npm run start:dev
```

### Ce qui se passe :
- Le serveur NestJS démarre sur le port `3000`
- L'API REST est disponible sur `http://localhost:3000/api`
- L'API GraphQL est disponible sur `http://localhost:3000/graphql`
- Les services gRPC écoutent sur le port `50051`
- La documentation Swagger est disponible sur `http://localhost:3000/api-docs`

```text
✅ Logs serveur attendus :
[Nest] 12345  - 03/07/2025, 19:30:00     LOG [NestFactory] Starting Nest application...
[Nest] 12345  - 03/07/2025, 19:30:01     LOG [InstanceLoader] TypeOrmModule dependencies initialized
[Nest] 12345  - 03/07/2025, 19:30:01     LOG [InstanceLoader] GraphQLAppModule dependencies initialized
[Nest] 12345  - 03/07/2025, 19:30:02     LOG [NestMicroservice] Nest microservice successfully started
[Nest] 12345  - 03/07/2025, 19:30:02     LOG [NestApplication] Nest application successfully started
```

### Vérifications rapides :

1. **API REST** : http://localhost:3000/api-docs
   ![Swagger documentation](images/swagger-docs.png)

2. **GraphQL Playground** : http://localhost:3000/graphql
   ![GraphQL playground](images/graphql-playground.png)

3. **Santé de l'API** : Testez un endpoint simple
   ```bash
   curl http://localhost:3000/api/rooms
   ```

---

## 🧪 Étape 4 : Exécuter les tests

Lancez la suite complète de tests :

```bash
npm run test
```

### Ce qui se passe :
- Tests unitaires des services
- Tests d'intégration E2E pour :
  - **REST API** (`test/rest/`)
  - **GraphQL API** (`test/api-graphql/`)
  - **gRPC services** (`test/grpc/`)

```text
✅ Résultats attendus :
Test Suites: 7 passed, 7 total
Tests:       39 passed, 39 total
Snapshots:   0 total
Time:        XX.XXXs
```

### Tests par catégorie :

#### Tests REST API :
```bash
npm run test:rest
```

#### Tests GraphQL :
```bash
npm run test:graphql
```

#### Tests gRPC :
```bash
npm run test:grpc
```

---

## 🔧 Fonctionnalités testées

### 1. **Gestion des utilisateurs**
- ✅ Création d'utilisateurs (avec droits admin)
- ✅ Récupération des utilisateurs
- ✅ Authentification Keycloak

### 2. **Gestion des salles**
- ✅ CRUD complet des salles (REST + GraphQL)
- ✅ Pagination et filtrage

### 3. **Gestion des réservations**
- ✅ CRUD complet des réservations (REST + GraphQL)
- ✅ Notifications automatiques via gRPC
- ✅ Validation des données

### 4. **Services gRPC**
- ✅ Service de notifications
- ✅ Service d'extraction CSV

### 5. **Extraction de données**
- ✅ Génération de fichiers CSV
- ✅ URLs présignées MinIO
- ✅ Export des réservations par utilisateur

---

## 📊 Environnement de test

Les tests utilisent les configurations suivantes :

- **Base de données** : PostgreSQL (même instance que le dev)
- **Authentification** : Keycloak avec utilisateurs de test
- **Stockage** : MinIO pour les fichiers CSV
- **URLs** :
  - API : `http://localhost:3000`
  - Keycloak : `http://localhost:8080`
  - MinIO : `http://localhost:9000`

---

## 📝 Structure des tests

```
test/
├── rest/                    # Tests API REST
│   ├── users.e2e.test.js
│   ├── rooms.e2e.test.js
│   └── reservation.e2e.test.js
├── api-graphql/             # Tests GraphQL
│   ├── room.e2e.test.js
│   └── reservation.e2e.test.js
├── grpc/                    # Tests gRPC
│   ├── extract.e2e.test.js
│   └── notification.e2e.test.js
└── utils/                   # Utilitaires de test
    ├── db.utils.js
    ├── graphql.utils.js
    └── user.utils.js
```

---

## ✅ Checklist de validation

Après avoir suivi toutes les étapes, vous devriez avoir :

- [ ] Tous les conteneurs Docker démarrés
- [ ] Keycloak configuré avec les utilisateurs de test
- [ ] Serveur NestJS qui fonctionne sur le port 3000
- [ ] Tous les tests qui passent (39/39)
- [ ] Documentation Swagger accessible
- [ ] GraphQL Playground fonctionnel

---

## 🎯 Points d'entrée de l'application

Une fois tout démarré, vous pouvez accéder à :

- **API REST** : http://localhost:3000/api/
- **Documentation Swagger** : http://localhost:3000/api-docs
- **GraphQL Playground** : http://localhost:3000/graphql
- **Keycloak Admin** : http://localhost:8080 (admin/admin)
- **MinIO Console** : http://localhost:9090 (minioadmin/minioadmin)
