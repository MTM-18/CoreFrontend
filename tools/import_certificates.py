from __future__ import annotations

import argparse
import hashlib
import json
import re
import shutil
import unicodedata
import zipfile
from datetime import datetime
from pathlib import Path
from urllib.parse import quote

import pdfplumber


DATE_FORMATS = ("%m/%d/%Y", "%m-%d-%Y", "%m/%d/%y", "%m-%d-%y")


def clean_cell(value: object) -> str:
    if value is None:
        return ""
    return re.sub(r"\s+", " ", str(value).replace("\n", " ")).strip()


def normalize_name(value: str) -> str:
    value = unicodedata.normalize("NFKC", value).casefold()
    value = "".join(char for char in unicodedata.normalize("NFKD", value) if not unicodedata.combining(char))
    return re.sub(r"[^a-z0-9]+", "", value)


def normalize_date(value: str) -> str:
    value = clean_cell(value)
    for fmt in DATE_FORMATS:
        try:
            return datetime.strptime(value, fmt).date().isoformat()
        except ValueError:
            pass
    return value


def read_birthdates(pdf_path: Path) -> dict[str, str]:
    birthdates: dict[str, str] = {}
    with pdfplumber.open(str(pdf_path)) as pdf:
        for page in pdf.pages:
            for table in page.extract_tables() or []:
                for row in table:
                    if not row or len(row) < 4:
                        continue
                    name = clean_cell(row[0])
                    birthdate = normalize_date(clean_cell(row[3]))
                    key = normalize_name(name)
                    if key and birthdate and key != "fullnameinenglish":
                        birthdates.setdefault(key, birthdate)
    return birthdates


def public_url(path: Path, public_dir: Path) -> str:
    relative = path.relative_to(public_dir).as_posix()
    return "/" + "/".join(quote(part) for part in relative.split("/"))


def item_id(program: str, name: str) -> str:
    digest = hashlib.sha1(f"{program}|{name}".encode("utf-8")).hexdigest()[:12]
    return f"certificate-{digest}"


def import_certificates(zip_path: Path, pdf_path: Path, public_dir: Path, storage_file: Path) -> dict[str, int]:
    birthdates = read_birthdates(pdf_path)
    output_root = public_dir / "uploads" / "document" / "certificates"
    output_root.mkdir(parents=True, exist_ok=True)

    items = []
    extracted = 0
    matched = 0
    unmatched = 0
    programs: set[str] = set()

    with zipfile.ZipFile(zip_path) as archive:
        for entry in archive.infolist():
            if entry.is_dir() or not entry.filename.lower().endswith(".pdf"):
                continue
            parts = Path(entry.filename).parts
            if len(parts) < 3:
                continue
            program = parts[-2]
            filename = parts[-1]
            name = Path(filename).stem.strip()
            if not program or not name:
                continue

            destination = output_root / program / filename
            destination.parent.mkdir(parents=True, exist_ok=True)
            with archive.open(entry) as source, destination.open("wb") as target:
                shutil.copyfileobj(source, target)
            extracted += 1

            birthdate = birthdates.get(normalize_name(name), "")
            is_matched = birthdate != ""
            matched += 1 if is_matched else 0
            unmatched += 0 if is_matched else 1
            programs.add(program)

            items.append({
                "id": item_id(program, name),
                "collection": "certificates",
                "title_en": name,
                "title_ar": name,
                "body_en": "",
                "body_ar": "",
                "subtitle_en": "",
                "subtitle_ar": "",
                "image_path": "",
                "media_path": public_url(destination, public_dir),
                "external_url": "",
                "program": program,
                "certificate_code": "",
                "certificate_type": "",
                "first_name": "",
                "birthdate": birthdate,
                "published_at": datetime.utcnow().date().isoformat(),
                "published": is_matched,
                "featured": False,
                "sort_order": len(items),
                "filter_id": "",
                "shorts": [],
                "created_at": datetime.utcnow().isoformat() + "Z",
                "updated_at": datetime.utcnow().isoformat() + "Z",
            })

    storage_file.parent.mkdir(parents=True, exist_ok=True)
    storage_file.write_text(json.dumps(items, ensure_ascii=False, indent=2), encoding="utf-8")
    return {
        "birthdate_rows": len(birthdates),
        "certificates": len(items),
        "extracted": extracted,
        "matched_birthdates": matched,
        "unmatched_birthdates": unmatched,
        "programs": len(programs),
    }


def main() -> None:
    parser = argparse.ArgumentParser(description="Import certificate PDFs and CMS records.")
    parser.add_argument("--zip", required=True, type=Path)
    parser.add_argument("--sheet-pdf", required=True, type=Path)
    parser.add_argument("--public-dir", default=Path("public"), type=Path)
    parser.add_argument("--storage-file", default=Path("public/storage/certificates.json"), type=Path)
    args = parser.parse_args()

    summary = import_certificates(args.zip, args.sheet_pdf, args.public_dir, args.storage_file)
    print(json.dumps(summary, ensure_ascii=False, indent=2))


if __name__ == "__main__":
    main()
