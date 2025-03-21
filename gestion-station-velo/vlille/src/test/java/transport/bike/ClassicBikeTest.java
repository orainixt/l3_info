package transport.bike;

import org.junit.jupiter.api.Test;
import transport.Transport;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import transport.TransportTest;

public class ClassicBikeTest extends TransportTest {


    @Override
    protected Transport createTransport(){
        return new ClassicBike(5); 
    }
    
    @BeforeEach
    public void init() {
        Transport.idC = 0;
        this.transport = this.createTransport();
    }


    @Test 
    public void testClassicBikeToString(){
        String testBikeString = "Bike " + transport.getId() + " is classic";
        assertEquals(testBikeString,transport.toString());
    }


}
