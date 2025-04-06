<?php
// Enable error reporting for debugging
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
logDebug("Raw POST data: " . file_get_contents("php://input"));
logDebug("Parsed POST data: " . json_encode($_POST));

error_reporting(E_ALL);

// Debug function
function logDebug($message) {
    file_put_contents("debug.log", date("Y-m-d H:i:s") . " - " . $message . PHP_EOL, FILE_APPEND);
}

// --- START Processing ---

// Parse POST data
$licenseKey = $_POST['licenseKey'] ?? null;
$hwid = $_POST['hwid'] ?? null;

logDebug("Received licenseKey=$licenseKey, hwid=$hwid");

// Validate input
if (!$licenseKey || !$hwid) {
    logDebug("Missing licenseKey or HWID.");
    die(json_encode(["status" => "error", "message" => "License key and HWID are required."]));
}

// Database connection settings
$host = "sql206.infinityfree.com";
$dbname = "if0_38687757_licenses";
$username = "if0_38687757";
$password = "Peyton0082";

try {
    $pdo = new PDO("mysql:host=$host;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    logDebug("Database connection successful.");
} catch (PDOException $e) {
    logDebug("Database connection failed: " . $e->getMessage());
    die(json_encode(["status" => "error", "message" => "Database connection failed."]));
}

// Check if the license key exists in the database
try {
    $stmt = $pdo->prepare("SELECT * FROM licenses WHERE license_key = :licenseKey");
    $stmt->execute(['licenseKey' => $licenseKey]);
    $license = $stmt->fetch(PDO::FETCH_ASSOC);
    logDebug("Database query executed for licenseKey=$licenseKey.");
} catch (PDOException $e) {
    logDebug("Database query failed: " . $e->getMessage());
    die(json_encode(["status" => "error", "message" => "Database query failed."]));
}

// Validate the license key
if (!$license) {
    logDebug("Invalid license key.");
    die(json_encode(["status" => "error", "message" => "Invalid license key."]));
}

// Check if the license key is already bound to an HWID
if ($license['hwid'] && $license['hwid'] !== $hwid) {
    logDebug("License key already bound to a different HWID.");
    die(json_encode(["status" => "error", "message" => "License key is already in use on another device."]));
}

// Bind the license key to the HWID if not already bound
if (!$license['hwid']) {
    try {
        $stmt = $pdo->prepare("UPDATE licenses SET hwid = :hwid WHERE license_key = :licenseKey");
        $stmt->execute(['hwid' => $hwid, 'licenseKey' => $licenseKey]);
        logDebug("HWID registered for licenseKey=$licenseKey.");
    } catch (PDOException $e) {
        logDebug("Failed to update HWID: " . $e->getMessage());
        die(json_encode(["status" => "error", "message" => "Failed to register HWID."]));
    }
}

// Return success response
logDebug("License key validated successfully.");
echo json_encode(["status" => "success", "message" => "License key validated successfully!"]);

// Debugging: Log parsed POST data
logDebug("Parsed POST data: " . json_encode($parsedPostData));
logDebug("Extracted licenseKey=$licenseKey, hwid=$hwid"); 

?>
