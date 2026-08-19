<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);

header('Access-Control-Allow-Origin: *');
header('Content-Type: application/json');

$response = ['status' => 'error', 'message' => 'Gagal memproses permintaan cuy.'];

$jsonFilePath = __DIR__ . '/../data/content.json';
$uploadDir = __DIR__ . '/../assets/images/';

// ==============================================================
// 0. BACA DATA LAMA
// ==============================================================
$existingJson = file_get_contents($jsonFilePath);
$existingData = json_decode($existingJson, true);

if (json_last_error() !== JSON_ERROR_NONE) {
    $response['message'] = 'File content.json di server corrupt cuy, ga bisa dibaca.';
    echo json_encode($response);
    exit;
}

$isUpdated = false;

// ==============================================================
// 1. UPDATE SEMUA DATA JSON YANG DIKIRIM (SUPER UNIVERSAL)
//    -> Cuma diproses di MEMORY dulu, belum ditulis ke file
// ==============================================================
foreach ($_POST as $key => $value) {
    $decodedValue = json_decode($value, true);

    if (json_last_error() === JSON_ERROR_NONE) {
        $existingData[$key] = $decodedValue;
        $isUpdated = true;
    }
}

// ==============================================================
// 2. PROSES UPLOAD LOGO CMS (Replace file lama, ikutin extension asli)
// ==============================================================
$allowedExt = ['webp', 'png', 'jpg', 'jpeg'];

if (isset($_FILES['cms_logo']) && $_FILES['cms_logo']['error'] === UPLOAD_ERR_OK) {

    $originalExt = strtolower(pathinfo($_FILES['cms_logo']['name'], PATHINFO_EXTENSION));

    if (!in_array($originalExt, $allowedExt)) {
        $response['status'] = $isUpdated ? 'warning' : 'error';
        $response['message'] = 'Format logo tidak didukung. Cuma boleh: ' . implode(', ', $allowedExt);
    } else {
        $baseName = 'logo_cms_kurir_koe';
        $newFileName = $baseName . '.' . $originalExt;
        $uploadPath = $uploadDir . $newFileName;

        // --- HAPUS FILE LOGO LAMA (extension apapun) biar bener2 di-replace, bukan numpuk ---
        $oldFiles = glob($uploadDir . $baseName . '.*');
        if ($oldFiles) {
            foreach ($oldFiles as $oldFile) {
                // Jangan hapus kalau kebetulan nama filenya sama persis dgn yang mau ditulis
                if (strtolower($oldFile) !== strtolower($uploadPath)) {
                    @unlink($oldFile);
                }
            }
        }

        if (move_uploaded_file($_FILES['cms_logo']['tmp_name'], $uploadPath)) {
            // Update field logo_url di data cms_global (masih di memory)
            if (!isset($existingData['cms_global']) || !is_array($existingData['cms_global'])) {
                $existingData['cms_global'] = [];
            }
            $existingData['cms_global']['logo_url'] = './assets/images/' . $newFileName;

            $isUpdated = true;
            $response['status'] = 'success';
            $response['message'] = 'Logo berhasil diupdate!';
        } else {
            $response['status'] = $isUpdated ? 'warning' : 'error';
            $response['message'] = 'Gagal upload logo (cek permission folder assets/images).';
        }
    }
}

// ==============================================================
// PROSES UPLOAD FAVICON LANDING PAGE
// ==============================================================
if (isset($_FILES['favicon_file']) && $_FILES['favicon_file']['error'] === UPLOAD_ERR_OK) {
    $originalExt = strtolower(pathinfo($_FILES['favicon_file']['name'], PATHINFO_EXTENSION));
    if (in_array($originalExt, $allowedExt)) {
        $baseName = 'logo_kurir_koefav';
        $newFileName = $baseName . '.' . $originalExt;
        $uploadPath = $uploadDir . $newFileName;
        
        // Hapus favicon lama
        $oldFiles = glob($uploadDir . $baseName . '.*');
        if ($oldFiles) {
            foreach ($oldFiles as $oldFile) {
                if (strtolower($oldFile) !== strtolower($uploadPath)) @unlink($oldFile);
            }
        }
        
        if (move_uploaded_file($_FILES['favicon_file']['tmp_name'], $uploadPath)) {
            if (!isset($existingData['global_meta']) || !is_array($existingData['global_meta'])) {
                $existingData['global_meta'] = [];
            }
            // Update value JSON di memory
            $existingData['global_meta']['favicon_url'] = './assets/images/' . $newFileName;
            $isUpdated = true;
            $response['global_meta'] = $existingData['global_meta']; // Balikin buat di-sync frontend
        }
    }
}

// ==============================================================
// PROSES UPLOAD HERO IMAGE
// ==============================================================
if (isset($_FILES['hero_image']) && $_FILES['hero_image']['error'] === UPLOAD_ERR_OK) {
    $originalExt = strtolower(pathinfo($_FILES['hero_image']['name'], PATHINFO_EXTENSION));
    if (in_array($originalExt, $allowedExt)) {
        $baseName = 'hero_illustration';
        $newFileName = $baseName . '.' . $originalExt;
        $uploadPath = $uploadDir . $newFileName;
        
        $oldFiles = glob($uploadDir . $baseName . '.*');
        if ($oldFiles) {
            foreach ($oldFiles as $oldFile) {
                if (strtolower($oldFile) !== strtolower($uploadPath)) @unlink($oldFile);
            }
        }
        
        if (move_uploaded_file($_FILES['hero_image']['tmp_name'], $uploadPath)) {
            if (!isset($existingData['hero']) || !is_array($existingData['hero'])) {
                $existingData['hero'] = [];
            }
            $existingData['hero']['image_url'] = './assets/images/' . $newFileName;
            $isUpdated = true;
            $response['hero'] = $existingData['hero']; // Balikin biar front-end nge-sync gambarnya
        }
    }
}

// ==============================================================
// PROSES UPLOAD PARTNERSHIP IMAGE
// ==============================================================
if (isset($_FILES['partnership_image']) && $_FILES['partnership_image']['error'] === UPLOAD_ERR_OK) {
    $originalExt = strtolower(pathinfo($_FILES['partnership_image']['name'], PATHINFO_EXTENSION));
    if (in_array($originalExt, $allowedExt)) {
        $baseName = 'partnership_illustration';
        $newFileName = $baseName . '.' . $originalExt;
        $uploadPath = $uploadDir . $newFileName;
        
        $oldFiles = glob($uploadDir . $baseName . '.*');
        if ($oldFiles) {
            foreach ($oldFiles as $oldFile) {
                if (strtolower($oldFile) !== strtolower($uploadPath)) @unlink($oldFile);
            }
        }
        
        if (move_uploaded_file($_FILES['partnership_image']['tmp_name'], $uploadPath)) {
            if (!isset($existingData['partnership']) || !is_array($existingData['partnership'])) {
                $existingData['partnership'] = [];
            }
            $existingData['partnership']['image_url'] = './assets/images/' . $newFileName;
            $isUpdated = true;
            $response['partnership'] = $existingData['partnership']; 
        }
    }
}

// ==============================================================
// 3. TULIS SEKALI AJA KE content.json (SETELAH semua proses selesai)
// ==============================================================
if ($isUpdated) {
    $newJsonString = json_encode($existingData, JSON_PRETTY_PRINT | JSON_UNESCAPED_SLASHES);
    $result = file_put_contents($jsonFilePath, $newJsonString);

    if ($result !== false) {
        if ($response['status'] !== 'error') {
            // kalau belum ke-set status success dari step logo, set sekarang
            if ($response['status'] === 'error') $response['status'] = 'success';
        }
        if ($response['status'] === 'error') {
            $response['status'] = 'success';
            $response['message'] = 'Mantap! Data berhasil disimpan.';
        }
        // Kirim balik data cms_global terbaru (termasuk logo_url baru) biar front-end bisa sync langsung
        if (isset($existingData['cms_global'])) {
            $response['cms_global'] = $existingData['cms_global'];
        }
    } else {
        $error = error_get_last();
        $response['status'] = 'error';
        $response['message'] = 'Gagal menyimpan ke content.json. Error: ' . ($error['message'] ?? 'Unknown');
    }
} else if (empty($_FILES)) {
    $response['status'] = 'error';
    $response['message'] = 'Tidak ada data valid yang diterima server.';
}

echo json_encode($response);