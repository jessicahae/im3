<?php

require_once 'config.php';

try{
    $pdo = new PDO($dsn, $username, $password, $options);

    $sql = "SELECT * FROM `Benutzer`";

    $stmt = $pdo->query($sql);
    $benutzende = $stmt->fetchAll();

    foreach($benutzende as $benutzer){
        echo $benutzer['vorname']. $benutzer ['nachname']. "<br>";
    }

} catch (PDOException $e) {
    // Behandelt die Verbindungsfehler
    die("Datenbankverbindungsfehler: " . $e->getMessage());
}




?>





