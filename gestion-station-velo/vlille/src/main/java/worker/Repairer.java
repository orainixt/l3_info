package worker;

import afficheur.Afficheur;
import station.StationComponent;
import transport.Transport;

/**
 * Worker Class
 */
public class Repairer implements Worker {

    private final int interval;

    /**
     * Builder of Repairer
     * @param interval the interval of we can't use the transport
     */
    public Repairer(int interval) {
        this.interval = interval;
    }

    @Override
    public void work(Transport t, StationComponent s) {
        if (!t.isInWork()) {
            t.setInWork(true);
            Afficheur.afficheur.affiche(t.toString() + "start these repairs");
        } else {
            t.incrementWorkInterval();
        }
        Afficheur.afficheur.affiche("Current work interval for " + t.toString() + ": " + t.getWorkInterval() + " / " + interval);
        if (t.getWorkInterval() >= interval) {
            t.setInWork(false);
            t.resetNbUtilisation();
            Afficheur.afficheur.affiche(t.toString() + " is repaired.");
        }
    }

    @Override
    public boolean canWork(Transport t , StationComponent s) {
        return (!t.isAvailable());
    }
}
