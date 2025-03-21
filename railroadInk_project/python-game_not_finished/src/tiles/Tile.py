from TileType import TileType 

class Tile: 
    #def __init__(self,north,south,east,west):
    def __init__(self,**args):
        """
        attribute north, south, east and west must be of TileType type
        """
        if len(args) == 0:
            self.north = self.south = self.east = self.west = TileType.NULL
        else:
            self.north = args.get('north', TileType.NULL)
            self.south = args.get('south', TileType.NULL)
            self.east = args.get('east', TileType.NULL)
            self.west = args.get('west', TileType.NULL)
            self.position = None 

    def __eq__(self,other): 
        # """
        # equals method, if not equals returns False and if same Object but different attributes return a customized message
        # """
        # if not isinstance(other,Tile):
        #     print("Not same Object")
        #     return False 
        
        # if not (self.north == other.north):
        #     print(f"north attributes are not the same"
        #           f"\nattribute north for self : ${self.north}."
        #           f"\nattribute north for other : ${other.north}") 
        #     return False 
            
        # if not (self.south == other.south) :
        #     print(f"south attributes are not the same"
        #           f"\nattribute south for self : ${self.south}."
        #           f"\nattribute south for other : ${other.south}")
        #     return False 
            
        # if not (self.east == other.east) :
        #     print(f"east attributes are not the same"
        #           f"\nattribute east for self : ${self.east}."
        #           f"\nattribute east for other : ${other.east}")
        #     return False 

        # if not (self.west == other.west) :
        #     print(f"west attributes are not the same"
        #           f"\nattribute west for self : ${self.west}."
        #           f"\nattribute west for other : ${other.west}")
        #     return False 
        
        # return True 

        return (isinstance(other, Tile ) and
                    self.north == other.north and
                    self.south == other.south and
                    self.east == other.east and
                    self.west == other.west)
        
        
    
    def __repr__(self) -> str:
        return f"Tile(north={repr(self.north)}, south={repr(self.south)}, east={repr(self.east)}, west={repr(self.west)})"

    def set_north(self,north): 
        self.north = north 

    def set_south(self,south): 
        self.south = south
    
    def set_east(self,east): 
        self.east = east 
    
    def set_west(self,west): 
        self.west = west 

    def set_position(self,position):
        self.position = position

    
    def get_north(self):
        return self.north 
    
    def get_south(self):
        return self.south 
    
    def get_east(self):
        return self.east 
    
    def get_west(self):
        return self.west
        

    # def print_tile(self):
    #     """
    #     speaks for itself
    #     """
    #     north_name = self.north.name if self.north else "None"
    #     south_name = self.south.name if self.south else "None"
    #     east_name = self.east.name if self.east else "None"
    #     west_name = self.west.name if self.west else "None"

    #     print(f"The north of the tile is {north_name} type\n"
    #       f"The south of the tile is {south_name} type\n"
    #       f"The east of the tile is {east_name} type\n"
    #       f"The west of the tile is {west_name} type\n")

    def print_tile(self):
        
        north_name = self.north.name if isinstance(self.north, TileType) else "None"
        south_name = self.south.name if isinstance(self.south, TileType) else "None"
        east_name = self.east.name if isinstance(self.east, TileType) else "None"
        west_name = self.west.name if isinstance(self.west, TileType) else "None"

        print(f"The north of the tile is {north_name} type\n"
            f"The south of the tile is {south_name} type\n"
            f"The east of the tile is {east_name} type\n"
            f"The west of the tile is {west_name} type\n")


    def print_tile_for_game(self):
        """
        print the tile, used in the game loop to display available / selected tiles
        """
        top,mid,bot = [],[],[]

        north = self.get_abbreviation(self.north)
        south = self.get_abbreviation(self.south)
        east = self.get_abbreviation(self.east)
        west = self.get_abbreviation(self.west)

        top.append(f"  {north}  |")
        mid.append(f"{west}  {east}|")
        bot.append(f"  {south}  |")

        print("+------+")
        print("|" + "".join(top) + "|")
        print("|" + "".join(mid) + "|")
        print("|" + "".join(bot) + "|")
        print("+------+")

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
        
    def rotate_right_once(self): 
        """
        speaks for itself
        """

        temp_south = self.south
        temp_east = self.east
        temp_west = self.west
    
        self.east = self.north
        self.south = temp_east 
        self.west = temp_south
        self.north = temp_west
    
    def rotate_right_multiple_times(self,x):   
        """
        speaks for itself
        """
        for _ in range(x) :
            self.rotate_right_once()
    
    def rotate_left_once(self): 
        """
        speaks for itself
        """
        temp_south = self.south
        temp_east = self.east
        temp_west = self.west

        self.west = self.north
        self.south = temp_west
        self.east = temp_south
        self.north = temp_east

    def rotate_left_mutliple_times(self,x):   
        """
        speaks for itself
        """
        for i in range(x): 
            self.rotate_left_once()

    def check_north(self,other_tile):
        """
        "other_tile" is ... an other tile, must be Tile type
        """ 
        return self.north == other_tile.south; 

    def check_south(self,other_tile):
        """
        "other_tile" is ... an other tile, must be Tile type
        """ 
        return self.south == other_tile.north; 

    def check_east(self,other_tile):
        """
        "other_tile" is ... an other tile, must be Tile type
        """ 
        return self.east == other_tile.west; 

    def check_west(self,other_tile):
        """
        "other_tile" is ... an other tile, must be Tile type
        """ 
        return self.west == other_tile.east; 

    # def check_border(self,border,other_tile):
    #     """
    #     "border" attribute is an int : 0 for north , 1 for south , 2 for east and 3 for west (if someone has a better solution !!)
    #     "other_tile" is ... an other tile, must be Tile type 
    #     """

    #     checking = {
    #         0: self.check_north,
    #         1: self.check_south,
    #         2: self.check_east,
    #         3: self.check_west
    #     }
    #     if border in checking: 
    #         return checking[border](other_tile)
    #     else : 
    #         raise ValueError("border must be between 0 and 3 (included)")
    

    def copy(self): 
        return Tile(north = self.north,south = self.south,east = self.east,west = self.west)