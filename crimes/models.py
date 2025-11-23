from django.db import models
from django.conf import settings

class CrimeRecord(models.Model):
    CRIME_TYPES = [
        ("THEFT", "Theft"),
        ("ASSAULT", "Assault"),
        ("ROBBERY", "Robbery"),
        ("HOMICIDE", "Homicide"),
        ("OTHER", "Other"),
    ]

    date = models.DateField()
    time = models.TimeField()
    division = models.CharField(max_length=100)
    crime_type = models.CharField(max_length=50, choices=CRIME_TYPES)
    location = models.CharField(max_length=255)
    address = models.TextField()
    count = models.PositiveIntegerField(default=1)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ["-date", "-time"]

    def __str__(self):
        return f"{self.crime_type} in {self.division} ({self.date})"
