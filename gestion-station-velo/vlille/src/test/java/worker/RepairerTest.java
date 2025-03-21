package worker;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import station.Station;
import station.StationBike;
import transport.Transport;
import transport.bike.Bike;

import static org.junit.jupiter.api.Assertions.*;

class RepairerTest {

    private Repairer repairer;
    private Station station;
    private Bike bike;
    private  Bike bikeDestroy;

    @BeforeEach
    void setUp() {
        Transport.idC = 0;
        repairer = new Repairer(3);
        station = new StationBike(5);
        bike = new Bike(3);
        bikeDestroy = new Bike(0);
    }

    @Test
    void testWorkWhenRepairIsNotCompleted() {
        station.addTransport(0, bike);
        repairer.work(bike, station);
        assertTrue(bike.isInWork());
        assertEquals(0, bike.getNbUtilisation());

    }

    @Test
    void testWorkWhenRepairYetCompleted() {
        station.addTransport(0, bike);
        bike.setInWork(true);
        bike.setInWork(true);
        repairer.work(bike, station);
        assertEquals(0, bike.getNbUtilisation());
    }

    @Test
    void testCanWorkWhenTransportIsUnavailable() {

        bike.addNbUtilisation();
        bike.addNbUtilisation();
        bike.addNbUtilisation();
        assertTrue(repairer.canWork(bike, station));
    }

    @Test
    void testCanWorkWhenTransportIsAvailable() {
        bike.addNbUtilisation(); // 1 utilisation
        assertFalse(repairer.canWork(bike, station));
    }

    @Test
    void testFinich(){
        bikeDestroy.addNbUtilisation();
        assertEquals(1,bikeDestroy.getNbUtilisation());
        repairer.work(bikeDestroy,station);
        repairer.work(bikeDestroy,station);
        repairer.work(bikeDestroy,station);
        assertFalse(bikeDestroy.isInWork());
        assertEquals(0,bikeDestroy.getNbUtilisation());
    }
}