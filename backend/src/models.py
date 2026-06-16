from sqlalchemy import Column, Integer, String, Text, DateTime, ForeignKey, Time
from sqlalchemy.orm import relationship
from .database import Base
import datetime

class Admin(Base):
    __tablename__ = "admin"
    admin_id = Column(Integer, primary_key=True, index=True)
    admin_login = Column(String(50), nullable=False)
    admin_password = Column(String(100), nullable=False)
    admin_email = Column(String(100), nullable=False)

class Exhibit(Base):
    __tablename__ = "exhibit"
    exhibit_id = Column(Integer, primary_key=True, index=True)
    exhibit_name = Column(String(255), nullable=False)
    exhibit_description = Column(Text, nullable=False)
    exhibit_qr = Column(String(255), nullable=False)
    exhibit_period = Column(String(100), nullable=False)
    exhibit_category = Column(String(100), nullable=False)
    exhibit_material = Column(String(255), nullable=False)
    exhibit_author = Column(String(255), nullable=False)
    admin_id = Column(Integer, ForeignKey("admin.admin_id"), nullable=False)
    
    admin = relationship("Admin", backref="exhibits")
    sessions = relationship("Session", back_populates="exhibit", cascade="all, delete-orphan")

    @property
    def admin_login(self):
        return self.admin.admin_login if self.admin else None

class Session(Base):
    __tablename__ = "session"
    session_id = Column(Integer, primary_key=True, index=True)
    session_total_questions = Column(Integer, default=0, nullable=False)
    session_start = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    session_over = Column(DateTime, nullable=True)
    exhibit_id = Column(Integer, ForeignKey("exhibit.exhibit_id"), nullable=False)
    
    exhibit = relationship("Exhibit", back_populates="sessions")
    queries = relationship("Query", back_populates="session", cascade="all, delete-orphan")

class Query(Base):
    __tablename__ = "query"
    query_id = Column(Integer, primary_key=True, index=True)
    query_text = Column(Text, nullable=False)
    query_created = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    session_id = Column(Integer, ForeignKey("session.session_id"), nullable=False)
    
    session = relationship("Session", back_populates="queries")
    answers = relationship("Answer", back_populates="query", cascade="all, delete-orphan")

class Answer(Base):
    __tablename__ = "answer"
    answer_id = Column(Integer, primary_key=True, index=True)
    answer_text = Column(Text, nullable=False)
    answer_date = Column(DateTime, default=datetime.datetime.utcnow, nullable=False)
    answer_response_time = Column(Integer, nullable=False)
    answer_feedback = Column(String(10), nullable=True)
    query_id = Column(Integer, ForeignKey("query.query_id"), nullable=False)
    
    query = relationship("Query", back_populates="answers")

