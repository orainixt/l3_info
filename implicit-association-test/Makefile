MONGO_FOLDER = dbData/
FEMININE_WORDS = misc/feminine_words.json
MASCULINE_WORDS = misc/masculine_words.json 
LITERATURE_WORDS = misc/literature_words.json 
SCIENCE_WORDS = misc/science_words.json 
DATABASE = TestBase 
WORD_COLLECTION = word 
ADMIN_COLLECTION = admin
SUPER_ADMIN = misc/super_admin.json 

run: 
	$(MAKE) mongo &
	$(MAKE) server &
	$(MAKE) webpack &
	wait	

webpack: 
	cd client ; ./node_modules/.bin/webpack --watch

create-mongo: 
	cd server ; mkdir ${MONGO_FOLDER}

clean-mongo: 
	cd server ; rm -f ${MONGO_FOLDER}

mongo: 
	cd server ; mongod --dbpath ${MONGO_FOLDER}

server: 
	cd server ; nodemon 

fill-words: 
	cd server ; mongoimport --db ${DATABASE} --collection ${WORD_COLLECTION} --file $(FEMININE_WORDS) 
	cd server ; mongoimport --db ${DATABASE} --collection ${WORD_COLLECTION} --file $(MASCULINE_WORDS) 
	cd server ; mongoimport --db ${DATABASE} --collection ${WORD_COLLECTION} --file $(LITERATURE_WORDS) 
	cd server ; mongoimport --db ${DATABASE} --collection ${WORD_COLLECTION} --file $(SCIENCE_WORDS) 

fill-admin: 
	cd server ; mongoimport --db ${DATABASE} --collection ${ADMIN_COLLECTION} --file ${SUPER_ADMIN} --jsonArray

install-server:
	cd server && npm install

install-client:
	cd client && npm install

install: install-server install-client


help:
	@echo "     available commands :                                 "
	@echo "     make install        -> install project dependencies    "
	@echo "     make run            -> launches the server, the webpack and the database"
	@echo "     make mongo          -> launch DataBase in ${MONGO_FOLDER}"
	@echo "     make webpack        -> refresh webpack with the newer files "
	@echo "     make server         -> launch the server with nodemon"
	@echo "     make create-mongo   -> create mongoDB folder           "
	@echo "     make clean-mongo    -> clean mongoDB folder             "
	@echo "     make fill-words     -> fill the database with the words from gender test"
	@echo "     make fill-admin     -> fill the database with the superadmin data "
	@echo "     make install-server -> install dependencies for back-end" 
	@echo "     make install-client -> install dependencies for front-end"



.PHONY: install run mongo webpack server create-mongo clean-mongo fill-words fill-admin install-server install-client 
