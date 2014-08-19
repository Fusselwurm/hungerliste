Menudaten von http://hofmann-menue.de extrahieren.

Greift deine Firma auch auf die Dienste der *Hofmann Menü-Manufaktur* zu? Kotzt dich das Webinterface auch so an?

Diese Anwendung ist in der Lage, das aktuelle Angebot aus deiner Kantine hübsch in JSON zu verpacken.

Fies zusammengehackt im Moment.

Datenpunkte die zZt aus der Seite geholt werden:
* Name
* Masse
* Energie
* Energie/Preis
* Preis
* Vegetarisch?

# Voraussetzungen

* nodeJS
* phantom-js (wenn phantomjs nicht im Suchpfad ist, gibt's `phantom stderr: execvp(): No such file or directory`

# Installation etc

* Node installieren
* PhantomJS installieren
* config.js.template in config.js umbenennen und editieren
* `npm install`
* `bin/main.js`

evtl client/index.html aufmachen um nen Basisclient zu haben
