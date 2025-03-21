package worker;


import station.StationComponent;
import transport.Transport;

/**
 * interface Worker
 */
public interface Worker {

    /**
     *  the work of the worker
     * @param t the transport where the worker work
     * @param s station  of the transport
     */
    void work(Transport t, StationComponent s);

    /**
     * verify if the player can use this action
     * @param t the transport tested
     * @param s station  of the transport
     * @return boolean response
     */
    boolean canWork(Transport t, StationComponent s);
}
