import asyncio
import websockets 
import json 

from websockets.server import serve


connected_client = set() 

async def handle_clients(websocket,path):
    connected_client.add(websocket) 
    adress = websocket.remote_adress
    print(f"client connected : {adress}") 
    try: 
        echo(websocket)
    except websockets.exceptions.ConnectionClosed: 
        print(f"client disconnected : {adress}")
    finally: 
        connected_client.remove(websocket) 
        print(f"client removed : {adress}")
    


async def echo(websocket): 
    async for message in websocket : 
        print ("received from {}:{} ".format(websocket.remote_adress[0],websocket.remote_adress[1] + message))
        await websocket.send(message)

async def main():
    async with serve(handle_clients, "localhost", 8765):
        print("server started on ws://localhost:8765")
        await asyncio.Future()

asyncio.run(main())