# Projet 1 

Ceci est le dépôt git du Projet 1 de JSFS. 

Il s'agissait de créer un site web permettant aux utilisateurs de créer et d'organiser des votes avec qui le veut. 

## Conception 

Conformément au cahier des charges il ne peut y avoir qu'un seul administrateur sinon un message apparaît et bloque la page. 

Tous les voteurs votent pour le même vote. Lorsque le vote est cloturé par l'admin, le graphe du vote est affiché sur les pages des voteurs. 

Lorsqu'un admin clotûre un vote, il peut en relancer un de nouveau sans recharger la page, et qui sera également bien envoyé aux voteurs. 


## Execution 

Normalement les fichiers JSON sont paramétrés de sorte à ce que toutes les dépendances soient installés grâce à npm, mais si j'en ai loupé je m'en excuse. 

Pour lancer le projet dans sa globalité : 
```
$ make
```
Cette commande exécute ```build-client``` et ```start-server```

Pour lancer le client et actualiser le WebPack : 
```
$ make build-client 
```
Cette commande implique ```install-client```

Pour lancer le serveur : 
```
$ make start-server
```
Cette commande implique ```i nstall-server```
