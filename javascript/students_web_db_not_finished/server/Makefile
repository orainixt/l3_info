
DB_PATH=mongo/
MONGO_DB_NAME=booksBase
STUDENTS_JSON_PATH=./misc/students.json
SCRIPT_PATH=scripts/generateGroups.js

install: 
	npm install 

start: 
	nodemon 

clean-mongo: 
	rm -rf $(DB_PATH)

mongo: clean-mongo
	mkdir $(DB_PATH) 
	mongod --dbpath $(DB_PATH) 


students:
	mongoimport --db studentsBase --collection students --file $(STUDENTS_JSON_PATH) 

groups: 
	node ${SCRIPT_PATH} 
