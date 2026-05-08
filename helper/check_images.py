import os
import json
import shutil

base_path = r"C:\Users\d.sauerwein\QuizApp\quiz-app"

json_folder = os.path.join(base_path, "questions", "characters")
image_folder = os.path.join(base_path, "images", "characters")
unused_folder = os.path.join(image_folder, "_unused")

os.makedirs(unused_folder, exist_ok=True)


# ----------------------------
# Helper: Normalisierung
# ----------------------------
def norm(value):
    return value.strip().lower()


# ----------------------------
# 1. Soll-Zustand aus JSON
# ----------------------------
required_images = set()

for file in os.listdir(json_folder):
    if file.endswith(".json") and not file.startswith("index"):
        path = os.path.join(json_folder, file)

        with open(path, "r", encoding="utf-8") as f:
            data = json.load(f)

            for entry in data:
                if isinstance(entry, dict):
                    img = entry.get("image")
                    if img:
                        required_images.add(norm(img))


# ----------------------------
# 2. Ist-Zustand aus Dateien
# ----------------------------
existing_files = {}

for file in os.listdir(image_folder):
    full_path = os.path.join(image_folder, file)

    if os.path.isfile(full_path) and file.lower().endswith(".jpg"):
        existing_files[norm(file)] = file  # original behalten


existing_images = set(existing_files.keys())


# ----------------------------
# 3. Vergleich
# ----------------------------
missing = required_images - existing_images
extra = existing_images - required_images


# ----------------------------
# 4. Output
# ----------------------------
print("\nFEHLENDE BILDER:")
for img in sorted(missing):
    print(img)

print("\nÜBERFLÜSSIGE BILDER:")
for img in sorted(extra):
    print(existing_files[img])


# ----------------------------
# 5. Verschieben (nur echte Extras)
# ----------------------------
for img in extra:
    original_name = existing_files[img]

    src = os.path.join(image_folder, original_name)
    dst = os.path.join(unused_folder, original_name)

    shutil.move(src, dst)


print("\nFertig.")
print(f"Missing: {len(missing)}")
print(f"Moved to _unused: {len(extra)}")