<?php
// filepath: /var/www/html/hwidchecker/licensekeys.php

// Database connection settings
$host = "localhost";
$dbname = "license_db";
$username = "root";
$password = "your_password";

// Connect to the database
try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    die(json_encode(["status" => "error", "message" => "Database connection failed: " . $e->getMessage()]));
}

// Get POST data
$licenseKey = $_POST['licenseKey'] ?? null;
$hwid = $_POST['hwid'] ?? null;

if (!$licenseKey || !$hwid) {
    die(json_encode(["status" => "error", "message" => "Missing licenseKey or HWID"]));
}

// Check if the license key exists
$stmt = $pdo->prepare("SELECT * FROM licenses WHERE license_key = :licenseKey");
$stmt->execute(['licenseKey' => $licenseKey]);
$license = $stmt->fetch(PDO::FETCH_ASSOC);

if (!$license) {
    die(json_encode(["status" => "error", "message" => "Invalid license key"]));
}

// Check if the license key is already redeemed
if ($license['hwid'] && $license['hwid'] !== $hwid) {
    die(json_encode(["status" => "error", "message" => "License key already redeemed on another machine"]));
}

// If the license key is valid and not redeemed, register the HWID
if (!$license['hwid']) {
    $stmt = $pdo->prepare("UPDATE licenses SET hwid = :hwid WHERE license_key = :licenseKey");
    $stmt->execute(['hwid' => $hwid, 'licenseKey' => $licenseKey]);
}

// Return success
echo json_encode(["status" => "success", "message" => "License key validated successfully"]);
?>
