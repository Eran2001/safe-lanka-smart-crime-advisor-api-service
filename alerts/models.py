# alerts/models.py
from django.db import models
from django.conf import settings

class Alert(models.Model):
    ALERT_TYPES = [
        ("INFO", "Information"),
        ("WARNING", "Warning"),
        ("ALERT", "Alert"),
    ]

    title = models.CharField(max_length=255)
    message = models.TextField()
    alert_type = models.CharField(max_length=20, choices=ALERT_TYPES, default="INFO")
    division = models.CharField(max_length=100)
    is_read = models.BooleanField(default=False)
    created_at = models.DateTimeField(auto_now_add=True)
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)

    def __str__(self):
        return f"{self.alert_type}: {self.title}"

def create_high_risk_alert(division, created_by):
    """
    Creates an automatic alert when a division becomes high risk.
    """
    title = f"High Risk Alert - {division}"
    message = f"The division '{division}' has been flagged as HIGH RISK. Immediate attention required."
    Alert.objects.create(
        title=title,
        message=message,
        alert_type="ALERT",
        division=division,
        created_by=created_by
    )
