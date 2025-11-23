from django.db import models
from django.conf import settings

class BlogPost(models.Model):
    CATEGORY_CHOICES = [
        ("SAFETY", "Safety Tips"),
        ("CRIME_AWARENESS", "Crime Awareness"),
        ("GUIDE", "User Guide"),
        ("NEWS", "News & Updates"),
    ]

    title = models.CharField(max_length=255)
    content = models.TextField()
    category = models.CharField(max_length=50, choices=CATEGORY_CHOICES)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    is_published = models.BooleanField(default=True)

    class Meta:
        ordering = ["-created_at"]

    def __str__(self):
        return self.title
