import config 
import unittest
from tiles.TileS import TileS
from tiles.TileType import TileType

class TestTileS(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileS() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south,TileType.TRAIN)
        self.assertEqual(self.tile.east, TileType.NULL)
        self.assertEqual(self.tile.west, TileType.NULL) 