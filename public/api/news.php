<?php
declare(strict_types=1);

$configFile = __DIR__ . '/config.php';
header('Content-Type: application/json; charset=utf-8');
if (!is_file($configFile)) {
    http_response_code(503);
    echo json_encode(['ok' => false, 'message' => 'CMS is not configured.']);
    exit;
}
require $configFile;

$language = ($_GET['lang'] ?? 'en') === 'ar' ? 'ar' : 'en';
$limit = max(1, min(20, (int) ($_GET['limit'] ?? 4)));

function db_configured(): bool
{
    foreach (['CMS_DB_HOST', 'CMS_DB_NAME', 'CMS_DB_USER', 'CMS_DB_PASSWORD'] as $constant) {
        if (!defined($constant) || constant($constant) === '') return false;
    }
    return true;
}

function table_name(): string
{
    $prefix = defined('CMS_DB_TABLE_PREFIX') ? preg_replace('/[^a-zA-Z0-9_]/', '', CMS_DB_TABLE_PREFIX) : '';
    return $prefix . 'cms_items';
}

if (db_configured()) {
    try {
        $charset = defined('CMS_DB_CHARSET') ? CMS_DB_CHARSET : 'utf8mb4';
        $pdo = new PDO('mysql:host=' . CMS_DB_HOST . ';dbname=' . CMS_DB_NAME . ';charset=' . $charset, CMS_DB_USER, CMS_DB_PASSWORD, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
            PDO::ATTR_EMULATE_PREPARES => false,
        ]);
        $table = table_name();
        $statement = $pdo->prepare("SELECT * FROM `$table` WHERE `collection` = 'news' AND `published` = 1 ORDER BY `sort_order` ASC, `published_at` DESC LIMIT :limit");
        $statement->bindValue('limit', $limit, PDO::PARAM_INT);
        $statement->execute();
        $items = $statement->fetchAll();
    } catch (Throwable $error) {
        http_response_code(500);
        echo json_encode(['ok' => false, 'message' => 'Database connection failed.']);
        exit;
    }
} else {
    $file = CMS_DATA_DIR . '/news.json';
    $items = is_file($file) ? json_decode((string) file_get_contents($file), true) : [];
    $items = is_array($items) ? $items : [];
    $items = array_values(array_filter($items, function (array $item): bool {
        return (bool) ($item['published'] ?? false);
    }));
    usort($items, function (array $a, array $b): int {
        $order = ($a['sort_order'] ?? 0) <=> ($b['sort_order'] ?? 0);
        return $order !== 0 ? $order : strcmp((string) ($b['published_at'] ?? ''), (string) ($a['published_at'] ?? ''));
    });
}
$items = array_slice($items, 0, $limit);
$mapped = array_map(function (array $item) use ($language): array {
    return [
        'id' => (string) ($item['id'] ?? ''),
        'title' => (string) ($item['title_' . $language] ?? ''),
        'body' => (string) ($item['body_' . $language] ?? ''),
        'image_path' => (string) ($item['image_path'] ?? ''),
        'published_at' => (string) ($item['published_at'] ?? ''),
    ];
}, $items);

echo json_encode(['ok' => true, 'items' => $mapped], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
