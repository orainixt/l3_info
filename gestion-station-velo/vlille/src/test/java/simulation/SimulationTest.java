package simulation;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import redistribute.Redistribute;
import redistribute.RedistributeClassic;
import station.StationComponent;
import transport.Transport;
import worker.Worker;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.*;

class SimulationTest {

    private Simulation simulation;
    private Redistribute Redistribute;
    private List<Worker> workers;

    @BeforeEach
    public void setUp() {
        Redistribute = new RedistributeClassic();
        workers = new ArrayList<>();
        simulation = new Simulation(Redistribute, workers);
    }

    @Test
    public void testInit() {
        assertNotNull(simulation);
    }
    @Test
    public void testInitControlCenter() {
        assertNotNull(simulation.getControlCenter());
    }

    @Test
    public void testInitStations() {
        List<StationComponent> stations = simulation.getControlCenter().getStations();
        assertFalse(stations.isEmpty());
    }

    @Test
    public void testInitTransports() {
        List<Transport> transports = simulation.getControlCenter().getAllTransports();
        assertFalse(transports.isEmpty());
    }




}