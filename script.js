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

// Schritt 3: Walzen drehen und prüfen
// Schritt 3: Walzen drehen und prüfen
document.getElementById("start-button").addEventListener("click", function() {
    const spinResults = spinReels(); // Drehe die Walzen
    displaySpinResults(spinResults); // Zeige die Walzen-Ergebnisse an

    const symbols = document.querySelectorAll(".symbol"); // Alle Symbole auswählen
    let maxDelay = 0; // Maximale Verzögerung für das Stoppen der Drehung

    // Start der Drehung der Symbole
    symbols.forEach((symbol, index) => {
        symbol.style.animation = "drehen 1s linear infinite"; // Start der Drehung

        // Verzögerung für jedes Symbol, damit sie nacheinander stoppen
        const delay = (index + 1) * 300; // Verzögerung für jedes Symbol (300ms pro Symbol)
        maxDelay = Math.max(maxDelay, delay); // Berechne die maximale Verzögerung

        // Symbol nach der Verzögerung stoppen
        setTimeout(() => {
            symbol.style.animation = "none"; // Stoppt die Drehung
        }, delay);
    });

    // Berechne den Gewinn
    const gewinn = checkWin(spinResults); 

    // Setze eine Verzögerung, um den Gewinntext erst nach dem Stoppen aller Symbole anzuzeigen
    setTimeout(() => {
        if (gewinn > 0) {
            guthaben += gewinn; // Füge den Gewinn zum Guthaben hinzu
            document.getElementById("gewinntext").textContent = `Du hast ${gewinn} Münzen gewonnen!`;
        } else {
            guthaben -= einsatz; // Ziehe den Einsatz ab, wenn der Spieler verloren hat
            document.getElementById("gewinntext").textContent = "Leider kein Gewinn.";
        }

        updateGuthaben(); // Aktualisiere das angezeigte Guthaben

        // Überprüfe, ob das Guthaben auf null ist
        if (guthaben <= 0) {
            askForMoreGuthaben(); // Frage, ob der Spieler mehr Guthaben einzahlen möchte
        }
    }, maxDelay + 500); // Verzögere die Anzeige des Gewinntexts um die maximale Verzögerung + 500ms
});
// Funktion zum Drehen der Walzen
function spinReels() {
    const symbols = ["kirsche.png", "zitrone.png", "glocke.png", "sieben.png", "stern.png", "bar.png"];
    const spinResults = [];
    for (let i = 0; i < 9; i++) {
        const randomSymbol = symbols[Math.floor(Math.random() * symbols.length)];
        spinResults.push(randomSymbol);
    }
    return spinResults;
}

// Funktion, um das Layout der Walzen anzuzeigen
function displaySpinResults(results) {
    // Stelle sicher, dass das Bild neu geladen wird, indem wir den `src` jedes Bildes aktualisieren
    document.getElementById('symbol1').src = 'images/' + results[0];
    document.getElementById('symbol2').src = 'images/' + results[1];
    document.getElementById('symbol3').src = 'images/' + results[2];
    document.getElementById('symbol4').src = 'images/' + results[3];
    document.getElementById('symbol5').src = 'images/' + results[4];
    document.getElementById('symbol6').src = 'images/' + results[5];
    document.getElementById('symbol7').src = 'images/' + results[6];
    document.getElementById('symbol8').src = 'images/' + results[7];
    document.getElementById('symbol9').src = 'images/' + results[8];
}

// Funktion zur Berechnung des Gewinns
function checkWin(results) {
    // Gewinnlinien (basierend auf einem 3x3 Layout)
    const GEWINN_LINIEN = [
        [0, 1, 2],  // Horizontale Linie oben
        [3, 4, 5],  // Horizontale Linie Mitte
        [6, 7, 8],  // Horizontale Linie unten
        [0, 3, 6],  // Vertikale Linie links
        [1, 4, 7],  // Vertikale Linie Mitte
        [2, 5, 8],  // Vertikale Linie rechts
        [0, 4, 8],  // Diagonale von oben links nach unten rechts
        [2, 4, 6]   // Diagonale von oben rechts nach unten links
    ];

    // Gewinnberechnung
    let gewinn = 0;
    for (let linie of GEWINN_LINIEN) {
        const symbol = results[linie[0]]; // Wähle das erste Symbol in der Reihe
        let istGewinn = true;

        // Prüfe, ob alle Symbole auf dieser Linie gleich sind
        for (let i of linie) {
            if (results[i] !== symbol) {
                istGewinn = false;
                break;
            }
        }

        // Wenn alle Symbole gleich sind, berechne den Gewinn basierend auf dem Symbol
        if (istGewinn) {
            const symbolWert = getSymbolValue(symbol);
            gewinn += einsatz * symbolWert; // Beispiel: Gewinn multipliziert mit Einsatz
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
    return symbolWerte[symbol] || 0; // Rückgabe des entsprechenden Werts oder 0, falls das Symbol nicht gefunden wird
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
            document.getElementById("guthaben-anzeige").style.display = "block"; // Zeige das Guthaben wieder an
        } else {
            alert("Ungültiger Betrag.");
        }
    } else {
        alert("Danke fürs Spielen! Dein aktuelles Guthaben: " + guthaben + " €.");
    }
}