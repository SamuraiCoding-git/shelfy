from datetime import datetime, timedelta
from typing import Optional

from sqlalchemy import select, func
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import User, Todo
from infrastructure.database.repo.base import BaseRepo


class UserRepo(BaseRepo):
    async def get_or_create_user(
            self,
            user_id: int,
            full_name: str,
            photo_url: str,
            points: Optional[int] = None,
            referrer: Optional[int] = None
    ):
        # Step 1: Prepare the values for the insert statement
        values = {
            'user_id': user_id,
            'full_name': full_name,
            'referrer': referrer,
            'photo_url': photo_url
        }

        # If points is provided, set it; otherwise, set points to 0 for a new user
        if points is not None:
            values['points'] = points
        else:
            # Ensure points is set to 0 only if creating a new user
            values['points'] = 0

        # Step 2: Insert or update the user record
        insert_stmt = (
            insert(User)
            .values(values)
            .on_conflict_do_update(
                index_elements=[User.user_id],
                set_={
                    'full_name': full_name,
                    'photo_url': photo_url,
                    # Only update points if it was provided or user doesn't exist
                    'points': values['points'] if points is not None else User.points,
                },
            )
            .returning(User)
        )
        result = await self.session.execute(insert_stmt)

        # Commit the transaction
        await self.session.commit()

        # Step 3: Fetch the created or updated user (from the result of the insert statement)
        user = result.scalar_one()

        count_query = select(func.count()).select_from(User).where(User.referrer == user_id)
        count_result = await self.session.execute(count_query)
        referral_count_result = count_result.scalar_one()

        # Step 5: Return the user and the referral count
        return user, referral_count_result if referral_count_result else 0

    async def select_user(self, user_id: int) -> Optional[User]:
        # Define the select query
        stmt = (select(User).where(User.user_id == user_id))

        # Execute the query and fetch the result
        result = await self.session.execute(stmt)

        # Return the first user (or None if no user was found)
        return result.scalars().first()

    async def get_top_users_by_earnings(self, period: str):
        # Assuming earnings is based on the completed tasks
        stmt = (
            select(
                User.user_id,
                User.full_name,
                User.photo_url,
                func.count(Todo.todo_id).label('completed_tasks'),  # Count completed tasks
                (func.count(Todo.todo_id) * 50).label('earnings')  # Calculate earnings
            )
            .join(Todo, Todo.user_id == User.user_id)
            .filter(Todo.status == True)  # Completed tasks
        )

        if period == 'weekly':
            # Add additional filtering based on period (e.g., filter by date range for weekly)
            pass

        stmt = stmt.group_by(User.user_id).order_by(func.count(Todo.todo_id).desc())  # Order by completed tasks

        result = await self.session.execute(stmt)
        users = result.all()

        return [
            {"user_id": user.user_id, "full_name": user.full_name, "photo_url": user.photo_url, "earnings": user.earnings}
            for user in users
        ]
