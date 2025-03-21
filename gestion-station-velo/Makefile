
all: clean compile

clean:
	mvn clean
	rm -rf Simulation.jar

test:
	mvn test

jar: compile
	jar cvfm Simulation.jar MANIFEST.MF -C target/classes .

run_jar: jar
	java -jar Simulation.jar
	
	
main : compile
	java -cp target/classes SimulationMain

doc:
	mvn javadoc:javadoc

coverage:
	mvn clean test-compile org.pitest:pitest-maven:mutationCoverage
	firefox target/pit-reports/index.html


compile:
	mvn compile

compile_test:
	mvn test-compile

