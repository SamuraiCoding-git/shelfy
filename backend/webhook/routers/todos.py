import json
import re

from datetime import datetime

from fastapi import APIRouter, HTTPException, Depends, Request
from sqlalchemy import update
from sqlalchemy.dialects import postgresql
from starlette.status import HTTP_400_BAD_REQUEST

from infrastructure.database.models import User
from infrastructure.database.repo.requests import RequestsRepo
from webhook.routers.users import validate_init_data
from webhook.utils import get_repo

todos_router = APIRouter(prefix="/todos")


# POST /todos - Create a new todo
@todos_router.post("/")
async def create_todo(request: Request,
                      repo: RequestsRepo = Depends(get_repo),
                      init_data: dict = Depends(validate_init_data)):
    data = await request.json()
    todo_data = data.get("todoData")

    print(todo_data)

    if not todo_data:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing todo data")

    user_id = json.loads(init_data['user'])['id']  # Use parsed initData for user info

    # Create new todo
    todo = await repo.todos.get_or_create_todo(
        user_id=user_id,
        title=todo_data["title"],
        date=datetime.strptime(todo_data["date"], '%Y-%m-%dT%H:%M:%S.%fZ'),
        description=todo_data["description"],
        reminder=todo_data["reminder"],
        time=todo_data["time"],
        reminder_time=todo_data["reminderTime"],
        status=todo_data["status"],
        repeat=todo_data["repeat"],
        tags=todo_data.get("tags", [])
    )

    return {"todo": todo}


# PUT /todos/{todo_id} - Update an existing todo
@todos_router.put("/{todo_id}")
async def update_todo(
        todo_id: int,
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    data = await request.json()
    todo_data = data.get("todoData")

    if not todo_data:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing todo data")

    user_id = init_data['user']['id']  # Use parsed initData for user info

    # Update todo
    updated_todo = await repo.todos.update_todo(
        todo_id=todo_id,
        user_id=user_id,
        title=todo_data["title"],
        description=todo_data.get("description"),
        due_date=todo_data["dueDate"],
        tags=todo_data.get("tags", [])
    )

    return {"updated_todo": updated_todo}


# DELETE /todos/{todo_id} - Delete a todo
@todos_router.delete("/{todo_id}")
async def delete_todo(
        todo_id: int,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    # Delete the todo
    deleted_todo = await repo.todos.delete_todo(todo_id)

    if not deleted_todo:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Todo not found or not owned by user")

    return {"message": f"Todo {todo_id} deleted successfully"}


# PATCH /todos/{todo_id} - Partial update for a todo
@todos_router.patch("/{todo_id}")
async def patch_todo(
        todo_id: int,
        request: Request,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    data = await request.json()
    todo_data = data.get("todoData")

    if not todo_data:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Missing todo data")

    user_id = init_data['user']['id']  # Use parsed initData for user info

    # Partially update the todo
    updated_todo = await repo.todos.update_todo(
        todo_id=todo_id,
        user_id=user_id,
        title=todo_data.get("title"),
        description=todo_data.get("description"),
        due_date=todo_data.get("dueDate"),
        tags=todo_data.get("tags", [])
    )

    return {"updated_todo": updated_todo}

@todos_router.post("/all")
async def get_todos_by_user(
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    user_id = json.loads(init_data['user'])['id']  # Extract user ID from parsed initData

    # Fetch all todos for the user
    todos = await repo.todos.get_todos_by_user(user_id)


    return {"todos": todos}


@todos_router.patch("/{todo_id}/toggle_status")
async def toggle_todo_status(
        todo_id: int,
        repo: RequestsRepo = Depends(get_repo),
        init_data: dict = Depends(validate_init_data)
):
    # Fetch the existing todo by ID and check if it belongs to the user
    todo = await repo.todos.get_todo_by_id(todo_id)

    if not todo:
        raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Todo not found or not owned by user")

    # Toggle the status (e.g., "incomplete" <=> "complete")
    new_status = not todo.status  # More Pythonic way to toggle a boolean

    # Update the todo with the new status
    updated_todo = await repo.todos.update_todo_status(
        todo_id=todo_id,
        status=new_status
    )

    if updated_todo:
        # Fetch the user associated with the todo (assuming `todo.user_id` exists)
        user_id = updated_todo.user_id

        # Fetch the user object from the database
        user = await repo.users.select_user(user_id)  # Assuming this method exists

        if user:
            # Add 100 points to the user's points
            await repo.users.get_or_create_user(user.user_id,
                                                user.full_name,
                                                user.photo_url,
                                                user.points + 50,
                                                user.referrer)

        return {"updated_todo": updated_todo}

    raise HTTPException(status_code=HTTP_400_BAD_REQUEST, detail="Failed to update todo status")
