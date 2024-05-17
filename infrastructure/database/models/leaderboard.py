import datetime
from typing import Optional, List

from sqlalchemy import BIGINT, ForeignKey, Date, ARRAY, Boolean
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin


class Leaderboard(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "todos"
    id: Mapped[int] = mapped_column(Integer, ForeignKey("users.id"), primary_key=True, nullable=False)
    weekly: Mapped[int] = mapped_column(Integer)
    monthly: Mapped[int] = mapped_column(Integer)
    all_time: Mapped[int] = mapped_column(Integer)
