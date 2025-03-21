import config 
import unittest
from tiles.TileHc import TileHc
from tiles.TileType import TileType

class TestTileHc(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileHc() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south, TileType.NULL)
        self.assertEqual(self.tile.east, TileType.ROAD)
        self.assertEqual(self.tile.west, TileType.NULL) 