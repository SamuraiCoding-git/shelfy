from datetime import datetime
from typing import Optional, List

from sqlalchemy import select, update, delete
from sqlalchemy.dialects.postgresql import insert

from infrastructure.database.models import Todo, Tag, User
from infrastructure.database.repo.base import BaseRepo


class TodoRepo(BaseRepo):
    async def get_or_create_todo(
        self,
        user_id: int,
        title: str,
        date: datetime,  # Non-default parameter before default parameters
        description: Optional[str] = None,
        reminder: Optional[str] = None,
        time: Optional[str] = None,
        reminder_time: Optional[datetime] = None,
        status: bool = False,
        repeat: Optional[str] = None,
        tags: Optional[List[str]] = None
    ) -> Todo:
        """
        Insert a new todo if it does not exist or update an existing todo.
        """
        insert_stmt = (
            insert(Todo)
            .values(
                user_id=user_id,
                title=title,
                description=description,
                reminder=reminder,
                date=date,
                time=time,
                reminder_time=reminder_time,
                status=status,
                repeat=repeat,
                tags=tags
            )
            .on_conflict_do_update(
                index_elements=[Todo.todo_id],  # or any unique constraint
                set_=dict(
                    title=title,
                    description=description,
                    reminder=reminder,
                    date=date,
                    time=time,
                    reminder_time=reminder_time,
                    status=status,
                    repeat=repeat,
                    tags=tags
                ),
            )
            .returning(Todo)
        )

        result = await self.session.execute(insert_stmt)
        await self.session.commit()
        return result.scalar_one()

    async def get_todo_by_id(self, todo_id: int) -> Optional[Todo]:
        """
        Fetch a Todo by its ID.
        """
        stmt = select(Todo).filter(Todo.todo_id == todo_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_todos_by_user(self, user_id: int) -> List[Todo]:
        """
        Get all todos for a given user, including the associated tags (via tag IDs stored in the 'tags' array).
        """
        # Step 1: Fetch all Todos for the user
        stmt = select(Todo).filter(Todo.user_id == user_id)
        result = await self.session.execute(stmt)
        todos = result.scalars().all()

        # Step 2: Extract all unique tag IDs from todos' tags field (array of IDs)
        tag_ids = {tag_id for todo in todos if todo.tags for tag_id in todo.tags}

        # Step 3: Fetch all tags using those IDs
        if tag_ids:
            tag_stmt = select(Tag).filter(Tag.tag_id.in_(tag_ids))  # Ensure you use the correct field `tag_id`
            tag_result = await self.session.execute(tag_stmt)
            tags = tag_result.scalars().all()

            # Step 4: Create a map for fast lookup by tag_id
            tag_map = {tag.tag_id: tag for tag in tags}

            # Step 5: Attach the corresponding tags to each Todo
            for todo in todos:
                # Map the tag IDs in 'tags' to the actual Tag objects
                todo_tags = [tag_map[tag_id] for tag_id in todo.tags if tag_id in tag_map]
                todo.tags = todo_tags  # Replace tag IDs with Tag objects

        return todos

    async def update_todo_status(self, todo_id: int, status: bool) -> Optional[Todo]:
        """
        Update the status (completed or not) of a todo and add 100 points to the associated user.
        """
        done_time = datetime.now()

        # Step 1: Update the todo status
        stmt = update(Todo).filter(Todo.todo_id == todo_id).values(status=status, done_time=done_time).returning(Todo)
        result = await self.session.execute(stmt)
        updated_todo = result.scalar_one_or_none()
        return updated_todo

    async def delete_todo(self, todo_id: int) -> Optional[Todo]:
        """
        Delete a todo by ID.
        """
        stmt = delete(Todo).filter(Todo.todo_id == todo_id).returning(Todo)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one()

    async def get_todos_by_date(self, user_id: int, date: str) -> List[Todo]:
        """
        Get todos for a given user filtered by a specific date.
        """
        stmt = select(Todo).filter(Todo.user_id == user_id, Todo.date == date)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def get_todos_by_status(self, user_id: int, status: bool) -> List[Todo]:
        """
        Get todos for a user filtered by their completion status.
        """
        stmt = select(Todo).filter(Todo.user_id == user_id, Todo.status == status)
        result = await self.session.execute(stmt)
        return result.scalars().all()
