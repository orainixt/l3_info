from Tile import Tile
from TileType import TileType

class TileH(Tile):
    """Classe des tuiles avec une autoroute droite traversante
    >>> t = TileH()
    >>> t.north
    <TileType.ROAD: 3>
    >>> t.north == TileType.ROAD
    True
    """

    def __init__(self,**args): 
        super().__init__(**{"north":TileType.ROAD,"south":TileType.ROAD})


    def get_description(self):
        return "|H  |"


if __name__ == '__main__':
    import doctest
    doctest.testmod(verbose=True)