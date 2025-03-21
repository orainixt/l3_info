package transport.bike;

import transport.Transport;

/**
 * Class ClassicBike
 */
public class ClassicBike extends Bike{
    
    /**
     * Builder of Classic Bike
     * @param threshold the threhold of the bike
     */
    public ClassicBike(int threshold){
        super(threshold);
    }


    @Override 
    public String toString(){
        return super.toString() + "is classic";
    }

    @Override
    public Transport copy(){
        return new ClassicBike(getThreshold());
    }
}

