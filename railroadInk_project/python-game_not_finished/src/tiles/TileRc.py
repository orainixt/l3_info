from Tile import Tile
from TileType import TileType

class TileRc(Tile):

    def __init__(self,**args):  
        super().__init__(**{"north":TileType.TRAIN,"east":TileType.TRAIN})
        
    def blbl(self):
        print("need to define a function or error")

    def get_description(self):
        return "|Rc |"