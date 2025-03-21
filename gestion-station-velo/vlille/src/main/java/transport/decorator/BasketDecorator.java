package transport.decorator;

import transport.Transport;

/**
 * Class BasketDecorator 
 */
public class BasketDecorator extends TransportDecorator {
    
    /**
     * Builder of BasketDecorateur
     * @param transport the transport use in the decorateur
     */
    public BasketDecorator(Transport transport){
        super(transport);
    }

    @Override
    public String toString(){
        return super.toString() + "with a basket"; 
    }

    @Override
    public Transport copy() {
        return new BasketDecorator(transport.copy());
    }

}
