from typing import Optional
from sqlalchemy import String, Integer, DateTime, Boolean, Enum, ForeignKey, BIGINT
from sqlalchemy.orm import Mapped, mapped_column, relationship
from sqlalchemy.dialects.postgresql import ARRAY

from .base import Base, TimestampMixin, TableNameMixin


class Todo(Base, TimestampMixin, TableNameMixin):
    """
    This class represents a Todo item in the application.

    Attributes:
        todo_id (Mapped[int]): The unique identifier of the todo.
        user_id (Mapped[int]): The foreign key referencing the User who owns the todo.
        title (Mapped[str]): The title of the todo.
        description (Mapped[Optional[str]]): The description of the todo.
        reminder (Mapped[Optional[DateTime]]): The reminder datetime.
        date (Mapped[DateTime]): The due date of the todo.
        time (Mapped[Optional[DateTime]]): The time the todo is due.
        reminder_time (Mapped[Optional[DateTime]]): The time the reminder is set for.
        status (Mapped[bool]): Whether the todo is completed or not.
        repeat (Mapped[Optional[str]]): Repeat frequency (e.g., "none", "daily").
        tags (Mapped[Optional[list]]): Tags associated with the todo (stored as a list).
    """

    todo_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey("users.user_id"), nullable=False)
    title: Mapped[str] = mapped_column(String(256), nullable=False)
    description: Mapped[Optional[str]] = mapped_column(String(512), nullable=True)
    reminder: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    date: Mapped[DateTime] = mapped_column(DateTime, nullable=False)
    time: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    reminder_time: Mapped[Optional[str]] = mapped_column(String, nullable=True)
    status: Mapped[bool] = mapped_column(Boolean, default=False)
    repeat: Mapped[Optional[str]] = mapped_column(Enum("None", "Daily", "Weekly", name="repeat_types"), nullable=True)
    tags: Mapped[Optional[list]] = mapped_column(ARRAY(BIGINT), nullable=True)
    done_time: Mapped[Optional[DateTime]] = mapped_column(DateTime, nullable=True, default=None)


    user: Mapped["User"] = relationship("User", back_populates="todos")

    def __repr__(self):
        return f"<Todo {self.todo_id} {self.title} {self.user_id} {self.status}>"
