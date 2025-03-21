import config 
import unittest
from tiles.TileR import TileR
from tiles.TileType import TileType

class TestTileR(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileR() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.TRAIN)
        self.assertEqual(self.tile.south, TileType.TRAIN)
        self.assertEqual(self.tile.east, TileType.NULL)
        self.assertEqual(self.tile.west, TileType.NULL) 