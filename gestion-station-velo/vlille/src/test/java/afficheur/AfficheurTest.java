package afficheur;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.Test;

import static org.junit.jupiter.api.Assertions.*;

class AfficheurTest {

    @AfterEach
    public void setDown() {
        System.setOut(System.out);
    }


    @Test
    void testGetInstanceReturnsSameInstance() {
        Afficheur instance1 = Afficheur.getInstance();
        Afficheur instance2 = Afficheur.getInstance();
        assertSame(instance1, instance2);
    }

    @Test
    void testAfficheMethod() {
        java.io.ByteArrayOutputStream outContent = new java.io.ByteArrayOutputStream();
        System.setOut(new java.io.PrintStream(outContent));
        Afficheur.getInstance().affiche("Test");
        String s = "Test";
        assertTrue(outContent.toString().contains(s));
        System.setOut(System.out);
    }
}
