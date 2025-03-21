package redistribute;

import station.StationComponent;
import transport.Transport;

import java.util.List;

/**
 * Class RedistributeClassic
 */
public class RedistributeClassic implements Redistribute{
    @Override
    public void redistribution(List<StationComponent> stations, List<Transport> allTransports) {
        int stationIndex = 0;
        for (Transport transport : allTransports) {
            if(transport.isAvailable()) {
                StationComponent currentStation = getStationForTransport(transport,stations);
                assert currentStation != null;
                int idx = currentStation.IndexOfTransport(transport);
                if(currentStation.canTake(idx)) {
                    currentStation.removeTransport(idx,transport);
                    StationComponent station = stations.get(stationIndex);
                    List<Integer> itransports = station.cellsAvailable(transport);
                    while (!station.canDrop(itransports.get(0),transport)) {
                        stationIndex = (stationIndex + 1) % stations.size();
                        station = stations.get(stationIndex);
                        itransports = station.cellsAvailable(transport);
                    }
                    station.addTransport(itransports.get(0), transport);
                    stationIndex = (stationIndex + 1) % stations.size();
                }
            }
        }
    }

    private StationComponent getStationForTransport(Transport transport, List<StationComponent> stations) {
        for (StationComponent station : stations) {
            if (station.getTransports().contains(transport)) {
                return station;
            }
        }
        return null;
    }
}
