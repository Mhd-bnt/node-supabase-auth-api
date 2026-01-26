# Node + Supabase (PostgreSQL) Auth API

API REST en **Node.js (TypeScript)** connectée à **Supabase (PostgreSQL)** via **Prisma**.
Authentification avec **JWT** (jsonwebtoken) et mots de passe hashés avec **bcrypt**.
Les routes sensibles sont protégées par un middleware d’auth (Bearer token).

## Stack

- Node.js / TypeScript
- Express
- Supabase (PostgreSQL)
- Prisma + `@prisma/adapter-pg` + `pg` (Pool de connexions)
- Auth : JWT (`jsonwebtoken`)
- Password hashing : `bcrypt`

## Features

- Register / Login
- Hash des mots de passe avec bcrypt (jamais stockés en clair)
- Génération + vérification de JWT
- Middleware d’auth : protection des routes via `Authorization: Bearer <token>`
- Connexion PostgreSQL via pool (pg) + Prisma adapter

## Getting started

### 1) Installation

```bash
npm install
```
