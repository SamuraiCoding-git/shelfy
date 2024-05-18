from sqlalchemy import ForeignKey
from sqlalchemy import Integer, BIGINT
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin


class Leaderboard(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "leaderboard"
    id: Mapped[int] = mapped_column(BIGINT, ForeignKey("users.id"), primary_key=True, nullable=False)
    weekly: Mapped[int] = mapped_column(Integer)
    monthly: Mapped[int] = mapped_column(Integer)
    all_time: Mapped[int] = mapped_column(Integer)
