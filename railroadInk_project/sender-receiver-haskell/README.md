# sender-receveir-haskell 

Ceci est le dépôt contenant l'outil permettant de communiquer avec le réflecteur fourni pour ce projet. 

Ce dépôt contient les versions de ces outils codées en Haskell. 

[Code Haskell](./websocket.hs) : Code permettant la connextion au réflecteur.

[Fichier Input](./input.txt) : Fichier contenant les messages à envoyer au réflecteur.

[Fichier Ouptup](./output.txt) : Fichier contenant les réponses du réflecteur (optionnel).

## Commandes

Pour lancer le réflecteur : 

```
#Par défaut, le réflecteur se lance sur le port 3000
$ ./reflector

#Optionnel : Spécifiez un port personnalisé
$ ./reflector --port=xxxx
```

Pour lancer le client 
```
#Pour compiler le programme
$ ghc -o websocket-client websocket.hs

#Pour lancer le programme sur le port 3000
$ ./websocket-client
```

## Fonctionnement 

Cet outil permet de lire dans un fichier [*input.txt*](./input.txt) les différents messages à envoyer au réflecteur.  

Le réflecteur renvoie alors des messages en fonctions des messages reçus. 

Par exemple pour les messages : 

    "
    1 ENTERS 
    1 LEAVES
    2 ENTERS
    "

Le rélecteur renvoie : 

    "
        (127.0.0.1 connected)
    1 ENTERS
    1 LEAVES
    2 ENTERS
        (127.0.0.1 disconnected)
    2 LEAVES
    "


Si les messages ne remplissent pas les conditions imposées par le réflecteur, il renvoie une erreur. 

Par exemple pour les messages : 

    "
    1 ENTERS 
    1 LEAVES
    2 ENTERS
    Mauvaise typo 
    "

Le réflecteur renvoie : 

    "
        (127.0.0.1 connected)
    1 ENTERS
    1 LEAVES
    2 ENTERS
        (127.0.0.1 disconnected)
    2 LEAVES
        (2 misbehaved)
    "

## Autres versions 

Pour ce projet nous avons implementé un outil en Haskell, mais il existe également une version de cet outil en **Java** et en **Python** 

[**Outil Python**](https://gitlab-etu.fil.univ-lille.fr/railroad-dream-team/sender-receiver-python)  || [**Outil Java**](https://gitlab-etu.fil.univ-lille.fr/railroad-dream-team/sender-receiver-java)
