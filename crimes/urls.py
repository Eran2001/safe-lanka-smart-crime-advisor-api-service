from django.urls import path
from .views import CrimeRecordListCreateView, CrimeRecordDetailView

urlpatterns = [
    path("", CrimeRecordListCreateView.as_view(), name="crime-list-create"),
    path("<int:pk>/", CrimeRecordDetailView.as_view(), name="crime-detail"),
]
