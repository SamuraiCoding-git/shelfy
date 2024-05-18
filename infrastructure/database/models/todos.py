from typing import List

from sqlalchemy import BIGINT, ForeignKey, ARRAY, Boolean
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin


class ToDo(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "todos"
    user_id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"))
    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    time: Mapped[str] = mapped_column(String, nullable=True)
    duration: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=True)
    status: Mapped[bool] = mapped_column(Boolean)
    title: Mapped[str] = mapped_column(String)
    description: Mapped[str] = mapped_column(String, nullable=True)
    badges: Mapped[List[str]] = mapped_column(ARRAY(String), nullable=True)

    def __repr__(self):
        return f"<User {self.id} {self.time} {self.duration} {self.status} {self.title} {self.description} {self.badges}>"
