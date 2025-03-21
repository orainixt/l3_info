import config 
import unittest
from tiles.TileHj import TileHj
from tiles.TileType import TileType

class TestTileHj(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileHj() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south,TileType.ROAD)
        self.assertEqual(self.tile.east, TileType.ROAD)
        self.assertEqual(self.tile.west, TileType.NULL) 