import random 

class Dice: 
    def __init__(self): 
        self.faces = []

    def roll_dice(self): 
        return random.choice(self.faces)