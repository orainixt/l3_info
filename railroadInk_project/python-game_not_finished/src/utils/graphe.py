class Graphe:

    #test = {frozenset({1,2}), frozenset({1,3})}
    #print(frozenset({2,1}) in test)
    #print(frozenset({2,3}) in test)

    def __init__(self, board): 
        self.__sommets = []
        self.__aretes = {}
        self.__composantesConnexes = []
        self.init(board)
        
        def init(self, board):
            size = board.get_size()
            for x in range(size):
                for y in range(size):
                    tile = board.get(x,y)
                    if tile.get_north() != tile.get_east() != tile.get_south() != tile.get_west() != None and not tile in self.__sommets:
                        self.__composantesConnexes.append(self.calculSommetsAretesCompo(board, x, y))       

        def calculSommetsAretesCompo(self, board, x, y):
            self.__sommets.append(board.get(x,y))
            compo = [(x,y)]

            if x > 0 and board.are_compatible(x, y, x-1, y, north):
                self.__aretes.add(frozenset({ board.get(x,y) , board.get(x-1,y) }))
                if not board.get(x-1,y) in self.__sommets:
                    compo.update(self.calculSommetsAretesCompo(board, x-1, y))

            if x < size and board.are_compatible(x, y, x+1, y, south):
                self.__aretes.add(frozenset({ board.get(x,y) , board.get(x+1,y) }))
                if not board.get(x+1,y) in self.__sommets:
                    compo.update(self.calculSommetsAretesCompo(board, x+1, y))

            if y > 0 and board.are_compatible(x, y, x, y-1, west):
                self.__aretes.add(frozenset({ board.get(x,y) , board.get(x,y-1) }))
                if not board.get(x,y-1) in self.__sommets:
                    compo.update(self.calculSommetsAretesCompo(board, x, y-1))

            if y < size and board.are_compatible(x, y, x, y+1, east):
                self.__aretes.add(frozenset({ board.get(x,y) , board.get(x,y+1) }))
                if not board.get(x,y+1) in self.__sommets:
                    compo.update(self.calculSommetsAretesCompo(board, x, y+1))

            return compo  

        
        def contientCycles(self, compo):
            # nbSommets = 0
            # aretesCopy = self.__aretes.copy()
            # for sommet in compo:
            #     nbSommets += 1
            #     for voisin in aretesCopy

            # implémentation différente de aretes ?

        def plusLongCheminDeComposanteDepuisSommet(self, x, y, board, aretesRestantes, currentLength):
            north_aretes = frozenset({ board.get(x,y), board.get(x-1,y)})
            south_aretes = frozenset({ board.get(x,y), board.get(x+1,y)})
            west_aretes = frozenset({ board.get(x,y), board.get(x,y-1)})
            east_aretes = frozenset({ board.get(x,y), board.get(x,y+1)})

            north_length = 0
            south_length = 0
            west_length = 0
            east_length = 0

            if north_aretes in aretesRestantes:
                north_length = plusLongCheminDeComposanteDepuisSommet(x-1, y, board, aretesRestantes.copy().remove(north_aretes), currentLength+1)

            if south_aretes in aretesRestantes:
                south_length = plusLongCheminDeComposanteDepuisSommet(x+1, y, board, aretesRestantes.copy().remove(south_aretes), currentLength+1)
        
            if west_aretes in aretesRestantes:
                west_length = plusLongCheminDeComposanteDepuisSommet(x, y-1, board, aretesRestantes.copy().remove(west_aretes), currentLength+1)
            
            if east_aretes in aretesRestantes:
                east_length = plusLongCheminDeComposanteDepuisSommet(x, y+1, board, aretesRestantes.copy().remove(east_aretes), currentLength+1)
            
            return max(north_length, south_length, west_length, east_length, currentLength)

        def plusLongCheminDeComposante(self, compo):
            res = 0
            for x,y in compo:
                res = max(res, self.plusLongCheminDeComposanteDepuisSommet(x, y, board, self.__aretes.copy(), 0))
            return res

        def plusLongCheminDuGraphe(self):
            res = 0
            for compo in self.__composantesConnexes:
                res = max(res, self.plusLongCheminDeComposante(compo))
            return res