from Tile import Tile
from TileType import TileType 

class TileSr(Tile): 
    
    def __init__(self,**args): 
        super().__init__(**{"north":TileType.TRAIN,"south":TileType.TRAIN,"east":TileType.TRAIN,"west":TileType.ROAD})

    def blbl(self):
        print("need to define a function or error")

    def get_description(self):
        return "|SR |"