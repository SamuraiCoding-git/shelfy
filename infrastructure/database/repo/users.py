from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import User
from infrastructure.database.repo.base import BaseRepo


class UserRepo(BaseRepo):
    async def get_or_create_user(
        self,
        id: int,
        name: str,
        friends: int = 0,
        invitation: int = 0,
        achievements: int = 0,
        currentLeague: str = "First",
        taskCompleted: int = 0,
        userImageProfile: str = None,
        burningDays: int = 0,
        tokenBalance: int = 0,
    ):
        """
        Creates or updates a new user in the database and returns the user object.
        :param user_id: The user's ID.
        :param full_name: The user's full name.
        :param language: The user's language.
        :param username: The user's username. It's an optional parameter.
        :return: User object, None if there was an error while making a transaction.
        """
        update_values = {
          key: value for key, value in {
            'name': name,
            'friends': friends,
            'invitation': invitation,
            'achievements': achievements,
            'currentLeague': currentLeague,
            'taskCompleted': taskCompleted,
            'userImageProfile': userImageProfile,
            'burningDays': burningDays,
            'tokenBalance': tokenBalance,
          }.items() if value is not None
        }
        insert_stmt = (
            insert(User)
            .values(
                id=id,
                name=name,
                friends=friends,
                invitation=invitation,
                achievements=achievements,
                currentLeague=currentLeague,
                taskCompleted=taskCompleted,
                userImageProfile=userImageProfile,
                burningDays=burningDays,
                tokenBalance=tokenBalance,
            )
            .on_conflict_do_update(
                index_elements=[User.id],
                set_=update_values,
            )
            .returning(User)
        )
        result = await self.session.execute(insert_stmt)

        await self.session.commit()
        await self.session.close()
        return result.scalar_one()

    async def select_user(self, id):
        query = select(User).where(User.id == id)
        return await self.session.scalar(query)

    async def update_balance(self, user_id: int, newTokenBalance: int):
        user = await self.select_user(user_id)
        balance = user.tokenBalance
        new_balance = balance + newTokenBalance
        update_stmt = (update(User).where(User.id == user_id).values(newTokenBalance=new_balance))
        await self.session.execute(update_stmt)
        await self.session.commit()
        await self.session.close()
        return new_balance
