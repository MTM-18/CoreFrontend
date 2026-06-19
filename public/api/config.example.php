<?php
declare(strict_types=1);

/*
 * Copy this file to config.php on cPanel and replace the credentials and secret.
 * Generate ADMIN_PASSWORD_HASH with:
 * php -r "echo password_hash('YOUR-STRONG-PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"
 */
const ADMIN_USERNAME = 'core-admin';
const ADMIN_PASSWORD_HASH = '$2y$10$replace.this.with.a.real.password.hash';
const CMS_SECRET = 'replace-with-a-long-random-secret';
const CMS_DATA_DIR = __DIR__ . '/../storage';
const CMS_UPLOAD_DIR = __DIR__ . '/../uploads';
const CMS_UPLOAD_URL = '/uploads';

/*
 * Optional now, required when you switch production to MySQL.
 * If these constants are missing or empty, the CMS keeps using JSON storage.
 */
// const CMS_DB_HOST = 'localhost';
// const CMS_DB_NAME = 'cpaneluser_corecms';
// const CMS_DB_USER = 'cpaneluser_coreuser';
// const CMS_DB_PASSWORD = 'replace-with-database-password';
// const CMS_DB_CHARSET = 'utf8mb4';
// const CMS_DB_TABLE_PREFIX = '';
