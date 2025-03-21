package transport.trottinette;

import static org.junit.jupiter.api.Assertions.assertEquals;


import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import transport.Transport;
import transport.TransportTest;

public class TrottinetteTest extends TransportTest{


    @Override 
    protected Transport createTransport(){
        return new Trottinette(5); 
    }

    @BeforeEach
    public void init(){
        Transport.idC = 0;
        this.transport = this.createTransport();
    }

    @Test 
    public void testTrottinetteToString(){
        String testTrottinetteString = "Trottinette " + transport.getId() +" ";
        assertEquals(testTrottinetteString,transport.toString());
    }




}
