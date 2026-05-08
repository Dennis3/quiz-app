import os
import json

# Ordner mit den JSON-Dateien
json_folder = r"C:\Users\d.sauerwein\QuizApp\quiz-app\questions\characters"

seen_names = set()
duplicates = []

for file in os.listdir(json_folder):
    if file.endswith(".json") and file != "index.json":

        path = os.path.join(json_folder, file)

        with open(path, "r", encoding="utf-8") as f:
            try:
                data = json.load(f)
            except Exception as e:
                print(f"Fehler in {file}: {e}")
                continue

            for i, entry in enumerate(data):

                if not isinstance(entry, dict):
                    continue

                name = entry.get("name")

                if name:
                    normalized_name = str(name).strip().lower()

                    if normalized_name in seen_names:
                        duplicates.append({
                            "file": file,
                            "index": i,
                            "name": name
                        })
                    else:
                        seen_names.add(normalized_name)

# Ausgabe
print("\n====================")
print("DOPPELTE NAMEN")
print("====================\n")

if not duplicates:
    print("Keine Duplikate gefunden.")
else:
    for dup in duplicates:
        print(f"Datei: {dup['file']}")
        print(f"Index: {dup['index']}")
        print(f"Name: {dup['name']}")
        print("-" * 40)

    print(f"\nGefundene Duplikate: {len(duplicates)}")