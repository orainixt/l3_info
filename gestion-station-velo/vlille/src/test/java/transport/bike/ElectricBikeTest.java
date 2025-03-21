package transport.bike;

import org.junit.jupiter.api.Test;
import transport.Transport;


import static org.junit.jupiter.api.Assertions.*;
import org.junit.jupiter.api.BeforeEach;
import transport.TransportTest;

public class ElectricBikeTest extends TransportTest{


    @Override
    protected Transport createTransport(){
        return new ElectricBike(5); 
    }
    
    @BeforeEach
    public void init() {
        Transport.idC = 0;
        this.transport = this.createTransport();
    }

    @Test 
    public void testElectricBikeToString(){
        String testBikeString = "Bike " + transport.getId() + " is elecrtic";
        assertEquals(testBikeString,transport.toString());
    }


}
