# Core Istanbul CMS deployment

1. Run `npm run build`.
2. Upload everything inside `dist/` to the website's `public_html` directory.
3. In `public_html/api`, copy `config.example.php` to `config.php`.
4. Generate a password hash in cPanel Terminal:

   `php -r "echo password_hash('YOUR-STRONG-PASSWORD', PASSWORD_DEFAULT), PHP_EOL;"`

5. Put the generated hash, admin username, and a long random `CMS_SECRET` in `config.php`.
6. Ensure PHP can write to `public_html/storage` and `public_html/uploads` (normally permissions `755`).
7. Enable the PHP GD extension in cPanel so JPEG/PNG uploads are resized and converted to WebP.
8. For large story videos, set `upload_max_filesize` and `post_max_size` to at least `256M` in cPanel MultiPHP INI Editor.
9. Open `/admin`, sign in, and add content.

Uploaded MP4/WebM videos are served from `/uploads/video/` and play inside the website. For long videos, YouTube is usually faster and cheaper; paste its URL into the external URL field.

## Where dashboard uploads are saved

- News, team, testimonial, story, report-cover, and library images: `public_html/uploads/image/`
- Report PDFs: `public_html/uploads/document/`
- Uploaded videos: `public_html/uploads/video/`

The dashboard uploads files through `api/cms.php`. Images are resized to a maximum side of 1920 pixels and converted to WebP when the cPanel PHP GD extension is enabled.
