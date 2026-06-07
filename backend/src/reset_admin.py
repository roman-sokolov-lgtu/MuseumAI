import os
from sqlalchemy import create_engine, text
from sqlalchemy.orm import sessionmaker
import bcrypt

DATABASE_URL = os.getenv("DATABASE_URL", "postgresql://user:secure_museum_password_2026@db/museum")

engine = create_engine(DATABASE_URL)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)

def reset_password():
    db = SessionLocal()
    try:
        # Generate hash for 'admin'
        hashed = bcrypt.hashpw(b'admin', bcrypt.gensalt()).decode()
        
        # Update database safely
        db.execute(text("UPDATE admin SET admin_password = :pwd WHERE admin_login = 'admin'"), {"pwd": hashed})
        db.commit()
        print("Пароль успешно сброшен на 'admin'!")
    except Exception as e:
        print(f"Ошибка: {e}")
        db.rollback()
    finally:
        db.close()

if __name__ == "__main__":
    reset_password()
