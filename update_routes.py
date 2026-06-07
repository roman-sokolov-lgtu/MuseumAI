import re

with open('backend/src/main.py', 'r', encoding='utf-8') as f:
    code = f.read()

# Replace get_exhibits
code = code.replace('def get_exhibits(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db)):', 'def get_exhibits(skip: int = 0, limit: int = 100, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace get_exhibit
code = code.replace('def get_exhibit(exhibit_id: int, db: Session = Depends(database.get_db)):', 'def get_exhibit(exhibit_id: int, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace create_exhibit
code = code.replace('def create_exhibit(exhibit: schemas.ExhibitCreate, db: Session = Depends(database.get_db)):', 'def create_exhibit(exhibit: schemas.ExhibitCreate, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace update_exhibit
code = code.replace('def update_exhibit(exhibit_id: int, exhibit: schemas.ExhibitCreate, db: Session = Depends(database.get_db)):', 'def update_exhibit(exhibit_id: int, exhibit: schemas.ExhibitCreate, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace delete_exhibit
code = code.replace('def delete_exhibit(exhibit_id: int, db: Session = Depends(database.get_db)):', 'def delete_exhibit(exhibit_id: int, db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace get_dialogs
code = code.replace('def get_dialogs(db: Session = Depends(database.get_db)):', 'def get_dialogs(db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace get_dashboard_stats or get_dashboard_analytics
code = code.replace('def get_dashboard_analytics(db: Session = Depends(database.get_db)):', 'def get_dashboard_analytics(db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Replace get_detailed_analytics
code = code.replace('def get_detailed_analytics(db: Session = Depends(database.get_db)):', 'def get_detailed_analytics(db: Session = Depends(database.get_db), current_admin: models.Admin = Depends(get_current_admin)):')

# Fix create_exhibit admin assignment
code = re.sub(
    r'if not exhibit_data\.get\(\"admin_id\"\):\n\s+admin = db\.query\(models\.Admin\)\.first\(\)\n\s+exhibit_data\[\"admin_id\"\] = admin\.admin_id if admin else None',
    'exhibit_data[\"admin_id\"] = current_admin.admin_id',
    code
)

with open('backend/src/main.py', 'w', encoding='utf-8') as f:
    f.write(code)
print('Done!')
