## Interaktive Medien III HS25 | Jessica Häseli & Alina Gerber

### Projektbeschreibung - Why did my garden plants die?
Das Projekt „Why did my plants die?“ bietet Nutzer:innen eine einfache Möglichkeit, die klimatischen Ursachen für eingegangene Pflanzen zu analysieren. Die Applikation ermöglicht den Zugriff auf historische Wetterdaten der Standorte Bern, Zürich und Genf.

#### Funktionsweise und Nutzen

*Datenbezug:* Die Wetterdaten werden automatisiert über die API "Open Meteo" bezogen und in einer internen Datenbank archiviert.

*Analyse:* Über eine minimalistisch gestaltete Benutzeroberfläche können Anwender:innen gezielt nach historischen Wetterereignissen suchen.

*Ursachenforschung:* Eine integrierte Diagramm-Ansicht visualisiert kritische Wetterlagen. Bleiben die Werte im Normbereich, hilft die App dabei, Pflegefehler als Ursache zu identifizieren.

*Design-Philosophie:* Die Benutzeroberfläche folgt einem klaren, reduzierten Design-Ansatz. Durch den Fokus auf das Wesentliche und eine intuitive Navigation wird die gezielte „Reise in die Vergangenheit“ für alle Nutzer:innen zugänglich gemacht.

### Learnings
Wir haben rasch gemerkt, dass es  hilfreich ist, wenn man sich Arbeitsprozesse anhand von KI erklären lässt und nicht nur blind kopiert und einfügt. Im Arbeitsprozess haben wir auf diese Weise viele neue Techniken gelernt und diese schliesslich auch korrekt ins unseren Code einbauen können. 

Zudem haben wir gelernt, komplexe Probleme in kleinere, lösbare Teilschritte zu zerlegen, um den Vorgang besser zu verstehen. 



### Schwierigkeiten 
Die *Zusammenführung der Code-Dateien* war eine grosse Herausforderung. Es kam wiederholt vor, dass Änderungen gegenseitig überschrieben wurden, was dazu führte, dass wir manche Arbeiten doppelt erledigen mussten.

Die *Verknüpfung* von Backend-Logik (PHP/Datenbank) mit der Frontend-Visualisierung (JavaScript/Chart.js) stellte zudem eine Hürde dar. Besonders die Logik, wie Daten vom Benutzer ausgewählt und anschliessend korrekt gefiltert werden, war komplex in der Umsetzung. Beispielsweise die Darstellung des Diagramms, welches dann exakt die Daten der ausgewählten Zeitspanne zeigen sollte, forderte uns viele Nerven und Zeit. Auch der Ortswechsel von Bern, Zürich und Genf war komplex zu programmieren.

Bei *Fehlern in der Datenübertragung* zwischen Datenbank und App war es oft schwierig, die genaue Ursache zu isolieren, was zeitweise zu grosser Frustration führte.



 
### genutzte Ressourcen
Für unser Projekt haben wir oft mit Google Gemini gearbeitet. In einzelnen Fällen haben wir auch ChatGPT verwendet. Für folgende Arbeitsprozesse haben wir die KI's benutzt:
	⁠Fehlersuche (Debugging)

	>⁠Unterstützung bei der Erstellung von komplexen SQL-Abfragen 

	>⁠Bereinigung des Codes (vor allem in der CSS-Datei)

	>⁠Erklärung von div. Arbeitsprozessen (Einbauen von Chart.js oder Kalender-Elementen, Filterung der API-Daten auf spezifische Zeitstempel)

Zudem hatten wir stets die Möglichkeit, während des Unterrichts unsere Dozentinnen und Dozenten beizuziehen. Das war sehr hilfreich. 

Auch in Diskussionen mit andere Gruppen konnten wir neue Lösungsansätze für eigene Probleme herausfinden.