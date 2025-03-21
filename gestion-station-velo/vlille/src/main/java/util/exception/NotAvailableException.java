package util.exception;

/**
 * Class NotAvailableException 
 */
public class NotAvailableException extends Exception{

    /**
     * Builder of the Exception
     * @param iIsOverCapacity the message
     */
    public NotAvailableException(String iIsOverCapacity) {
        super(iIsOverCapacity);
    }
}
