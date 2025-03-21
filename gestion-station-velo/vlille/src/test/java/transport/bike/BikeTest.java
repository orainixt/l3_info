package transport.bike;

import org.junit.jupiter.api.Test;
import transport.Transport;
import transport.TransportTest;

import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;

public class BikeTest extends TransportTest{


    @Override
    protected Transport createTransport(){
        return new Bike(5); 
    }

    @BeforeEach 
    public void init() {
        Transport.idC = 0;
        this.transport = this.createTransport();
    }

    @Test 
    public void testBikeToString(){
        String testBikeString = "Bike " + transport.getId() +" ";
        assertEquals(testBikeString,transport.toString());
    }


}
