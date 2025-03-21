import config
import unittest 
from tiles.Tile import Tile 
from tiles.TileType import TileType

class TestTile(unittest.TestCase): 

    def setUp(self): 
        self.road_tile = Tile()
        self.road_tile.set_north(TileType.ROAD)
        self.road_tile.set_south(TileType.ROAD)
        self.road_tile.set_east(TileType.ROAD)
        self.road_tile.set_west(TileType.ROAD)

    
    def test_eq_when_not_empty_ok(self): 
        road_tile_copy = self.road_tile.copy() 
        self.assertTrue(self.road_tile == road_tile_copy)

    def test_rotate_right_once_ok(self):
        self.road_tile.set_north(TileType.TRAIN)
        self.road_tile.set_south(TileType.ROAD)
        self.road_tile.set_east(TileType.TRAIN)
        self.road_tile.set_west(TileType.ROAD)

        self.road_tile.rotate_right_once() 

        self.assertEqual(self.road_tile.north, TileType.ROAD)
        self.assertEqual(self.road_tile.south, TileType.TRAIN)
        self.assertEqual(self.road_tile.east, TileType.TRAIN) 
        self.assertEqual(self.road_tile.west, TileType.ROAD)

    def test_rotate_right_four_times_ok(self): 
        self.road_tile.set_north(TileType.TRAIN)
        self.road_tile.set_south(TileType.ROAD)
        self.road_tile.set_east(TileType.TRAIN)
        self.road_tile.set_west(TileType.ROAD)

        self.road_tile.rotate_right_multiple_times(4) 

        self.assertEqual(self.road_tile.north, TileType.TRAIN)
        self.assertEqual(self.road_tile.south, TileType.ROAD)
        self.assertEqual(self.road_tile.east, TileType.TRAIN) 
        self.assertEqual(self.road_tile.west, TileType.ROAD)

    def test_rotate_left_once_ok(self):
        self.road_tile.set_north(TileType.TRAIN)
        self.road_tile.set_south(TileType.ROAD)
        self.road_tile.set_east(TileType.TRAIN)
        self.road_tile.set_west(TileType.ROAD)

        self.road_tile.rotate_left_once() 

        self.assertEqual(self.road_tile.north, TileType.TRAIN)
        self.assertEqual(self.road_tile.south, TileType.ROAD)
        self.assertEqual(self.road_tile.east, TileType.ROAD) 
        self.assertEqual(self.road_tile.west, TileType.TRAIN)

    def test_rotate_right_four_times_ok(self): 
        self.road_tile.set_north(TileType.TRAIN)
        self.road_tile.set_south(TileType.ROAD)
        self.road_tile.set_east(TileType.TRAIN)
        self.road_tile.set_west(TileType.ROAD)

        self.road_tile.rotate_left_mutliple_times(4) 

        self.assertEqual(self.road_tile.north, TileType.TRAIN)
        self.assertEqual(self.road_tile.south, TileType.ROAD)
        self.assertEqual(self.road_tile.east, TileType.TRAIN) 
        self.assertEqual(self.road_tile.west, TileType.ROAD)

    def test_check_border_when_copy_ok(self): 
        road_tile_copy = self.road_tile.copy() 
        self.assertTrue(self.road_tile.check_border(0,road_tile_copy))
        self.assertTrue(self.road_tile.check_border(1,road_tile_copy))
        self.assertTrue(self.road_tile.check_border(2,road_tile_copy))
        self.assertTrue(self.road_tile.check_border(3,road_tile_copy))

class TestTileEmpty(unittest.TestCase): 

    def setUp(self): 
        self.empty_tile = Tile()

    def test_setup_when_empty_ok(self):
        self.assertEqual(TileType.NULL,self.empty_tile.north)
        self.assertEqual(TileType.NULL,self.empty_tile.south)
        self.assertEqual(TileType.NULL,self.empty_tile.east)
        self.assertEqual(TileType.NULL,self.empty_tile.west)

    def test_setters_when_empty_ok(self): 
        self.empty_tile.set_north(TileType.ROAD)
        self.empty_tile.set_south(TileType.ROAD)
        self.empty_tile.set_east(TileType.ROAD)
        self.empty_tile.set_west(TileType.ROAD)

        self.assertEqual(self.empty_tile.north, TileType.ROAD)
        self.assertEqual(self.empty_tile.south, TileType.ROAD)
        self.assertEqual(self.empty_tile.east, TileType.ROAD)
        self.assertEqual(self.empty_tile.west, TileType.ROAD)

    def test_eq_when_empty_ok(self): 
        empty_tile_copy = Tile() 
        self.assertTrue(self.empty_tile.__eq__(empty_tile_copy))


if __name__ == '__main__':
    unittest.main()
