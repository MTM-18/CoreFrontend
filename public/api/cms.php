<?php
declare(strict_types=1);

header('Content-Type: application/json; charset=utf-8');
header('X-Content-Type-Options: nosniff');
header('Cache-Control: no-store, no-cache, must-revalidate, max-age=0');

$configFile = __DIR__ . '/config.php';
if (!is_file($configFile)) {
    respond(503, ['ok' => false, 'message' => 'CMS is not configured. Copy api/config.example.php to api/config.php.']);
}
require $configFile;

const COLLECTIONS = ['news', 'home_testimonials', 'program_testimonials', 'team', 'podcasts', 'reports', 'stories', 'certificates', 'workspace_images', 'gallery', 'filters'];

function respond(int $status, array $payload): void
{
    http_response_code($status);
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
}

function request_body(): array
{
    $decoded = json_decode((string) file_get_contents('php://input'), true);
    return is_array($decoded) ? $decoded : [];
}

function clean_string($value, int $max = 20000): string
{
    $cleaned = trim(is_string($value) ? $value : '');
    return function_exists('mb_substr')
        ? mb_substr($cleaned, 0, $max)
        : substr($cleaned, 0, $max);
}

function bearer_token(): string
{
    $header = $_SERVER['HTTP_AUTHORIZATION'] ?? '';
    if (preg_match('/^Bearer\s+(.+)$/i', $header, $matches)) {
        return trim($matches[1]);
    }
    return '';
}

function token_for(string $username, int $expires): string
{
    $payload = base64_encode(json_encode(['user' => $username, 'exp' => $expires]));
    $signature = hash_hmac('sha256', $payload, CMS_SECRET);
    return $payload . '.' . $signature;
}

function require_admin(): void
{
    $parts = explode('.', bearer_token(), 2);
    if (count($parts) !== 2 || !hash_equals(hash_hmac('sha256', $parts[0], CMS_SECRET), $parts[1])) {
        respond(401, ['ok' => false, 'message' => 'Unauthorized. Please sign in again.']);
    }
    $payload = json_decode((string) base64_decode($parts[0], true), true);
    if (!is_array($payload) || ($payload['exp'] ?? 0) < time() || ($payload['user'] ?? '') !== ADMIN_USERNAME) {
        respond(401, ['ok' => false, 'message' => 'Unauthorized. Please sign in again.']);
    }
}

function collection_name($value): string
{
    $collection = is_string($value) ? $value : '';
    if (!in_array($collection, COLLECTIONS, true)) {
        respond(400, ['ok' => false, 'message' => 'Invalid content collection.']);
    }
    return $collection;
}

function table_name(): string
{
    $prefix = defined('CMS_DB_TABLE_PREFIX') ? preg_replace('/[^a-zA-Z0-9_]/', '', CMS_DB_TABLE_PREFIX) : '';
    return $prefix . 'cms_items';
}

function db_configured(): bool
{
    foreach (['CMS_DB_HOST', 'CMS_DB_NAME', 'CMS_DB_USER', 'CMS_DB_PASSWORD'] as $constant) {
        if (!defined($constant) || constant($constant) === '') return false;
    }
    return true;
}

function data_file(string $collection): string
{
    if (!defined('CMS_DATA_DIR')) {
        respond(503, ['ok' => false, 'message' => 'JSON storage is not configured.']);
    }
    if (!is_dir(CMS_DATA_DIR) && !mkdir(CMS_DATA_DIR, 0755, true) && !is_dir(CMS_DATA_DIR)) {
        respond(500, ['ok' => false, 'message' => 'Unable to create the CMS storage directory.']);
    }
    return CMS_DATA_DIR . '/' . $collection . '.json';
}

function read_json_items(string $collection): array
{
    $file = data_file($collection);
    if (!is_file($file)) return [];
    $decoded = json_decode((string) file_get_contents($file), true);
    return is_array($decoded) ? array_values($decoded) : [];
}

function write_json_items(string $collection, array $items): void
{
    $file = data_file($collection);
    $handle = fopen($file, 'c+');
    if ($handle === false || !flock($handle, LOCK_EX)) {
        respond(500, ['ok' => false, 'message' => 'Unable to lock the CMS data file.']);
    }
    ftruncate($handle, 0);
    rewind($handle);
    fwrite($handle, (string) json_encode(array_values($items), JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES));
    fflush($handle);
    flock($handle, LOCK_UN);
    fclose($handle);
}

function pdo(): PDO
{
    static $pdo = null;
    if ($pdo instanceof PDO) return $pdo;
    if (!db_configured()) {
        respond(503, ['ok' => false, 'message' => 'MySQL is not configured. Add CMS_DB_* constants to api/config.php.']);
    }
    $charset = defined('CMS_DB_CHARSET') ? CMS_DB_CHARSET : 'utf8mb4';
    $dsn = 'mysql:host=' . CMS_DB_HOST . ';dbname=' . CMS_DB_NAME . ';charset=' . $charset;
    try {
        $pdo = new PDO($dsn, CMS_DB_USER, CMS_DB_PASSWORD, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        init_schema($pdo);
        return $pdo;
    } catch (Throwable $error) {
        respond(500, ['ok' => false, 'message' => 'Database connection failed. Check the MySQL credentials in api/config.php.']);
    }
}

function init_schema(PDO $pdo): void
{
    static $done = false;
    if ($done) return;
    $table = table_name();
    $pdo->exec("
        CREATE TABLE IF NOT EXISTS `$table` (
            `row_id` BIGINT UNSIGNED NOT NULL AUTO_INCREMENT,
            `id` VARCHAR(100) NOT NULL,
            `collection` VARCHAR(50) NOT NULL,
            `title_en` VARCHAR(500) NOT NULL DEFAULT '',
            `title_ar` VARCHAR(500) NOT NULL DEFAULT '',
            `body_en` MEDIUMTEXT NULL,
            `body_ar` MEDIUMTEXT NULL,
            `subtitle_en` VARCHAR(1000) NOT NULL DEFAULT '',
            `subtitle_ar` VARCHAR(1000) NOT NULL DEFAULT '',
            `image_path` VARCHAR(2000) NOT NULL DEFAULT '',
            `media_path` VARCHAR(2000) NOT NULL DEFAULT '',
            `external_url` VARCHAR(2000) NOT NULL DEFAULT '',
            `program` VARCHAR(200) NOT NULL DEFAULT '',
            `certificate_code` VARCHAR(200) NOT NULL DEFAULT '',
            `certificate_type` VARCHAR(500) NOT NULL DEFAULT '',
            `first_name` VARCHAR(200) NOT NULL DEFAULT '',
            `birthdate` VARCHAR(40) NOT NULL DEFAULT '',
            `published_at` VARCHAR(40) NOT NULL DEFAULT '',
            `published` TINYINT(1) NOT NULL DEFAULT 0,
            `featured` TINYINT(1) NOT NULL DEFAULT 0,
            `sort_order` INT NOT NULL DEFAULT 0,
            `filter_id` VARCHAR(100) NOT NULL DEFAULT '',
            `shorts_json` MEDIUMTEXT NULL,
            `created_at` VARCHAR(40) NOT NULL DEFAULT '',
            `updated_at` VARCHAR(40) NOT NULL DEFAULT '',
            PRIMARY KEY (`row_id`),
            UNIQUE KEY `uniq_collection_id` (`collection`, `id`),
            KEY `idx_collection_order` (`collection`, `published`, `sort_order`, `published_at`),
            KEY `idx_certificate_lookup` (`collection`, `program`, `birthdate`)
        ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci
    ");
    $done = true;
}

function normalize_certificate_code(string $value): string
{
    return strtolower((string) preg_replace('/[^a-zA-Z0-9]/', '', $value));
}

function normalize_lookup_name(string $value): string
{
    $value = preg_replace('/\s+/u', ' ', trim($value));
    return function_exists('mb_strtolower') ? mb_strtolower($value, 'UTF-8') : strtolower($value);
}

function public_certificate_payload(array $item): array
{
    return [
        'full_name' => clean_string($item['title_en'] ?? ($item['title_ar'] ?? ''), 500),
        'certificate_code' => clean_string($item['certificate_code'] ?? '', 200),
        'certificate_type' => clean_string($item['certificate_type'] ?? '', 500),
        'program' => clean_string($item['program'] ?? ($item['body_en'] ?? ''), 1000),
        'issued_at' => clean_string($item['published_at'] ?? '', 40),
        'file_url' => clean_string(($item['media_path'] ?? '') ?: ($item['external_url'] ?? ''), 2000),
    ];
}

function row_to_item(array $row): array
{
    $shorts = json_decode((string) ($row['shorts_json'] ?? '[]'), true);
    return [
        'id' => (string) ($row['id'] ?? ''),
        'collection' => (string) ($row['collection'] ?? ''),
        'title_en' => (string) ($row['title_en'] ?? ''),
        'title_ar' => (string) ($row['title_ar'] ?? ''),
        'body_en' => (string) ($row['body_en'] ?? ''),
        'body_ar' => (string) ($row['body_ar'] ?? ''),
        'subtitle_en' => (string) ($row['subtitle_en'] ?? ''),
        'subtitle_ar' => (string) ($row['subtitle_ar'] ?? ''),
        'image_path' => (string) ($row['image_path'] ?? ''),
        'media_path' => (string) ($row['media_path'] ?? ''),
        'external_url' => (string) ($row['external_url'] ?? ''),
        'program' => (string) ($row['program'] ?? ''),
        'certificate_code' => (string) ($row['certificate_code'] ?? ''),
        'certificate_type' => (string) ($row['certificate_type'] ?? ''),
        'first_name' => (string) ($row['first_name'] ?? ''),
        'birthdate' => (string) ($row['birthdate'] ?? ''),
        'published_at' => (string) ($row['published_at'] ?? ''),
        'published' => (bool) ($row['published'] ?? false),
        'featured' => (bool) ($row['featured'] ?? false),
        'sort_order' => (int) ($row['sort_order'] ?? 0),
        'filter_id' => (string) ($row['filter_id'] ?? ''),
        'shorts' => is_array($shorts) ? $shorts : [],
        'created_at' => (string) ($row['created_at'] ?? ''),
        'updated_at' => (string) ($row['updated_at'] ?? ''),
    ];
}

function normalize_item(array $input, string $collection, ?array $existing = null): array
{
    $now = gmdate('c');
    $shorts = [];
    foreach ((is_array($input['shorts'] ?? null) ? $input['shorts'] : []) as $short) {
        if (!is_array($short)) continue;
        $shorts[] = [
            'id' => clean_string($short['id'] ?? '') ?: bin2hex(random_bytes(6)),
            'title_en' => clean_string($short['title_en'] ?? '', 500),
            'title_ar' => clean_string($short['title_ar'] ?? '', 500),
            'youtube_url' => clean_string($short['youtube_url'] ?? '', 2000),
        ];
    }
    return [
        'id' => clean_string($input['id'] ?? '') ?: bin2hex(random_bytes(8)),
        'collection' => $collection,
        'title_en' => clean_string($input['title_en'] ?? '', 500),
        'title_ar' => clean_string($input['title_ar'] ?? '', 500),
        'body_en' => clean_string($input['body_en'] ?? ''),
        'body_ar' => clean_string($input['body_ar'] ?? ''),
        'subtitle_en' => clean_string($input['subtitle_en'] ?? '', 1000),
        'subtitle_ar' => clean_string($input['subtitle_ar'] ?? '', 1000),
        'image_path' => clean_string($input['image_path'] ?? '', 2000),
        'media_path' => clean_string($input['media_path'] ?? '', 2000),
        'external_url' => clean_string($input['external_url'] ?? '', 2000),
        'program' => clean_string($input['program'] ?? '', 200),
        'certificate_code' => clean_string($input['certificate_code'] ?? '', 200),
        'certificate_type' => clean_string($input['certificate_type'] ?? '', 500),
        'first_name' => clean_string($input['first_name'] ?? '', 200),
        'birthdate' => clean_string($input['birthdate'] ?? '', 40),
        'published_at' => clean_string($input['published_at'] ?? date('Y-m-d'), 40),
        'published' => (bool) ($input['published'] ?? false),
        'featured' => (bool) ($input['featured'] ?? false),
        'sort_order' => (int) ($input['sort_order'] ?? 0),
        'filter_id' => clean_string($input['filter_id'] ?? '', 100),
        'shorts' => $shorts,
        'created_at' => $existing['created_at'] ?? $now,
        'updated_at' => $now,
    ];
}

function find_item(string $collection, string $id): ?array
{
    if (!db_configured()) {
        foreach (read_json_items($collection) as $item) {
            if (is_array($item) && ($item['id'] ?? '') === $id) return $item;
        }
        return null;
    }
    $table = table_name();
    $statement = pdo()->prepare("SELECT * FROM `$table` WHERE `collection` = :collection AND `id` = :id LIMIT 1");
    $statement->execute(['collection' => $collection, 'id' => $id]);
    $row = $statement->fetch();
    return is_array($row) ? row_to_item($row) : null;
}

function read_items(string $collection, bool $admin = false): array
{
    if (!$admin && $collection === 'certificates') return [];
    if (!db_configured()) {
        $items = read_json_items($collection);
        if (!$admin) {
            $items = array_values(array_filter($items, function (array $item): bool {
                return (bool) ($item['published'] ?? false);
            }));
        }
        usort($items, function (array $a, array $b): int {
            $order = ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0);
            return $order !== 0 ? $order : strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? ''));
        });
        return $items;
    }
    $table = table_name();
    $sql = "SELECT * FROM `$table` WHERE `collection` = :collection";
    $params = ['collection' => $collection];
    if (!$admin) $sql .= " AND `published` = 1";
    $sql .= " ORDER BY `sort_order` ASC, `published_at` DESC";
    $statement = pdo()->prepare($sql);
    $statement->execute($params);
    return array_map('row_to_item', $statement->fetchAll());
}

function save_item(array $item): array
{
    if (!db_configured()) {
        $items = array_values(array_filter(read_json_items($item['collection']), function (array $candidate) use ($item): bool {
            return ($candidate['id'] ?? '') !== $item['id'];
        }));
        $items[] = $item;
        write_json_items($item['collection'], $items);
        return $item;
    }
    $table = table_name();
    $sql = "
        INSERT INTO `$table` (
            `id`, `collection`, `title_en`, `title_ar`, `body_en`, `body_ar`, `subtitle_en`, `subtitle_ar`,
            `image_path`, `media_path`, `external_url`, `program`, `certificate_code`, `certificate_type`,
            `first_name`, `birthdate`, `published_at`, `published`, `featured`, `sort_order`, `filter_id`,
            `shorts_json`, `created_at`, `updated_at`
        ) VALUES (
            :id, :collection, :title_en, :title_ar, :body_en, :body_ar, :subtitle_en, :subtitle_ar,
            :image_path, :media_path, :external_url, :program, :certificate_code, :certificate_type,
            :first_name, :birthdate, :published_at, :published, :featured, :sort_order, :filter_id,
            :shorts_json, :created_at, :updated_at
        )
        ON DUPLICATE KEY UPDATE
            `title_en` = VALUES(`title_en`),
            `title_ar` = VALUES(`title_ar`),
            `body_en` = VALUES(`body_en`),
            `body_ar` = VALUES(`body_ar`),
            `subtitle_en` = VALUES(`subtitle_en`),
            `subtitle_ar` = VALUES(`subtitle_ar`),
            `image_path` = VALUES(`image_path`),
            `media_path` = VALUES(`media_path`),
            `external_url` = VALUES(`external_url`),
            `program` = VALUES(`program`),
            `certificate_code` = VALUES(`certificate_code`),
            `certificate_type` = VALUES(`certificate_type`),
            `first_name` = VALUES(`first_name`),
            `birthdate` = VALUES(`birthdate`),
            `published_at` = VALUES(`published_at`),
            `published` = VALUES(`published`),
            `featured` = VALUES(`featured`),
            `sort_order` = VALUES(`sort_order`),
            `filter_id` = VALUES(`filter_id`),
            `shorts_json` = VALUES(`shorts_json`),
            `updated_at` = VALUES(`updated_at`)
    ";
    $params = $item;
    $params['published'] = $item['published'] ? 1 : 0;
    $params['featured'] = $item['featured'] ? 1 : 0;
    $params['shorts_json'] = json_encode($item['shorts'], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    unset($params['shorts']);
    pdo()->prepare($sql)->execute($params);
    return $item;
}

function delete_item(string $collection, string $id): void
{
    if (!db_configured()) {
        write_json_items($collection, array_values(array_filter(read_json_items($collection), function (array $item) use ($id): bool {
            return ($item['id'] ?? '') !== $id;
        })));
        return;
    }
    $table = table_name();
    $statement = pdo()->prepare("DELETE FROM `$table` WHERE `collection` = :collection AND `id` = :id");
    $statement->execute(['collection' => $collection, 'id' => $id]);
}

function reorder_items(string $collection, array $ids): void
{
    if (!db_configured()) {
        $positions = [];
        foreach ($ids as $position => $id) {
            if (is_string($id)) $positions[$id] = $position;
        }
        write_json_items($collection, array_map(function (array $item) use ($positions): array {
            $id = (string) ($item['id'] ?? '');
            if (array_key_exists($id, $positions)) {
                $item['sort_order'] = $positions[$id];
                $item['updated_at'] = gmdate('c');
            }
            return $item;
        }, read_json_items($collection)));
        return;
    }
    $table = table_name();
    $statement = pdo()->prepare("UPDATE `$table` SET `sort_order` = :sort_order, `updated_at` = :updated_at WHERE `collection` = :collection AND `id` = :id");
    $now = gmdate('c');
    foreach ($ids as $position => $id) {
        if (!is_string($id)) continue;
        $statement->execute([
            'sort_order' => $position,
            'updated_at' => $now,
            'collection' => $collection,
            'id' => $id,
        ]);
    }
}

function migrate_json_storage(): array
{
    if (!db_configured()) {
        respond(400, ['ok' => false, 'message' => 'Configure MySQL first, then run migration.']);
    }
    if (!defined('CMS_DATA_DIR') || !is_dir(CMS_DATA_DIR)) {
        return ['imported' => 0, 'collections' => []];
    }
    $imported = 0;
    $collections = [];
    foreach (COLLECTIONS as $collection) {
        $file = CMS_DATA_DIR . '/' . $collection . '.json';
        if (!is_file($file)) continue;
        $decoded = json_decode((string) file_get_contents($file), true);
        if (!is_array($decoded)) continue;
        $count = 0;
        foreach ($decoded as $candidate) {
            if (!is_array($candidate)) continue;
            $existing = find_item($collection, clean_string($candidate['id'] ?? '', 100));
            save_item(normalize_item($candidate, $collection, $existing));
            $count++;
        }
        $collections[$collection] = $count;
        $imported += $count;
    }
    return ['imported' => $imported, 'collections' => $collections];
}

function image_to_webp(string $source, string $destination, string $mime): bool
{
    if (!function_exists('imagewebp')) return false;
    $image = false;
    if ($mime === 'image/jpeg') {
        $image = @imagecreatefromjpeg($source);
    } elseif ($mime === 'image/png') {
        $image = @imagecreatefrompng($source);
    } elseif ($mime === 'image/webp') {
        $image = @imagecreatefromwebp($source);
    }
    if (!$image) return false;

    $width = imagesx($image);
    $height = imagesy($image);
    $max = 1920;
    $scale = min(1, $max / max($width, $height));
    $newWidth = max(1, (int) round($width * $scale));
    $newHeight = max(1, (int) round($height * $scale));
    $canvas = imagecreatetruecolor($newWidth, $newHeight);
    imagealphablending($canvas, false);
    imagesavealpha($canvas, true);
    imagecopyresampled($canvas, $image, 0, 0, 0, 0, $newWidth, $newHeight, $width, $height);
    $saved = imagewebp($canvas, $destination, 82);
    imagedestroy($canvas);
    imagedestroy($image);
    return $saved;
}

function upload_file(): void
{
    $kind = $_POST['kind'] ?? '';
    $allowed = [
        'image' => ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'],
        'document' => ['application/pdf' => 'pdf'],
        'video' => ['video/mp4' => 'mp4', 'video/webm' => 'webm'],
    ];
    $limits = ['image' => 12 * 1024 * 1024, 'document' => 40 * 1024 * 1024, 'video' => 250 * 1024 * 1024];
    if (!isset($allowed[$kind], $_FILES['file']) || !is_uploaded_file($_FILES['file']['tmp_name'])) {
        respond(400, ['ok' => false, 'message' => 'A valid upload is required.']);
    }
    if ($_FILES['file']['error'] !== UPLOAD_ERR_OK || $_FILES['file']['size'] > $limits[$kind]) {
        respond(413, ['ok' => false, 'message' => 'The uploaded file is too large or incomplete.']);
    }
    $mime = (new finfo(FILEINFO_MIME_TYPE))->file($_FILES['file']['tmp_name']);
    if (!isset($allowed[$kind][$mime])) {
        respond(415, ['ok' => false, 'message' => 'This file format is not allowed.']);
    }

    $folder = CMS_UPLOAD_DIR . '/' . $kind;
    if (!is_dir($folder) && !mkdir($folder, 0755, true) && !is_dir($folder)) {
        respond(500, ['ok' => false, 'message' => 'Unable to create the upload directory.']);
    }
    $base = date('Ymd-His') . '-' . bin2hex(random_bytes(5));
    $extension = $allowed[$kind][$mime];
    $destination = $folder . '/' . $base . '.' . $extension;

    if ($kind === 'image') {
        if (!image_to_webp($_FILES['file']['tmp_name'], $folder . '/' . $base . '.webp', $mime)) {
            respond(500, ['ok' => false, 'message' => 'WebP conversion is unavailable. Enable PHP GD with WebP support in cPanel.']);
        }
        $extension = 'webp';
    } elseif (!move_uploaded_file($_FILES['file']['tmp_name'], $destination)) {
        respond(500, ['ok' => false, 'message' => 'Unable to store the uploaded file.']);
    }
    respond(200, ['ok' => true, 'path' => CMS_UPLOAD_URL . '/' . $kind . '/' . $base . '.' . $extension]);
}

$method = $_SERVER['REQUEST_METHOD'] ?? 'GET';

if ($method === 'GET') {
    $collection = collection_name($_GET['collection'] ?? '');
    $admin = ($_GET['admin'] ?? '') === '1';
    if ($admin) require_admin();
    respond(200, ['ok' => true, 'items' => read_items($collection, $admin)]);
}

if ($method !== 'POST') respond(405, ['ok' => false, 'message' => 'Method not allowed.']);

$contentType = $_SERVER['CONTENT_TYPE'] ?? '';
$body = strpos($contentType, 'multipart/form-data') === 0 ? $_POST : request_body();
$action = $body['action'] ?? '';

if ($action === 'login') {
    $username = clean_string($body['username'] ?? '', 200);
    $password = is_string($body['password'] ?? null) ? $body['password'] : '';
    $passwordMatches = defined('ADMIN_PASSWORD_HASH')
        && ADMIN_PASSWORD_HASH !== ''
        && password_verify($password, ADMIN_PASSWORD_HASH);
    if (!$passwordMatches && defined('ADMIN_PASSWORD_PBKDF2') && defined('ADMIN_PASSWORD_SALT')) {
        $iterations = defined('ADMIN_PASSWORD_ITERATIONS') ? ADMIN_PASSWORD_ITERATIONS : 210000;
        $candidate = hash_pbkdf2('sha256', $password, ADMIN_PASSWORD_SALT, $iterations, 64);
        $passwordMatches = hash_equals(ADMIN_PASSWORD_PBKDF2, $candidate);
    }
    if (!hash_equals(ADMIN_USERNAME, $username) || !$passwordMatches) {
        usleep(500000);
        respond(401, ['ok' => false, 'message' => 'Incorrect username or password.']);
    }
    if (db_configured()) pdo();
    respond(200, ['ok' => true, 'token' => token_for($username, time() + 8 * 60 * 60)]);
}

if ($action === 'verify_certificate') {
    $program = clean_string($body['program'] ?? '', 500);
    $fullName = normalize_lookup_name(clean_string($body['full_name'] ?? '', 500));
    $birthdate = clean_string($body['birthdate'] ?? '', 40);
    if ($program === '' || $fullName === '' || $birthdate === '') {
        respond(400, ['ok' => false, 'message' => 'Program, full name, and birthdate are required.']);
    }
    $items = [];
    if (db_configured()) {
        $table = table_name();
        $statement = pdo()->prepare("SELECT * FROM `$table` WHERE `collection` = 'certificates' AND `published` = 1 AND `program` = :program AND `birthdate` = :birthdate");
        $statement->execute(['program' => $program, 'birthdate' => $birthdate]);
        $items = array_map('row_to_item', $statement->fetchAll());
    } else {
        $items = array_values(array_filter(read_json_items('certificates'), function (array $item) use ($program, $birthdate): bool {
            return (bool) ($item['published'] ?? false)
                && clean_string($item['program'] ?? '', 500) === $program
                && clean_string($item['birthdate'] ?? '', 40) === $birthdate;
        }));
    }
    foreach ($items as $item) {
        if (normalize_lookup_name($item['title_en'] ?: $item['title_ar']) === $fullName) {
            respond(200, ['ok' => true, 'item' => public_certificate_payload($item)]);
        }
    }
    usleep(300000);
    respond(404, ['ok' => false, 'message' => 'No certificate matched those details.']);
}

if ($action === 'certificate_programs') {
    if (db_configured()) {
        $table = table_name();
        $statement = pdo()->query("SELECT `program`, `certificate_type` FROM `$table` WHERE `collection` = 'certificates' AND `published` = 1 AND `program` <> '' ORDER BY `certificate_type` ASC, `program` ASC");
        $programs = [];
        foreach ($statement->fetchAll() as $row) {
            $value = clean_string($row['program'] ?? '', 500);
            if ($value === '' || isset($programs[$value])) continue;
            $label = clean_string($row['certificate_type'] ?? '', 500) ?: $value;
            $programs[$value] = ['value' => $value, 'label' => $label];
        }
        $programs = array_values($programs);
    } else {
        $programs = [];
        foreach (read_json_items('certificates') as $item) {
            if ((bool) ($item['published'] ?? false) && clean_string($item['program'] ?? '', 500) !== '') {
                $value = clean_string($item['program'] ?? '', 500);
                if (isset($programs[$value])) continue;
                $label = clean_string($item['certificate_type'] ?? '', 500) ?: $value;
                $programs[$value] = ['value' => $value, 'label' => $label];
            }
        }
        $programs = array_values($programs);
        usort($programs, function (array $a, array $b): int {
            return strcasecmp((string) ($a['label'] ?? ''), (string) ($b['label'] ?? ''));
        });
    }
    respond(200, ['ok' => true, 'items' => $programs]);
}

require_admin();
if ($action === 'upload') upload_file();
if ($action === 'migrate_json') respond(200, ['ok' => true, 'migration' => migrate_json_storage()]);

$collection = collection_name($body['collection'] ?? ($body['item']['collection'] ?? ''));

if ($action === 'reorder') {
    $ids = is_array($body['ids'] ?? null) ? array_values($body['ids']) : [];
    reorder_items($collection, $ids);
    respond(200, ['ok' => true]);
}

if ($action === 'save') {
    $input = is_array($body['item'] ?? null) ? $body['item'] : [];
    $existing = find_item($collection, clean_string($input['id'] ?? '', 100));
    $item = save_item(normalize_item($input, $collection, $existing));
    respond(200, ['ok' => true, 'item' => $item]);
}

if ($action === 'delete') {
    delete_item($collection, clean_string($body['id'] ?? '', 100));
    respond(200, ['ok' => true]);
}

respond(400, ['ok' => false, 'message' => 'Unknown CMS action.']);
