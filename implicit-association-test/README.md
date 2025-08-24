# Test d'association implicite (TAI)

Ceci est le dépôt GitHub pour le projet de Test d'Association Implicite (TAI), demandé par la Faculté des Sciences et Technologies (FST) de l'Université de Lille et réalisé par Omayma EL KADAOUI, Anis REKIMA et Lucas SAUVAGE. 

## Sommaire 

- [Contexte](#contexte) 
- [Présentation du projet](#présentation-du-projet)
- [Installation et configuration](#installation-et-configuration)
    - [Prérequis](#prérequis)
    - [Installation](#installation)
        - [Base de données](#base-de-données) 
        - [Application](#application)
- [Déroulement du test](#déroulement-du-test) 
    - [Séquence des phases du test](#séquence-des-phases-du-test)
    - [Collecte des données](#collecte-des-données)
    - [Analyse des données](#analyse-des-données)

## Contexte 

Le Test d'Association Implicite (TAI) est un outil largement utilisé en psychologie sociale pour révéler des biais inconscients ou implicites. Ces biais peuvent influencer les jugements et comportements, sans que l’utilisateur en ait conscience.

## Présentation du projet

Ces dernières décennies, les effets indirects de la société sur les processus cognitifs ont été largement étudiés dans le domaine des sciences humaines et sociales

Plus particulièrement, en 1998, Anthony GREENWALD propose une expérience dans le but d'étudier les biais implicite présents chez chacun.

Il choisit alors 4 catégories qui iront par paires, avec une paire représentant des concepts et une autre représentant des attributs. Chaque catégorie aura un ensemble de mot, et il faudra classer les mots dans les bonnes catégories selon deux configurations distinctes : une première où les associations correspondent aux stéréotypes attendus (condition congruente), et une seconde où elles s'y opposent (condition incongruente), permettant ainsi de révéler les biais implicites par la comparaison des temps de réaction entre ces deux conditions.

## Installation et configuration 

Ce projet utilise un système client/serveur en Node.js avec MongoDB comme base de données. L'installation et le lancement sont gérés par un `Makefile`.

### Prérequis 

Assurez vous d'avoir installé : 
- Node.js 
- npm 
- MongoDB
- make 

### Installation

**Cloner le dépôt** : 
```bash 
git clone https://gitlab.univ-lille.fr/anis.rekima.etu/implicite-association-test 
cd implicite-association-test
```

#### Base de données

```bash
make create-mongo # Créer le dossier de base de données MongoDB
make fill-words # Remplir la base de données avec les mots du test portant sur le genre
make fill-admin # Ajouter le super-admin (Essentiel pour ajouter d'autres admins) 
# identifiant : superadmin
# password : superadmin
```

#### Application 

```bash 
make dependecies # Installer les dépendances
```

**Lancement tout en un** : 
```bash 
make run 
```

**Lancement séparé** : 
```bash 
make mongo    # Démarre MongoDB
make server   # Démarre le serveur back-end
make webpack  # Compile les fichiers front-end avec Webpack
```

## Déroulement du test 

### Séquence des phases du test 

1. **Affichage d'une première paire de catégories**, l'utilisateur doit classer les mots en fonction des catégories (gauche/droite).
2. **Changement de paire de catégories**.
3. **Condition congruente** (catégories combinées selon les stéréotypes attendus).
4. Répétition de la condition congruente.
5. **Inversion des catégories d’attributs** (ex. position dans le document de sciences et lettres échangées).
6. **Condition incongruente**.
7. Répétition de la condition incongruente.



### Collecte des données 

Conformément aux recommandations de Greenwald, on collecte les temps des conditions congruentes et incongruentes, et on ne collectera pas les temps des blocs d'entraînements (i.e. Etapes 1-2-5). 

De plus, les temps de réactions sont bornés entre 300 et 3000 ms. En effet, si l'utilisateur répond en moins de 300 ms, on peut considérer qu'il ne réfléchit pas et répond pour se débarrasser du test. C'est pourquoi le résultat du test est invalidé si l'utilisateur a classifié plus de 10% des mots en moins de 300 ms. 

Dans l'étude de Greenwald, il définit la borne supérieure à 3000 ms car il considère que si l'utilisateur répond trop lentement, c'est probablement dû à une perte d'attention.


### Analyse des données 

Le but de ce test étant de déterminer s'il existe des biais implicites, on calculera un score en fonction des temps de réactions de l'utilisateur. 

La formule est la suivante : 
$$
D = \frac{\bar{X}_{\text{incompatible}} - \bar{X}_{\text{compatible}}}{SD_{\text{pooled}}}
$$ 

Avec $\bar{X}$ la **moyenne** des temps des conditions, et $SD_{\text{pooled}}$ l'**écart-type standardisé** (aussi appelé **écart-type** ***pooled***). 

L'écart-type mesure la dispersion d'un ensemble de données par rapport à la moyenne, c'est à dire qu'il indique à quel point les données varient par rapport à la moyenne. 

L'écart-type standardisé est utilisé pour combiner les 2 ensembles (congruent / incongruent) ayant chacun leur propre moyenne et écart-type. Il est utilisé pour standardiser une différence entre deux groupes. 

Voici la formule : 
$$
SD_{\text{pooled}} = \sqrt{ \frac{(n_1 - 1)s_1^2 + (n_2 - 1)s_2^2}{n_1 + n_2 - 2} }
$$

Avec $n_1$ et $n_2$ qui représentent les tailles des deux groupes, $s_1$ et $s_2$ l'écart-type respectif des deux groupes. Comme les groupes sont de même taille, on peut écrire : 
$$SD_{\text{pooled}} = \sqrt{ \frac {s_1^2 + s_2^2}{2} } $$ 

Le résultat, le **score D**, est compris entre -2 et 2 (même si usuellement on considère qu'il est compris entre -1 et 1), et est utilisé pour indiquer l'intensité du biais. 

On prend la valeur absolue (en prenant en compte la direction) et on renvoie un résultat selon ce tableau : 

| Valeur du résultat       |       | Intensité           |
|--------------------------|-------|----------------------|
| $0 \leq dScore \leq .15$ | ⟶    | Aucun biais          |
| $.15 < dScore \leq .35$  | ⟶    | Faiblement biaisé    |
| $.35 < dScore \leq .65$  | ⟶    | Modérément biaisé    |
| $dScore > .65$           | ⟶    | Fortement biaisé     |

La direction du score permet d’identifier vers quelle condition se manifeste le biais.







