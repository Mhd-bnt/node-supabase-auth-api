# Node + Supabase (PostgreSQL) Auth API

API REST construite avec **Node.js (TypeScript)** utilisant **Supabase (PostgreSQL)** comme base de données via **Prisma**.

L’authentification repose sur des **JWT (JSON Web Tokens)** et le hachage des mots de passe est assuré avec **bcrypt**.  
Les routes sensibles sont protégées par un middleware d’authentification basé sur le header `Authorization: Bearer <token>`.

---

## Stack Technique

- **Runtime** : Node.js / TypeScript
- **Framework** : Express
- **Base de données** : Supabase (PostgreSQL)
- **ORM** : Prisma + `@prisma/adapter-pg` + `pg` (pool de connexions)
- **Sécurité** :
  - JWT (`jsonwebtoken`)
  - Hashing des mots de passe avec `bcrypt`

---

## Fonctionnalités

- **Inscription / Connexion**
  - Création de compte
  - Authentification utilisateur
- **Sécurité**
- Mots de passe jamais stockés en clair
- Vérification des tokens JWT
- **Middleware d’auth**
- Protection des routes sensibles
- Header requis : `Authorization: Bearer <token>`
- **Performance**
- Pool de connexions PostgreSQL via `pg`
- Intégration Prisma optimisée pour Supabase

---

## Mise en route

### Installation

```bash
npm install
```

---

### Configuration (variables d’environnement)

Créer un fichier `.env` à la racine du projet :

```env
DATABASE_URL="votre_url_postgresql_supabase"
JWT_SECRET="votre_secret_jwt_tres_long"
PORT=3000
```

---

### Base de données (Prisma)

Synchroniser le schéma Prisma avec Supabase :

```bash
npx prisma db push
```

---

### Lancement du serveur

#### Mode développement

```bash
npm run dev
```

#### Build & production

```bash
npm run build
npm start
```

---

## Notes

- Assurez-vous que votre projet Supabase est actif
- Le secret JWT doit être **long et sécurisé**
- Prisma est configuré pour fonctionner avec un pool PostgreSQL

---
