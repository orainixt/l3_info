package station;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import transport.Transport;
import util.exception.NotAvailableException;

import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public abstract class StationTest {

    protected Station station;
    protected Transport transport1;
    protected Transport transport2;

    @BeforeEach
    public void setUp() {
        Transport.idC = 0;
        Station.idC = 0;
        station = createStation();
        transport1 = createTransport(1);
        transport2 = createTransport(5);
    }

    protected abstract Station createStation();

    protected abstract Transport createTransport(int threshold);

    @Test
    public void testId() {
        assertEquals(1, station.getId());
    }

    @Test
    public void testToString() {
        assertEquals("Station 1 ", station.toString());
    }

    @Test
    public void testDropTransportSuccess() throws NotAvailableException {
        List<Integer> lIndex = station.cellsAvailable(transport1);
        assertTrue(station.canDrop(lIndex.get(0), transport1));
        station.dropTransport(lIndex.get(0), transport1);
        assertEquals(1, station.getNumberOfTransports());
        assertTrue(station.getTransports().contains(transport1));
    }

    @Test
    public void testDropTransportFailureInvalidIndex() {
        assertThrows(NotAvailableException.class, () -> station.dropTransport(-1, transport1));
        assertThrows(NotAvailableException.class, () -> station.dropTransport(10, transport1));
    }


    @Test
    public void testDropTransportFailureFull() throws NotAvailableException {
        station.dropTransport(0, transport1);
        station.dropTransport(1, transport2);
        assertThrows(NotAvailableException.class, () -> station.dropTransport(2, transport1));
    }

    @Test
    public void testTakeTransportSuccess() throws NotAvailableException {
        station.dropTransport(0, transport1);
        Transport taken = station.takeTransport(0);
        assertEquals(transport1, taken);
        assertEquals(0, station.getNumberOfTransports());
    }

    @Test
    public void testTakeTransportFailure() throws NotAvailableException {
        station.dropTransport(0, transport1);
        transport1.addNbUtilisation();
        assertThrows(NotAvailableException.class, () -> station.takeTransport(0));
    }

    @Test
    public void testIsEmpty() throws NotAvailableException {
        assertTrue(station.isEmpty());
        station.dropTransport(0, transport1);
        assertFalse(station.isEmpty());
    }

    @Test
    public void testIsFull() throws NotAvailableException {
        assertFalse(station.isFull());
        station.dropTransport(0, transport1);
        assertFalse(station.isFull());
        station.dropTransport(1, transport2);
        assertTrue(station.isFull());
    }

    @Test
    public void testGetCapaMax() {
        assertEquals(2, station.getCapaMax());
    }

    @Test
    public void testCanDrop() throws NotAvailableException {
        assertTrue(station.canDrop(0, transport1));
        station.dropTransport(0, transport1);
        assertTrue(station.canDrop(1, transport2));
        station.dropTransport(1, transport2);
        assertFalse(station.canDrop(1, transport2));
    }

    @Test
    public void testCanDropFailureInvalidIndex() {
        assertFalse(station.canDrop(-1, transport1));
        assertFalse(station.canDrop(10, transport1));
    }

    @Test
    public void testDropAndTake() throws NotAvailableException {
        station.dropTransport(0, transport1);
        station.dropTransport(1, transport2);
        assertEquals(2, station.getNumberOfTransports());
        assertEquals(transport2, station.takeTransport(1));
        assertEquals(transport1, station.takeTransport(0));
        assertTrue(station.isEmpty());
    }

    @Test
    void testEquals() {
        assertEquals(station, station);
        assertNotEquals(station, createStation());
    }

    @Test
    public void testNotEquals() {
        Station anotherStation = createStation();
        assertNotEquals(station, anotherStation);
    }

    @Test
    public void testAddInterval() throws NotAvailableException {
        station.addInterval();
        assertEquals(1, station.getInterval());
    }

    @Test
    public void testResetInterval() throws NotAvailableException {
        station.addInterval();
        station.resetInterval();
        assertEquals(0, station.getInterval());
    }

    @Test
    public void testResetInterval_with0() {
        station.resetInterval();
        assertEquals(0, station.getInterval());
    }

}
