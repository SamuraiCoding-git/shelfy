import logging
import betterlogging as bl
from fastapi import FastAPI
from starlette.responses import JSONResponse

from infrastructure.database.models import User
from infrastructure.database.models.todos import ToDo
from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.setup import create_engine, create_session_pool
from tgbot.config import load_config

app = FastAPI()
config = load_config(".env")
engine = create_engine(config.db)
session_pool = create_session_pool(engine)
log_level = logging.INFO
bl.basic_colorized_config(level=log_level)
log = logging.getLogger(__name__)


@app.get("/api/getUser/{id}")
async def get_user(id: int):
  async with engine.begin() as conn:
    await conn.run_sync(User.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    user = await repo.users.select_user(id)
    content = {
      "id": user.id,
      "name": user.name,
      "friends": user.friends,
      "invitation": user.invitation,
      "achievements": user.achievements,
      "currentLeague": user.currentLeague,
      "taskCompleted": user.taskCompleted,
      "userImageProfile": user.userImageProfile,
      "burningDays": user.burningDays,
      "tokenBalance": user.tokenBalance
    }
    return JSONResponse(status_code=200, content=content)


@app.post("/api/add_user/{id}/{name}/{friends}/{invitation}/{achievements}/{currentLeague}/{taskCompleted}/{userImageProfile}/{burningDays}/{tokenBalance}")
async def add_user(id: int, name, friends, invitation, achievements, currentLeague, taskCompleted, userImageProfile, burningDays, tokenBalance):
  async with engine.begin() as conn:
    await conn.run_sync(User.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    await repo.users.get_or_create_user(id, name, friends, invitation, achievements, currentLeague, taskCompleted, userImageProfile, burningDays, tokenBalance)
    content = {
      "id": id,
      "name": name,
      "friends": friends,
      "invitation": invitation,
      "achievements": achievements,
      "currentLeague": currentLeague,
      "taskCompleted": taskCompleted,
      "userImageProfile": userImageProfile,
      "burningDays": burningDays,
      "tokenBalance": tokenBalance
    }
    return JSONResponse(status_code=200, content=content)


@app.get("/api/get_todos/{user_id}")
async def get_todos(user_id: int):
  async with engine.begin() as conn:
    await conn.run_sync(ToDo.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)
    finally:
      await session.close()
    content = []
    todos = await repo.todos.select_todos(user_id)
    for todo in todos:
      
    
@app.get("/api/get_todos_calendar/{time}")
async def get_todos_calendar(time: datetime.time):
  async with engine.begin() as conn:
    await conn.run_sync(ToDo.metadata.create_all, checkfirst=True)
  async with session_pool() as session:
    try:
      repo = RequestsRepo(session)

    finally:
      await session.close()
    todos = await repo.todos.select_todos_calendar(time)
    
