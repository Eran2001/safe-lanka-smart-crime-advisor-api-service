from rest_framework import serializers
from .models import CrimeRecord

class CrimeRecordSerializer(serializers.ModelSerializer):
    class Meta:
        model = CrimeRecord
        fields = "__all__"
        read_only_fields = ("created_by", "created_at", "updated_at")
