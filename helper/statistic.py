import os
import json

base_path = r"C:\Users\d.sauerwein\QuizApp\quiz-app"

json_folder = os.path.join(base_path, "questions", "characters")

# ----------------------------
# Helper: Normalisierung
# ----------------------------
def norm(value):
    return value.strip().lower()


# ----------------------------
# 1. Char Data from JSON
# ----------------------------
characters = set()

for file in os.listdir(json_folder):
    if file.endswith(".json") and not file.startswith("index"):
        path = os.path.join(json_folder, file)

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

            for entry in data:
                if isinstance(entry, dict):
                    img = entry.get("image")
                    name = entry.get("name")
                    difficulty = entry.get("difficulty")
                    if img and name and difficulty:
                        characters.add((norm(name), norm(img), difficulty))

# ----------------------------
# 2. How Many Characters per Difficulty?
# ----------------------------
difficulty_counts = {1: 0, 2: 0, 3: 0}
for _, _, difficulty in characters:
    if difficulty in difficulty_counts:
        difficulty_counts[difficulty] += 1

print("Character Counts by Difficulty:")
for diff, count in difficulty_counts.items():
    print(f"Difficulty {diff}: {count} characters")     