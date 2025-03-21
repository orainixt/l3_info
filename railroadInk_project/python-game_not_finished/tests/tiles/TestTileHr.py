import config 
import unittest
from src.tiles.TileHr import TileHr
from src.tiles.TileType import TileType

class TestTileHr(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileHr() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south, TileType.ROAD)
        self.assertEqual(self.tile.east, TileType.TRAIN)
        self.assertEqual(self.tile.west, TileType.TRAIN) 