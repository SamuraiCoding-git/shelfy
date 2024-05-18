from typing import List

from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models.todos import ToDo
from infrastructure.database.repo.base import BaseRepo


class TodoRepo(BaseRepo):
  async def get_or_create_todo(
    self,
    user_id: int,
    time: str,
    duration: List[str],
    status: bool,
    title: str,
    description: str,
    badges: List[str]
  ):
    insert_stmt = (
      insert(ToDo)
      .values(
        user_id=user_id,
        time=time,
        duration=duration,
        status=status,
        title=title,
        description=description,
        badges=badges
      )
      .returning(ToDo)
    )
    result = await self.session.execute(insert_stmt)

    await self.session.commit()
    await self.session.close()
    return result.scalar_one()

  async def select_todos(self, user_id):
    query = select(ToDo).where(ToDo.user_id == user_id)
    return await self.session.scalars(query)

  async def select_todos_calendar(self, time):
    query = select(ToDo).where(ToDo.time == time)
    return await self.session.scalars(query)
