from django.contrib import admin
from django.urls import path, include

urlpatterns = [
    path("admin/", admin.site.urls),
    # include your app routes here when ready, e.g.:
    # path("api/auth/", include("accounts.urls")),
]
