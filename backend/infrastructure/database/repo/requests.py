from dataclasses import dataclass

from sqlalchemy.ext.asyncio import AsyncSession

from infrastructure.database.repo.tags import TagRepo
from infrastructure.database.repo.todos import TodoRepo
from infrastructure.database.repo.users import UserRepo


@dataclass
class RequestsRepo:
    """
    Repository for handling database operations. This class holds all the repositories for the database models.

    You can add more repositories as properties to this class, so they will be easily accessible.
    """

    session: AsyncSession

    @property
    def users(self) -> UserRepo:
        return UserRepo(self.session)

    @property
    def todos(self) -> TodoRepo:
        return TodoRepo(self.session)

    @property
    def tags(self) -> TagRepo:
        return TagRepo(self.session)
