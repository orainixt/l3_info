import unittest
from tiles.TileH import TileH
from game.board import Board 
from utils.position import Position

class TestBoard(unittest.TestCase):

    def setUp(self):
        self.board = Board()
        self.tile = TileH()

    def test_board_size(self):
        self.assertEqual(self.board.get_size(), 7)

    def test_initialize_exit_tiles(self):
        self.assertEqual(len(self.board.exit_tiles), 12) 

    def test_within_bounds(self):
        self.assertTrue(self.board.is_within_bounds(3, 3))  
        self.assertFalse(self.board.is_within_bounds(-1, 0)) 
        self.assertFalse(self.board.is_within_bounds(7, 7)) 

    def test_place_tile(self):
        position = Position(2, 3) 
        self.board.set(position,self.tile)
        self.assertEqual(self.board.get(position),self.tile)  

if __name__ == '__main__':
    unittest.main()