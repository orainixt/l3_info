from Tile import Tile
from TileType import TileType

class TileSs(Tile):

    def __init__(self,**args): 
        super().__init__(**{"north":TileType.ROAD,"south":TileType.TRAIN,"east":TileType.ROAD,"west":TileType.TRAIN})

    def blbl(self):
        print("need to define a function or error")

    def get_description(self):
        return "|SS |"
