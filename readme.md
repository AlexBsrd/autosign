###### :pencil2: Author : Alex Broussard 
# Remplissage automatique du formulaire d'appel

### :warning: Prérequis : 
- `node`
- `npm`
- `git`

### :construction: Installation : 
Placer vous dans le répertoire de votre choix
```bash 
git clone https://gitlab.com/alexbsd/autosign.git
```
Allez dans le répertoire du projet
```bash 
cd autosign
```
Installez les dépendances
```bash 
npm install
```

### :wrench: Configuration : 
Lancer le script d'installation automatique et renseignez votre prénom, votre nom et votre mot de passe campus.
```bash 
sh setup.sh
```
Renseignez le lien vers votre page de présence de la semaine à l'aide du script `change_week.sh`
```bash 
sh change_week.sh
```

### :heavy_check_mark: Utilisation : 

Pour l'utiliser, placez vous simplement à la racine du projet et lancez la commande 
```bash 
node appel.js
```
Vous verrez dans la console si le script a fonctionné où si vous avez rencontré des erreurs.
Vous pouvez également voir le dernier état du navigateur si ça a fonctionné en ouvrant le png généré `<votreprenom>.png`.
Le script va automatiquement envoyer un mail sur votre adresse prenom?nom@mines-ales.fr pour vous dire si l'appel a fonctionné ou non.

### :broken_heart: Erreurs que j'ai rencontré

En installant le bot sur mon raspberry, le navigateur n'arrivait pas à se lancer.
J'ai donc du installer moi-même chromium-browser sur ma machine en exécutant la commande `sudo apt-get install chromium-browser` et en décommentant la ligne 52 du fichier `appel.js` que j'ai écrite pour ce cas précis : 
```javascript
50 const browser = await puppeteer.launch({
51         //Uncomment optional line if you use custom path (for example on Raspberry with your own chromium-browser)
52        // executablePath: '/usr/bin/chromium-browser',
53        headless: true,
54        //height à 2500 pour voir toutes la semaine sur la page de présence
55        defaultViewport: { height: 2500, width: 1920 },
56        args: ['--no-sandbox','--disable-extensions']
57    });
```
###### En installant moi même chromium et en lancant le script j'ai vu qu'il me manquait des librairies, si vous rencontrez ce problème les libraires seront écrites dans le message d'erreur. Si vous n'arrivez pas à les installer n'hésitez pas à utiliser Google ou à me demander directement de vous aider.
______

### :star2: Pour aller plus loin (Linux)
Vous pouvez paramétrer une tâche automatique sur votre machine qui lancera la commande `node appel.js` automatiquement à l'heure voulue.
Personnellement pour ça j'ai utilisé l'utilitaire `crontab` présent sur linux.
Lancez la commande suivante et choisissez un éditeur de texte parmi ceux qui vous sont proposés
```bash 
crontab -e
```
Et ajoutez par exemple la ligne suivante à la fin du fichier
```bash 
30 08 20 11 * node ~/autosign/appel.js
```
L'utilitaire `crontab` utilise la syntaxe `minutes heure jour mois année <commande>`, la ligne ci-dessus va donc lancer (chaque année mais on s'en fout) la commande `node ~/autosign/appel.js` le 20 Novembre à 8h30. 


#### :grey_question: Questions

###### Si vous avez des questions je suis joignable sur [Facebook](https://www.facebook.com/bsdalex/) ou par mail en cliquant sur l'enveloppe [:email:](mailto:alex.broussard@mines-ales.org)
