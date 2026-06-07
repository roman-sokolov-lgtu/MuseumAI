from pydantic import BaseModel
from typing import Optional, List
import datetime

class ExhibitBase(BaseModel):
    exhibit_name: str
    exhibit_description: str
    exhibit_qr: str
    exhibit_period: str
    exhibit_category: str
    exhibit_material: str
    exhibit_author: str

class ExhibitCreate(ExhibitBase):
    admin_id: int = 1

class ExhibitResponse(ExhibitBase):
    exhibit_id: int
    admin_id: Optional[int] = None
    admin_login: Optional[str] = None
    
    class Config:
        orm_mode = True



class MessageSchema(BaseModel):
    role: str
    content: str
    timestamp: datetime.datetime
    feedback: Optional[str] = None

class FeedbackRequest(BaseModel):
    feedback: str

class DialogResponse(BaseModel):
    id: str
    sessionId: str
    exhibitName: str
    date: str
    duration: str
    messagesCount: int
    messages: List[MessageSchema]



class DashboardStats(BaseModel):
    totalSessions: int
    totalQuestions: int
    activeSessions: int
    totalExhibits: int

class PopularExhibit(BaseModel):
    name: str
    questions: int

class SessionDataPoint(BaseModel):
    date: str
    sessions: int
    questions: int

class SessionDurationPoint(BaseModel):
    range: str
    count: int
    color: str

class DashboardResponse(BaseModel):
    stats: DashboardStats
    sessionData: List[SessionDataPoint]
    popularExhibits: List[PopularExhibit]
    sessionDuration: List[SessionDurationPoint]
