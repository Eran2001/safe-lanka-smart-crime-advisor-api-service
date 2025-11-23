from django.urls import path
from .views import BlogPostListCreateView, BlogPostDetailView

urlpatterns = [
    path("", BlogPostListCreateView.as_view(), name="blog-list-create"),
    path("<int:pk>/", BlogPostDetailView.as_view(), name="blog-detail"),
]
