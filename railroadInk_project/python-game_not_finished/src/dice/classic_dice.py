from dice.dice import Dice

from tiles.TileH import TileH
from tiles.TileHj import TileHj
from tiles.TileHc import TileHc
from tiles.TileR import TileR
from tiles.TileRj import TileRj
from tiles.TileRc import TileRc

import random 

class ClassicDice(Dice):  

    def __init__(self): 
        super().__init__()
        self.init_faces() 
    
    def init_faces(self): 
        self.faces = [TileH(),TileHj(),TileHc(),TileR(),TileRj(),TileRc()] 
