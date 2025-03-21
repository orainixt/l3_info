import Chart from 'chart.js/auto';


const socket = io();
let voteOpen = true; 

socket.emit("enters","admin"); 

socket.on('connect' , ()=>{
    console.log("admin");
});

socket.on('admin-refused', () => {
    console.log("admin refused"); 
    const refusedElement = document.getElementById('refused');
    refusedElement.style.display = 'flex';
    refusedElement.style.fontSize = '18px'; 
    refusedElement.style.fontWeight = 'bold'; 
    // document.getElementById('admin-vote').style.display = 'none';
});

socket.on('update', (userNumber) => {
    console.log(`Update in users, new total : ${userNumber}`); 
    document.getElementById("number-voter").textContent = `Nombre de connectés : ${userNumber}`;
}); 

document.getElementById("start-vote").addEventListener("click", function() {

    if (voteOpen) {
        
        document.getElementById("start-vote").textContent = "Clore le vote";
        document.getElementById("vote-result").style.display = 'flex'; 
        document.getElementById("vote-user").textContent = `Nombre de votants : 0`;  
        myChart.update(); 

        let vote = {
            name : document.getElementById("vote-name").value,
            values : myChart.data.datasets[0].data
        }; 
        voteOpen = false; 
        socket.emit("new-vote",vote);

    } else {
        voteOpen = true; 
        document.getElementById("start-vote").textContent = "Démarrer le vote";
  
        document.getElementById("vote-user").textContent = `Le vote a été clôturé`;  
        console.log("clotured vote");
        socket.emit("end-vote");

    }
});

const ctxt = document.getElementById('results-chart').getContext('2d');

const myChart = new Chart(ctxt, {
    type: 'bar',
    data: {
        labels: ["Pour","Contre","Ne vote pas","Abstention"],
        datasets: [{
            label : `Nombre de votes`,
            data :  [0,0,0,0],
            backgroundColor: 'rgba(161, 15, 15 , 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      plugins: {
        title: {
          display: true,
          text: 'Resultats du vote actuel'
        }
      },
      scales: {
        y: {
          min: 0,
          max: 10,
        }
      }
    },
});

socket.on("current-vote", (data) => {
    document.getElementById("vote-name").value = data.name; 
    myChart.data.datasets[0].data = data.values;
    document.getElementById("vote-start").textContent = "Clore le vote";
    myChart.update();
}); 

socket.on("voter-action", (data) => {
  document.getElementById("vote-name").value = data.name;
  myChart.data.datasets[0].data = data.values;
  myChart.update(); 
});

socket.on("update-user-list", (data) => {
  document.getElementById("list-user").textContent = `Utilisateurs connectés : ${data.join(", ")}`; 
})