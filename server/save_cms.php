<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = ['status' => 'error', 'message' => 'Gagal memproses permintaan cuy.'];

$jsonFilePath = __DIR__ . '/../data/content.json';
$uploadDir = __DIR__ . '/../assets/images/';

// ==============================================================
// 1. PROSES UPDATE DATA JSON SECARA OTOMATIS (SUPER UNIVERSAL)
// ==============================================================
$isUpdated = false;

// Baca file content.json yang udah ada di server
$existingJson = file_get_contents($jsonFilePath);
$existingData = json_decode($existingJson, true);

if (json_last_error() === JSON_ERROR_NONE) {
    
    // Looping semua paket data yang dikirim dari JS (Entah itu cms_global, nav_menu, dll)
    foreach ($_POST as $key => $value) {
        $decodedValue = json_decode($value, true);
        
        // Kalau format JSON-nya valid, langsung timpa data lama sesuai nama key-nya
        if (json_last_error() === JSON_ERROR_NONE) {
            $existingData[$key] = $decodedValue;
            $isUpdated = true;
        }
    }

    // Jika ada perubahan, simpan kembali ke file
    if ($isUpdated) {
        $newJsonString = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
        $result = file_put_contents($jsonFilePath, $newJsonString);
        
        if ($result !== false) {
            $response['status'] = 'success';
            $response['message'] = 'Mantap! Data berhasil disimpan.';
        } else {
            $error = error_get_last();
            $response['message'] = 'Gagal menyimpan ke content.json. Error: ' . ($error['message'] ?? 'Unknown');
        }
    }
} else {
    $response['message'] = 'File content.json di server corrupt cuy, ga bisa dibaca.';
    echo json_encode($response);
    exit;
}

// ==============================================================
// 2. PROSES UPLOAD LOGO CMS
// ==============================================================
if (isset($_FILES['cms_logo']) && $_FILES['cms_logo']['error'] === UPLOAD_ERR_OK) {
    $fileName = 'logo_cms_kurir_koe.webp'; 
    $uploadPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['cms_logo']['tmp_name'], $uploadPath)) {
        $response['status'] = 'success'; // Paksa sukses jika minimal gambar berhasil diupload
        $response['message'] .= ' Logo berhasil diupdate!';
    } else {
        $response['status'] = $isUpdated ? 'warning' : 'error';
        $response['message'] .= ' Tapi logo gagal diupload.';
    }
}

// Jika ngga ada data yang dikirim sama sekali
if (!$isUpdated && empty($_FILES)) {
    $response['message'] = 'Tidak ada data valid yang diterima server.';
}

echo json_encode($response);
?>