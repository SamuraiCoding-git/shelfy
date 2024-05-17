from typing import Optional

from sqlalchemy import BIGINT
from sqlalchemy import String, Integer
from sqlalchemy.orm import Mapped, mapped_column

from .base import Base, TimestampMixin, TableNameMixin


class User(Base, TimestampMixin, TableNameMixin):
    __tablename__ = "users"
    id: Mapped[int] = mapped_column(BIGINT, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String)
    friends: Mapped[int] = mapped_column(Integer)
    invitation: Mapped[int] = mapped_column(Integer)
    achievements: Mapped[int] = mapped_column(Integer)
    currentLeague: Mapped[str] = mapped_column(String)
    taskCompleted: Mapped[int] = mapped_column(Integer)
    userImageProfile: Mapped[Optional[str]] = mapped_column(String)
    burningDays: Mapped[int] = mapped_column(Integer)
    tokenBalance: Mapped[int] = mapped_column(Integer)

    def __repr__(self):
        return f"<User {self.id} {self.name} {self.friends} {self.invitation} {self.achievements} {self.currentLeague} {self.taskCompleted} {self.userImageProfile} {self.burningDays} {self.tokenBalance}>"
