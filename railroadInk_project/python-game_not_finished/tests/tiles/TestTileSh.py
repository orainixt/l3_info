import config 
import unittest
from tiles.TileSh import TileSh
from tiles.TileType import TileType

class TestTileSh(unittest.TestCase): 

    def setUp(self): 
        self.tile = TileSh() 

    def test_init_ok(self): 
        self.assertEqual(self.tile.north, TileType.ROAD)
        self.assertEqual(self.tile.south,TileType.ROAD)
        self.assertEqual(self.tile.east, TileType.ROAD)
        self.assertEqual(self.tile.west, TileType.TRAIN) 