import config 
import unittest
from tiles.TileHh import TileHh
from tiles.TileType import TileType

class TestTileHh(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileHh() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south,TileType.ROAD)
        self.assertEqual(self.tile.east, TileType.ROAD)
        self.assertEqual(self.tile.west, TileType.ROAD) 