import json
from fastapi import APIRouter, HTTPException, Depends, Request
from starlette.status import HTTP_400_BAD_REQUEST, HTTP_404_NOT_FOUND
from infrastructure.database.repo.requests import RequestsRepo
from webhook.routers.users import validate_init_data
from webhook.utils import get_repo

tags_router = APIRouter(prefix="/tags")


# POST /tags - Create a new tag
@tags_router.post("/")
async def create_tag(
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    data = await request.json()
    tag_data = data.get("tagData")

    if not tag_data:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing tag data")

    user_id = json.loads(init_data['user'])['id']

    tag = await repo.tags.get_or_create_tag(
        user_id=user_id,
        name=tag_data["name"],
        color=tag_data.get("color", "#000000")
    )

    return {"tag": tag}


# POST /tags/fetch-all - Get all tags for a user (replacing GET with POST)
@tags_router.post("/fetch-all")
async def get_tags_by_user(
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    user_id = json.loads(init_data['user'])['id']

    # Fetch all tags for the user
    tags = await repo.tags.get_tags_by_user(user_id)

    return {"tags": tags}


# POST /tags/fetch-one - Get a specific tag by ID (replacing GET with POST)
@tags_router.post("/fetch-one")
async def get_tag_by_id(
        request: Request,
        repo: RequestsRepo = Depends(get_repo)
):
    data = await request.json()
    tag_id = data.get("tagId")

    if not tag_id:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing tag ID")

    tag = await repo.tags.get_tag_by_id(tag_id)

    if not tag:
        raise HTTPException(status_code=HTTP_404_NOT_FOUND, detail="Tag not found")

    return {"tag": tag}


# POST /tags/delete - Delete a tag (replacing DELETE with POST)
@tags_router.post("/delete")
async def delete_tag(
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    data = await request.json()
    tag_id = data.get("tagId")

    if not tag_id:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing tag ID")

    deleted_tag = await repo.tags.delete_tag(tag_id)

    if not deleted_tag:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Tag not found or not owned by user")

    return {"message": f"Tag {tag_id} deleted successfully"}


# POST /tags/update - Update a tag (replacing PUT with POST)
@tags_router.post("/update")
async def update_tag(
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    data = await request.json()
    tag_data = data.get("tagData")
    tag_id = data.get("tagId")

    if not tag_data or not tag_id:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing tag data or tag ID")

    user_id = json.loads(init_data['user'])['id']

    # Update the tag
    updated_tag = await repo.tags.update_tag(
        tag_id=tag_id,
        name=tag_data["name"],
        color=tag_data.get("color", "#000000")
    )

    return {"updated_tag": updated_tag}
