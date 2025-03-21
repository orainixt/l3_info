import config 
import unittest
from tiles.TileSs import TileSs
from tiles.TileType import TileType

class TestTileSs(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileSs() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south,TileType.TRAIN)
        self.assertEqual(self.tile.east, TileType.ROAD)
        self.assertEqual(self.tile.west, TileType.TRAIN) 