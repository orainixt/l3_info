from dice.dice import Dice

from tiles.TileS import TileS
from tiles.TileSc import TileSc
from tiles.TileHr import TileHr

import random 

class SpecialDice(Dice):  

    def __init__(self): 
        super().__init__()
        self.init_faces() 
    
    def init_faces(self): 
        self.faces = [TileS(),TileSc(),TileHr()] 

    def roll_dice(self): 
        return random.choice(self.faces)