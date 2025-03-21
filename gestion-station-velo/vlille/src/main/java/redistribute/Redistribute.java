package redistribute;

import station.StationComponent;
import transport.Transport;

import java.util.List;

/**
 * Interface Redistribute
 */
public interface Redistribute {

    /**
     * Redistribute all transports in stations 
     * @param stations all stations
     * @param allTransports all transports 
     */
    public void redistribution(List<StationComponent> stations, List<Transport> allTransports);
}
