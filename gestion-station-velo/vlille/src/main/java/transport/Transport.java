package transport;


/**
 * Abstract class of transport
 */
public abstract class Transport {



    protected int threshold;
    protected final int id;
    public static int idC = 0;
    protected int nbUtilisation;
    protected int nbOfNotUse;
    protected boolean InWork ;
    protected int workInterval;



    /**
     * Builder of transport
     * @param threshold The maximum usage threshold.
     */
    public Transport(int threshold) {
        this.threshold = threshold;
        this.id = idC++;
        this.nbUtilisation = 0;
        this.nbOfNotUse = 0;
        this.InWork = false;
        this.workInterval = 0;
    }

    /**
     * the Transport is in work or not
     * @return the response
     */
    public boolean isInWork() {
        return InWork;
    }

    /**
     * Increment workInterval
     */
    public void incrementWorkInterval() {
        if (InWork) {
            this.workInterval++;
        }
    }

    /**
     * set if the transport are in work or not
     * @param inWork true if he is in work and false otherwise
     */
    public void setInWork(boolean inWork) {
        if (inWork && !this.InWork) {
            this.workInterval = 1;
        } else if (!inWork && this.InWork) {
            this.workInterval = 0;
        }
        this.InWork = inWork;

    }

    /**
     * @return the maximum usage threshold.
     */
    public int getThreshold() {
        return threshold;
    }


    /**
     * @return number utilisation
     */
    public int getNbUtilisation() {
        return nbUtilisation;
    }

    /**
     * reset the number of utilisation
     */
    public void resetNbUtilisation() {
        this.nbUtilisation = 0;
    }
    /**
     * @return if it's available or not
     */
    public boolean isAvailable() {
        return this.nbUtilisation < this.threshold ;
    }

    /**
     * add one nb of not use the transport
     */
    public void addNbOfNotUse() {
        this.nbOfNotUse += 1;
    }

    /**
     * reset the number of use
     */
    public void resetNbOfNotUse() {
        this.nbOfNotUse = 0;
    }

    /**
     * remove 1 of the number of use
     */
    public void remove1NbOfNotUse() {
        if (this.nbOfNotUse != 0) {
            this.nbOfNotUse -= 1;
        }
    }
    /**
     * @return the number of we not use the transport
     */
    public int getNbOfNotUse() {
        return this.nbOfNotUse;
    }

    /**
     * @return the id of the transport
     */
    public int getId(){
        return this.id;
    }

    /**
     * add one utilisation
     */
    public void addNbUtilisation() {
        this.nbUtilisation++;
    }

    /**
     * Give the number of worker work to the transport
     * @return the workInterval
     */
    public int getWorkInterval() {
        return workInterval;
    }


    @Override
    public abstract String toString();

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (o == null || getClass() != o.getClass()) return false;
        Transport transport = (Transport) o;
        return id == transport.id && nbUtilisation == transport.nbUtilisation && nbOfNotUse == transport.nbOfNotUse ;
    }

    public abstract Transport copy();

}
