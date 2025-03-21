# Python Game 

Ceci est le dépôt correspondant à l'implémentation du jeu en orienté objet python.

## Règles du jeu

RailRoad Ink est un jeu prenant place sur un plateau constitué de tuiles que les joueurs piochent en lanceant des dés au début de chaque tour. 
Chaque joueur reçoit (dans la version basique) 4 tuiles à placer chaque tour. 

Quand le jeu est terminé (au bout de 7 tours), on compte les points et celui qui a le plus de points l'emporte. 
Pour marquer des points il faut créer les plus grandes routes possibles, et on compte également les routes dans le carré de 3x3 cases au milieu du plateau. 

## Makefile 

Afin d'avoir la liste complète des commandes relatives à l'éxecution des différentes règles du Makefile vous pouvez éxecuter : 

```
$ make help 
```

Ceci dit, voici une liste complète des règles du Makefile :

```
$ make test //execute les tests du projet
$ make clean //nettoie le dossier du projet 
```


## Conception 

<!-- Differentes macro pour les classes -->
[Tile]:./src/tiles/Tile.py
[TileType]:./src/tiles/TileType.py
[Dice]:./src/dice/dice.py
[ClassicDice]:./src/dice/classic_dice.py
[SpecialDice]:./src/dice/special_dice.py
[Game]:./src/game/game.py
[Rules]:./src/game/rules.py
[Board]:./src/game/board.py

Le fichier mère [**Tile**][Tile] définit les fonctions qui définissent les comportements basiques des Tuiles. 

Une [**Tile**][Tile] est défini par ces arguments :

    (TileType) north : The Tile type for the north border
    (TileType) south : The Tile type for the south border
    (TileType) east : The Tile type for the east border
    (TileType) west : The Tile type for the west border

La classe [**Tile**][Tile] définit les fonctions suivantes : 

    > __eq__(Tile) : boolean =: Compare 2 objets Tile
    > print_tile() : void  =: Affiche les attributs de la Tile 
    > rotate_right_multiple_times(int) : void  =: Tourne (int) fois la tuile
        cette fonction utilise rotate_right_once() (int) fois
    > rotate_left_multiple_times(int): void =: Idem 
    > check_border(int, Tile) : boolean =: Vérifie si la bordure représentée par le (int) est la même que l'autre (Tile) bordure. 
        cette fonction utilise check_(north/south/east/west)()
    > print_tile() =: Affiche la tuile 
    > print_tile_for_game() =: Affiche la tuile dans le jeu de l'utilisateur 
    > get_abbreviation() && get_tile_abbreviation() =: Utilisées dans print_tile_for_game() 

    
Les classes filles sont au nombre de **15** et chaque constructeur construit la tuile de la même manière pour toutes les tuiles : grâce à la classe enum [**TileType**][TileType] qui définit 3 attributs : 

    > ROAD
    > RIVER 
    > TRAIN 
    > NULL

Chaque tuile est différente donc chaque constructeur est différent. 
On peut cependant ensuite tourner les tuiles comme le joueur le souhaite, ce qui modifie uniquement la tuile concernée.  

Pour le jeu, on utilisera la classe [**Dice**][Dice] pour définir les dés utilisés dans la partie. Dans mon cas je définis les 2 dés du jeu de base, soit un [**ClassicDice**][ClassicDice] qui proposera 3 tuiles différentes par tour dans la liste suivante : H, Hj, Hc, R, Rj, Rc. 
Le [**SpecialDice**][SpecialDice] proposera 3 tuiles : S, Sc, Hr


La classe [**Rules**][Rules] permet au jeu de vérifier si le joueur peut poser sa tuile a la position X via un ensemble de tests correspondant aux régles du jeu. 
C'est à dire qu'une tuile ne peut être placée que si elle est connectée à une sortie ou si elle est connectée à une autre pièce (dont les bordures sont, évidemment, du même type). 
La classe définit les fonctions suivantes : 

    > is_tile_empty(Board, Position) : boolean =: Vérifie que la tuile à l'emplacement Position est vide (== None) 
    > is_tile_connected_to_other(Board, Tile) : boolean =: Vérifie si la tuile Tile peut être posée sur le tableau (càd si il y a une pièce aux alentours qui à une bordure du même type à l'endroit opposé)
    > check_****(Board, X, Y, Tile) : boolean =: 4 fonctions qui vérifient si la tuile correspond avec une aux alentours
    > is_tile_connected_to_exit_tile(Board, Tile) : boolean =: Vérifie si la tuile Tile est connectée à une exit_tile (liste définie dans Board) 
    > is_border_ok_exit_tile(List[exit_tiles], Tile) : boolean =: Vérifie si la bordure de la tuile Tile correspond à celle de l'exit_tile
    > is_time_over(Game) : boolean =: Vérifie si la durée du jeu ne dépasse pas 7 (selon les règles)  

La classe [**Board**][Board] permet d'initialiser le plateau de jeu, d'ajouter des tuiles à ce plateau et de dessiner le plateau de jeu. Il n'est pas utile de détailler les fonctions car elles n'implémentent pas la logique du jeu. 

La classe [**Game**][Game] quant à elle définit la logique du jeu via une méthode play(), détaillée dans "Déroulement du jeu" 

## Déroulement du jeu 





