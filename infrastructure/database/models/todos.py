import datetime
from typing import Optional, List

from sqlalchemy import BIGINT, ForeignKey, Date, ARRAY, Boolean
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin


class ToDo(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "todos"
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    id: Mapped[int] = mapped_column(BIGINT, autoincrement=True)
    time: Mapped[datetime.time] = mapped_column(Date, nullable=True)
    duration: Mapped[List[datetime.time, datetime.time]] = mapped_column(ARRAY(Date), nullable=True)
    status: Mapped[bool] = mapped_column(Boolean)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String, nullable=True)
    badges: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=True)

    def __repr__(self):
        return f"<User {self.id} {self.time} {self.duration} {self.status} {self.title} {self.description} {self.badges}>"
