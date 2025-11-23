from django.urls import path
from .views import AlertListCreateView, AlertUpdateView

urlpatterns = [
    path("", AlertListCreateView.as_view(), name="alert-list-create"),
    path("<int:pk>/", AlertUpdateView.as_view(), name="alert-update"),
]
