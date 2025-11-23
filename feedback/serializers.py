from rest_framework import serializers
from .models import Feedback

class FeedbackSerializer(serializers.ModelSerializer):
    user_name = serializers.CharField(source="user.username", read_only=True)

    class Meta:
        model = Feedback
        fields = ["id", "user_name", "message", "rating", "created_at"]
        read_only_fields = ["user_name", "created_at"]
