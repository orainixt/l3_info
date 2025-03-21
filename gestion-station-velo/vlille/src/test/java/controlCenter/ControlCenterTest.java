package controlCenter;

import org.junit.jupiter.api.AfterEach;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import redistribute.Redistribute;
import redistribute.RedistributeClassic;
import station.Station;
import station.StationBike;
import transport.Transport;
import transport.bike.Bike;
import util.exception.NotAvailableException;
import worker.Repairer;
import worker.Worker;

import java.io.ByteArrayOutputStream;
import java.io.PrintStream;
import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

public class ControlCenterTest {

    private ControlCenter controlCenter;
    private Station station1;
    private Station station2;
    private Station station3;
    private Transport bike1;
    private Transport bike2;
    private Transport bike3;
    private Transport bike4;
    private Worker worker;
    private List<Worker> workers;
    private ByteArrayOutputStream outContent;

    @BeforeEach
    public void setUp() {
        Transport.idC = 0;
        Redistribute r = new RedistributeClassic();
        controlCenter = new ControlCenter(r);
        station1 = new StationBike(10);
        station2 = new StationBike(10);
        station3 = new StationBike(1);
        bike1 = new Bike(10);
        bike2 = new Bike(10);
        bike3 = new Bike(0);
        bike4 = new Bike(0);
        worker = new Repairer(2);
        workers = new ArrayList<>();
        workers.add(worker);
        outContent = new ByteArrayOutputStream();
        System.setOut(new PrintStream(outContent));
    }

    @AfterEach
    public void setDown() {
        System.setOut(System.out);
    }

    @Test
    public void testAddStation() {
        controlCenter.addStation(station1);
        assertEquals(1, controlCenter.getStations().size());
        assertSame(station1, controlCenter.getStations().get(0));
    }

    @Test
    public void testRemoveStation() {
        controlCenter.addStation(station1);
        assertEquals(1, controlCenter.getStations().size());
        controlCenter.removeStation(station1);
        assertEquals(0, controlCenter.getStations().size());
    }

    @Test
    public void testAddWorker() {
        controlCenter.addWorker(workers);
        assertEquals(1, controlCenter.getWorkers().size());
        assertSame(worker, controlCenter.getWorkers().get(0));
    }

    @Test
    public void testRemoveWorker() {
        controlCenter.addWorker(workers);
        assertEquals(1, controlCenter.getWorkers().size());
        controlCenter.removeWorker(worker);
        assertEquals(0, controlCenter.getWorkers().size());
    }

    @Test
    public void testTakeTransport() throws NotAvailableException {
        controlCenter.addStation(station1);
        station1.dropTransport(0, bike1);
        assertTrue(controlCenter.getAllTransports().contains(bike1));
        station1.takeTransport(0);
        assertTrue(controlCenter.getTransportTaken().contains(bike1));
        String s = bike1.toString() + " has been take in " + station1.toString();
        assertTrue(outContent.toString().contains(s));
    }

    @Test
    public void testDropTransport() throws NotAvailableException {
        controlCenter.addStation(station1);
        assertTrue(controlCenter.getAllTransports().isEmpty());
        station1.dropTransport(0, bike1);
        assertTrue(controlCenter.getAllTransports().contains(bike1));
        String s = bike1.toString() + " has been drop in " + station1.toString();
        assertTrue(outContent.toString().contains(s));
    }

    @Test
    public void testReorganize() throws NotAvailableException {
        controlCenter.addStation(station1);
        controlCenter.addStation(station2);
        station1.dropTransport(0, bike1);
        station1.dropTransport(1, bike2);
        assertTrue(station2.isEmpty());
        station2.addInterval();
        station2.addInterval();
        station2.addInterval();
        assertFalse(station1.isEmpty());
        assertFalse(station2.isEmpty());
        assertTrue(outContent.toString().contains("Reorganize called"));
        assertTrue(outContent.toString().contains("Reorganize done"));
    }

    @Test
    public void testImpossibleReorganize() throws NotAvailableException {
        controlCenter.addStation(station1);
        controlCenter.addStation(station2);
        station1.dropTransport(0, bike3);
        station1.dropTransport(1, bike4);
        assertTrue(station2.isEmpty());
        station2.addInterval();
        station2.addInterval();
        station2.addInterval();
        assertFalse(station1.isEmpty());
        assertTrue(station2.isEmpty());
    }

    @Test
    public void testWorkerWork() throws NotAvailableException {
        controlCenter.addStation(station1);
        controlCenter.addWorker(workers);
        station1.dropTransport(0, bike3);
        controlCenter.checkInterval();
        assertTrue(bike3.isInWork());
        String expectedStartOutput = bike3.toString() + "start these repairs";
        assertTrue(outContent.toString().contains(expectedStartOutput));
        assertTrue(outContent.toString().contains("Current work interval for " + bike3.toString() + ": " + bike3.getWorkInterval() + " / " + 2));
        controlCenter.checkInterval();
        String expectedRepairedOutput = bike3.toString() + " is repaired.";
        assertTrue(outContent.toString().contains(expectedRepairedOutput));
    }

    @Test
    public void testCheckInterval() throws NotAvailableException {
        controlCenter.addStation(station1);
        controlCenter.addStation(station2);
        controlCenter.addStation(station3);
        station1.dropTransport(0, bike1);
        station1.dropTransport(1, bike3);
        station2.dropTransport(0, bike4);
        controlCenter.addWorker(workers);
        assertEquals(2, station1.getTransports().size());
        assertEquals(1, station2.getTransports().size());
        assertEquals(0, station3.getTransports().size());
        assertFalse(bike3.isInWork());
        assertFalse(bike4.isInWork());
        controlCenter.checkInterval();
        assertEquals(station1.getInterval(), 0);
        assertEquals(station2.getInterval(), 0);
        assertEquals(station3.getInterval(), 1);
        station3.dropTransport(0, bike3);
        assertTrue(bike3.isInWork());
        assertTrue(bike4.isInWork());
        assertEquals(0, bike1.getNbOfNotUse());
        controlCenter.checkInterval();
        assertEquals(station3.getInterval(), 2);
    }
}
