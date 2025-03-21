from tiles.Tile import Tile
from tiles.TileType import TileType
from tiles.TileHh import TileHh
from tiles.TileRr import TileRr
from tiles.TileSh import TileSh
from tiles.TileShr import TileShr
from tiles.TileSr import TileSr
from tiles.TileSs import TileSs
from utils.position import Position

class Board: 

    BOARD_SIZE = 7 

########################################################################################################################################################################
#here's the code for the initialization of the BOARD 
########################################################################################################################################################################

    def __init__(self): 
        self.size = Board.BOARD_SIZE
        self.grid = [[None for _ in range(Board.BOARD_SIZE)] for _ in range(Board.BOARD_SIZE)]
        self.exit_tiles = []
        self.special_tiles = []
        self.initialize_exit_tiles()
        self.init_special_tiles()


    def initialize_exit_tiles(self):
        self.set_exit_for_rows()
        self.set_exit_for_columns()

    def set_exit_for_rows(self): 
        """
        set exit tiles which are on row edge
        """
        self.exit_tiles.append((0,1,TileType.ROAD,"SOUTH")) 
        self.exit_tiles.append((0,3,TileType.TRAIN,"SOUTH"))
        self.exit_tiles.append((0,5,TileType.TRAIN,"SOUTH"))

        board_size = self.size - 1 

        self.exit_tiles.append((board_size,1,TileType.ROAD,"NORTH"))
        self.exit_tiles.append((board_size,3,TileType.TRAIN,"NORTH"))
        self.exit_tiles.append((board_size,5,TileType.ROAD,"NORTH")) 

    def set_exit_for_columns(self): 
        """
        set exit tiles which are on column edge
        """
        self.exit_tiles.append((1,0,TileType.TRAIN,"WEST")) 
        self.exit_tiles.append((3,0,TileType.ROAD,"WEST"))
        self.exit_tiles.append((5,0, TileType.TRAIN,"WEST"))

        board_size = self.size - 1 

        self.exit_tiles.append((1,board_size,TileType.TRAIN,"EAST"))
        self.exit_tiles.append((3,board_size,TileType.ROAD,"EAST"))
        self.exit_tiles.append((5,board_size,TileType.TRAIN,"EAST"))


    def init_special_tiles(self):
        """
        init special tiles (those user can use once per game)
        """
        self.special_tiles.append(TileHh())
        self.special_tiles.append(TileRr())
        self.special_tiles.append(TileSh())
        self.special_tiles.append(TileShr())
        self.special_tiles.append(TileSr())
        self.special_tiles.append(TileSs())

    def is_exit_tile(self,row,col):
        """
        checks if the tile is an exit tile 
        """
        return any((row,col) == (exit_tile[0],exit_tile[1]) for exit_tile in self.exit_tiles)

########################################################################################################################################################################
#here's all the getters and setters for game class
########################################################################################################################################################################

    def get_size(self):
        """
        get board size
        """
        return Board.BOARD_SIZE

    def get(self, *args):
        match args:
            case (position,):
                row = position.get_row()
                column = position.get_column()
                return self.grid[row][column]
            case (x, y):
                return self.grid[x][y]

    def set(self, *args): 
        match args: 
            case (position,tile):
                row = position.get_row()
                col = position.get_column() 
                self.grid[row][col] = tile 
                tile.position = position 
            case (x,y,tile):
                self.grid[x][y] = tile 
                tile.position = Position(x,y)


########################################################################################################################################################################
#here's all the game rules
########################################################################################################################################################################

    def is_within_bounds(self,x,y):
        """
        check if index's out of bounds
        """
        return (x > -1 and x < self.get_size()) and (y > -1 and y < self.get_size())
    
    def is_valid_position(self,position):
        """
        check if position's out of bounds
        """
        row = position.get_row()
        column = position.get_column() 

        return (row > -1 and row < self.get_size()) and (column > -1 and column < self.get_size())


    def place_tile(self,tile, position): 
        x = position.get_row()
        y = position.get_column()
        self.set_tile(x,y,tile)    
            

########################################################################################################################################################################
#here's all the methods to display the board 
########################################################################################################################################################################

    def display_board(self):
        self.display_special_tiles()
        print("\n\t\t THE GAME")
        print(self.get_row_separator())
        
        for row in range(self.size):
            row_display = self.get_row_display(row)
            print("\n".join(row_display))
            
            if row < self.size - 1:
                print(self.get_row_separator())
        
        print(self.get_row_separator())
    

    def display_special_tiles(self):
        print("\nYou can use these special tiles once per game\n")

        print(self.get_special_tiles_list_display())

        print(self.get_special_row_separator())

        top, middle, bottom = [], [], []

        for tile in self.special_tiles:
            self.append_tile_display(tile, top, middle, bottom)

        print("|" + "".join(top) + "|")
        print("|" + "".join(middle) + "|")
        print("|" + "".join(bottom) + "|")

        print(self.get_special_row_separator())
        print(tile.get_description(), end=" ")
        print("\n")
        
    def get_row_display(self, row):
        top, middle, bottom = [], [], []
        
        for col in range(self.size):
            tile = self.grid[row][col]
            if tile is None:
                # if self.is_exit_tile(row,col): 
                #     self.append_exit_tile_display(top,middle,bottom)
                # else: 
                #     self.append_empty_tile(top,middle,bottom)
                self.append_empty_tile(top,middle,bottom)
            else:
                self.append_tile_display(tile, top, middle, bottom)
        
        return ["|" + "".join(top) + "|", "|" + "".join(middle) + "|", "|" + "".join(bottom) + "|"]
    
    def append_empty_tile(self, top, middle, bottom):
        top.append("      |")
        middle.append("      |")
        bottom.append("      |")
    
    def append_tile_display(self, tile, top, middle, bottom):
        north = self.get_abbreviation(tile.get_north())
        south = self.get_abbreviation(tile.get_south())
        east = self.get_abbreviation(tile.get_east())
        west = self.get_abbreviation(tile.get_west())
        
        top.append(f"  {north}  |")
        middle.append(f"{west}  {east}|")
        bottom.append(f"  {south}  |")
    

    # def append_exit_tile_display(self,top,middle,bottom):
    #     for exit_tile in self.exit_tiles:
    #         border = exit_tile[3]  
    #         symbol = "EX"  

    #         if border == "NORTH":
    #             top.append(f"  {symbol}  |")
    #             middle.append(f"      |")
    #             bottom.append(f"      |")
    #         elif border == "SOUTH":
    #             top.append(f"      |")
    #             middle.append(f"      |")
    #             bottom.append(f"  {symbol}  |")
    #         elif border == "EAST":
    #             top.append(f"      |")
    #             middle.append(f"    {symbol}|")
    #             bottom.append(f"      |")
    #         elif border == "WEST":
    #             top.append(f"      |")
    #             middle.append(f"{symbol}    |")
    #             bottom.append(f"      |")

    def get_row_separator(self):
        return "+------" * self.get_size() + "+"
    
    def get_special_row_separator(self):
        return "+------+------+------+------+------+------+"

    def get_special_tiles_list_display(self):
        return "+--HH--+--RR--+--SH--+-SHR--+--SR--+--SS--+"
    
    def get_abbreviation(self, tile_type):
        color_codes = {
            TileType.RIVER: "\033[34m", 
            TileType.ROAD: "\033[36m",  
            TileType.TRAIN: "\033[33m",   
            TileType.NULL: "\033[37m",  
        }
        color_code = color_codes.get(tile_type, "\033[33m") 
        return f"{color_code}{self.get_tile_abbreviation(tile_type)}\033[0m"
    
    def get_tile_abbreviation(self, tile_type):
        abbreviations = {
            'ROAD': "Ro",
            'TRAIN': "Ra",
            'NULL': "  ",
            'RIVER': "Ri",
        }
        return abbreviations.get(tile_type.name, "XX")

    def get_neighbors_tiles(self, x, y):
        return [self.grid[x+1][y], self.grid[x][y+1], self.grid[x-1][y], self.grid[x][y-1]]

    def are_compatible(self,x1, y1, x2, y2, direction):
        if direction == "north":
            return self.get(x1,y1).get_north() == self.get(x2,y2).get_south()
        if direction == "south":
            return self.get(x1,y1).get_south() == self.get(x2,y2).get_north()
        if direction == "east":
            return self.get(x1,y1).get_east() == self.get(x2,y2).get_west()
        if direction == "west":
            return self.get(x1,y1).get_west() == self.get(x2,y2).get_east()