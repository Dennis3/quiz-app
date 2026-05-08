import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

json_folder = os.path.join(BASE_DIR, "..", "questions", "characters")

def norm(value):
    return value.strip().lower()

# 1. Char Data from JSON (rekursiv)
characters = set()

for root, dirs, files in os.walk(json_folder):
    for file in files:
        if file.endswith(".json") and not file.startswith("index"):
            path = os.path.join(root, file)

            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)

                for entry in data:
                    if isinstance(entry, dict):
                        img = entry.get("image")
                        name = entry.get("name")
                        difficulty = entry.get("difficulty")
                        if img and name and difficulty:
                            characters.add((norm(name), norm(img), difficulty))

# 2. How Many Characters per Difficulty?
difficulty_counts = {1: 0, 2: 0, 3: 0}
for _, _, difficulty in characters:
    if difficulty in difficulty_counts:
        difficulty_counts[difficulty] += 1

print("Character Counts by Difficulty:")
for diff, count in difficulty_counts.items():
    print(f"  Difficulty {diff}: {count} characters")
print(f"  Total:        {len(characters)} characters")