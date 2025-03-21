import config 
import unittest
from tiles.TileH import TileH 
from tiles.TileType import TileType

class TestTileH(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileH()
        print(self.tile)

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south, TileType.ROAD)
        self.assertEqual(self.tile.east, TileType.NULL)
        self.assertEqual(self.tile.west, TileType.NULL) 
    
    def test_with_equals(self):
        self.assertTrue(self.tile.north == TileType.ROAD)