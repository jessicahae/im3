<?php

// Datenbankverbindungsparameter
$host = 'un0au5.myd.infomaniak.com';
$dbname = 'un0au5_im_3';
$username = 'un0au5_im3';
$password = 'Im_3_5062';

// DSN (Datenquellenname) für PDO
$dsn = "mysql:host=$host;dbname=$dbname;charset=utf8";

// Optionen für PDO
$options = [
    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION, // Aktiviert die Ausnahmebehandlung für Datenbankfehler
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC, // Legt den Standard-Abrufmodus auf assoziatives Array fest
    PDO::ATTR_EMULATE_PREPARES => false, // Deaktiviert die Emulation vorbereiteter Anweisungen, für bessere Leistung
];

?>