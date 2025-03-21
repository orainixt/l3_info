package redistribute;

import station.StationComponent;
import transport.Transport;

import java.util.List;
import java.util.Random;

/**
 * Class RedistributeRandom
 */
public class RedistributeRandom implements Redistribute {
    private final Random random;

    /**
     * Builder of RedistributeRandom
     */
    public RedistributeRandom() {
        this.random = new Random();
    }

    @Override
    public void redistribution(List<StationComponent> stations, List<Transport> allTransports) {
        for (Transport transport : allTransports) {
            if (transport.isAvailable()) {
                StationComponent currentStation = getStationForTransport(transport, stations);
                if (currentStation != null) {
                    int idx = currentStation.IndexOfTransport(transport);
                    if (currentStation.canTake(idx)) {
                        currentStation.removeTransport(idx, transport);
                        StationComponent randomStation = getRandomStation(stations);
                        List<Integer> availableCells = randomStation.cellsAvailable(transport);
                        while (!randomStation.canDrop(availableCells.get(0), transport)) {
                            randomStation = getRandomStation(stations);
                            availableCells = randomStation.cellsAvailable(transport);
                        }
                        randomStation.addTransport(availableCells.get(0), transport);
                    }
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

    private StationComponent getRandomStation(List<StationComponent> stations) {
        return stations.get(random.nextInt(stations.size()));
    }
}
