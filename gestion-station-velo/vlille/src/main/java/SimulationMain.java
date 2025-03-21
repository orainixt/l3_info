import redistribute.Redistribute;
import redistribute.RedistributeClassic;
import simulation.Simulation;
import worker.Repairer;
import worker.Robber;
import worker.Worker;

import java.util.ArrayList;
import java.util.List;

public class SimulationMain {
    public static void main(String[] args) {
        try {
            List<Worker> workers = new ArrayList<>();
            workers.add(new Robber());
            workers.add(new Repairer(3));
            Redistribute redistributionMode = new RedistributeClassic();
            Simulation simulation = new Simulation(redistributionMode, workers);
            simulation.play();
        } catch (Exception e) {
            System.err.println(e.getMessage());
        }
    }
}
