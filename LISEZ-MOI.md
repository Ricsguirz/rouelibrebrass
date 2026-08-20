# Site du Roue Libre Brass — mode d'emploi

## Les fichiers

| Fichier | À quoi ça sert |
|---|---|
| `index.html` | Tout le **contenu** du site : les textes, les dates, les liens. C'est ici que tu modifies. |
| `style.css` | L'**apparence** : couleurs, tailles, mise en page. À toucher seulement si tu veux changer le style. |
| `images/` | Les **photos**. Remplace les fichiers provisoires par les vôtres, en gardant les mêmes noms. |

## Voir le site sur ton ordinateur

Double-clique sur `index.html`. Il s'ouvre dans ton navigateur. C'est exactement ce que verront les visiteurs.

Après chaque modification : enregistre le fichier, puis appuie sur **F5** dans le navigateur pour rafraîchir.

## Les 6 choses à remplacer

Ouvre `index.html` avec le Bloc-notes (clic droit > Ouvrir avec > Bloc-notes) et cherche les commentaires `<!-- À REMPLACER -->`.

1. **La phrase d'accroche** — sous le grand titre
2. **La bio du groupe** — section « Le groupe »
3. **Les chiffres clés** — 12 musiciens, année de création, etc.
4. **La vidéo YouTube** — voir ci-dessous
5. **L'e-mail et le téléphone** — section « Nous faire jouer » (chaque info apparaît 2 fois, change bien les deux)
6. **Les photos** — voir ci-dessous

## Remplacer les photos

1. Choisis 6 photos + 1 grande photo d'accueil.
2. Renomme-les : `hero.jpg` (l'accueil), puis `photo-1.jpg` à `photo-6.jpg`.
3. Colle-les dans le dossier `images/` en écrasant les fichiers provisoires.

⚠️ Réduis le poids des photos avant : une photo de 5 Mo rend le site lent sur mobile.
Passe-les sur https://squoosh.app (gratuit, sans inscription) et vise **moins de 300 Ko** par photo.

## Mettre la vidéo YouTube

1. Sur YouTube, ouvre ta vidéo > **Partager** > **Intégrer**.
2. Dans le code affiché, repère l'adresse `https://www.youtube.com/embed/xxxxxxxx`.
3. Dans `index.html`, colle-la entre les guillemets de `src=""` de la balise `<iframe>`.

## Ajouter une date de concert

Dans `index.html`, section « Prochaines dates ». Copie un bloc entier :

```html
<li class="date">
  <div class="date__when"><span class="date__day">12</span><span class="date__month">SEPT</span></div>
  <div class="date__what">
    <h3>Fête des vendanges</h3>
    <p>Tain-l'Hermitage (26) · 18 h 00 · Entrée libre</p>
  </div>
</li>
```

Colle-le juste en dessous, puis change le jour, le mois, le titre et le lieu.
Pense à supprimer les dates passées.

## Changer les couleurs

Dans `style.css`, tout en haut, le bloc `:root`. Change `--cuivre: #d98324;` par un autre
code couleur (choisis-en un sur https://coolors.co) et toute la charte du site suit.
