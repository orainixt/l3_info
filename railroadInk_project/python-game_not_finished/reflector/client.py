import asyncio
import websockets 

async def client():
    url = "ws://localhost:3000"
    async with websockets.connect(url) as websocket:
        print(f"connected to {url}")
        asyncio.gather(receive_message(websocket),send_message(websocket))



async def receive_message(websocket):
    try:
        async for message in websocket: 
            print(f"received : {message}") 
    except websockets.exception.ConnectionClosed:
        print("disconnect from server")
    except Exception as e : 
        print(f"error : {e}")


async def send_message(websocket):
    while True: 
        message = input("msg")
        await websocket.send(message)
        print(f"sent : {message}") 


if __name__ == "__main__":
    asyncio.run(client())