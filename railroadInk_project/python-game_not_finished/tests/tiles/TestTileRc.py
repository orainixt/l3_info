import config 
import unittest
from tiles.TileRc import TileRc
from tiles.TileType import TileType

class TestTileRc(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileRc() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.TRAIN)
        self.assertEqual(self.tile.south, TileType.NULL)
        self.assertEqual(self.tile.east, TileType.TRAIN)
        self.assertEqual(self.tile.west, TileType.NULL) 