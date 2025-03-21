package station;

import transport.Transport;
import transport.bike.Bike;

/**
 * class StationBike
 */
public class StationBike extends Station {


    /**
     * Builder of Station
     *
     * @param nbMaxt max number of transport
     */
    public StationBike(int nbMaxt) {
        super(nbMaxt);
    }

    @Override
    public boolean transportTypeIsAccept(Transport transport) {
        return transport instanceof Bike;
    }
}
