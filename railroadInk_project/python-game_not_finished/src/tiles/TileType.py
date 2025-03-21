from enum import Enum 

class TileType(Enum): 
    RIVER = 1 
    TRAIN = 2 
    ROAD = 3 
    NULL = 4

#TileType.RIVER return TileType.RIVER
#TileType.RIVER.name return RIVER
#TileType.RIVER.value return 1 