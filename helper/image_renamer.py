import os
import json

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

json_folder = os.path.join(BASE_DIR, "..", "questions", "characters")

picture_folder = os.path.join(BASE_DIR, "character_images")

# ----------------------------
# Helper: Normalisierung
# ----------------------------
def norm(value):
    return value.strip().lower()


# ----------------------------
# 1. Char Data from JSON
# ----------------------------
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
                        if img and name:
                            characters.add((norm(img), norm(name)))


for pic in os.listdir(picture_folder):
    if pic.lower().endswith(".webp"):
        pic_path = os.path.join(picture_folder, pic)
        name_part = os.path.splitext(pic)[0]  # ohne Endung
        name_part = name_part.replace("_", " ")  # Unterstrich durch Leerzeichen ersetzen

        # Suche nach passendem Charakter
        match = None
        for img, name in characters:
            if norm(name) in norm(name_part):
                match = img
                break

        if match:
            new_name = f"{match}"
            new_path = os.path.join(picture_folder, new_name)
            os.rename(pic_path, new_path)
            print(f"Renamed '{pic}' to '{new_name}'")
        else:
            print(f"No match found for '{pic}'")