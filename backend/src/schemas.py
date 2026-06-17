from pydantic import BaseModel, validator
from typing import Optional, List
import datetime


def _normalize_text(value: str) -> str:
    if isinstance(value, str):
        return " ".join(value.split())
    return value


class ExhibitBase(BaseModel):
    exhibit_name: str
    exhibit_description: str
    exhibit_qr: str
    exhibit_period: str
    exhibit_category: str
    exhibit_material: str
    exhibit_author: str

    @validator(
        "exhibit_name",
        "exhibit_description",
        "exhibit_period",
        "exhibit_category",
        "exhibit_material",
        "exhibit_author",
        pre=True,
    )
    def strip_and_collapse_spaces(cls, v):
        return _normalize_text(v)

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
