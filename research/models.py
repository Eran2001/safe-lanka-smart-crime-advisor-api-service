from django.db import models
from django.conf import settings

class ResearchRecord(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    reference = models.URLField(blank=True, null=True)
    division = models.CharField(max_length=100)
    researcher = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    date = models.DateField(auto_now_add=True)
    correlation_score = models.FloatField(default=0.0)
    verified = models.BooleanField(default=False)

    def __str__(self):
        return self.title
