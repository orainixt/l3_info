package transport.decorator;

import transport.Transport;

/**
 * Abstract class Transport Decorator
 */
public abstract class TransportDecorator extends Transport{

    protected final Transport transport;

    /**
     * Builder of TransportDecorator
     * @param transport the transport of the décorateur
     */
    public TransportDecorator(Transport transport){
        super(transport.getThreshold());
        this.transport = transport; 
    } 

    @Override
    public String toString(){
        return this.transport.toString(); 
    }   
}