<?php
declare(strict_types=1);

const ADMIN_USERNAME = 'core-admin';
const ADMIN_PASSWORD_HASH = '';
const ADMIN_PASSWORD_SALT = '917775d9b583ecd3e2afc7b31cdb6389';
const ADMIN_PASSWORD_ITERATIONS = 210000;
const ADMIN_PASSWORD_PBKDF2 = '271afebf31f49560bf2b4dfcc84363ba2f9c636391b2b2391583b32e227975be';
const CMS_SECRET = 'b4e2bae529a0ca3563764d43d2b27ab9db5bfedca6a8afb05efc9b77fc0f88cf';
const CMS_DATA_DIR = __DIR__ . '/../storage';
const CMS_UPLOAD_DIR = __DIR__ . '/../uploads';
const CMS_UPLOAD_URL = '/uploads';
