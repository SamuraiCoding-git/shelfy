from sqlalchemy import String, Integer, ForeignKey
from sqlalchemy.dialects.mysql import BIGINT
from sqlalchemy.orm import Mapped, relationship, mapped_column
from .base import Base, TimestampMixin, TableNameMixin

class Tag(Base, TimestampMixin, TableNameMixin):
    """
    This class represents a Tag entity in the application.

    Attributes:
        tag_id (Mapped[int]): The unique identifier of the tag.
        name (Mapped[str]): The name of the tag.
        checked (Mapped[bool]): A flag indicating whether the tag is selected.
        user_id (Mapped[int]): Foreign key to the associated user.
        color (Mapped[str]): The hexadecimal color code associated with the tag.

    Methods:
        __repr__(): Returns a string representation of the Tag object.

    Inherited Attributes:
        Inherits from Base, TimestampMixin, and TableNameMixin classes, which provide additional attributes and functionality.

    Inherited Methods:
        Inherits methods from Base, TimestampMixin, and TableNameMixin classes, which provide additional functionality.
    """

    tag_id: Mapped[int] = mapped_column(Integer, primary_key=True, autoincrement=True)
    name: Mapped[str] = mapped_column(String(128), unique=True)
    color: Mapped[str] = mapped_column(String(7), nullable=True)

    user_id: Mapped[int] = mapped_column(BIGINT, ForeignKey('users.user_id'), nullable=False)
    user: Mapped["User"] = relationship("User", back_populates="tags")

    def __repr__(self):
        return f"<Tag {self.tag_id} {self.name} {self.color}>"
