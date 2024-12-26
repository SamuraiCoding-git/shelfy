from typing import Optional, List
from sqlalchemy import select, update, delete
from sqlalchemy.dialects.postgresql import insert
from infrastructure.database.models import Tag
from infrastructure.database.repo.base import BaseRepo


class TagRepo(BaseRepo):
    async def get_or_create_tag(
        self,
        user_id: int,
        name: str,
        color: str
    ) -> Tag:
        """
        Insert a new tag if it does not exist or update an existing tag.
        """
        insert_stmt = (
            insert(Tag)
            .values(
                user_id=user_id,
                name=name,
                color=color
            )
            .on_conflict_do_update(
                index_elements=[Tag.tag_id],
                set_=dict(
                    name=name,
                    color=color
                ),
            )
            .returning(Tag)
        )

        result = await self.session.execute(insert_stmt)
        await self.session.commit()
        return result.scalar_one()

    async def get_tag_by_id(self, tag_id: int) -> Optional[Tag]:
        """
        Fetch a Tag by its ID.
        """
        stmt = select(Tag).filter(Tag.tag_id == tag_id)
        result = await self.session.execute(stmt)
        return result.scalars().first()

    async def get_tags_by_user(self, user_id: int) -> List[Tag]:
        """
        Get all tags for a given user.
        """
        stmt = select(Tag).filter(Tag.user_id == user_id)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def delete_tag(self, tag_id: int) -> Optional[Tag]:
        """
        Delete a tag by ID.
        """
        stmt = delete(Tag).filter(Tag.tag_id == tag_id).returning(Tag)
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one()

    async def get_tags_by_name(self, name: str) -> List[Tag]:
        """
        Get tags by name (partial match allowed).
        """
        stmt = select(Tag).filter(Tag.name == name)
        result = await self.session.execute(stmt)
        return result.scalars().all()

    async def update_tag(self, tag_id: int, name: str, color: str) -> Optional[Tag]:
        """
        Update a tag's name and color by its ID.
        """
        stmt = (
            update(Tag)
            .where(Tag.tag_id == tag_id)
            .values(name=name, color=color)
            .returning(Tag)
        )
        result = await self.session.execute(stmt)
        await self.session.commit()
        return result.scalar_one_or_none()
