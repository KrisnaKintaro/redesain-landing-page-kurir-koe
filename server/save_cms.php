<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = ['status' => 'error', 'message' => 'Gagal memproses permintaan cuy.'];

$jsonFilePath = __DIR__ . '/../data/content.json';
$uploadDir = __DIR__ . '/../assets/images/';

// ==============================================================
// 1. PROSES UPDATE KEY 'cms_global' SAJA
// ==============================================================
if (isset($_POST['cms_global'])) {
    // Tangkap hanya data cms_global dari frontend
    $newCmsGlobal = json_decode($_POST['cms_global'], true);
    
    if (json_last_error() === JSON_ERROR_NONE) {
        // Baca file content.json yang udah ada di server
        $existingJson = file_get_contents($jsonFilePath);
        $existingData = json_decode($existingJson, true);
        
        if (json_last_error() === JSON_ERROR_NONE) {
            // TIMPA HANYA PADA KEY 'cms_global'
            $existingData['cms_global'] = $newCmsGlobal;
            
            // Format ulang dan simpan
            $newJsonString = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
            $result = file_put_contents($jsonFilePath, $newJsonString);
            
            if ($result !== false) {
                $response['status'] = 'success';
                $response['message'] = 'Mantap! Data cms_global berhasil diperbarui tanpa menyentuh komponen lain.';
            } else {
                $error = error_get_last();
                $response['message'] = 'Gagal menyimpan ke content.json. Error: ' . ($error['message'] ?? 'Unknown');
                echo json_encode($response);
                exit;
            }
        } else {
            $response['message'] = 'File content.json di server corrupt cuy, ga bisa dibaca.';
            echo json_encode($response);
            exit;
        }
    } else {
        $response['message'] = 'Format JSON yang dikirim dari frontend berantakan.';
        echo json_encode($response);
        exit;
    }
}

// ==============================================================
// 2. PROSES UPLOAD LOGO CMS
// ==============================================================
if (isset($_FILES['cms_logo']) && $_FILES['cms_logo']['error'] === UPLOAD_ERR_OK) {
    $fileName = 'logo_cms_kurir_koe.webp'; 
    $uploadPath = $uploadDir . $fileName;
    
    if (move_uploaded_file($_FILES['cms_logo']['tmp_name'], $uploadPath)) {
        $response['message'] .= ' Logo berhasil diupdate!';
    } else {
        $response['status'] = 'warning';
        $response['message'] .= ' Tapi logo gagal diupload.';
    }
}

echo json_encode($response);
?>