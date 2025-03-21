from Tile import Tile
from TileType import TileType

class TileR(Tile): 
    
    def __init__(self,**args):  
        super().__init__(**{"north":TileType.TRAIN,"south":TileType.TRAIN})

    def blbl(self):
        print("need to define a function or error")

    def get_description(self):
        return "|R  |"