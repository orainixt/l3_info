from utils.position import Position

class Rules: 


########################################################################################################################################################################
#here's all the methods to check position
########################################################################################################################################################################
    def is_valid_position(self,board,position):
        """
        checks if the position's valid
        """ 
        return not (position.get_row() < 0 or position.get_row() >= board.get_size() or 
            position.get_column() < 0 or position.get_column() >= board.get_size())

########################################################################################################################################################################
#here's all the methods to check tiles 
########################################################################################################################################################################

    def is_positioning_ok(self,board,position,tile):
        #TO_REMOVE
        print(f"empty ? {self.is_tile_empty(board,position)}\nconnected ? {self.is_tile_connected_to_exit_tile(board,tile)}\n other ? {self.is_tile_connected_to_other(board,tile)}")
        return (self.is_tile_empty(board,position) and 
                (self.is_tile_connected_to_exit_tile(board,tile) 
                 or self.is_tile_connected_to_other(board,tile)))
    
    def is_tile_empty(self,board,position): 
        """
        checks if the board tile's empty at position
        """
        return (board.get(position) == None)


    def is_tile_connected_to_other(self,board,tile): 
        """
        we need to check    if tile.North matches with the south of the above tile
                            if tile.South matches with the north of tile below 
                            if tile.West mathes with the east of the one on the left
                            if tile.East matches with the west of the one on the right
        """

        print(f"Checking if the tile is connected to an other")

        row = tile.position.get_row()
        col = tile.position.get_column()
        
        # Les sorties sont checkées avant 
        if (row == 0 or row == 6) or (col == 0 or col == 6): 
            print("EDGESSSSSSSSSSS")
            pass
        

        else : 
            return (self.check_above(board,row,col,tile) 
                    or self.check_below(board,row,col,tile)
                    or self.check_right(board,row,col,tile) 
                    or self.check_left(board,row,col,tile))
    
    def check_above(self,board,row,col,tile): 
        above_position = Position(row+1,col)
        tile_above = board.get(above_position)
        if tile_above == None : 
            return False
        return tile.check_north(tile_above)

    def check_below(self,board,row,col,tile): 
        below_position = Position(row-1,col)
        tile_below = board.get(below_position) 
        if tile_below == None : 
            return False
        return tile.check_south(tile_below)

    def check_right(self,board,row,col,tile): 
        right_position = Position(row,col+1) 
        right_tile = board.get(right_position)
        if right_tile == None : 
            return False 
        return tile.check_east(right_tile) 

    def check_left(self,board,row,col,tile):
        left_position = Position(row,col-1) 
        left_tile = board.get(left_position)
        if left_tile == None : 
            return False
        return tile.check_west(left_tile)


    def is_tile_connected_to_exit_tile(self,board,tile):
        """
        the board has an attribute "exit_tiles" 
        this function checks if the tile's connected to an exit
        """
        print(f"Checking if its connected to an exit")
        row = tile.position.get_row()
        column = tile.position.get_column()
        for exit_tile in board.exit_tiles: 
            if exit_tile[0] == row and exit_tile[1] == column : 
                return self.is_border_ok_exit_tile(tile,exit_tile)
        return False 
    
    def is_border_ok_exit_tile(self,tile,exit_tile): 
        """
        used in {see is_connected_to_exit_tile()}         
        this function checks if the tile's border is the same as exit        
        """
        print("Checking if the border matches")
        exit_tile_type = exit_tile[2]
        border = exit_tile[3]


        
        if (border == "NORTH"): 
            print(f"exit_tile_border : {border}, type : {exit_tile_type}, tile border : {tile.north}")
            return tile.north == exit_tile_type
        if (border == "SOUTH"): 
            print(f"exit_tile_border : {border}, type : {exit_tile_type.value}, tile border : {tile.south.value}, ok : {tile.south.value == exit_tile_type.value}")  
            return tile.south.value == exit_tile_type.value
        if (border == "EAST"): 
            print(f"exit_tile_border : {border}, type : {exit_tile_type}, tile border : {tile.east}") 
            return tile.east == exit_tile_type
        if (border == "WEST"): 
            print(f"exit_tile_border : {border}, type : {exit_tile_type}, tile border : {tile.west}") 
            return tile.west == exit_tile_type
            
########################################################################################################################################################################
#here's all the methods to check the board 
########################################################################################################################################################################

    def is_time_over(self,game): 
        return game.nb_turn < 7