import unittest

from game.rules import Rules
from game.board import Board
from game.game import Game

from utils.position import Position

from tiles.TileH import TileH 

class TestRules(unittest.TestCase): 

    def setUp(self):
        self.rules = Rules()
        self.board = Board()

        self.game = Game()


        self.position = Position(4,5)
        self.board.set(self.position,TileH())
    

    def test_is_tile_empty_ok(self): 
        position = Position(3,4)
        self.assertTrue(self.rules.is_tile_empty(self.board,position))
        self.assertFalse(self.rules.is_tile_empty(self.board,self.position))

    def test_is_tile_connected_to_other_ok(self):
        self.assertFalse(self.rules.is_tile_connected_to_other(self.board,self.board.get(self.position)))
        self.board.set(Position(3,5),TileH()) 
        self.assertTrue(self.rules.is_tile_connected_to_other(self.board,self.board.get(self.position)))

    def test_is_border_ok_when_equals(self):
        exit_tile = self.board.exit_tiles[0] #TILE 0 1 ROAD SOUTH 
        self.assertTrue(self.rules.is_border_ok_exit_tile(TileH(),exit_tile))

    def test_is_tile_connected_to_exit_ok(self): 
        self.assertFalse(self.rules.is_tile_connected_to_exit_tile(self.board,self.board.get(self.position)))
        self.board.set(Position(6,1),TileH()) 
        self.assertTrue(self.rules.is_tile_connected_to_exit_tile(self.board,self.board.get(Position(6,1))))

    def test_is_time_over_ok(self): 
        self.assertFalse(self.rules.is_time_over(self.game)) 