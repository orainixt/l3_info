import Chart from 'chart.js/auto';

const socket = io();
let selectedVote = null;


socket.emit("enters","voter");

socket.on("new-vote", (data) => {
    document.getElementById("vote").style.display = 'flex';
    document.getElementById("no-vote").style.display = 'none';
    document.getElementById("voter-result").style.display = "none";
    document.getElementById("vote-result").textContent = "Vote en cours";
    document.getElementById("vote-name").textContent = data.name;
    
    document.querySelectorAll('button[name="actions"]').forEach(button => {
        button.disabled = false;
    });
});


const voteButtons = document.querySelectorAll('button[name="actions"]');
voteButtons.forEach(button => {
    button.addEventListener("click", () => {
        document.getElementById("vote-result").textContent = `Votre choix : ${button.textContent.toUpperCase()}`;
        
        if (selectedVote != null) {
            console.log(`selected vote : ${selectedVote}`);
            socket.emit("voter-undone", { value: selectedVote });
        }
        
        selectedVote = button.textContent.toLowerCase();
        console.log(`selected vote : ${selectedVote}`);
        socket.emit("voter-action", { value: selectedVote });
    });
});

console.log('voter connected');


const ctx = document.getElementById('voters-chart').getContext('2d');
const myChart = new Chart(ctx, {
    type: 'bar',
    data: {
        labels: ["Pour", "Contre", "Ne vote pas", "Abstention"],
        datasets: [{
            label: "Nombre de votes",
            data: [0, 0, 0, 0],
            backgroundColor: 'rgba(161, 15, 15, 0.2)',
            borderColor: 'rgba(0, 0, 0, 1)',
            borderWidth: 1
        }]
    },
    options: {
        responsive: true,
        plugins: {
            title: {
                display: true,
                text: 'Résultats du vote en cours'
            }
        },
        scales: {
            y: {
                min: 0,
                max: 10,
            }
        }
    }
});

socket.on("end-vote", (data) => {
    myChart.data.datasets[0].data = data.values;
    document.getElementById("voter-result").style.display = "flex";
    
    voteButtons.forEach(button => {
        button.disabled = true;
    });
    
    myChart.update();
});
