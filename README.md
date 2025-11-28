# XBURNCRUST - Plateforme de Contenu IA

> Landing page moderne propulsée par Next.js 15 avec gestion de médias via Cloudinary

## 🚀 Stack Technique

### Frontend
- **Next.js 15.5.6** - Framework React avec App Router
- **React 19** - Dernière version avec Server Components
- **TypeScript 5.6** - Typage statique
- **Tailwind CSS 3.4** - Styling moderne et responsive
- **next-cloudinary** - Optimisation automatique des médias

### Backend & Database
- **Prisma ORM 5.21** - Gestion de la base de données
- **SQLite** - Base de données locale (dev)
- **Next.js API Routes** - Endpoints RESTful

### Médias & Assets
- **Cloudinary** - CDN et optimisation d'images/vidéos
- **20 fichiers** uploadés (34 MB)
- **Transformations automatiques** (format, qualité, taille)

### DevOps
- **Vercel** - Hébergement et déploiement automatique
- **GitHub** - Gestion de code et CI/CD
- **Git** - Contrôle de version

---

## 📁 Structure du Projet

```
lustleak-fr/
├── app/                      # Next.js App Router
│   ├── layout.tsx           # Layout principal
│   ├── page.tsx             # Page d'accueil
│   ├── globals.css          # Styles globaux
│   └── api/                 # API Routes
│       ├── categories/      # Endpoint catégories
│       └── videos/          # Endpoint vidéos
├── components/              # Composants React
│   ├── Header.tsx           # Header avec menu burger
│   ├── VideoCard.tsx        # Card vidéo avec autoplay
│   ├── VideoGrid.tsx        # Grille de vidéos
│   ├── FilterBar.tsx        # Barre de filtres
│   ├── HeroVideo.tsx        # Hero section
│   ├── AgeGateModal.tsx     # Modal de vérification d'âge
│   └── Footer.tsx           # Footer
├── lib/                     # Utilitaires
│   ├── prisma.ts           # Client Prisma
│   ├── utils.ts            # Fonctions utilitaires
│   └── mediaCatalog.ts     # Catalogue de médias
├── prisma/                  # Configuration Prisma
│   ├── schema.prisma       # Schéma de la DB
│   ├── seed.ts             # Script de seed
│   └── migrations/         # Migrations
├── scripts/                 # Scripts utilitaires
│   ├── upload-to-cloudinary.ts
│   └── cloudinary-mapping.json
└── public/                  # Assets statiques
```

---

## 🎨 Fonctionnalités

### Interface Utilisateur
- ✅ **Design responsive** (mobile, tablet, desktop)
- ✅ **Menu burger** pour mobile (< 768px)
- ✅ **Dark mode** par défaut
- ✅ **Animations fluides** avec Tailwind
- ✅ **Modal de vérification d'âge**

### Vidéos & Médias
- ✅ **Autoplay intelligent** : vidéo démarre quand visible à 50%
- ✅ **Hover preview** : aperçu vidéo au survol
- ✅ **Lazy loading** : chargement progressif
- ✅ **Optimisation Cloudinary** : format/qualité auto

### Performance
- ✅ **Images optimisées** via Cloudinary CDN
- ✅ **Server Components** React 19
- ✅ **Streaming adaptatif** pour les vidéos
- ✅ **Build time < 10s**

---

## 🛠️ Installation & Développement

### Prérequis
- Node.js ≥ 18.18.0
- npm 10.9.0
- Compte Cloudinary (gratuit)

### Installation

```bash
# Cloner le repo
git clone https://github.com/jamsyjamsy75-wq/JCR_Project.git
cd lustleak-fr

# Installer les dépendances
npm install

# Configurer les variables d'environnement
cp .env.local.example .env.local
# Remplir avec vos credentials Cloudinary
```

### Variables d'environnement

```env
DATABASE_URL="file:./dev.db"
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=your_cloud_name
```

### Commandes

```bash
# Développement
npm run dev                    # Lance le serveur dev sur http://localhost:3000

# Database
npm run db:seed               # Seed la base de données

# Cloudinary
npm run cloudinary:upload     # Upload les médias vers Cloudinary

# Production
npm run build                 # Build pour la production
npm start                     # Lance le serveur de production
```

---

## 🌐 Déploiement

### Déploiement Vercel (Actuel)

**URL Production** : `https://project-xburncrust.vercel.app`

#### Configuration automatique
1. Push vers GitHub → Déploiement auto
2. Build time : ~2-3 minutes
3. Variables d'environnement configurées dans Vercel Dashboard

#### Variables Vercel requises
```
DATABASE_URL=file:./dev.db
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=dbtuww2ie
```

### Workflow de déploiement

```
Developer → Git Push → GitHub
                         ↓
                    Vercel Webhook
                         ↓
                    Build (2-3 min)
                    - npm install
                    - prisma generate
                    - next build
                         ↓
                    Deploy → CDN
                         ↓
                Production Live ✅
```

---

## 📊 Modèles de Données

### Category
```typescript
{
  id: number
  name: string
  slug: string
  videos: Video[]
  createdAt: DateTime
  updatedAt: DateTime
}
```

### Video
```typescript
{
  id: string
  title: string
  duration: number
  views: number
  isHd: boolean
  coverUrl: string      // Cloudinary Public ID
  videoUrl: string?     // Cloudinary Public ID
  performer: string
  ageBadge: string?
  categoryId: number
  createdAt: DateTime
  updatedAt: DateTime
}
```

---

## 🎯 Optimisations Cloudinary

### Images
- Format automatique : WebP/AVIF
- Qualité : auto
- Responsive : 800px max width
- Lazy loading

### Vidéos
- Streaming adaptatif
- Qualité auto
- Format auto (MP4/WebM)
- Préchargement metadata

---

## 📦 Dépendances Principales

```json
{
  "next": "^15.5.6",
  "react": "^19.2.0",
  "prisma": "^5.21.1",
  "cloudinary": "^2.8.0",
  "next-cloudinary": "^7.1.0",
  "tailwindcss": "^3.4.18",
  "typescript": "^5.6.3"
}
```

---

## 🔒 Sécurité

- ✅ HTTPS automatique via Vercel
- ✅ Headers de sécurité (X-Frame-Options, CSP)
- ✅ Variables d'environnement sécurisées
- ✅ Validation des entrées utilisateur
- ✅ Modal de vérification d'âge avec localStorage

---

## 📈 Métriques

### Performance
- **Lighthouse Score** : 90+
- **First Contentful Paint** : < 1.5s
- **Time to Interactive** : < 3s

### Hébergement Gratuit
- **Vercel Hobby** : 100 GB bandwidth/mois
- **Cloudinary Free** : 25 GB stockage + 25 GB bandwidth/mois
- **Coût total** : 0€/mois

---

## 👨‍💻 Auteur

**xburncrust** (Jamal)
- GitHub: [@jamsyjamsy75-wq](https://github.com/jamsyjamsy75-wq)
- Projet: JCR_Project

---

## 📝 License

MIT License - Voir le fichier LICENSE

---

## 🆘 Support

Pour toute question ou problème :
- Créer une issue sur GitHub
- Consulter la [documentation Next.js](https://nextjs.org/docs)
- Consulter la [documentation Cloudinary](https://cloudinary.com/documentation)
- Consulter la [documentation Vercel](https://vercel.com/docs)

---

**Dernière mise à jour** : 28 novembre 2025
