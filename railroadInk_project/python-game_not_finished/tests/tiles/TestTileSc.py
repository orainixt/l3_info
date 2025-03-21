import config 
import unittest
from tiles.TileSc import TileSc
from tiles.TileType import TileType

class TestTileSc(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileSc() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south, TileType.NULL)
        self.assertEqual(self.tile.east, TileType.TRAIN)
        self.assertEqual(self.tile.west, TileType.NULL) 