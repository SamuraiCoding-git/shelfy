import json

from fastapi import APIRouter, HTTPException, Depends
from starlette.requests import Request

from infrastructure.database.repo.requests import RequestsRepo
from webhook.utils import get_repo, validate_init_data

users_router = APIRouter(prefix="/users")


# Route for handling user creation or fetching user data
from datetime import timedelta, datetime


@users_router.post("/")
async def users(request: Request, repo: RequestsRepo = Depends(get_repo)):
    parsed_data = await validate_init_data(request)  # Validate and parse initData

    if parsed_data is None:
        raise HTTPException(status_code=400, detail="No valid userInitData provided")

    user = json.loads(parsed_data['user'])
    data = await request.json()
    start_param = int(data.get('startParam', 0))
    referrer = await repo.users.select_user(user_id=start_param)

    user, referral_count = await repo.users.get_or_create_user(
        user_id=user['id'],
        full_name=user['first_name'] + user['last_name'],
        photo_url=user['photo_url'],
        referrer=start_param if referrer else referrer
    )

    # Fetch tasks completed by the user
    tasks = await repo.todos.get_todos_by_user(user_id=user.user_id)  # Assume this returns tasks with completion date

    # Sort tasks by completion date, ensuring None values are handled correctly
    tasks = sorted(tasks, key=lambda x: x.done_time if x.done_time is not None else datetime.min)

    # Now we calculate the longest streak of consecutive days
    longest_streak = 0
    current_streak = 0
    previous_date = None

    completed_tasks_count = 0  # Variable to count completed tasks

    # Iterate through sorted tasks to calculate streak
    for task in tasks:
        # Ensure done_time is not None and then convert to date
        if task.done_time and isinstance(task.done_time, datetime):
            completion_date = task.done_time.date()  # Convert datetime to date for comparison
            completed_tasks_count += 1  # Increment completed task count
        else:
            continue  # Skip this task if done_time is None or not a valid datetime

        # Calculate streak
        if previous_date is None or completion_date == previous_date + timedelta(days=1):
            # If it's the first task or it's the next consecutive day
            current_streak += 1
        else:
            # If there's a break in the streak, reset the current streak
            current_streak = 1

        # Update the longest streak
        longest_streak = max(longest_streak, current_streak)
        previous_date = completion_date

    # Prepare the response user object
    user_response = {
        "user_id": user.user_id,
        "full_name": user.full_name,
        "referrer": user.referrer,
        "friends": referral_count,
        "burningDays": longest_streak,
        "points": user.points,
        "completed_tasks": completed_tasks_count  # Add the number of tasks completed
    }

    return {"user": user_response}

@users_router.post("/top_earnings")
async def get_top_earnings(period: str = "all", repo: RequestsRepo = Depends(get_repo)):
    top_users = await repo.users.get_top_users_by_earnings(period)
    return {"top_users": top_users}

