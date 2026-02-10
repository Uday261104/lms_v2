from django.contrib.auth.models import AbstractUser
from django.db import models
from .manager import UserManager


class User(AbstractUser):
    username = None  # remove username field

    user_name = models.CharField(max_length=150)
    email = models.EmailField(unique=True)

    objects = UserManager()

    USERNAME_FIELD = "email"
    REQUIRED_FIELDS = ["user_name"]

    def __str__(self):
        return self.email
