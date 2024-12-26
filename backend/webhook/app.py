# app.py

import logging
from contextlib import asynccontextmanager

from fastapi import FastAPI, APIRouter
from starlette.middleware.cors import CORSMiddleware

from infrastructure.database.models import Base
from infrastructure.database.setup import create_engine
from tgbot.config import load_config
from webhook import routers

@asynccontextmanager
async def lifespan(app: FastAPI):
    config = load_config(".env")
    engine = create_engine(config.db)
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)
    try:
        yield
    finally:
        logging.info("Shutting down the application...")

app = FastAPI(lifespan=lifespan)

# Configure CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Use "*" for all origins or specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

logging.getLogger(__name__).setLevel(logging.INFO)
logging.basicConfig(
    level=logging.INFO,
    format="%(filename)s:%(lineno)d #%(levelname)-8s [%(asctime)s] - %(name)s - %(message)s",
)

prefix_router = APIRouter(prefix="/api")

# Include routers
for router in [
    routers.users.users_router,
    routers.todos.todos_router,
    routers.tags.tags_router
]:
    prefix_router.include_router(router)

app.include_router(prefix_router)

