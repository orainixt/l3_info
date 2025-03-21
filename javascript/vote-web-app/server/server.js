import {createServer} from "http" 
import handleRequest from "./utils.js"
import {Server as IOServer} from 'socket.io';

const PORT = 8080;
let voterNumber = 0 
let adminNumber = 0
let vote = {
    labels : ["pour","contre","nppv","abstention"],
    current : false,
    name : null,
    values : [0,0,0,0]
}
let userList = []; 

const server = createServer((request,response) => {
    handleRequest(request,response);
});

const io = new IOServer(server , {
    cors :{
        origin :"*" ,
    }
}); 


io.on('connection', socket => {

    console.log(`Connection with id ${socket.id}`); 

    socket.on('enters',(socketData) => {

        socket.role = socketData;
        
        switch(socket.role){           
            case "admin": 
                if (adminNumber != 0){
                    console.log("There's already an admin for this room"); 
                    socket.emit('admin-refused'); 
                } else {
                    adminNumber++; 
                }
                break;
            case "voter":
                userList.push(socket.id);
                io.sockets.emit("update-user-list",userList);
                voterNumber++; 
                console.log(`New Voter with id ${socket.id} `); 
                if(vote.current){
                    socket.emit("new-vote",vote.name);
                }
                break;
            default: 
                console.log("! Error with the socket role !");
                break;
        }  
        io.sockets.emit("update",voterNumber); 
    });

    socket.on('disconnect', () => {

        console.log(`Disconnected id ${socket.id}`); 
        switch(socket.role){
            case "voter": 
                userList = userList.filter(id => id !== socket.id);
                io.sockets.emit("update-user-list",userList);
                voterNumber--;
                console.log(`voter with id : ${socket.id}disconnected`);
                break; 
            case "admin": 
                adminNumber--;
                break; 
            default: 
                break;
        }
        io.sockets.emit("update",voterNumber);
    });

    socket.on("new-vote", (data) => {
        console.log(`New vote : ${data.name}`);
        vote.current = true;
        vote.name = data.name;
        vote.values = data.values;
        io.sockets.emit("new-vote",data);
    });

    socket.on("end-vote", () => {
        console.log("Vote closed.");
        io.sockets.emit("end-vote", {values: vote.values});
    });

    socket.on("voter-action", (data) => {
        console.log(`New user input : vote is ${data.value}`); 
        vote.values[vote.labels.indexOf(data.value)]++;
        io.sockets.emit("voter-action",{values:vote.values})
    }); 

    socket.on("voter-undone", (data) => {
        console.log(`An user deleted his vote : ${data.value}`);
        vote.values[vote.labels.indexOf(data.value)]--;
        io.sockets.emit("voter-undone", {values:vote.values}); 
    })
});

server.listen(PORT, () => console.log(`Serveur démarré sur http://localhost:${PORT}`));
