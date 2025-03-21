package transport.bike;
import transport.Transport;


/**
 * Class Bike
 */
public class Bike extends Transport {

    /**
     * Constructor for the Bike Objects
     * @param threshold the maximum number of use
     */
    public Bike(int threshold) {
        super(threshold);
    }

    /**
     * toString method, herited from Transport class
     * @return the String describing the bike
     */
    @Override
    public String toString() {
        return "Bike " + this.id + " ";
    }

    /**
     * copy methods, herited from Transport class
     */
    @Override
    public Transport copy(){
        return new Bike(this.threshold);
    }
}

