from Tile import Tile
from TileType import TileType

class TileSc(Tile):

    def __init__(self): 
        super().__init__(**{"north":TileType.ROAD,"east":TileType.TRAIN}) 

    def blbl(self):
        print("need to define a function or error")