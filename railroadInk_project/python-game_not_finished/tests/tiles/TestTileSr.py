import config 
import unittest
from tiles.TileSr import TileSr
from tiles.TileType import TileType

class TestTileSr(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileSr() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.TRAIN)
        self.assertEqual(self.tile.south,TileType.TRAIN)
        self.assertEqual(self.tile.east, TileType.TRAIN)
        self.assertEqual(self.tile.west, TileType.ROAD) 