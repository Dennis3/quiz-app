import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

tf_folder = os.path.join(BASE_DIR, "..", "questions", "true-false")
index_path = os.path.join(tf_folder, "index.json")

with open(index_path, "r", encoding="utf-8") as f:
    index = json.load(f)

# Index kann eine flache Liste oder ein Dict mit Kategorien sein
if isinstance(index, dict):
    files = [f for files in index.values() for f in files]
else:
    files = index

total_true = 0
total_false = 0

print("Verhältnis Wahr / Falsch pro Datei:\n")

for relative_path in files:
    path = os.path.join(tf_folder, relative_path)

    with open(path, "r", encoding="utf-8") as f:
        try:
            data = json.load(f)
        except Exception as e:
            print(f"Fehler in {relative_path}: {e}")
            continue

    true_count = sum(1 for entry in data if entry.get("answer") is True)
    false_count = sum(1 for entry in data if entry.get("answer") is False)

    total_true += true_count
    total_false += false_count

    print(f"{relative_path}: {true_count} wahr, {false_count} falsch (gesamt {true_count + false_count})")

print("\n====================")
print(f"GESAMT: {total_true} wahr, {total_false} falsch")
print(f"Gesamtanzahl Fragen: {total_true + total_false}")