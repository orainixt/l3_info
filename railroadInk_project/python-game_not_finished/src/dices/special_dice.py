from dice import Dice

from tiles.TileS import TileS
from tiles.TileSc import TileSc
from tiles.TileHr import TileHr

class SpecialDice(Dice): 
    def __init__(self): 
        super().__init__()
        self.faces = [TileHr(),TileSc(),TileS()]