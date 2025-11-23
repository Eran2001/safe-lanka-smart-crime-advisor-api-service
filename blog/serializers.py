from rest_framework import serializers
from .models import BlogPost

class BlogPostSerializer(serializers.ModelSerializer):
    author_name = serializers.CharField(source="author.username", read_only=True)

    class Meta:
        model = BlogPost
        fields = [
            "id", "title", "content", "category",
            "author", "author_name", "is_published",
            "created_at", "updated_at"
        ]
        read_only_fields = ["author", "created_at", "updated_at"]
