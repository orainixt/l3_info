package transport.decorator;

import org.junit.jupiter.api.Test;
import transport.Transport;
import transport.bike.*;
import transport.trottinette.Trottinette;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;

public class BasketDecoratorTest {
    
    protected Bike bike; 
    protected TransportDecorator decoratedBike; 

    protected Trottinette trottinette; 
    protected TransportDecorator decoratedTrottinette; 

    @BeforeEach
    public void init(){
        Transport.idC = 0;
        bike = new Bike(10);
        decoratedBike = new BasketDecorator(bike);
        
        trottinette = new Trottinette( 10);
        decoratedTrottinette = new BasketDecorator(trottinette); 

    }


    @Test
    public void testGetThreshold() {
        assertEquals(10,decoratedBike.getThreshold());
        assertEquals(10,decoratedTrottinette.getThreshold());
    }

    @Test
    public void testNbUtilisationWhenZero(){
        assertEquals(0,decoratedBike.getNbUtilisation()); 
        assertEquals(0,decoratedTrottinette.getNbUtilisation()); 
    }

    @Test
    public void testNbUtilisationWhenIncreased(){
        decoratedBike.addNbUtilisation();
        decoratedTrottinette.addNbUtilisation();
        assertEquals(1,decoratedBike.getNbUtilisation());
        assertEquals(1,decoratedTrottinette.getNbUtilisation()); 
    }

    @Test public void isAvailableOkAtCreation(){
        assertTrue(decoratedBike.isAvailable()); 
        assertTrue(decoratedTrottinette.isAvailable());
    }

    @Test 
    public void isAvailableFalseWhenMaxTreshold(){
        for(int i=0 ; i<12;i++){
            decoratedBike.addNbUtilisation();
            decoratedTrottinette.addNbUtilisation();
        }
        assertFalse(decoratedBike.isAvailable()); 
        assertFalse(decoratedTrottinette.isAvailable()); 
    }

    @Test
    public void testSetAvailable(){ //a refaire
        assertTrue(decoratedBike.isAvailable());
        assertTrue(decoratedTrottinette.isAvailable()); 
    }

    @Test 
    public void testNbOfNotUseAtCreation(){
        assertEquals(0,decoratedBike.getNbOfNotUse()); 
        assertEquals(0,decoratedTrottinette.getNbOfNotUse());
    }

    @Test 
    public void testAddNbOfNotUse(){
        decoratedBike.addNbOfNotUse();
        decoratedTrottinette.addNbOfNotUse();
        assertEquals(1,decoratedBike.getNbOfNotUse());
        assertEquals(1,decoratedTrottinette.getNbOfNotUse()); 
    }

    @Test
    public void testResetNbOfNotUse(){
        decoratedBike.addNbOfNotUse();
        decoratedTrottinette.addNbOfNotUse();

        decoratedBike.resetNbOfNotUse();
        decoratedTrottinette.resetNbOfNotUse();

        assertEquals(0,decoratedBike.getNbOfNotUse());
        assertEquals(0,decoratedTrottinette.getNbOfNotUse());
    }

    @Test 
    public void testBasketDecoratorToString(){
        String testBikeString = "Bike " + bike.getId() + " with a basket";
        String testTrottinetteString = "Trottinette " + trottinette.getId() + " with a basket";
        assertEquals(testBikeString,decoratedBike.toString()); 
        assertEquals(testTrottinetteString,decoratedTrottinette.toString()); 
    }



}
