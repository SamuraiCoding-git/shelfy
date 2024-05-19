import os

from aiogram import Router, Bot
from aiogram.filters import CommandStart
from aiogram.types import Message

from infrastructure.database.repo.requests import RequestsRepo

user_router = Router()


@user_router.message(CommandStart())
async def user_start(message: Message, bot: Bot, repo: RequestsRepo):
    try:
        os.remove(f"photos/profile_photo_{message.from_user.id}.png")
    except FileNotFoundError:
        pass
    a = await bot.get_user_profile_photos(message.from_user.id)
    try:
        file = await bot.get_file(a.photos[0][0].file_id)
        file_path = file.file_path
        await bot.download_file(file_path,
                            f"photos/profile_photo_{message.from_user.id}.png")
        photo = f"photos/profile_photo_{message.from_user.id}.png"
    except IndexError:
        photo = f"photos/profile_photo_blank.png"
    await repo.users.get_or_create_user(message.from_user.id,
                                        message.from_user.full_name,
                                        userImageProfile=photo)
    await message.reply("Осс, товарищи самураи!")
