package station;

import controlCenter.ControlCenter;
import transport.Transport;
import util.exception.NotAvailableException;
import java.util.List;


public interface StationComponent {



    /**
     * The Interval when the station is empty
     * @return the interval
     */
    int getInterval();

    /**
     * add 1 in the interval
     *@throws NotAvailableException it's the exception  rise with the control center
     */
    void addInterval() throws NotAvailableException ;

    /**
     * reset the Interval
     */
    void resetInterval();

    /**
     * @return capacité totale de la station
     */
    int getCapaMax() ;

    /**
     *  give the transport
     * @param i index of the transport
     * @return the transport in index i
     */
    Transport getTransport(int i);

    /**
     * @return number of  transport in the station
     */
    int getNumberOfTransports() ;

    /**
     * get if we can drop in the station at the index i
     * @param i the index
     * @param t the transport drop   
     * @return if we can or not
     */
    boolean canDrop(int i,Transport t) ;

    /**
     * list the cells available in station
     * @param t the transport who search a cell available  
     * @return the list
     */
    List<Integer> cellsAvailable(Transport t) ;

    /**
     * add a means of transport in the station
     * @param t le moyen de transport à ajouter
     * @param i index of w   
     * @throws NotAvailableException rise if we can drop on the index i   
     */
    void dropTransport(int i ,Transport t) throws NotAvailableException;

    /**
     *
     * @return if the station is empty or not
     */
    boolean isEmpty();

    /**
     *
     * @return if the station is full or not
     */
    boolean isFull();

    /**
     * get the index of the transport
     * @param t the transport 
     * @return the index of the transport
     */
    int IndexOfTransport(Transport t);

    /**
     * u can take a transport or not
     *@param i index who he takes the bike 
     *@return if we can take or not  
     */
    boolean canTake(int i) ;

    /**
     * Take a means of transport in the station.
     * @param i the index of the transport
     * @return le moyen de transport retiré
     * @throws NotAvailableException if the transport is not available or not found in the station
     */
    Transport takeTransport(int i) throws NotAvailableException ;

    /**
     * @return the list of cell
     */
    List<Transport> getTransports() ;

    /**
     * @return station's ID
     */
    int getId();

    @Override
    String toString() ;

    /**
     * remove the transport in the param
     * @param i the index of transport to remove
     *@param t the transport remove 
     */
    void removeTransport(int i,Transport t);


    /**
     * add the transport in the param
     * @param t the transport to add
     *@param i the index of the transport add 
     */
    void addTransport(int i,Transport t);


    /**
     * Give the Control Center of the station
     * @return the control center
     */
    ControlCenter getC();

    /**
     * add the control center of the sattion
     * @param c the control Center
     */
    void setC(ControlCenter c);

    @Override
    boolean equals(Object o);
}
