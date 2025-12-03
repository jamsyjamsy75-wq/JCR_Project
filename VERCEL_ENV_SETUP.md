# 🚀 Configuration Variables d'Environnement Vercel

## ⚠️ Variables OBLIGATOIRES pour la production

Voici toutes les variables d'environnement à ajouter sur Vercel Dashboard → Settings → Environment Variables :

### 1️⃣ **Cloudinary** (Upload images)
```
CLOUDINARY_CLOUD_NAME=<voir .env.local>
CLOUDINARY_API_KEY=<voir .env.local>
CLOUDINARY_API_SECRET=<voir .env.local>
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=<voir .env.local>
```

### 2️⃣ **NextAuth** (Authentification)
```
AUTH_URL=https://project-xburncrust.vercel.app
AUTH_SECRET=<voir .env.local>
```
⚠️ **Important** : Remplace `https://project-xburncrust.vercel.app` par ton URL Vercel réelle !

### 3️⃣ **Turso Database** (Base de données production)
```
TURSO_DATABASE_URL=<voir .env.local>
TURSO_AUTH_TOKEN=<voir .env.local>
```

### 4️⃣ **Hugging Face** (Génération images IA - 100% GRATUIT)
```
HUGGING_FACE_TOKEN=<voir .env.local>
```
⚠️ **CRITIQUE** : Sans cette variable, le générateur d'images retourne une erreur 500 !

📝 **Note** : Les autres valeurs réelles sont dans ton fichier `.env.local` (non versionné pour la sécurité)

### 5️⃣ **Configuration média**
```
NEXT_PUBLIC_USE_LOCAL_MEDIA=false
```

---

## 📋 Checklist de déploiement

1. ✅ Code pushé sur GitHub
2. ⬜ **[URGENT]** Ajouter `HUGGING_FACE_TOKEN` sur Vercel (générateur d'images ne fonctionne pas sans ça !)
3. ⬜ Ajouter toutes les autres variables d'environnement ci-dessus sur Vercel
4. ⬜ Vérifier que `AUTH_URL` correspond à ton URL Vercel
5. ⬜ Redéployer le projet après avoir ajouté les variables
6. ⬜ Tester la génération d'image sur https://project-xburncrust.vercel.app/admin/generate
7. ⬜ Tester la sauvegarde d'image générée

---

## 🚨 Erreur 500 sur `/api/admin/generate-image` ?

**Cause probable :** `HUGGING_FACE_TOKEN` manquant sur Vercel

**Solution :**
1. Vercel Dashboard → Votre projet → Settings → Environment Variables
2. Add New → `HUGGING_FACE_TOKEN` = `<votre token depuis .env.local>`
3. Cochez : Production + Preview + Development
4. Save
5. Deployments → Redeploy

---

## 🔧 Comment ajouter les variables sur Vercel

1. Va sur **Vercel Dashboard**
2. Sélectionne ton projet **project-xburncrust**
3. **Settings** → **Environment Variables**
4. Pour chaque variable :
   - Name : `NOM_DE_LA_VARIABLE`
   - Value : `valeur_correspondante`
   - Environments : ✅ Production ✅ Preview ✅ Development (cocher les 3)
   - Cliquer sur **Save**
5. Une fois toutes les variables ajoutées, va dans **Deployments** → clic sur les 3 points → **Redeploy**

---

## ✅ Ce qui a été corrigé

### Problème initial
```
POST /api/admin/save-generated-image 500 (Internal Server Error)
```

### Corrections apportées
1. ✅ Remplacement de l'upload preset par l'API authentifiée Cloudinary SDK
2. ✅ Utilisation du package `cloudinary` déjà installé
3. ✅ Logs détaillés pour déboguer en production
4. ✅ Gestion d'erreur améliorée avec messages explicites

### Commits pushés
- `dc8edfa` - Add AI image generation with FLUX models and quality controls
- `853f99c` - Fix Cloudinary upload with authenticated API (no upload preset needed)
- `11af984` - Use Cloudinary SDK for reliable authenticated upload

---

## 🎯 Prochaines étapes après déploiement

1. Tester la génération d'image sur https://project-xburncrust.vercel.app/admin/generate
2. Vérifier que les images s'enregistrent correctement
3. Confirmer que les images apparaissent dans la galerie principale

---

## 🆘 En cas de problème

Si l'erreur 500 persiste :
1. Vérifie les logs Vercel (Deployments → View Function Logs)
2. Assure-toi que TOUTES les variables sont bien configurées
3. Vérifie que `AUTH_URL` correspond exactement à ton URL Vercel
4. Redéploie après modification des variables
