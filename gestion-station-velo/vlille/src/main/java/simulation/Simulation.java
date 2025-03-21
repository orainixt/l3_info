package simulation;

import controlCenter.ControlCenter;
import redistribute.Redistribute;
import station.*;
import transport.Transport;
import transport.bike.Bike;
import transport.trottinette.Trottinette;
import util.exception.NotAvailableException;
import worker.Worker;

import java.util.ArrayList;
import java.util.List;
import java.util.Random;

import static java.lang.Thread.sleep;

public class Simulation {

    private static final int RandomAction = 2;


    private ControlCenter ControlCenters;
    private Redistribute modeRedistribution;
    private List<Worker> w;

    public Simulation(Redistribute r, List<Worker> w){
        this.modeRedistribution = r;
        this.w = w;
        this.ControlCenters = new ControlCenter(modeRedistribution);
        this.ControlCenters.addWorker(this.w);
        this.init();
    }

    private void init(){
        Random r = new Random();

        int nbStation = r.nextInt(10)+5;
        for(int j =0; j< nbStation;j++){
            int nbTransportMax = r.nextInt(20-10)+10;
            StationOfStation s = new StationOfStation(nbTransportMax);
            Station sb  = new StationBike((nbTransportMax/2)-1);
            Station st = new StationTrottinette((nbTransportMax/2)-1);
            s.addStation(sb);
            s.addStation(st);
            int nbTransport = r.nextInt(nbTransportMax);
            for(int k = 0 ; k<nbTransport;k++) {
                int thread = r.nextInt(4 - 3) + 2;
                if(r.nextInt(2) == 0){
                    Bike b = new Bike(thread);
                    s.addTransport(k, b);
                }
                else{
                    Trottinette t = new Trottinette(thread);
                    s.addTransport(k, t);
                }
            }
            this.ControlCenters.addStation(s);
        }
    }


    public void play() throws InterruptedException, NotAvailableException {
        Random r = new Random();
        while(true){
            for(StationComponent s : this.ControlCenters.getStations()){
                int action = r.nextInt(RandomAction);
                if (action == 0) {
                    if (!s.isEmpty()) {
                        List<Transport> transports = s.getTransports();
                        int indexToTake = s.IndexOfTransport(transports.get(r.nextInt(transports.size())));
                        if (s.canTake(indexToTake)) {
                            s.takeTransport(indexToTake);
                        }
                    }
                }
            }
            for(Transport transportTake : new ArrayList<>(this.ControlCenters.getTransportTaken())){
                int action = r.nextInt(RandomAction);
                if (action == 0) {
                    List<StationComponent> stationsToDrop = this.ControlCenters.getStations();
                    StationComponent stationTemp = stationsToDrop.get(r.nextInt(stationsToDrop.size()));
                    List<Integer> indexToDrop = stationTemp.cellsAvailable(transportTake);
                    int indexTemp = r.nextInt(indexToDrop.size());
                    if (stationTemp.canDrop(indexTemp,transportTake)) {
                        stationTemp.dropTransport(indexTemp,transportTake);
                    }
                }
            }
            this.ControlCenters.checkInterval();
            sleep(1000);
        }
    }

    public ControlCenter getControlCenter(){
        return this.ControlCenters;
    }
}
