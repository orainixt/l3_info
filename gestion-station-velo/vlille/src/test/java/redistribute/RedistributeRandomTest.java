package redistribute;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import station.StationBike;
import station.StationComponent;
import transport.Transport;
import transport.bike.Bike;

import java.util.ArrayList;
import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;

class RedistributeRandomTest {

    private RedistributeRandom redistributeRandom;
    private List<StationComponent> stations;
    private Bike bike1;
    private Bike bike2;
    private Bike bike3;
    private List<Transport> bikeList;
    private StationComponent station1;
    private StationComponent station2;

    @BeforeEach
    public void setUp() {
        redistributeRandom = new RedistributeRandom();
        stations = new ArrayList<>();
        station1 = new StationBike(1);
        station2 = new StationBike(1);
        bikeList = new ArrayList<>();
        bike1 = new Bike(10);
        bike2 = new Bike(20);
        bike3 = new Bike(0);
        station1.addTransport(0, bike1);
    }

    @Test
    public void testRedistributionWithAvailableTransport() {
        stations.add(station1);
        stations.add(station2);
        bikeList.add(bike1);

        redistributeRandom.redistribution(stations, bikeList);
        int totalTransports = station1.getNumberOfTransports() + station2.getNumberOfTransports();
        assertEquals(1, totalTransports);
    }

    @Test
    void testRedistributionWithFullStations() {
        station1.addTransport(0, bike1);
        station2.addTransport(0, bike2);
        stations.add(station1);
        stations.add(station2);
        bikeList.add(bike1);
        bikeList.add(bike2);

        redistributeRandom.redistribution(stations, bikeList);
        assertEquals(1, station1.getNumberOfTransports());
        assertEquals(1, station2.getNumberOfTransports());
    }

    @Test
    public void testRedistributionWithEmptyStations() {
        StationBike station1 = new StationBike(5);
        StationBike station2 = new StationBike(5);
        stations.add(station1);
        stations.add(station2);
        redistributeRandom.redistribution(stations, new ArrayList<>());
        assertEquals(0, station1.getNumberOfTransports());
        assertEquals(0, station2.getNumberOfTransports());
    }

    @Test
    public void testRedistributionWithMultipleTransports() {
        stations.add(station1);
        stations.add(station2);
        station2.addTransport(0, bike1);
        station1.addTransport(0, bike2);
        bikeList.add(bike1);
        bikeList.add(bike2);
        redistributeRandom.redistribution(stations, bikeList);
        int totalTransports = station1.getNumberOfTransports() + station2.getNumberOfTransports();
        assertEquals(2, totalTransports);
    }

    @Test
    public void testNotRedistribution() {
        stations.add(station1);
        stations.add(station2);
        station2.addTransport(0, bike3);
        redistributeRandom.redistribution(stations, bikeList);
        int totalTransports = station1.getNumberOfTransports() + station2.getNumberOfTransports();
        assertEquals(2, totalTransports);
        assertEquals(bike3,station2.getTransport(0));
    }
}
