from rest_framework import serializers
from .models import Alert

class AlertSerializer(serializers.ModelSerializer):
    created_by_name = serializers.CharField(source="created_by.username", read_only=True)

    class Meta:
        model = Alert
        fields = [
            "id", "title", "message", "alert_type", "division",
            "is_read", "created_by", "created_by_name", "created_at"
        ]
        read_only_fields = ["created_by", "created_at"]
