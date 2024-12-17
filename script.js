let guthaben = 0; // Aktuelles Guthaben
let einsatz = 0; // Einsatz des Spielers
let startguthaben = 0; // Startguthaben, das nur beim ersten Setzen verwendet wird

// Schritt 1: Startguthaben setzen
document.getElementById("set-guthaben-button").addEventListener("click", function() {
    const startGuthabenInput = document.getElementById("startguthaben").value;
    if (startGuthabenInput && startGuthabenInput > 0) {
        startguthaben = parseInt(startGuthabenInput);
        guthaben = startguthaben; // Setzt das Guthaben auf das Startguthaben
        document.getElementById("guthaben-amount").textContent = guthaben;
        document.getElementById("guthaben-container").style.display = "none";
        document.getElementById("einsatz-container").style.display = "block"; // Zeige das Einsatzfeld an
    } else {
        alert("Bitte geben Sie ein gültiges Startguthaben ein.");
    }
});

// Schritt 2: Einsatz setzen
document.getElementById("set-einsatz-button").addEventListener("click", function() {
    const einsatzInput = document.getElementById("einsatzInput").value;
    if (einsatzInput && einsatzInput > 0 && einsatzInput <= guthaben) {
        einsatz = parseInt(einsatzInput);
        document.getElementById("einsatz-container").style.display = "none"; // Verstecke das Einsatzfeld
        document.getElementById("slot-machine").style.display = "block"; // Zeige das 3x3 Feld
        document.getElementById("guthaben-anzeige").style.display = "block"; // Zeige das Guthaben
        document.getElementById("gewinntext").style.display = "block"; // Zeige den Gewinntext
    } else {
        alert("Bitte gib einen gültigen Einsatz ein, der nicht höher als dein Guthaben ist.");
    }
});
// Funktion, um die Symbole während des Ratterns zu variieren
function startRattern(symbolElements, spinResults) {
    const symbols = ["kirsche.png", "zitrone.png", "glocke.png", "sieben.png", "stern.png", "bar.png"];
    let intervalId = [];

    // Zeige das "Rattern", indem wir die Symbole regelmäßig ändern
    symbolElements.forEach((symbol, index) => {
        let currentIndex = 0;
        let interval = setInterval(() => {
            // Zufälliges Symbol setzen
            const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
            symbol.src = `images/${randomSymbol}`;

            currentIndex++;

            // Wenn die maximale Anzahl an "Ratterns" erreicht ist, stoppen
            if (currentIndex >= 50) {  // Du kannst hier die Anzahl der Ratter-Wiederholungen anpassen
                clearInterval(interval);
                symbol.src = `images/${spinResults[index]}`; // Das finale Symbol anzeigen
            }
        }, 50);  // Alle 100ms ein neues zufälliges Symbol anzeigen
        intervalId.push(interval);
    });
}
// Schritt 3: Walzen drehen und prüfen
document.getElementById("start-button").addEventListener("click", function () {
    const spinResults = spinReels(); // Drehe die Walzen
    const symbolElements = document.querySelectorAll(".symbol"); // Alle Symbole auswählen
    let maxDelay = 0; // Maximale Verzögerung für das Stoppen der Drehung

    const delayTimes = [500, 1500, 2500, 4000, 5000, 6000, 7500, 8500, 9500]; // Verzögerungen für jedes Symbol

    const stopSymbol = (index, delay) => {
        setTimeout(() => {
            symbolElements[index].style.animation = "none"; // Stoppt die Animation
            symbolElements[index].src = `images/${spinResults[index]}`; // Setze das endgültige Symbol
        }, delay);
    };

    // Drehe die Spalten von links nach rechts
    const spalten = [
        [0, 1, 2], // Erste Spalte (links)
        [3, 4, 5], // Zweite Spalte (mitte)
        [6, 7, 8]  // Dritte Spalte (rechts)
    ];

    // Zuerst alle Symbole der linken Spalte animieren
    spalten[0].forEach((symbolIndex, i) => {
        symbolElements[symbolIndex].style.animation = "rattern 0.00001s linear infinite";
        stopSymbol(symbolIndex, delayTimes[i]);
        maxDelay = Math.max(maxDelay, delayTimes[i]);
    });

    // Dann alle Symbole der mittleren Spalte animieren
    spalten[1].forEach((symbolIndex, i) => {
        symbolElements[symbolIndex].style.animation = "rattern 0.00001s linear infinite";
        stopSymbol(symbolIndex, delayTimes[i + 3]); // Verzögerung nach der ersten Spalte
        maxDelay = Math.max(maxDelay, delayTimes[i + 3]);
    });

    // Zuletzt alle Symbole der rechten Spalte animieren
    spalten[2].forEach((symbolIndex, i) => {
        symbolElements[symbolIndex].style.animation = "rattern 0.00001s linear infinite";
        stopSymbol(symbolIndex, delayTimes[i + 6]); // Verzögerung nach der zweiten Spalte
        maxDelay = Math.max(maxDelay, delayTimes[i + 6]);
    });

    // Berechne den Gewinn
    const gewinn = checkWin(spinResults);

    // Zeige den Gewinntext erst nach dem Stoppen aller Symbole
    setTimeout(() => {
        if (gewinn > 0) {
            guthaben += gewinn; // Füge den Gewinn zum Guthaben hinzu
            document.getElementById("gewinntext").textContent = `Du hast ${gewinn} Münzen gewonnen!`;
        } else {
            guthaben -= einsatz; // Ziehe den Einsatz ab, wenn der Spieler verloren hat
            document.getElementById("gewinntext").textContent = "Leider kein Gewinn.";
        }

        updateGuthaben(); // Aktualisiere das Guthaben

        // Überprüfe, ob das Guthaben auf null ist
        if (guthaben <= 0) {
            askForMoreGuthaben(); // Frage nach neuem Guthaben
        }
    }, maxDelay + 500); // Warte bis die maximale Verzögerung plus 500ms nach dem letzten Symbol
});
// Funktion zum Drehen der Walzen
function spinReels() {
    const symbols = ["kirsche.png", "zitrone.png", "glocke.png", "sieben.png", "stern.png", "bar.png"];

    constweightedSymbols = [
    "kirsche.png", "kirsche.png","kirsche.png",
    "zitrone.png","zitrone.png",
    "glocke.png",
    "sieben.png",
    "stern.png",
    "bar.png",
    ];
    const spinResults = [];
    for (let i = 0; i < 9; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        spinResults.push(randomSymbol);
    }
    return spinResults;
}

// Funktion zur Anzeige der Symbole
function displaySpinResults(results) {
    for (let i = 0; i < results.length; i++) {
        document.getElementById(`symbol${i + 1}`).src = `images/${results[i]}`;
    }
}

// Funktion zur Berechnung des Gewinns
function checkWin(results) {
    const GEWINN_LINIEN = [
        [0, 3, 6],
        [1, 4, 7],  // Horizontale Linie Mitte
        [2, 5, 8],
    ];

    let gewinn = 0;
    for (let linie of GEWINN_LINIEN) {
        const symbol = results[linie[0]];
        let istGewinn = true;

        for (let i of linie) {
            if (results[i] !== symbol) {
                istGewinn = false;
                break;
            }
        }

        if (istGewinn) {
            const symbolWert = getSymbolValue(symbol);
            gewinn += einsatz * symbolWert;
        }
    }
    return gewinn;
}

// Hilfsfunktion: Berechne den Wert des Symbols
function getSymbolValue(symbol) {
    const symbolWerte = {
        "kirsche.png": 1,
        "zitrone.png": 2,
        "glocke.png": 3,
        "sieben.png": 5,
        "stern.png": 10,
        "bar.png": 20
    };
    return symbolWerte[symbol] || 0;
}

// Guthaben aktualisieren
function updateGuthaben() {
    document.getElementById('guthaben-amount').textContent = guthaben;
}

// Funktion, um nach mehr Guthaben zu fragen
function askForMoreGuthaben() {
    const mehrGuthaben = confirm("Dein Guthaben ist aufgebraucht. Möchtest du mehr Guthaben einzahlen?");
    if (mehrGuthaben) {
        const neuerGuthaben = prompt("Gib den Betrag ein, den du einzahlen möchtest:");
        if (neuerGuthaben && neuerGuthaben > 0) {
            guthaben = parseInt(neuerGuthaben);
            document.getElementById("guthaben-amount").textContent = guthaben;
            document.getElementById("guthaben-anzeige").style.display = "block";
        } else {
            alert("Ungültiger Betrag.");
        }
    } else {
        alert("Danke fürs Spielen! Dein aktuelles Guthaben: " + guthaben + " €.");
    }
}
