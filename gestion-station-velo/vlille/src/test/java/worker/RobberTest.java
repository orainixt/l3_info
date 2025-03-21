package worker;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import station.Station;
import station.StationBike;
import transport.Transport;
import transport.bike.Bike;
import util.exception.NotAvailableException;

import static org.junit.jupiter.api.Assertions.*;

public class RobberTest {

    private Robber robber;
    private Robber robber2;
    private Station station;
    private Transport bike1;
    private Transport bike2;

    @BeforeEach
    public void setUp() {
        Transport.idC = 0;
        robber = new Robber(1);
        robber2 = new Robber();
        station = new StationBike(10);
        bike1 = new Bike( 10);
        bike2 = new Bike( 10);
    }

    @AfterEach
    public void setDown() {
        System.setOut(System.out);
    }
    @Test
    public void RandomTest(){
        assertEquals(robber.getRandom(),1);
        assertTrue(robber2.getRandom()<= 20);
    }

    @Test
    public void testWork() throws NotAvailableException {
        java.io.ByteArrayOutputStream outContent = new java.io.ByteArrayOutputStream();
        System.setOut(new java.io.PrintStream(outContent));
        station.dropTransport(0,bike1);
        assertEquals(1, station.getTransports().size());
        robber.work(bike1, station);
        assertTrue(station.getTransports().isEmpty());
        assertTrue(outContent.toString().contains(bike1.toString() + "has been rob !"));
    }

    @Test
    public void testCanWorkTrue() throws NotAvailableException {
        station.dropTransport(0,bike1);
        bike1.addNbOfNotUse();
        bike1.addNbOfNotUse();
        assertTrue(robber.canWork(bike1, station));
    }

    @Test
    public void testCanWorkFalse() {
        bike1.addNbOfNotUse();
        assertFalse(robber.canWork(bike1, station));
    }

    @Test
    public void testWorkOnMultipleTransports() throws NotAvailableException {
        station.dropTransport(0,bike1);
        station.dropTransport(1,bike2);
        assertEquals(2, station.getTransports().size());
        robber.work(bike1, station);
        assertEquals(1, station.getTransports().size());
        assertFalse(station.getTransports().contains(bike1));
        assertTrue(station.getTransports().contains(bike2));
    }
}

