from sqlalchemy import select, update
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models.leaderboard import Leaderboard
from infrastructure.database.repo.base import BaseRepo


class LeaderboardRepo(BaseRepo):
  async def get_or_create_leaderboard(
    self,
    id: int,
    weekly: int = 0,
    monthly: int = 0,
    all_time: int = 0
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
        'weekly': weekly,
        'monthly': monthly,
        'all_time': all_time
      }.items() if value is not None
    }
    insert_stmt = (
      insert(Leaderboard)
      .values(
        id=id,
        weekly=weekly,
        monthly=monthly,
        all_time=all_time
      )
      .on_conflict_do_update(
        index_elements=[Leaderboard.id],
        set_=update_values,
      )
      .returning(Leaderboard)
    )
    result = await self.session.execute(insert_stmt)

    await self.session.commit()
    await self.session.close()
    return result.scalar_one()

  async def select_user(self, id):
    query = select(Leaderboard).where(Leaderboard.id == id)
    return await self.session.scalar(query)

  async def select_users(self, period, number_of_users):
      if period == 'weekly':
          query = select(Leaderboard.id, Leaderboard.weekly).where(Leaderboard.weekly.isnot(None)).order_by(Leaderboard.weekly.desc()).limit(number_of_users)
      elif period == 'monthly':
          query = select(Leaderboard.id, Leaderboard.monthly).where(Leaderboard.weekly.isnot(None)).order_by(Leaderboard.monthly.desc()).limit(number_of_users)
      elif period == 'all_time':
          query = select(Leaderboard.id, Leaderboard.all_time).where(Leaderboard.weekly.isnot(None)).order_by(Leaderboard.all_time.desc()).limit(number_of_users)
      result = await self.session.execute(query)
      return result.mappings().all()

  async def update_balance(self, user_id: int, newTokenBalance: int):
    user = await self.select_user(user_id)
    new_balance_weekly = user.weekly + newTokenBalance
    new_balance_monthly = user.monthly + newTokenBalance
    new_balance_alltime = user.all_time + newTokenBalance
    update_stmt = (update(Leaderboard).where(Leaderboard.id == user_id).values(weekly=new_balance_weekly,
                                                                                           monthly=new_balance_monthly,
                                                                                           all_time=new_balance_alltime))
    await self.session.execute(update_stmt)
    await self.session.commit()
    await self.session.close()
    return new_balance_weekly, new_balance_monthly, new_balance_alltime

