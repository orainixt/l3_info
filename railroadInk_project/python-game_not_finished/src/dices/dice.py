import random

class Dice(): 
    def __init__(self):
        self.faces = []

    def roll_classic_dice(self):
        random_face = random.choice(self.faces)
        print(random_face.get_description())
        return random_face