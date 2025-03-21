package station;

import org.junit.jupiter.api.Test;
import transport.Transport;
import transport.bike.Bike;
import transport.trottinette.Trottinette;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StationBikeTest extends StationTest {

    @Override
    protected Station createStation() {
        return new StationBike(2);
    }

    @Override
    protected Transport createTransport(int threshold) {
        return new Bike(threshold);
    }

    @Test
    public void testTransportTypeIsAccept_Bike() {
        assertTrue(station.transportTypeIsAccept(transport1));
        assertTrue(station.transportTypeIsAccept(transport2));
    }

    @Test
    public void testTransportTypeIsAccept_NotBike() {
        Transport trottinette = new Trottinette(5) {};
        assertFalse(station.transportTypeIsAccept(trottinette));
    }
}
