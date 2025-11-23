from rest_framework import serializers
from .models import ResearchRecord

class ResearchRecordSerializer(serializers.ModelSerializer):
    researcher_name = serializers.CharField(source="researcher.username", read_only=True)

    class Meta:
        model = ResearchRecord
        fields = [
            "id", "title", "description", "reference", "division",
            "researcher", "researcher_name", "correlation_score",
            "verified", "date"
        ]
        read_only_fields = ["researcher", "date"]
