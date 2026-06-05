from fastapi import HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.models.user import User
from app.schemas.auth import RegisterRequest, LoginRequest, ChangePasswordRequest
from app.core.security import hash_password, verify_password, create_access_token


class AuthService:
    """Service layer handling user authentication and account management business logic."""

    @staticmethod
    async def register_user(db: AsyncSession, request: RegisterRequest) -> User:
        """Registers a new user in the database after checking email uniqueness."""
        # Check if email is already registered
        query = select(User).where(User.email == request.email)
        result = await db.execute(query)
        existing_user = result.scalar_one_or_none()

        if existing_user:
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Email address is already registered",
            )

        # Create new user record
        new_user = User(
            name=request.name,
            email=request.email,
            password_hash=hash_password(request.password),
        )
        db.add(new_user)
        await db.commit()
        await db.refresh(new_user)
        return new_user

    @staticmethod
    async def login_user(db: AsyncSession, request: LoginRequest) -> str:
        """Verifies user credentials and generates a JWT token."""
        query = select(User).where(User.email == request.email)
        result = await db.execute(query)
        user = result.scalar_one_or_none()

        if not user or not verify_password(request.password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Incorrect email or password",
            )

        # Generate JWT access token
        access_token = create_access_token(data={"sub": str(user.id)})
        return access_token

    @staticmethod
    async def change_password(
        db: AsyncSession, user: User, request: ChangePasswordRequest
    ) -> None:
        """Changes user password after validating current password."""
        if not verify_password(request.current_password, user.password_hash):
            raise HTTPException(
                status_code=status.HTTP_400_BAD_REQUEST,
                detail="Incorrect current password",
            )

        user.password_hash = hash_password(request.new_password)
        await db.commit()

    @staticmethod
    async def delete_account(db: AsyncSession, user: User) -> None:
        """Deletes user account and cascade removes related detection records."""
        await db.delete(user)
        await db.commit()
