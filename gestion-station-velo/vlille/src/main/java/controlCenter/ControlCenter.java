package controlCenter;

import afficheur.Afficheur;
import redistribute.Redistribute;
import station.StationComponent;
import transport.*;
import util.exception.NotAvailableException;
import worker.Worker;
import java.util.ArrayList;
import java.util.List;

/**
Class ControlCenter
 */
public class ControlCenter {

    /**
     *  the interval for the station to be reset
     */
    public static final int STATION_MAX_INTERVAL = 2;

    private  int interval = 0 ;
    private List<Transport> transportTaken;
    private List<StationComponent> stations;
    private List<Transport> allTransports;
    private List<Worker> workers;
    private Redistribute modeDistribution;

    /**
     * Builder for Control Center
     * @param modeDistribution the mode of the redistribution
     */
   public ControlCenter(Redistribute modeDistribution) {
        this.stations = new ArrayList<>();
        this.transportTaken = new ArrayList<>();
        this.allTransports = new ArrayList<>();
        this.workers = new ArrayList<>();
        this.modeDistribution = modeDistribution;
   }

    /**
     * Add workers to the list of workers of the ControlCenter
     * @param workers is the list of worker to add of the list of worker of the control center
     */
    public void addWorker(List<Worker> workers) {
        this.workers.addAll(workers);
    }

    /**
     * Remove one worker in the List of Worker of the Control Center
     * @param worker remove the worker of the control center
     */
    public void removeWorker(Worker worker) {
        this.workers.remove(worker);
    }

    /**
     * can take the list of workers
     *@return the list of worker of the control center 
     */
    public List<Worker> getWorkers() {
        return this.workers;
    }

    /**
     * Get all transport of the control center
     * @return all transport
     */
    public List<Transport> getAllTransports() {
        return allTransports;
    }

    /**
     * get the list of the transport take
     * @return the list of transpor
     */
    public List<Transport> getTransportTaken() {
        return transportTaken;
    }

    /**
     * get all supervise station by the control center
     * @return stations
     */
    public List<StationComponent> getStations() {
        return stations;
    }

    /**
     * add station to the list of stations
     * @param station the station to add
     */
    public void addStation( StationComponent station ) {
        this.stations.add( station );
        station.setC(this);
        this.allTransports.addAll(station.getTransports());
    }

    /**
     * remove station to the list of stations
     * @param station station the station to remove
     */
    public void removeStation( StationComponent station ) {
        this.allTransports.removeAll( station.getTransports() );
        this.stations.remove( station );
    }

    /**
     * Notify if the control center if the transport is drop in the station
     * @param t the transport drop
     * @param s the station where the transport is dropping
     */
    public void notifyDrop(Transport t, StationComponent s) {
        Afficheur.afficheur.affiche(t.toString() + " has been drop in "+ s.toString());
        this.transportTaken.remove(t);
        if(!this.allTransports.contains(t)){
            this.allTransports.add(t);
        }
    }

    /**
     * Notify if the control center if the transport is takes in the station
     * @param t the transport takes
     * @param s the station where the transport is taking
     */
    public void notifyTake(Transport t, StationComponent s){
        Afficheur.afficheur.affiche(t.toString() + " has been take in "+ s.toString());
        this.transportTaken.add(t);
        t.addNbUtilisation();
    }

    /**
     * check to add or not to interval of station interval
     * @throws NotAvailableException if we can't take or drop
     */
    public void checkInterval() throws NotAvailableException {
        this.interval = 0;
        for(StationComponent s : new ArrayList<>(this.stations)){
            if(s.isEmpty()){
                s.addInterval();
            } else if (s.isFull()) {
                s.addInterval();
            } else{
                s.resetInterval();
            }
        }
        this.checkTransport();
    }

    /**
     * Check the interval for the transport
     * @throws NotAvailableException if we can't drop or takes the transport
     */
    public void checkTransport() throws NotAvailableException {
        for(StationComponent s : new ArrayList<>(this.stations)){
            if(s.getTransports().size() == 1){
                s.getTransports().get(0).addNbOfNotUse();
                this.workerWork(s.getTransports().get(0),s);
            }
            else if (s.getTransports().size() != 1){
                for(Transport t : new ArrayList<>(s.getTransports())){
                    t.resetNbOfNotUse();
                    this.workerWork(t,s);
                }
            }
        }
    }

    /**
     * notify when interval station reaches limit
     */
    public void notifyInterval() {
        this.reorganize();
    }

    /**
     * reorganize the station
     */
    private void reorganize() {
        if(this.verifReoganize()) {
            this.interval = 1;
            Afficheur.afficheur.affiche("Reorganize called");
            this.modeDistribution.redistribution(stations, this.allTransportInStation());
            Afficheur.afficheur.affiche("Reorganize done");
        }
    }

    private boolean verifReoganize() {
        boolean b = false;
        for(Transport t : this.allTransports){
            if(t.isAvailable()){
                b = true;
            }
        }
        return b && interval == 0;
    }

    /**
     * get all transport in stations
     * @return all transport in station
     */
    private List<Transport> allTransportInStation(){
        List<Transport> transports = new ArrayList<>();
        for(StationComponent s : this.stations){
            transports.addAll(s.getTransports());
        }
        return transports;
    }

    /**
     * use the worker to work to the transport
     * @param t the transport target
     * @param s the station of the transport
     */
    public void workerWork(Transport t , StationComponent s ){
        for (Worker worker : workers) {
            if(worker.canWork(t,s)){
                worker.work(t,s);
            }
        }
    }
}