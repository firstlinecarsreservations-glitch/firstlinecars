# FirstLineCars

Site vitrine de **FirstLineCars**, agence de location de voiture à Agadir et
à l'aéroport Agadir Al Massira (Maroc).

Bilingue français / anglais, avec catalogue de véhicules, formulaire de
réservation envoyé par email, et affichage des prix en dirhams ou en euros.

## Stack

| | |
|---|---|
| Framework | Next.js 16 (App Router, React Server Components) |
| UI | React 19, Tailwind CSS v4, framer-motion |
| Formulaires | react-hook-form + zod |
| Email | Resend |
| Langage | TypeScript (strict) |

## Démarrer

```bash
npm install
cp .env.example .env.local
npm run dev
```

Renseigner `RESEND_API_KEY` dans `.env.local`, puis ouvrir
http://localhost:3000 — la racine redirige vers `/fr` ou `/en` selon la
langue du navigateur.

## Variables d'environnement

Liste complète et commentée dans [`.env.example`](.env.example).

| Variable | Obligatoire | Rôle |
|---|---|---|
| `RESEND_API_KEY` | oui | Envoi des demandes de réservation. Sans elle, le formulaire répond 502. |
| `BOOKING_EMAIL_TO` | non | Destinataire des demandes. Défaut : `firstlinecars.reservations@gmail.com` |
| `BOOKING_EMAIL_FROM` | non | Expéditeur. Défaut `onboarding@resend.dev`, qui ne peut écrire qu'à l'adresse du compte Resend tant qu'aucun domaine n'est vérifié. |
| `NEXT_PUBLIC_SITE_URL` | non | URL canonique, utilisée par le sitemap et les métadonnées. |
| `NEXT_PUBLIC_WHATSAPP_NUMBER` | non | Numéro des liens WhatsApp, format international sans `+`. |
| `NEXT_PUBLIC_EUR_MAD_EXCHANGE_RATE` | non | Taux de conversion MAD → EUR. Défaut : `10.9`. |

## Architecture

```
app/[locale]/          Pages : accueil, véhicules, réservation, à propos, contact
app/api/booking/       Réception du formulaire, validation, envoi de l'email
components/            UI par domaine : booking, home, layout, reviews, ui, vehicles
data/*.json            Contenu éditorial : véhicules, destinations, FAQ, avis
lib/                   Métier : i18n, devise, prix, email, WhatsApp, business
locales/{fr,en}.json   Dictionnaires de traduction
```

Conventions qui expliquent la structure :

- **Le contenu vit en JSON, pas en dur dans les composants.** Modifier la
  flotte ou les destinations ne demande pas de toucher au JSX.
- **Les prix sont stockés en dirhams** (`pricePerDayMad`) et convertis à
  l'affichage. La devise choisie vit dans un cookie lu côté serveur, ce
  qui évite que les prix changent visiblement après le chargement.
- **`lib/business.ts` est la source unique** des informations réelles de
  l'agence : adresse, téléphone, note Google, réseaux sociaux. Rien
  d'affiché comme un fait ne doit être écrit ailleurs.
- **Langue par défaut : français**, détectée par cookie puis
  `Accept-Language` dans `middleware.ts`.

## Déploiement (Vercel)

1. Importer le dépôt dans Vercel — le framework est détecté automatiquement.
2. Ajouter les variables d'environnement ci-dessus dans
   *Project Settings → Environment Variables*.
3. Déployer.

`.env.local` n'est jamais commité : les valeurs de production se
configurent uniquement côté Vercel.

## Scripts

```bash
npm run dev      # développement
npm run build    # build de production
npm run start    # servir le build
npm run lint     # ESLint
```

## À faire

- Vérifier le domaine chez Resend pour pouvoir envoyer depuis
  `reservations@firstlinecars.ma` — nécessaire pour écrire aux clients.
- Remplacer les avis de démonstration de `data/reviews.json` par les vrais
  avis Google. La note (4,7) et le nombre (50+) affichés viennent déjà de
  `lib/business.ts` et sont réels.
- Remplacer l'URL de la fiche Google dans `lib/business.ts` par le lien
  canonique (Google Maps → Partager).
- Réduire le poids de `public/images/vehicules/hyundai-grand-i10.png`
  (7 Mo) et de `public/flc_logo_nobg.png` (0,9 Mo).
