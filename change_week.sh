# !/bin/bash

read -p "Lien vers la page de présence de la semaine : " weekLink

ESCAPED_REPLACE=$(printf '%s\n' "$weekLink" | sed -e 's/[\/&]/\\&/g') # Now you can use ESCAPED_REPLACE in the original sed statement

sed -i "s/LIEN_VERS_LA_PAGE_DE_PRESENCE_DE_LA_SEMAINE.*/LIEN_VERS_LA_PAGE_DE_PRESENCE_DE_LA_SEMAINE=$ESCAPED_REPLACE/" .env
