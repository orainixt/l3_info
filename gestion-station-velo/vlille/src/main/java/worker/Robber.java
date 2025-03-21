package worker;

import afficheur.Afficheur;
import station.StationComponent;
import transport.Transport;

import java.util.Random;

public class Robber implements Worker{

    public static final int IntervalRob =2;
    private final int random ;

    public Robber(int random){
        this.random = random;
    }

    public Robber(){
        Random r = new Random();
        this.random =(r.nextInt(10)+10);
    }

    public int getRandom(){
        return random;
    }

    @Override
    public void work(Transport t, StationComponent s) {
        Random r = new Random();
        if(r.nextInt(random) == 0) {
            int i = s.IndexOfTransport(t);
            Afficheur.afficheur.affiche(t.toString() + "has been rob !");
            s.removeTransport(i,t);
        }
    }

    @Override
    public boolean canWork(Transport t, StationComponent s) {
        return t.getNbOfNotUse()>= IntervalRob && s.getTransports().size() == 1;
    }
}
