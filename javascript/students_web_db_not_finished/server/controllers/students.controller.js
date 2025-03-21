const Students = require('./../models/students.model').model; 

const listStudents = async (_,res) => {
    try {
        const allStudents = await Students.find(); 
        console.log('Students : ', allStudents); 
        res.status(200).json(allStudents); 
    } catch (error) {
        console.error('error while retrieving studients'); 
        res.status(500).json({error: 'fetch error'});
    }
}; 

const createStudent = async (req,res,_) => {
        const newStudentData = {...req.body}; 
        try {
            const createdStudent = await Students.create(newStudentData); 
            res.status(200).json(createdStudent);
        } catch (error) {
            res.status(500).json(error);
        }
    }



module.exports.list = listStudents;
module.exports.create = createStudent; 

// module.exports.delete = nom de la fonction qui delete
