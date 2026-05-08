import os
import json

# Pfad des Scripts
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Relativ dazu
json_folder = os.path.join(BASE_DIR, "..", "questions", "characters")

seen_names = set()
duplicates = []

for root, dirs, files in os.walk(json_folder):
    for file in files:
        if file.endswith(".json") and file != "index.json":

            path = os.path.join(root, file)

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
                                "file": os.path.relpath(path, json_folder),
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
        print(f"Name:  {dup['name']}")
        print("-" * 40)

    print(f"\nGefundene Duplikate: {len(duplicates)}")