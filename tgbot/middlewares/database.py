from typing import Callable, Dict, Any, Awaitable

from aiogram import BaseMiddleware
from aiogram.types import Message

from infrastructure.database.repo.requests import RequestsRepo


class DatabaseMiddleware(BaseMiddleware):
  def __init__(self, session_pool) -> None:
    self.session_pool = session_pool

  async def __call__(
    self,
    handler: Callable[[Message, Dict[str, Any]], Awaitable[Any]],
    event: Message,
    data: Dict[str, Any],
  ) -> Any:
    async with self.session_pool() as session:
      try:
        repo = RequestsRepo(session)
        user = await repo.users.get_or_create_user(event.from_user.id,
                                                   event.from_user.full_name)
        await repo.leaderboard.get_or_create_leaderboard(event.from_user.id)
        data["session"] = session
        data["repo"] = repo
        data["user"] = user
        return await handler(event, data)
      finally:
        await session.close()
