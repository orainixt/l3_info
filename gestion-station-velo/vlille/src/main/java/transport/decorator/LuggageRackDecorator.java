package transport.decorator;

import transport.Transport;

/**
 * Class LuggageRackDecorator
 */
public class LuggageRackDecorator extends TransportDecorator {

    /**
     * Constructor for the LuggageRackDecorator Object
     * @param transport the transport to which add a luggage rack
     */
    public LuggageRackDecorator(Transport transport){
        super(transport); 
    }

    /**
     * toString method 
     * @return the String of the toString
     */
    @Override
    public String toString(){
        return super.toString() + "with a luggage rack"; 
    }
    
    /**
     * copy method, herited from Transport class
     * @return LuggageRackDecorator the new object
     */
    @Override
    public LuggageRackDecorator copy(){
        return new LuggageRackDecorator(this.transport);
    }
}
