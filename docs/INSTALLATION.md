# Guide d’installation — KYC Cameroun

## 1. Prérequis

Ce dépôt contient une application **Expo / React Native avec TypeScript**. Il ne contient pas de code Flutter ou Dart. Installez une version récente de Node.js, pnpm et, pour un essai sur appareil, Expo Go ou un environnement iOS/Android configuré selon les recommandations Expo. [1]

| Élément | Version ou rôle |
|---|---|
| Node.js | Version 22 recommandée par le projet. |
| pnpm | Gestionnaire de paquets utilisé par le fichier `pnpm-lock.yaml`. |
| Expo Go | Prévisualisation du parcours sur téléphone physique. |
| Git | Clonage et synchronisation du dépôt. |

## 2. Installation locale

Clonez le dépôt et installez les dépendances.

```bash
git clone https://github.com/Ekole237/kyc-cmr.git
cd kyc-cmr
pnpm install
```

Lancez l’environnement de développement :

```bash
pnpm dev
```

Le script démarre l’API Node et Expo. Ouvrez l’interface web de prévisualisation, ou scannez le QR code affiché par Expo avec Expo Go pour tester les parcours sur un téléphone. La caméra requiert un appareil ou un émulateur disposant d’une autorisation caméra ; le navigateur web peut limiter cette fonctionnalité.

## 3. Commandes utiles

| Commande | Usage |
|---|---|
| `pnpm dev` | Lance l’API et Expo en développement. |
| `pnpm test` | Exécute les tests Vitest, notamment le moteur de risque KYC. |
| `pnpm check` | Vérifie les types TypeScript. |
| `pnpm lint` | Exécute l’analyse statique Expo/ESLint. |
| `pnpm qr` | Génère un QR code de connexion Expo si l’environnement le permet. |

Avant chaque commit, exécutez au minimum :

```bash
pnpm test && pnpm check && pnpm lint
```

## 4. Configuration locale et secrets

L’application fonctionne sans secrets en mode démonstration. Les dossiers de démonstration sont conservés localement et aucune CNI, selfie réel ou transaction réelle ne doit être utilisé dans cet état.

Lorsque l’intégration est prête, configurez les secrets dans les paramètres sécurisés du projet, puis testez les appels uniquement avec les environnements sandbox des fournisseurs. N’ajoutez jamais une clé KYC ou Mobile Money à `app.config.ts`, au code client, à un fichier versionné ou à une variable `EXPO_PUBLIC_*`.

| Cas | Variables côté serveur |
|---|---|
| KYC Smile ID | `SMILE_ID_PARTNER_ID`, `SMILE_ID_API_KEY`, `SMILE_ID_CALLBACK_SECRET` |
| MTN MoMo | `MTN_MOMO_SUBSCRIPTION_KEY`, `MTN_MOMO_API_USER`, `MTN_MOMO_API_KEY` |
| Orange Money | `ORANGE_MONEY_CLIENT_ID`, `ORANGE_MONEY_CLIENT_SECRET`, `ORANGE_MONEY_MERCHANT_KEY` |
| CinetPay | `CINETPAY_SITE_ID`, `CINETPAY_API_KEY` |

Les autres variables techniques injectées par l’environnement — URL de base API, stockage, base de données et OAuth — sont déjà définies par la plateforme de développement. Elles ne doivent pas être remplacées par des valeurs de test arbitraires.

## 5. Essai du MVP

1. Ouvrez l’onglet **Accueil**.
2. Créez un dossier avec des données fictives.
3. Ouvrez le dossier, effectuez les étapes de document et selfie dans le parcours guidé, puis confirmez le consentement.
4. Soumettez le dossier et consultez l’état ou la **File de revue**.
5. Exercez une décision de revue sur le dossier de démonstration sans utiliser de document réel.

Le moteur local classe les dossiers de façon simulée. Les captures ne sont pas envoyées à un serveur KYC et ne constituent pas une vérification d’identité effective.

## 6. Passage à un environnement de production

Avant d’activer la collecte de données réelles, mettez en place les adaptateurs serveur décrits dans [`TECHNICAL.md`](./TECHNICAL.md), configurez les webhooks HTTPS des fournisseurs, ajoutez le contrôle des rôles et validez les règles de conservation avec la conformité. La publication d’une version mobile doit passer par le mécanisme de publication géré du projet, qui construit l’artefact mobile ; ne fabriquez pas d’APK manuellement dans l’environnement de développement.

## Références

[1]: https://docs.expo.dev/get-started/set-up-your-environment/ "Expo — Set up your environment"
