package transport.bike;

import transport.Transport;

/**
 * Class ElectricBike
 */
public class ElectricBike extends Bike{
    
    /**
     * Builder of ElectricBike
     * @param threshold the threshold of the ElecticBike
     */
    public ElectricBike(int threshold){
        super(threshold);
    }


    @Override 
    public String toString(){
        return super.toString() + "is elecrtic";
    }

    @Override
    public Transport copy(){
        return new ElectricBike(getThreshold());
    }
}
