import os
import json
import shutil

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

json_folder = os.path.join(BASE_DIR, "..", "questions", "characters")
image_folder = os.path.join(BASE_DIR, "..", "images", "characters")
unused_folder = os.path.join(image_folder, "_unused")

os.makedirs(unused_folder, exist_ok=True)

def norm(value):
    return value.strip().lower()

# 1. Soll-Zustand aus JSON (rekursiv)
required_images = set()

for root, dirs, files in os.walk(json_folder):
    for file in files:
        if file.endswith(".json") and not file.startswith("index"):
            path = os.path.join(root, file)
            with open(path, "r", encoding="utf-8") as f:
                data = json.load(f)
                for entry in data:
                    if isinstance(entry, dict):
                        img = entry.get("image")
                        if img:
                            required_images.add(norm(img))

# 2. Ist-Zustand aus Dateien (rekursiv, ohne _unused)
existing_files = {}

for root, dirs, files in os.walk(image_folder):
    dirs[:] = [d for d in dirs if d != "_unused"]  # _unused überspringen
    for file in files:
        if file.lower().endswith(".jpg"):
            existing_files[norm(file)] = os.path.join(root, file)

existing_images = set(existing_files.keys())

# 3. Vergleich
missing = required_images - existing_images
extra = existing_images - required_images

# 4. Output
print("\nFEHLENDE BILDER:")
for img in sorted(missing):
    print(img)

print("\nÜBERFLÜSSIGE BILDER:")
for img in sorted(extra):
    print(os.path.relpath(existing_files[img], image_folder))

# 5. Verschieben
for img in extra:
    full_path = existing_files[img]
    dst = os.path.join(unused_folder, os.path.basename(full_path))
    shutil.move(full_path, dst)

print("\nFertig.")
print(f"Missing:          {len(missing)}")
print(f"Moved to _unused: {len(extra)}")