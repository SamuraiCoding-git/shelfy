from datetime import datetime
from select import select
from typing import List

from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import User
from infrastructure.database.models.todos import ToDo
from infrastructure.database.repo.base import BaseRepo


class TodoRepo(BaseRepo):
  async def get_or_create_todo(
    self,
    user_id: int,
    id: int,
    time: datetime.time,
    duration: List[datetime.time],
    status: bool,
    title: str,
    description: str,
    badges: List[str],
  ):
    update_values = {
      key: value for key, value in {
        "time": time,
        "duration": duration,
        "status": status,
        "title": title,
        "description": description,
        "badges": badges
      }.items() if value is not None
    }
    insert_stmt = (
      insert(User)
      .values(
        user_id=user_id,
        id=id,
        time=time,
        duration=duration,
        status=status,
        title=title,
        description=description,
        badges=badges
      )
      .on_conflict_do_update(
        index_elements=[ToDo.user_id, ToDo.id],
        set_=update_values,
      )
      .returning(User)
    )
    result = await self.session.execute(insert_stmt)

    await self.session.commit()
    return result.scalar_one()

  async def select_todos(self, user_id):
    query = select([ToDO.id, ToDo.time, ToDo.duration, ToDo.status, ToDo.title, ToDo.description, ToDo.badges]).where(ToDo.user_id == user_id)
    return await self.session.scalars(query)

  async def select_todos_calendar(self, time):
    query = select([ToDO.id, ToDo.time, ToDo.duration, ToDo.status, ToDo.title, ToDo.description, ToDo.badges]).where(ToDo.time == time)
    return await self.session.scalars(query)
