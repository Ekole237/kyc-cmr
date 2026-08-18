# Notes de recherche — intégrations Cameroun

## Constats vérifiés le 18 août 2026

| Sujet | Constat | Source officielle |
|---|---|---|
| Vérification d’identité | Smile ID présente une couverture de six catégories de documents camerounais, dont les cartes nationales d’identité, et décrit un parcours de vérification documentaire combiné à une comparaison faciale. | [Smile ID — Cameroon](https://smile.id/countries/cameroon) |
| MTN Mobile Money | Le portail MTN MoMo présente les produits Collection, Disbursement, Collection Widget et Remittances. Il mentionne un parcours développeur comprenant environnement de test, création de clé API, `RequestToPay`, consultation de statut et contrôle d’utilisateur. | [MTN MoMo API](https://momo.mtn.com/api/) |
| Orange Money | Orange expose officiellement le produit « Orange Money Web Payment / M Payment » et un parcours d’application marchand via son portail développeur. La page consultée ne rend toutefois pas les détails d’API dans cette session ; la disponibilité pays, les URL de retour et les identifiants de production devront être confirmés directement lors de l’onboarding marchand. | [Orange Developer — OM Web Payment](https://developer.orange.com/apis/om-webpay) |
| CinetPay Collect | CinetPay présente son offre comme disponible au Cameroun, avec des méthodes Mobile Money et une API de checkout ou une API Direct. La page indique aussi la consultation de statut et les webhooks de changement de statut pour les paiements et transferts. | [CinetPay Collect](https://cinetpay.com/products/payments), [CinetPay API Direct](https://cinetpay.com/products/api-direct) |
| Intégration Smile ID | La vérification de document Smile ID accepte une image de document, un selfie, des images de liveness et une URL de callback. L’API REST `POST /v3/document_verification` est asynchrone, renvoie un `202 Accepted` avec une référence de job, puis adresse le résultat final au callback. Les statuts documentés sont `clear`, `attention`, `block` et `error`. | [Smile ID — Document Verification](https://docs.usesmileid.com/products/onboarding-with-biometrics/document-verification.md) |

## Implication d’architecture

Les clés et appels de vérification ou de paiement ne doivent pas être placés dans l’application Expo. Le mobile doit appeler des procédures côté serveur, qui portent l’authentification fournisseur, créent les demandes, vérifient les retours et persistent uniquement les références nécessaires aux dossiers et transactions.

Les descriptions ci-dessus confirment l’existence de capacités fournisseur ; elles ne confirment pas à elles seules l’éligibilité contractuelle d’une entité donnée ni la disponibilité de chaque produit dans le compte de production. La documentation finale devra donc prévoir des étapes d’onboarding et de validation avec les partenaires.

## Décision proposée pour le MVP

Pour la vérification, choisir Smile ID comme premier adaptateur car sa couverture de documents camerounais et son contrat de traitement asynchrone sont explicitement documentés. Pour l’encaissement, prévoir une interface `PaymentProvider` avec CinetPay comme premier adaptateur d’agrégation, car l’offre indique une présence au Cameroun ; conserver des adaptateurs distincts MTN MoMo et Orange Money pour les entreprises qui obtiennent des contrats directs auprès des opérateurs.
