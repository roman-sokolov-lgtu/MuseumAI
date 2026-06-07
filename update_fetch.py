import os

pages_dir = r"admin-panel\src\app\pages"
files = ["Exhibits.tsx", "Dashboard.tsx", "Analytics.tsx", "Dialogs.tsx", "Root.tsx"]

for f in files:
    path = os.path.join(pages_dir, f)
    if not os.path.exists(path):
        continue
    with open(path, "r", encoding="utf-8") as file:
        content = file.read()
    
    if "import { authFetch }" not in content:
        content = "import { authFetch } from \"../utils/api\";\n" + content
    
    content = content.replace("await fetch(", "await authFetch(")
    
    with open(path, "w", encoding="utf-8") as file:
        file.write(content)

print("Updated fetches!")
