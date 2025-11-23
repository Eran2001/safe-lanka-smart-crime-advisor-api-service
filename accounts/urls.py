from django.urls import path
from .views import RegisterView, LoginView, approve_user, reject_user

urlpatterns = [
    path("register/", RegisterView.as_view(), name="register"),
    path("login/", LoginView.as_view(), name="login"),
    path("approve/<int:user_id>/", approve_user, name="approve-user"),
    path("reject/<int:user_id>/", reject_user, name="reject-user"),
]
