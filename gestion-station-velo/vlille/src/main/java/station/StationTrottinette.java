package station;

import transport.Transport;
import transport.trottinette.Trottinette;

/**
 * class StationTrottinette
 */
public class StationTrottinette extends Station {



    /**
     * Builder of Station
     *
     * @param nbMaxt max number of transport
     */
    public StationTrottinette(int nbMaxt) {
        super(nbMaxt);
    }

    @Override
    public boolean transportTypeIsAccept(Transport transport) {
        return transport instanceof Trottinette;
    }

}
