package station;

import controlCenter.ControlCenter;
import transport.Transport;
import util.exception.NotAvailableException;

import java.util.ArrayList;
import java.util.List;

public class StationOfStation implements StationComponent{

    private ControlCenter c;
    private final int nbMaxt;
    private int current_size;
    private final int id;
    public static int idC = 0;
    private int interval ;
    private List<Station> Stations;

    /**
     * Builder of Station
     * @param nbMaxt max number of transport
     */
    public StationOfStation(int nbMaxt) {
        this.nbMaxt = nbMaxt;
        this.current_size = 0;
        this.id = (++idC);
        this.interval=0;
        this.c =null;
        this.Stations = new ArrayList<>();
    }


    /**
     * Add the station to the list of station
     * @param s the new station
     */
    public void addStation(Station s){
        if(this.current_size+s.getCapaMax()<this.nbMaxt){
            this.Stations.add(s);
            this.current_size+=s.getCapaMax();
            s.setC(this.c);
        }
    }

    /**
     * Get all station in the station
     * @return all station
     */
    public List<Station> getStations(){
        return this.Stations;
    }

    /**
     * Remove the station to the list of station
     * @param s the new station
     */
    public void removeStation(Station s){
        this.Stations.remove(s);
    }

    /**
     * The Interval when the station is empty
     *
     * @return the interval
     */
    @Override
    public int getInterval() {
        return this.interval;
    }

    /**
     * add 1 in the interval
     */
    @Override
    public void addInterval() throws NotAvailableException {
        this.interval++;
        if(this.interval > ControlCenter.STATION_MAX_INTERVAL&&this.c!=null){
            c.notifyInterval();
        }
    }

    /**
     * reset the Interval
     */
    @Override
    public void resetInterval() {
        this.interval=0;
    }

    /**
     * @return capacité totale de la station
     */
    @Override
    public int getCapaMax() {
        return nbMaxt;
    }

    /**
     * give the transport
     *
     * @param i index of the transport
     * @return the transport in index i
     */
    @Override
    public Transport getTransport(int i) {
        for (Station s : this.Stations) {
            if (s.getTransport(i) != null) {
                return s.getTransport(i);
            }
        }
        return null;
    }

    /**
     * @return number of  transport in the station
     */
    @Override
    public int getNumberOfTransports() {
        int i=0;
        for(Station s:this.Stations){
            i+= s.getNumberOfTransports();
        }
        return i;
    }

    /**
     * get if we can drop in the station at the index i
     *
     * @param i the index
     * @return if we can or not
     */
    @Override
    public boolean canDrop(int i,Transport t) {
        boolean b = false;
        for(Station s:this.Stations){
            if(s.canDrop(i,t)){
                b = true;
            }
        }
        return b;
    }

    /**
     * list the cells available in station
     *
     * @return the list
     */
    @Override
    public List<Integer> cellsAvailable(Transport t) {
        List<Integer> list = new ArrayList<>();
        for(Station s:this.Stations){
            if(s.transportTypeIsAccept(t)){
                list.addAll(s.cellsAvailable(t));
            }
        }
        return list;
    }

    /**
     * add a means of transport in the station
     *
     * @param i index who we want to drop
     * @param t le moyen de transport à ajouter
     */
    @Override
    public void dropTransport(int i, Transport t) throws NotAvailableException {
        for(Station s:this.Stations){
            if(s.canDrop(i,t)){
                s.dropTransport(i,t);
                return;
            }
        }
        throw new NotAvailableException("you can't drop here");
    }

    /**
     * @return if the station is empty or not
     */
    @Override
    public boolean isEmpty() {
        boolean b = true;
        for(Station s:this.Stations){
            if(!s.isEmpty()){
                b = false;
            }
        }
        return b;
    }

    /**
     * @return if the station is full or not
     */
    @Override
    public boolean isFull() {
        boolean b = true;
        for(Station s:this.Stations){
            if(!s.isFull()){
                b = false;
            }
        }
        return b;
    }

    @Override
    public int IndexOfTransport(Transport t) {
        int i = -1;
        for(Station s:this.Stations){
            if(s.transportTypeIsAccept(t)){
                i = s.IndexOfTransport(t);
            }
        }
        return i;
    }

    /**
     * u can take a transport or not
     *
     * @param i index who we want to take
     */
    @Override
    public boolean canTake(int i) {
        for(Station s:this.Stations){
            if(s.canTake(i)){
                return true;
            }
        }
        return false;
    }

    /**
     * Take a means of transport in the station.
     *
     * @param i the index of the transport
     * @return le moyen de transport retiré
     * @throws NotAvailableException if the transport is not available or not found in the station
     */
    @Override
    public Transport takeTransport(int i) throws NotAvailableException {
        for(Station s:this.Stations){
            if(s.canTake(i)){
                return s.takeTransport(i);
            }
        }
        throw new NotAvailableException("you can't take here");
    }

    /**
     * @return the list of cell
     */
    @Override
    public List<Transport> getTransports() {
        List<Transport> transports = new ArrayList<>();
        for(Station s : this.Stations){
            transports.addAll(s.getTransports());
        }
        return transports;
    }

    /**
     * @return station's ID
     */
    public int getId() {
        return this.id;
    }

    /**
     * remove the transport in the param
     *
     * @param i the index of transport to remove
     */
    @Override
    public void removeTransport(int i,Transport t) {
        for(Station s : this.Stations){
            if(s.transportTypeIsAccept(t)){
                s.removeTransport(i,t);
                return;
            }
        }
    }

    /**
     * add the transport in the param
     *
     * @param i the index of the transport
     * @param t the transport to add
     */
    @Override
    public void addTransport(int i, Transport t) {
        for(Station s : this.Stations){
            if(s.transportTypeIsAccept(t)){
                s.addTransport(i,t);
                return;
            }
        }
    }

    /**
     * Give the Control Center of the station
     *
     * @return the control center
     */
    @Override
    public ControlCenter getC() {
        return this.c;
    }

    /**
     * add the control center of the sattion
     *
     * @param c the control Center
     */
    @Override
    public void setC(ControlCenter c) {
        this.c = c;
        for (Station s : this.Stations) {
            s.setC(c);
        }
    }

    @Override
    public String toString() {
        return "Station "+this.id;
    }
}
