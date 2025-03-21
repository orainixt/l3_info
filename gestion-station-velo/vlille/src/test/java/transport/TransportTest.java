package transport;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;


import static org.junit.jupiter.api.Assertions.*;

public abstract class TransportTest {

    protected Transport transport;

    protected abstract Transport createTransport();

    @BeforeEach
    public void init(){
        Transport.idC = 0;
        this.transport = this.createTransport();
    }

    @Test
    public void testGetThreshold() {
        assertEquals(5, transport.getThreshold());
    }

    @Test
    public void testNbUtilisationWith0() {
        assertEquals(0, transport.getNbUtilisation());
    }

    @Test
    public void testNbUtilisation() {
        transport.addNbUtilisation();
        assertEquals(1, transport.getNbUtilisation());
    }

    @Test
    public void testIsAvailable() {
        assertTrue(transport.isAvailable());
    }

    @Test
    public void testIsNotAvailable() {
        for (int i = 0; i < 6; i++) {
            transport.addNbUtilisation();
        }
        assertFalse(transport.isAvailable());
    }

    @Test
    public void testNbOfNotUse() {
        assertEquals(0, transport.getNbOfNotUse());
    }

    @Test
    public void testAddNbOfNotUse() {
        transport.addNbOfNotUse();
        assertEquals(1, transport.getNbOfNotUse());
    }

    @Test
    public void testResetNbOfNotUse() {
        transport.addNbOfNotUse();
        transport.resetNbOfNotUse();
        assertEquals(0, transport.getNbOfNotUse());
    }

    @Test
    public void testRemoveNbOfNotUse() {
        transport.addNbOfNotUse();
        transport.remove1NbOfNotUse();
        assertEquals(0, transport.getNbOfNotUse());
    }

    @Test
    public void testRemoveNbOfNotUseWith0() {
        assertEquals(0, transport.getNbOfNotUse());
        transport.remove1NbOfNotUse();
        assertEquals(0, transport.getNbOfNotUse());
    }

    @Test
    public void testId() {
        assertEquals(0, transport.getId());
    }

    @Test
    public void testEquals() {
        assertEquals(transport, transport);
    }

    @Test
    public void testNotEquals() {
        Transport t =createTransport();
        assertNotEquals(transport, t);
    }

    @Test
    public void testWhenInWorkFalse() {
        transport.setInWork(true);
        boolean secondInWork = false;
        transport.setInWork(secondInWork);
        assertEquals(0, transport.getWorkInterval());
    }

    @Test
    public void testSetInWorkTrue() {
        transport.setInWork(true);
        assertTrue(transport.isInWork());
        assertEquals(1, transport.getWorkInterval());
    }

    @Test
    public void testSetInWorkFalse() {
        transport.setInWork(false);
        assertFalse(transport.isInWork());
        assertEquals(0, transport.getWorkInterval());
    }

    @Test
    public void testAddNbUtilisation() {
        for (int i = 0; i < transport.getThreshold(); i++) {
            transport.addNbUtilisation();
        }
        assertFalse(transport.isAvailable());
    }

    @Test
    public void testNotEqualsBis() {
        assertNotEquals(transport, new Object());
    }

    @Test
    public void testIncrementWorkInterval() {
        assertEquals(0, transport.getWorkInterval());
        transport.setInWork(true);
        assertEquals(1, transport.getWorkInterval());
        transport.incrementWorkInterval();
        assertEquals(2, transport.getWorkInterval());
    }

    @Test
    public void testThresholdFull() {
        transport.addNbUtilisation();
        assertTrue(transport.isAvailable());
        for (int i = 0; i < transport.getThreshold() - 1; i++) {
            transport.addNbUtilisation();
        }
        assertFalse(transport.isAvailable());
    }

    @Test
    public void testWorkButNotInWork() {
        transport.setInWork(false);
        transport.incrementWorkInterval();
        assertEquals(0, transport.getWorkInterval());
    }

    @Test
    public void testCopy() {
        Transport copiedTransport = transport.copy();
        assertEquals(transport.getThreshold(), copiedTransport.getThreshold());
        assertEquals(transport.getNbUtilisation(), copiedTransport.getNbUtilisation());
        assertEquals(transport.getNbOfNotUse(), copiedTransport.getNbOfNotUse());
    }

    @Test
    public void testCopyButChangeParamAfter() {
        transport.addNbUtilisation();
        transport.addNbOfNotUse();
        Transport copiedTransport = transport.copy();
        assertEquals(transport.getThreshold(), copiedTransport.getThreshold());
        assertNotEquals(transport.getNbUtilisation(), copiedTransport.getNbUtilisation());
        assertNotEquals(transport.getNbOfNotUse(), copiedTransport.getNbOfNotUse());
    }
}
