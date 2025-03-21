package transport.trottinette;

import transport.Transport;

public class Trottinette extends Transport {

    /**
     * Builder of Trottinette
     * @param threshold the threshold of the trotinette
     */
    public Trottinette(int threshold) {
        super(threshold);
    }


    @Override 
    public String toString(){
        return "Trottinette " + this.id + " "; 
    }

    @Override
    public Transport copy() {
        return new Trottinette(this.threshold);
    }
}
