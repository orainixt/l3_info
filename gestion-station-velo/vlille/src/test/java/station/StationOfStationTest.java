package station;

import controlCenter.ControlCenter;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import redistribute.Redistribute;
import redistribute.RedistributeClassic;
import transport.Transport;
import transport.bike.Bike;
import util.exception.NotAvailableException;
import java.util.ArrayList;
import java.util.List;


import static org.junit.jupiter.api.Assertions.*;

public class StationOfStationTest {

    private Station station1;
    private Station station2;
    private StationOfStation stationOfStation;
    private Transport bike1;
    private Bike bike2;
    ControlCenter c;
    Redistribute r;

    @BeforeEach
    public void setUp() {
        r = new RedistributeClassic();
        c = new ControlCenter(r);
        Transport.idC = 0;
        Station.idC = 0;
        StationOfStation.idC = 0;
        station1 = new StationBike(2);
        station2 = new StationBike(5);
        stationOfStation = new StationOfStation(10);
        bike1 = new Bike(1);
        bike2 = new Bike(5);
        stationOfStation.addStation(station1);
        c.addStation(stationOfStation);
    }

    @Test
    public void testId() {
        assertEquals(1, stationOfStation.getId());
    }

    @Test
    public void testToString() {
        assertEquals("Station 1", stationOfStation.toString());
    }

    @Test
    public void testAddStation() {
        stationOfStation.addStation(station2);
        List<Station> stations = new ArrayList<>();
        stations.add(station1);
        stations.add(station2);
        assertEquals(stations, stationOfStation.getStations());
    }

    @Test
    public void testRemoveStation() {
        stationOfStation.removeStation(station1);
        List<Station> stations = new ArrayList<>();
        assertEquals(stations, stationOfStation.getStations());
    }

    @Test
    public void testNotAddStation_WhenFull() {
        stationOfStation.addStation(station2);
        stationOfStation.addStation(station2);
        List<Station> stations = new ArrayList<>();
        stations.add(station1);
        stations.add(station2);
        assertEquals(stations, stationOfStation.getStations());
    }

    @Test
    public void testDropTransport_Success() throws NotAvailableException {
        List<Integer> availableCells = stationOfStation.cellsAvailable(bike1);
        assertFalse(availableCells.isEmpty());
        int index = availableCells.get(0);
        stationOfStation.dropTransport(index, bike1);
        assertEquals(1, stationOfStation.getNumberOfTransports());
        assertTrue(stationOfStation.getTransports().contains(bike1));
    }

    @Test
    public void testDropTransportFailure() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        stationOfStation.dropTransport(1, bike2);
        assertThrows(NotAvailableException.class, () -> stationOfStation.dropTransport(2, bike1));
    }


    @Test
    public void testResetInterval() throws NotAvailableException {
        stationOfStation.addInterval();
        assertEquals(1, stationOfStation.getInterval());
        stationOfStation.resetInterval();
        assertEquals(0, stationOfStation.getInterval());
    }

    @Test
    public void testIsEmpty() {
        assertTrue(stationOfStation.isEmpty());
    }

    @Test
    public void testIsFullButNotExactly() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        stationOfStation.dropTransport(1, bike2);
        assertTrue(stationOfStation.isFull());
        stationOfStation.addStation(station2);
        assertFalse(stationOfStation.isFull());
    }


    @Test
    public void testCannotTake() {
        stationOfStation.removeTransport(0, bike1);
        assertFalse(stationOfStation.canTake(0));
    }

    @Test
    public void testIndexOfTransport() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        assertEquals(0, stationOfStation.IndexOfTransport(bike1));
    }

    @Test
    public void testIndexOfTransportFailure() {
        assertEquals(-1, stationOfStation.IndexOfTransport(bike2));
    }

    @Test
    public void  testMaxCapa(){
        assertEquals(10,stationOfStation.getCapaMax());
    }


    @Test
    public void  testGetTransport(){
        stationOfStation.addTransport(0,bike1);
        assertEquals(bike1,stationOfStation.getTransport(0));
        assertNotEquals(bike1,stationOfStation.getTransport(1));
    }


    @Test
    public void testTakeTransport() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        Transport takenTransport = stationOfStation.takeTransport(0);
        assertEquals(bike1, takenTransport);
    }

    @Test
    public void testTakeTransportFailureNotAvailble() {
        assertThrows(NotAvailableException.class,() -> stationOfStation.takeTransport(0));
    }

    @Test
    public void testTakeTransportFailure() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        stationOfStation.removeTransport(0, bike1);
        assertThrows(NotAvailableException.class, () -> stationOfStation.takeTransport(0));
    }

    @Test
    public void testCanDrop_Success() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        assertFalse(stationOfStation.canDrop(0, bike1));
    }

    @Test
    public void testCanDropFailure() {
        Station station3 = new StationBike(3);
        Transport bike3 = new Bike(2);
        station3.addTransport(0, bike3);
        stationOfStation.addStation(station3);
        assertTrue(stationOfStation.canDrop(0, bike1));
    }

    @Test
    public void testRemoveTransport_Success() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        stationOfStation.removeTransport(0, bike1);
        assertFalse(stationOfStation.getTransports().contains(bike1));
    }

    @Test
    public void testSetC(){
        for(Station s : stationOfStation.getStations()){
            assertEquals(s.getC(),stationOfStation.getC());
        }
        stationOfStation.addStation(station2);
        for(Station s : stationOfStation.getStations()){
            assertEquals(s.getC(),stationOfStation.getC());
        }
    }


    @Test
    public void testTakeTransportFailureNotEnoughCapacity() throws NotAvailableException {
        stationOfStation.dropTransport(0, bike1);
        assertThrows(NotAvailableException.class, () -> stationOfStation.takeTransport(10));
    }
}
