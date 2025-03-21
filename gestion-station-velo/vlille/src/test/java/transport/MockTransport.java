package transport;

public class MockTransport extends Transport{
    
    public final static int THRESHOLD = 10; 
    private int id = 1; 
    
    public MockTransport(){
        super(THRESHOLD); 
    }
    

    @Override
    public String toString() {
        return "MOCK_STRING";
    }

    public int getId(){
        return this.id; 
    }

    public boolean isEquals(){
        return true; 
    }

    public boolean isNotEqual(){
        return false; 
    }

    public Transport copy(){
        return new MockTransport();
    }
}