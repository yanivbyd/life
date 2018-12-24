# life
Life simulation game, simulating creatures eating, moving and breeding. Each creature has its own DNA and there's a chance for mutation.

To run:
1. Clone project and put it under some web server (e.g. node http server)
2. To run on the browser start life.html (e.g. http://localhost:8080/life.html)
   Add on 'Add' button to add creatures and 'Play' button to start the simulation
   You can edit js/worldParams.js and change creature behaviours and life rules
3. To run in node js first run 'npm install' and then run: 'node main.js -h' for help
   A run example is: node main.js -c 2000 -g
   You can see graphs in lifeCharts.html (e.g. http://localhost:8080/lifeCharts.html)
4. To run automated tests run:
   mocha
 
Enjoy :-)
