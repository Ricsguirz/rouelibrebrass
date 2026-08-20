# Site du Roue Libre Brass — mode d'emploi

## Les fichiers

| Fichier | À quoi ça sert |
|---|---|
| `index.html` | Tout le **contenu** du site : les textes, les dates, les liens. C'est ici que tu modifies. |
| `style.css` | L'**apparence** : couleurs, tailles, mise en page. À toucher seulement si tu veux changer le style. |
| `images/` | Les **photos** : `hero.jpg` (accueil), `photo-1.jpg` à `photo-6.jpg` (galerie), `logo.png`. |
| `videos/` | Les **vidéos** : `video-1.mp4`, `video-2.mp4`, `video-3.mp4`. |

## Voir le site sur ton ordinateur

Double-clique sur `index.html`. Il s'ouvre dans ton navigateur. C'est exactement ce que verront les visiteurs.

Après chaque modification : enregistre le fichier, puis appuie sur **F5** dans le navigateur pour rafraîchir.

## Ajouter ou remplacer des photos

Dépose les nouvelles photos, en vrac et sans les retoucher, dans le dossier
`images/A-DEPOSER-ICI/`. Demande ensuite à Claude de les préparer : il les recadre,
les compresse et les met en place.

Si tu veux le faire toi-même : les photos de la galerie doivent s'appeler
`photo-1.jpg` à `photo-6.jpg`, l'image d'accueil `hero.jpg`, et le logo `logo.png`.
Passe-les d'abord sur https://squoosh.app pour descendre sous 300 Ko.

## Ce qu'il reste à faire

Il ne manque plus que la **vidéo** (voir ci-dessous). Tout le reste est en place :
textes, contact, formation, dates, photos et logo.

Ouvre `index.html` avec le Bloc-notes (clic droit > Ouvrir avec > Bloc-notes)
pour modifier un texte. Les endroits sensibles sont signalés par des commentaires en français.

## Ajouter ou remplacer une vidéo

Les vidéos sont hébergées directement sur le site, sans passer par YouTube.

Pour en **remplacer** une : dépose ton fichier `.mp4` dans le dossier `videos/`
en gardant le même nom (`video-1.mp4`, etc.).

Pour en **ajouter** une : dépose le fichier dans `videos/`, puis dans `index.html`,
section « Voir & écouter », copie un bloc entier :

```html
<figure class="video">
  <video controls preload="metadata" playsinline>
    <source src="videos/video-1.mp4" type="video/mp4">
  </video>
  <figcaption>Le Roue Libre Brass en action</figcaption>
</figure>
```

Change le nom du fichier et la légende.

⚠️ Garde des vidéos **courtes** (moins d'une minute) et sous **10 Mo**.
Les vidéos venant de WhatsApp sont déjà au bon format.

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
