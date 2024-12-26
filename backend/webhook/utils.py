import hashlib
import hmac
from urllib.parse import unquote, parse_qsl
from fastapi import HTTPException, Request

from aiogram import Bot
from starlette.status import HTTP_400_BAD_REQUEST

from infrastructure.database.repo.requests import RequestsRepo
from infrastructure.database.setup import create_session_pool, create_engine
from tgbot.config import load_config, Config

config: Config = load_config()
engine = create_engine(config.db)
session_pool = create_session_pool(engine)
bot = Bot(config.tg_bot.token)


async def get_repo():
    async with session_pool() as session:
        yield RequestsRepo(session)


def parse_init_data(init_data: str = None) -> dict:
    if not init_data:
        return {}

    parsed_data = dict(parse_qsl(init_data))
    return parsed_data


def validate_telegram_data(init_data: str) -> bool:
    parsed_data = parse_init_data(init_data)

    received_hash = parsed_data.pop("hash")
    # Constructing the data-check-string
    fields = sorted(
        [(key, unquote(value)) for key, value in parsed_data.items() if key != "hash"]
    )
    # Constructing the data-check-string using the sorted order
    data_check_string = "\n".join(f"{k}={v}" for k, v in fields)

    # Computing the secret key
    secret_key = hmac.new(
        b"WebAppData", config.tg_bot.token.encode(), hashlib.sha256
    ).digest()

    # Comparing received hash with computed hash
    computed_hash = hmac.new(
        secret_key, data_check_string.encode(), hashlib.sha256
    ).hexdigest()

    if computed_hash != received_hash:
        return False


    return True

async def validate_init_data(request: Request):
    if request.method in ["POST", "PUT", "DELETE", "PATCH"]:
        data = await request.json()
        init_data = data.get("userInitData")

        if init_data and not validate_telegram_data(init_data):
            raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Invalid initData")

        parsed_data = parse_init_data(init_data)
        # Return parsed data if needed for further logic (e.g., user info)
        return parsed_data
    return None