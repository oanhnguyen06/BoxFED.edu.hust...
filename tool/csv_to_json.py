import csv
import json

INPUT_FILE = "data/lecturers.csv"
OUTPUT_FILE = "data/lecturers.json"

LIST_FIELDS = ["train", "work", "area", "teach"]

def parse_row(row):
    data = {}
    for key, value in row.items():
        if key in LIST_FIELDS and value:
            data[key] = [item.strip() for item in value.split("|")]
        else:
            data[key] = value.strip() if value else ""
    return data

def main():
    lecturers = []

    with open(INPUT_FILE, newline="", encoding="utf-8") as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            lecturers.append(parse_row(row))

    with open(OUTPUT_FILE, "w", encoding="utf-8") as jsonfile:
        json.dump(lecturers, jsonfile, ensure_ascii=False, indent=2)

    print("✅ Đã tạo lecturers.json thành công")

if __name__ == "__main__":
    main()
