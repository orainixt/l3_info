package station;

import org.junit.jupiter.api.Test;
import transport.Transport;
import transport.bike.Bike;
import transport.trottinette.Trottinette;

import static org.junit.jupiter.api.Assertions.assertFalse;
import static org.junit.jupiter.api.Assertions.assertTrue;

public class StationTrottinetteTest extends StationTest {

    @Override
    protected Station createStation() {
        return new StationTrottinette(2);
    }

    @Override
    protected Transport createTransport(int threshold) {
        return new Trottinette(threshold);
    }

    @Test
    public void testTransportTypeIsAccept_Trottinette() {
        assertTrue(station.transportTypeIsAccept(transport1));
        assertTrue(station.transportTypeIsAccept(transport2));
    }

    @Test
    public void testTransportTypeIsAccept_NotTrottinette() {
        Transport bike = new Bike(5) {};
        assertFalse(station.transportTypeIsAccept(bike));
    }
}
