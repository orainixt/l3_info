package afficheur;

/**
 * Class Afficheur
 */
public class Afficheur {
    public static Afficheur afficheur = getInstance();

    /**
     * Constructor of the Afficheur Object  
     * It's private so we only have one global object
     */
    private Afficheur(){}


    /**
     * This is the method used to build the Afficheur Object
     * He's static so we only have one global object
     * @return Global Afficheur Object
     */
    public static Afficheur getInstance(){
        if (afficheur == null){
            afficheur = new Afficheur();
        }
        return afficheur;
    }

    /**
     * affiche's the main (and only) function of the Afficheur Object 
     * It allows us to print Strings
     * @param s The string we want to print 
     */
    public void affiche(String s){
        System.out.println(s);
    }
}
