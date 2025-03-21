const displayMessage = msg => document.getElementById('content').textContent = msg; 

console.log("student script laoded");

const fetchStudents =
    async () => {
        console.log('fetching students');
        try {
            removeStudents();
            const studentTable = document.getElementById('studentList'); 
            const response = await fetch('/students', {method : 'GET'}); 
            const allStudents = await response.json(); 
            removeStudents();
            allStudents.forEach(student => studentTable.appendChild(buildOneElement(student)));
        } catch (error) {
            displayMessage(error.message); 
            console.error('fetch students error', error);
        }   
    }

const removeStudents = 
    () => {
        const element = document.getElementById("studentList");
        while (element.firstChild) {
            element.removeChild(element.firstChild);
        }
    }

const buildOneElement = 
    student => {
        const studentElement = document.createElement('tr'); 
        studentElement.className = 'student';
        studentElement.appendChild(buildBox(student.surname, 'name'));
        studentElement.appendChild(buildBox(student.firstnames, 'firstnames'));
        studentElement.appendChild(buildBox(student.ine, 'ine'));
        return studentElement; 
    }

const buildBox = 
    (content,className) => {
        const tdElement = document.createElement('td'); 
        tdElement.textContent = content; 
        tdElement.className = className; 
        return tdElement; 
    }

const buildDeleteButton = 
    (studentId) => {
        const tdElement = document.createElement('td'); 
        const button = document.createElement('button'); 
        button.textContent = '❌';
        button.className = 'deleteButton'; 
        button
    }

const createStudent = 
    async () => {
        const ine = document.getElementById("number").value.trim(); 
        const firstnames = document.getElementById("firstnames").value.split(",").map(name=>name.trim())
        const surname = document.getElementById("surname").value.trim();

        if (!surname) {
            displayMessage("surname's mandatory"); 
            return;
        }

        try {
            const requestOptions = {
                method: 'POST',
                headers: {'Content-Type' : 'application/json'}, 
                body: JSON.stringify({ine,firstnames,surname}),
            };
            const response = await fetch('/students',requestOptions); 

            if (response.ok) {
                const responseWithData = await response.json(); 
                displayMessage(`student added => ${responseWithData.firstnames} ${responseWithData.name} with student ID : ${responseWithData.ine}`);
                fetchStudents();
            } else {
                const error = await response.json().catch(()=>null);
                displayMessage(`Error: ${error?.message || response.statusText || 'Unknown error'}`);
            }
        } catch (error) {
            displayMessage(error.message); 
            console.error('create student error', error);
        }
    }


const deleteStudents = 
    async (studentId) => {
        await fetch(`/students/${studentId}`, {method: 'DELETE'})
    }

const setupEventListeners = 
    () => {
        document.getElementById("createUpdate").addEventListener('click', createStudent);
    }

const setup = () => {
    console.log("setup")
    displayMessage("Prêt"); 
    fetchStudents();
    
}

setup();