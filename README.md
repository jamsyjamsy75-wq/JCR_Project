# XBURNCRUST - Plateforme de Streaming pour Adultes

> Plateforme moderne propulsée par Next.js 15 avec authentification sécurisée et système de favoris

[![Next.js](https://img.shields.io/badge/Next.js-15.5.6-black)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-blue)](https://www.typescriptlang.org/)
[![License](https://img.shields.io/badge/License-MIT-green)](LICENSE)

🔗 **Demo** : [project-xburncrust.vercel.app](https://project-xburncrust.vercel.app)

⚠️ **Accès privé** - Réservé aux administrateurs uniquement

---

## 🚀 Stack Technique

**Frontend** : Next.js 15 • React 19 • TypeScript • Tailwind CSS  
**Backend** : Prisma ORM • Turso (SQLite) • NextAuth v5 • API Routes  
**Médias** : Cloudinary CDN • Optimisation WebP/AVIF  
**Hosting** : Vercel Edge Network



## ✨ Fonctionnalités Principales

### 🔐 Authentification
- **Protection admin** - Middleware bloque l'accès non-autorisé
- **NextAuth v5** - JWT avec hash bcrypt
- **Toggle password** - Icône œil sur formulaires
- **Rôles** - Admin / User

### 🎬 Vidéos & Médias
- **Favoris** - Système de likes avec API REST
- **Autoplay intelligent** - Démarre à 50% de visibilité
- **Hover preview** - Aperçu au survol
- **Filtres** - Par catégorie
- **CDN Cloudinary** - Optimisation auto (WebP/AVIF)

### 🎨 Interface
- **Responsive** - Mobile, tablette, desktop
- **Dark mode** - Thème neon-pink
- **Modal âge** - Vérification avec localStorage

---

## 🛠️ Installation

```bash
# Cloner et installer
git clone https://github.com/jamsyjamsy75-wq/JCR_Project.git
cd lustleak-fr
npm install

# Configurer .env.local
AUTH_SECRET=xxx                    # openssl rand -base64 32
AUTH_URL=http://localhost:3000
DATABASE_URL="file:./dev.db"
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx

# Setup database
npx prisma generate
npx prisma migrate dev
npm run db:seed

# Lancer
npm run dev  # http://localhost:3000
```

## 🌐 Déploiement Vercel

### Variables d'environnement requises
```env
AUTH_SECRET=xxx                              # CRITIQUE pour NextAuth
AUTH_URL=https://project-xburncrust.vercel.app
TURSO_DATABASE_URL=libsql://xxx.turso.io
TURSO_AUTH_TOKEN=xxx
CLOUDINARY_CLOUD_NAME=xxx
CLOUDINARY_API_KEY=xxx
CLOUDINARY_API_SECRET=xxx
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=xxx
NEXT_PUBLIC_USE_LOCAL_MEDIA=false
```

Push sur GitHub → Déploiement auto (2-3 min)

---

## 📊 Schema Database

**User** : id, email, password (hashed), role (admin/user)  
**Video** : id, title, coverUrl, videoUrl, duration, views, categoryId  
**Category** : id, name, slug  
**Favorite** : userId + videoId (unique)  
**Session** : NextAuth JWT



## 🔒 Sécurité

- **Middleware** - Routes protégées (sauf `/auth/*`)
- **Rôle admin requis** - Users bloqués automatiquement
- **JWT NextAuth v5** - Sessions sécurisées
- **Bcrypt** - Hash password (salt 10)
- **HTTPS Vercel** - Certificat auto
- **Modal âge** - Vérification obligatoire

---

## 👨‍💻 Auteur

**xburncrust** - [@jamsyjamsy75-wq](https://github.com/jamsyjamsy75-wq)

**License** : MIT

---

*Dernière mise à jour : 29 novembre 2025*

## 🔧 Accès Admin

**Inscription ouverte** mais seul `role = "admin"` accède au contenu.

```bash
# Scripts utilitaires
node make-admin.js        # Promouvoir un user en admin
node check-turso.js       # Vérifier la database
node reset-password.js    # Reset password
```

---

## 📝 Limitations

- OAuth Google/GitHub désactivé en prod
- Upload vidéos via scripts uniquement
- Contenu statique (seedé manuellement)

---
