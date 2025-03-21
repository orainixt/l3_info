package station;

import controlCenter.ControlCenter;
import transport.Transport;
import util.exception.*;


import java.util.*;


/**
 * Station class
 */
public abstract class  Station implements StationComponent {

    protected ControlCenter c;
    protected final int nbMaxt;
    protected Map<Integer,Transport> Cells;
    protected final int id;
    protected static int idC = 0;
    protected int interval ;

    /**
     * Builder of Station
     * @param nbMaxt max number of transport
     */
    public Station(int nbMaxt) {
        this.nbMaxt = nbMaxt;
        this.id = (++idC);
        this.Cells = new HashMap<>(nbMaxt);
        this.interval=0;
        this.c =null;
        this.initCells();
    }




    private void initCells() {
        for (int i = 0; i < nbMaxt; i++) {
            this.Cells.put(i,null);
        }
    }


    /**
     * get if the transport have a good type to be dropping or taking
     * @param transport the transport check
     * @return if the type of the transport is good
     */
    public abstract boolean transportTypeIsAccept(Transport transport);

   @Override
    public int getInterval(){
        return this.interval;
    }

    @Override
    public void addInterval() throws NotAvailableException {
        this.interval++;
        if (this.interval > ControlCenter.STATION_MAX_INTERVAL&&this.c != null) {
            c.notifyInterval();
        }
    }

    @Override
    public void resetInterval(){
        this.interval=0;
    }

    @Override
    public int getCapaMax() {
        return nbMaxt;
    }

    @Override
    public Transport getTransport(int i){
        return this.Cells.get(i);
    }

    @Override
    public int getNumberOfTransports() {
        int nb_Transports = 0;
        for(Transport t : this.Cells.values()){
            if(t!=null){
                nb_Transports++;
            }
        }
        return nb_Transports;
    }

    @Override
    public boolean canDrop(int i,Transport t) {
        return i>=0 && this.Cells.containsKey(i) && this.Cells.get(i) == null&& this.transportTypeIsAccept(t);
    }

    @Override
    public List<Integer> cellsAvailable(Transport t) {
        List<Integer> list = new ArrayList<>();
        for (int i = 0; i < nbMaxt; i++) {
            if (this.Cells.get(i) == null) {
                list.add(i);
            }
        }
        if (list.isEmpty()) {
            list.add(-1);
        }
        return list;
    }

    @Override
    public void dropTransport(int i ,Transport t) throws NotAvailableException{
        if(!this.canDrop(i,t) ){
            throw new NotAvailableException("you can't drop here");
        }
        this.addTransport(i,t);
        if(this.getC()!=null){
            this.getC().notifyDrop(t,this);
        }
    }

    @Override
    public boolean isEmpty(){
        boolean b =true;
        for(int i =0 ; i< nbMaxt;i++){
            if (this.Cells.get(i)!=null){
                b = false;
            }
        }
        return b;
    }

    @Override
    public boolean isFull(){
        boolean b =true;
        for(int i =0 ; i< nbMaxt;i++){
            if (this.Cells.get(i)==null){
                b = false;
            }
        }
        return b;
    }

    public int IndexOfTransport(Transport t){
        int index =-1;
        for(int i =0 ; i< nbMaxt;i++){
            if (this.Cells.get(i) != null && this.Cells.get(i).equals(t)){
                index = i;
            }
        }
        return index;
    }

    @Override
    public boolean canTake(int i) {
        if(!this.Cells.containsKey(i)){
            return false;
        }
        if(this.Cells.get(i) == null) {
            return false;
        }
        Transport mt =this.Cells.get(i);
        return mt.isAvailable();
    }

    @Override
    public Transport takeTransport(int i) throws NotAvailableException {
        if(!this.canTake(i)){
            throw new NotAvailableException("you can't take here");
        };
        Transport mt = this.getTransport(i);
        this.removeTransport(i,mt);
        if (this.getC() != null) {
            this.getC().notifyTake(mt, this);
        }
        return mt;
    }

    @Override
    public List<Transport> getTransports() {
        List<Transport> list = new ArrayList<>();
        for (Transport t : this.Cells.values()) {
            if (t != null) {
                list.add(t);
            }
        }
        return list ;
    }

    @Override
    public int getId() {
        return id;
    }

    @Override
    public String toString() {
        return "Station "+ this.id +" ";
    }

    @Override
    public void removeTransport(int i,Transport t){
        this.Cells.put(i,null);
    }


    @Override
    public void addTransport(int i,Transport t){
        this.Cells.put(i, t);
    }


    @Override
    public ControlCenter getC() {
        return c;
    }

    @Override
    public void setC(ControlCenter c) {
        this.c = c;
    }

    @Override
    public boolean equals(Object o) {
        if (! (o instanceof Station))
            return false;
        Station station = (Station) o;
        return nbMaxt == station.nbMaxt && id == station.id && Objects.equals(c, station.c) && Objects.equals(Cells, station.Cells);
    }

}