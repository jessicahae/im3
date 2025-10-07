<?php

/* ============================================================================
   HANDLUNGSANWEISUNG (transform.php)
   0) Schau dir die Rohdaten genau an und plane exakt, wie du die Daten umwandeln möchtest (auf Papier)
   1) Binde extract.php ein und erhalte das Rohdaten-Array.
   2) Definiere Mapping Koordinaten → Anzeigename (z. B. Bern/Genz/Zürich).
   3) Konvertiere Einheiten (z. B. °F → °C) und runde sinnvoll (Celsius = (Fahrenheit - 32) * 5 / 9).
   4) Leite eine einfache "condition" ab (z. B. sonnig/teilweise bewölkt/bewölkt/regnerisch).
   5) Baue ein kompaktes, flaches Array je Standort mit den Ziel-Feldern.
   6) Optional: Sortiere die Werte (z. B. nach Zeit), entferne irrelevante Felder.
   7) Validiere Pflichtfelder (location, temperature_celsius, …).
   8) Kodieren: json_encode(..., JSON_PRETTY_PRINT) → JSON-String.
   9) GIB den JSON-String ZURÜCK (return), nicht ausgeben – für den Load-Schritt.
  10) Fehlerfälle als Exception nach oben weiterreichen (kein HTML/echo).
   ============================================================================ */

// Bindet das Skript extract.php für Rohdaten ein und speichere es in $data
$weatherdata = include('extract.php');


// ----------------------------------------------------------------------
// 1. Transformationsfunktionen
// ----------------------------------------------------------------------

/**
 * Konvertiert eine Temperatur von Fahrenheit (°F) nach Celsius (°C).
 * @param float $fahrenheit Die Temperatur in Fahrenheit.
 * @return float Die Temperatur in Celsius (gerundet auf 2 Dezimalstellen).
 */
function convertFahrenheitToCelsius(float $fahrenheit): float {
    return round(($fahrenheit - 32) * (5/9), 2);
}

/**
 * Bestimmt den Ort basierend auf Längen- und Breitengrad (gerundet auf 2 Dezimalstellen).
 * @param float $lat Breitengrad.
 * @param float $lon Längengrad.
 * @return string Der zugeordnete Ort.
 */
function determineLocation(float $lat, float $lon): int {
    $lat = round($lat, 2);
    $lon = round($lon, 2);
    
    // Ortszuordnung basierend auf den Rohdaten
    if ($lat === 46.94 && $lon === 7.44) {
        return 1;
    } elseif ($lat === 47.36 && $lon === 8.56) {
        return 2;
    } elseif ($lat === 46.24 && $lon === 6.10) {
        return 3;
    }
    return 0; // Standardfall
}

/**
 * Leitet den englischen Wettercode (weather_code) ab.
 * @param int $cloud_cover Wolkenbedeckung in Prozent (0-100).
 * @param float $rain Regenmenge.
 * @param float $snowfall Schneefall-Menge.
 * @return string Kurzer englischer Textcode.
 */
function getWeatherCode(int $cloud_cover, float $rain, float $snowfall): string {
    if ($snowfall > 0.0) {
        return 'Snowing';
    } elseif ($rain > 0.5) {
        return 'Rainy';
    } elseif ($cloud_cover >= 85) {
        return 'Overcast';
    } elseif ($cloud_cover >= 30) {
        return 'Partly Cloudy';
    } else {
        return 'Sunny';
    }
}

// ----------------------------------------------------------------------
// 2. Datenverarbeitung
// ----------------------------------------------------------------------

// Rohdaten aus extract.php
$rawData = $weatherdata;

// Koordinaten aus der API-Request (wie in extract.php verwendet)
$latitudes = [46.9481, 47.3667, 46.2376];
$longitudes = [7.4474, 8.55, 6.1092];

// Hilfs-Array, um die Zuweisung location -> location_id zu verfolgen
$locationMap = [];

// Die finalen Arrays für den Batch-Insert
$weatherDataToInsert = [];


// Iteriere über die Standorte, die durch die Längen-/Breitengrade definiert sind
foreach ($rawData as $locationIndex => $locationData) {
    $lat = $locationData['latitude'];
    $lon = $locationData['longitude'];
    $locationId = determineLocation($lat, $lon);

    if (!isset($locationData['hourly']) || !isset($locationData['hourly']['time']) || !is_array($locationData['hourly']['time'])) {
        throw new Exception("Fehler: 'hourly' Daten fehlen oder sind ungültig.");
    }
    $hoursPerDay = count($locationData['hourly']['time']);
    for ($i = 0; $i < $hoursPerDay; $i++) {
        $time = $locationData['hourly']['time'][$i] ?? null;
        $temp = $locationData['hourly']['temperature_2m'][$i] ?? null;
        $humidity = $locationData['hourly']['relative_humidity_2m'][$i] ?? null;
        $rain = $locationData['hourly']['rain'][$i] ?? null;
        $cloud_cover = $locationData['hourly']['cloud_cover'][$i] ?? 0;
        $windspeed = $locationData['hourly']['wind_speed_10m'][$i] ?? null;
        // $wmo_code = $locationData['hourly']['weather_code'][$i] ?? null; // not used for getWeatherCode

        if ($time === null || $temp === null) continue;

        $temperature = round((float)$temp, 2);
        $weatherCodeString = getWeatherCode((int)$cloud_cover, (float)$rain, 0.0);

        $weatherDataToInsert[] = [
            'location_id' => $locationId,
            'temperature' => $temperature,
            'humidity' => (int)$humidity,
            'rain' => (float)$rain,
            'weather_code' => $weatherCodeString,
            'windspeed' => round((float)$windspeed, 2),
            'timestamp' => $time
        ];
    }
}
// ----------------------------------------------------------------------
// 3. Ergebnis
// ----------------------------------------------------------------------
$currentHour = (int)(new DateTime('now', new DateTimeZone('Europe/Zurich')))->format('H');

$weatherDataToInsert = array_filter($weatherDataToInsert, function ($entry) use ($currentHour) {
    if (!isset($entry['timestamp'])) return false;
    $dataHour = (int)(new DateTime($entry['timestamp']))->format('H');
    return $dataHour === $currentHour;
});

// (Optional) Array-Keys neu indexieren
$weatherDataToInsert = array_values($weatherDataToInsert);
return $weatherDataToInsert;

// echo "Daten erfolgreich verarbeitet und in Batch-Arrays organisiert.\n\n";

// echo "--- Tabelle 'location' Daten ---\n";
// print_r($transformedDataBatch['locations']);

// echo "\n--- Tabelle 'weather' Daten ---\n";
// print_r($transformedDataBatch['weather_data']);

?>