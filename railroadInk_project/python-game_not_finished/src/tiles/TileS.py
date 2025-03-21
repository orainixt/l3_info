from Tile import Tile
from TileType import TileType

class TileS(Tile): 
    
    def __init__(self,**args): 
        super(TileS, self).__init__(**{"north":TileType.ROAD,"south":TileType.TRAIN})
    def blbl(self):
        print("need to define a function or error")