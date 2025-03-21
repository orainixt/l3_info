import config 
import unittest
from tiles.TileRr import TileRr
from tiles.TileType import TileType

class TestTileRr(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileRr() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.TRAIN)
        self.assertEqual(self.tile.south, TileType.TRAIN)
        self.assertEqual(self.tile.east, TileType.TRAIN)
        self.assertEqual(self.tile.west,TileType.TRAIN) 