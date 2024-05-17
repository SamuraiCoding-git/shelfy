from sqlalchemy import select
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import User
from infrastructure.database.repo.base import BaseRepo


class UserRepo(BaseRepo):
    async def get_or_create_user(
        self,
        id: int,
        name: str,
        friends: int,
        invitation: int,
        achievements: int,
        currentLeague: str,
        taskCompleted: int,
        userImageProfile: str,
        burningDays: int,
        tokenBalance: int,
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
        return result.scalar_one()

    async def select_user(self, id):
        query = select(User).where(User.id == id)
        return await self.session.scalar(query)
