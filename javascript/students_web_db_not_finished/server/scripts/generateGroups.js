const mongoose = require('mongoose');

const Students = require('../models/students.model').model; 
const Groups = require('../models/groups.model').model; 

const setRandomGroup = 
    () => {
        return Math.floor(Math.random() * 6) + 1; 
    }

const generateGroups = 
    async () => {
        try {
            const students = await Students.find(); 
            const groups = students.map(student => {
                return { 
                    group: setRandomGroup(),
                    studentId: student._id
                }
            });
            await Groups.insertMany(groups); 
            groups.forEach(group => {
                console.log(`group with number ${group.group} is assigned to student with ID ${group.studentId}`);
            });
            return;
        } catch (error) {
            console.error("error :", error); 
            return;
        } finally {
            await mongoose.connection.close();
        }

    }  

generateGroups();
    