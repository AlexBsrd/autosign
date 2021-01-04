# !/bin/bash

read -p "Prénom de la personne : " surname
read -p "Nom de la personne : " name
read -p "Mot de passe campus : " passwd

sed -i "s/prenom/$surname/" appel.js
sed -i "s/IDENTIFIANT.*/IDENTIFIANT=$surname.$name/" .env
sed -i "s/PASSWORD.*/PASSWORD=$passwd/" .env

echo "Si vous lancez ce script pour la première fois, pensez à changer le lien vers la semaine de présence"
echo "En utilisant sh change_week.sh"

