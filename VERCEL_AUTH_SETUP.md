# 🚀 Configuration Vercel pour l'authentification

## Variables d'environnement à ajouter sur Vercel

Allez sur **Vercel Dashboard → Project Settings → Environment Variables** et ajoutez :

### 1️⃣ Variables obligatoires

```env
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbtuww2ie
NEXTAUTH_URL=https://votre-projet.vercel.app
NEXTAUTH_SECRET=gFXxvlD7CJp/L6D2jltr5GOTsorrJIV0txRq+4/BlZk=
```

> ⚠️ Remplacez `votre-projet.vercel.app` par votre vraie URL Vercel

### 2️⃣ Variables optionnelles (OAuth)

Si vous voulez activer Google/GitHub login :

```env
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GITHUB_CLIENT_ID=your_github_client_id
GITHUB_CLIENT_SECRET=your_github_client_secret
```

#### Comment obtenir les credentials OAuth :

**Google :**
1. https://console.cloud.google.com/apis/credentials
2. Créer un projet → Créer des identifiants → ID client OAuth 2.0
3. Ajouter `https://votre-projet.vercel.app/api/auth/callback/google` dans "URI de redirection autorisés"

**GitHub :**
1. https://github.com/settings/developers
2. New OAuth App
3. Homepage URL : `https://votre-projet.vercel.app`
4. Callback URL : `https://votre-projet.vercel.app/api/auth/callback/github`

---

## 🔒 Base de données en production

**Attention** : SQLite (`file:./dev.db`) n'est pas persistant sur Vercel !

Chaque déploiement recrée la DB à zéro. Pour la production, utilisez :

### Option recommandée : Turso (gratuit)

```bash
# Installer Turso CLI
npm install -g @turso/cli

# Login
turso auth login

# Créer une DB
turso db create lustleak-prod

# Récupérer l'URL et le token
turso db show lustleak-prod --url
turso db tokens create lustleak-prod
```

Puis mettez à jour Vercel :
```env
TURSO_DATABASE_URL=libsql://your-db.turso.io
TURSO_AUTH_TOKEN=your_token
```

Et modifiez `prisma/schema.prisma` :
```prisma
datasource db {
  provider = "sqlite"
  url      = env("TURSO_DATABASE_URL")
}
```

---

## ✅ Checklist avant déploiement

- [ ] Variables Vercel configurées (NEXTAUTH_URL, NEXTAUTH_SECRET)
- [ ] NEXTAUTH_URL pointe vers l'URL Vercel (pas localhost)
- [ ] Base de données production configurée (Turso recommandé)
- [ ] Migration Prisma appliquée en prod
- [ ] Tester signup/login en production

---

## 🧪 Tester l'authentification en prod

1. Ouvrir `https://votre-projet.vercel.app/auth/signup`
2. Créer un compte
3. Se connecter via `/auth/login`
4. Vérifier que `/profile` fonctionne

Si ça ne marche pas :
- Vérifier les logs Vercel (Deployments → Logs)
- Vérifier que NEXTAUTH_SECRET est bien défini
- Vérifier que NEXTAUTH_URL correspond à l'URL de production
