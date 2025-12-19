import csv
import json
from pathlib import Path

# ===== PATH =====
INPUT_FILE = Path("data/lecturers.csv")
OUTPUT_FILE = Path("data/lecturers.json")

# Các cột dạng danh sách, phân tách bằng |
LIST_FIELDS = ["train", "work", "area", "teach"]

def parse_row(row: dict) -> dict:
    data = {}

    for key, value in row.items():
        if not value:
            data[key] = ""
            continue

        value = value.strip()

        if key in LIST_FIELDS:
            data[key] = [item.strip() for item in value.split("|") if item.strip()]
        else:
            data[key] = value

    return data

def main():
    if not INPUT_FILE.exists():
        raise FileNotFoundError(f" Không tìm thấy file: {INPUT_FILE}")

    lecturers = []

    with INPUT_FILE.open(encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            lecturers.append(parse_row(row))

    OUTPUT_FILE.parent.mkdir(parents=True, exist_ok=True)

    with OUTPUT_FILE.open("w", encoding="utf-8") as jsonfile:
        json.dump(lecturers, jsonfile, ensure_ascii=False, indent=2)

    print(f" Auto-generate thành công: {OUTPUT_FILE}")

if __name__ == "__main__":
    main()
