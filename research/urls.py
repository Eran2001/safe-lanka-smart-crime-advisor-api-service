from django.urls import path
from .views import ResearchListCreateView, ResearchDetailView

urlpatterns = [
    path("", ResearchListCreateView.as_view(), name="research-list-create"),
    path("<int:pk>/", ResearchDetailView.as_view(), name="research-detail"),
]
