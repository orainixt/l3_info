from game.board import Board
from dice.classic_dice import ClassicDice
from dice.special_dice import SpecialDice
from game.rules import Rules
from utils.position import Position
import time 

class Game: 

    def __init__(self): 
        """
        nb_turn : Counts number of turns 
        """
        self.board = Board()

        self.classic_dice = ClassicDice()
        self.special_dice = SpecialDice()

        self.nb_turn = 0 
        self.rules = Rules()

    def play(self):
        """
        main function, run the game 
        """
        #before playing  

        #game loop
        while(self.nb_turn < 7): 

            print(f"Turn number : {self.nb_turn}\n")
            self.board.display_board()

            #dice rolling
            tile_list = [] 
            print(f"\nList of availables tiles:")
            for i in range(3):  
                tile = self.classic_dice.roll_dice()
                tile_list.append(tile) 
                print(f"\nTile number {i} :")
                tile.print_tile_for_game()
            

            special_tile = self.special_dice.roll_dice() 

            # print(f"Spéciale tuile disponible : \n {special_tile.print_tile_for_game()}")


            selected_tile = self.which_tile(tile_list)
            print(selected_tile)
            position_asked = self.which_position()
            selected_tile.set_position(position_asked)

            if (not self.rules.is_positioning_ok(self.board,position_asked,selected_tile)): 
                print(f"You can't place the tile here you cheater\nNow youre grounded for 10 seconds\n"); 
                time.sleep(10)
                print(f"Turn {self.nb_turn} again\n")


            else : 
                print("Placing tile on the board ...") 
                self.board.place_tile(selected_tile,position_asked)
                self.board.display_board()
                self.nb_turn += 1 



    

    def which_tile(self,tile_list): 
        """
        function used to ask which tile the player wants to select 
        it's recursive if the number's not within 0 and 2 
        """
        print("Which tile do you want to play ?\n")
        user_input = input("Number ? ...\n")
        try: 
            number = int(user_input) 
        except ValueError:
            print("This is not an int\n")
            self.which_tile(tile_list)
        if (0 <= number < len(tile_list)):
            return tile_list[number]
        else: 
            print(f"Please select a number between 0 and {len(tile_list) - 1}\n")
            self.which_tile(tile_list)


        
    def which_position(self): 
        """
        function used to ask which position the player wants to play
        it's recursive if the number's not in the board boundaries"""
        print("Which row ?") 
        row_input = input("Row ? ...\n")
        col_input = input("Col ? ... \n") 
        try: 
            int_row = int(row_input)
            int_col = int(col_input) 
        except ValueError:
            print("This is not an int\n")
            self.which_position() 
        if ((0 <= int_row < 7) and (0 <= int_col < 7)): 
            return Position(int_row,int_col)
        else:
            print(f"Please select 2 numbers between 0 and 6")
            self.which_position()
