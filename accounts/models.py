from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = [
        ("SUPER_ADMIN", "Super Admin"),
        ("ADMIN", "Admin"),
        ("POLICE_OFFICER", "Police Officer"),
        ("ANALYST", "Analyst"),
        ("RESEARCHER", "Researcher"),
    ]

    role = models.CharField(max_length=30, choices=ROLE_CHOICES, default="POLICE_OFFICER")
    is_approved = models.BooleanField(default=False)

    def __str__(self):
        return f"{self.username} ({self.role})"
