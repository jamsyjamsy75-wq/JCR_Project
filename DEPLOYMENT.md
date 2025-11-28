# Guide de Déploiement - LustLeak.fr sur Vercel

## 📋 Prérequis

### 1. Compte Cloudinary (Gratuit)
1. Créer un compte : https://cloudinary.com/users/register_free
2. Récupérer vos credentials depuis le Dashboard :
   - Cloud Name
   - API Key
   - API Secret

### 2. Compte Turso (Gratuit - Optionnel)
1. Créer un compte : https://turso.tech
2. Installer le CLI : `npm install -g @turso/cli`
3. Login : `turso auth login`

### 3. Compte Vercel (Gratuit)
1. Créer un compte : https://vercel.com/signup
2. Connecter votre compte GitHub

---

## 🚀 Étapes de Déploiement

### Étape 1 : Configuration Locale

1. **Créer `.env.local`** :
```bash
cp .env.local.example .env.local
```

2. **Remplir avec vos credentials Cloudinary** :
```env
CLOUDINARY_CLOUD_NAME=Root
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Étape 2 : Migration des Médias vers Cloudinary

```bash
npm run cloudinary:upload
```

Ce script va :
- ✅ Uploader tous vos médias (34 MB) vers Cloudinary
- ✅ Générer un fichier `scripts/cloudinary-mapping.json` avec les URLs
- ✅ Organiser les médias dans des dossiers sur Cloudinary

### Étape 3 : Mettre à Jour les URLs

Après l'upload, mettez à jour `lib/mediaCatalog.ts` avec les nouvelles URLs Cloudinary depuis le fichier `cloudinary-mapping.json`.

**Exemple :**
```typescript
// AVANT
coverUrl: "/media/Photo_IA/image.png"

// APRÈS
coverUrl: "lustleak/media/Photo_IA/image"  // Sans extension
```

### Étape 4 : Migration Base de Données (Optionnel - Production)

**Option A : Garder SQLite (Simple, limites de Vercel)**
- Fonctionne mais fichier DB non persistant sur Vercel
- Bon pour les tests

**Option B : Turso (Recommandé pour production)**

1. Créer une base de données :
```bash
turso db create lustleak-prod
```

2. Récupérer l'URL :
```bash
turso db show lustleak-prod --url
```

3. Créer un token :
```bash
turso db tokens create lustleak-prod
```

4. Mettre à jour `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "sqlite"
  url      = env("TURSO_DATABASE_URL")
}
```

5. Appliquer les migrations :
```bash
turso db shell lustleak-prod < prisma/migrations/20251128105436_init/migration.sql
turso db shell lustleak-prod < prisma/migrations/20251128112226_optional_video_url/migration.sql
```

### Étape 5 : Déploiement sur Vercel

#### Via GitHub (Recommandé)

1. Push votre code :
```bash
git add .
git commit -m "chore: configure cloudinary and vercel"
git push origin main
```

2. Sur Vercel Dashboard :
   - Import Project → Sélectionner votre repo GitHub
   - Framework Preset: **Next.js** (détecté automatiquement)
   - Root Directory: `./`

3. **Configurer les variables d'environnement** :
   - `DATABASE_URL` : `file:./dev.db` (ou Turso URL)
   - `NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME` : `your_cloud_name`
   - `TURSO_DATABASE_URL` : `libsql://your-db.turso.io` (si Turso)
   - `TURSO_AUTH_TOKEN` : `your_token` (si Turso)

4. Cliquer sur **Deploy**

#### Via CLI

```bash
npm install -g vercel
vercel login
vercel
```

---

## ✅ Checklist Post-Déploiement

- [ ] Site accessible sur `https://votre-projet.vercel.app`
- [ ] Images chargent depuis Cloudinary
- [ ] Vidéos fonctionnent correctement
- [ ] API `/api/categories` retourne des données
- [ ] API `/api/videos` retourne des vidéos
- [ ] Base de données fonctionne (tester quelques requêtes)
- [ ] Modal d'âge s'affiche correctement
- [ ] Filtres de catégories fonctionnent

---

## 🐛 Dépannage

### Erreur "Module not found: Can't resolve 'cloudinary'"
```bash
npm install cloudinary next-cloudinary
```

### Erreur Prisma en production
Vérifier que `prisma generate` est bien dans le build :
```json
// package.json
"scripts": {
  "build": "prisma generate && next build"
}
```

### Images ne chargent pas
Vérifier `next.config.mjs` :
```javascript
images: {
  remotePatterns: [
    { protocol: "https", hostname: "res.cloudinary.com" },
  ],
}
```

---

## 📊 Limites Gratuites

### Vercel Hobby
- ✅ 100 GB Bandwidth
- ✅ Builds illimités
- ✅ HTTPS automatique
- ✅ Deploy depuis GitHub

### Cloudinary Free
- ✅ 25 GB stockage
- ✅ 25 GB bandwidth/mois
- ✅ Transformations d'images

### Turso Free
- ✅ 9 GB stockage
- ✅ 1 milliard de rows lues/mois
- ✅ 25 millions de rows écrites/mois

---

## 🔗 Liens Utiles

- Dashboard Vercel : https://vercel.com/dashboard
- Dashboard Cloudinary : https://console.cloudinary.com
- Dashboard Turso : https://turso.tech/app
- Documentation Next.js : https://nextjs.org/docs

---

**Bon déploiement ! 🚀**
