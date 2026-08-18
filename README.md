# KYC Cameroun

Application mobile **Expo / React Native** destinée à la démonstration d’un parcours KYC camerounais. Le produit aide les équipes opérationnelles à créer des dossiers, préparer une capture de document et de selfie, suivre les étapes, orienter les dossiers à risque et consigner une revue humaine.

> Ce dépôt ne contient pas une application Flutter. Le projet est construit avec Expo SDK 54, React Native et TypeScript.

## Démarrage rapide

```bash
pnpm install
pnpm dev
```

Pour exécuter les validations :

```bash
pnpm test && pnpm check && pnpm lint
```

## Documentation

| Document | Contenu |
|---|---|
| [`docs/INSTALLATION.md`](./docs/INSTALLATION.md) | Prérequis, installation, commandes de développement et mode démonstration. |
| [`docs/TECHNICAL.md`](./docs/TECHNICAL.md) | Architecture, modèle métier, flux CNI, Mobile Money, webhooks et sécurité. |
| [`docs/integration-research-notes.md`](./docs/integration-research-notes.md) | Notes et sources de recherche utilisées pour guider le choix des fournisseurs. |
| [`docs/KYC_AUTONOMOUS.md`](./docs/KYC_AUTONOMOUS.md) | Rôles, parcours client, revue humaine, audit et limites de la plateforme sans fournisseur KYC. |
| [`docs/PAYMENT_OPTIONS_FUTURE.md`](./docs/PAYMENT_OPTIONS_FUTURE.md) | Évaluation préliminaire de Maviance/Smobilpay, NotchPay et SupraPay sans intégration de paiement. |

## Limites du MVP

La version actuelle ne vérifie pas une CNI contre une base d’autorité émettrice, ne transmet pas de document réel à un fournisseur KYC et n’effectue aucun paiement Mobile Money. Les intégrations de production doivent être implémentées côté serveur avec des secrets sécurisés, des webhooks authentifiés, des contrôles de rôles et une validation conformité préalable.
