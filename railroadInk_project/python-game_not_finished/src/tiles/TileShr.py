from Tile import Tile
from TileType import TileType

class TileShr(Tile): 

    def __init__(self,**args): 
        super().__init__(**{"north":TileType.ROAD,"south":TileType.ROAD,"east":TileType.TRAIN,"west":TileType.TRAIN})

    def blbl(self):
        print("need to define a function or error")

    def get_description(self):
        return "|SHR|"
    