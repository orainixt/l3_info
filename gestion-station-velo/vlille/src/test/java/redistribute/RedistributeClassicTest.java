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

class RedistributeClassicTest {

    private RedistributeClassic redistributeClassic;
    private List<StationComponent> stations;
    private Bike bike;
    private Bike bike2;
    private List<Transport> bikeList;
    private StationComponent station1;
    private StationComponent station2;

    @BeforeEach
    void setUp() {
        redistributeClassic = new RedistributeClassic();
        stations = new ArrayList<>();
        station1 = new StationBike(1);
        station2 = new StationBike(1);
        bikeList = new ArrayList<>();
        bike = new Bike(10);
        bike2 = new Bike(20);
        station1.addTransport(0, bike);
    }

    @Test
    void testRedistributionWithAvailableTransport() {

        stations.add(station1);
        stations.add(station2);
        bikeList.add(bike);
        redistributeClassic.redistribution(stations, bikeList);
        assertEquals(1, station1.getTransports().size());
        assertEquals(0, station2.getTransports().size());
        assertEquals(bike, station1.getTransport(0));
    }

    @Test
    void testRedistributionWithFullStation() {
        station1.addTransport(0, bike);
        station2.addTransport(0, bike2);
        stations.add(station1);
        stations.add(station2);
        bikeList.add(bike);
        bikeList.add(bike2);
        redistributeClassic.redistribution(stations,bikeList);
        assertEquals(1, station1.getTransports().size());
        assertEquals(1, station2.getTransports().size());
    }

    @Test
    void testRedistributionWithEmptyStations() {
        StationBike station1 = new StationBike(5);
        StationBike station2 = new StationBike(5);
        stations.add(station1);
        stations.add(station2);
        redistributeClassic.redistribution(stations, new ArrayList<>());
        assertEquals(0, station1.getTransports().size());
        assertEquals(0, station2.getTransports().size());
    }
}

