# Options de paiement futures — Cameroun

## Décision actuelle

**Aucun paiement n’est intégré à KYC Cameroun.** La plateforme KYC ne demande ni clé de paiement, ni numéro de Mobile Money, ni autorisation de débit. Cette note sert uniquement à préparer une future évaluation fournisseur après validation commerciale, juridique et opérationnelle de la fintech.

## Options à instruire

| Option | Indications publiques vérifiées | Intérêt potentiel | Points à confirmer avant toute décision |
|---|---|---|---|
| **Maviance / Smobilpay** | Maviance présente Smobilpay comme une solution destinée notamment aux entreprises, banques et institutions financières de la région CEMAC. La page indique une intégration via API unique, des paiements, collectes, remises et capacités de rapprochement. [1] | Forte pertinence régionale et orientation institutionnelle/CEMAC. | Contrat, éligibilité fintech, produits disponibles, environnements sandbox, mécanismes d’authentification, notification d’état, commissions et règlement. |
| **NotchPay** | La documentation publique expose des canaux `CM` / `XAF`, dont MTN Mobile Money (`cm.mtn`) et Orange Money (`cm.orange`), ainsi que des bornes indicatives de montant. [2] | API publique détaillée et sélection dynamique de canaux par pays/devise. | Onboarding marchand, comptes de règlement, pays et canaux réellement activables pour l’entité, webhooks, plafonds contractuels et support. |
| **SupraPay** | Aucune documentation API publique et officielle suffisamment vérifiable n’a été identifiée dans la recherche menée pour ce projet. | Option à conserver seulement si une documentation fournisseur et un interlocuteur commercial sont fournis. | Dénomination exacte, contrat, portail développeur, couverture MTN/Orange, sandbox, sécurité, réconciliation et SLA. |

Maviance indique notamment que Smobilpay propose une intégration à des systèmes existants via une API unique et cite des capacités de collecte, paiement et remise. [1] La référence S3P publique de Smobilpay montre des opérations de collecte et de vérification de transaction, mais la documentation détaillée doit être obtenue dans le cadre du partenariat approprié. [3]

NotchPay documente un endpoint de ressources pouvant filtrer les canaux par pays (`CM`), devise (`XAF`) et type, avec des exemples MTN Mobile Money et Orange Money au Cameroun. [2] Cette information est utile pour une sélection dynamique à une date future, mais ne remplace pas la confirmation de l’éligibilité marchande ni les termes contractuels.

## Critères de sélection recommandés

| Critère | Question à poser au fournisseur |
|---|---|
| Couverture | MTN MoMo et Orange Money sont-ils disponibles pour la société et le produit concerné au Cameroun ? |
| Cycle de vie | Comment créer une intention, confirmer l’état final, annuler, expirer et rembourser ? |
| Webhooks | Quel mécanisme de signature, de rejeu, de déduplication et de rotation de secret est disponible ? |
| Rapprochement | Quelles références uniques, rapports de règlement et exports sont fournis ? |
| Risque | Quels plafonds, règles de fraude, procédures KYC marchand et mécanismes de litige s’appliquent ? |
| Exploitation | Existe-t-il un sandbox, un SLA, une astreinte, un support local et une procédure d’incident ? |

Quand la fintech décidera d’ajouter le paiement, l’implémentation devra rester côté serveur : création d’intention, clé d’idempotence, validation du montant XAF, stockage de la référence fournisseur, vérification d’un webhook signé et rapprochement. Le client mobile ne devra jamais définir seul un paiement comme réussi.

## Références

[1]: https://maviance.com/solutions/smobilpay/ "Maviance — Smobilpay"
[2]: https://developer.notchpay.co/api-reference/resources "NotchPay — Resources API"
[3]: https://apidocs.smobilpay.com/s3papi/API-Reference.2066448558.html "Smobilpay Cameroon S3P API Reference"
