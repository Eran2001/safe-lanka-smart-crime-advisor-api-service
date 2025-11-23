from rest_framework import generics, status
from rest_framework.response import Response
from rest_framework.permissions import AllowAny, IsAdminUser
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate, get_user_model
from rest_framework_simplejwt.tokens import RefreshToken
from django.core.mail import send_mail
from django.conf import settings
from .serializers import RegisterSerializer, UserSerializer

User = get_user_model()


class RegisterView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegisterSerializer
    permission_classes = [AllowAny]

    def perform_create(self, serializer):
        user = serializer.save()

        subject = "Welcome to SafeLanka – The Smart Crime Advisor"
        message = f"""
Hello {user.username},

Welcome to SafeLanka – Smart Crime Advisor! Thank you for registering with us. 
Your account has been successfully received and is now under review.

Once your registration is approved by the administrator, 
you will be able to log in and access the system’s features.

We appreciate your interest in joining our platform and look forward to supporting 
smarter, safer, and data-driven policing.

If you have any questions, feel free to contact our support team.

Warm regards,  
SafeLanka – Smart Crime Advisor Team
        """

        send_mail(
            subject=subject,
            message=message,
            from_email=settings.DEFAULT_FROM_EMAIL,
            recipient_list=[user.email],
            fail_silently=True,
        )


class LoginView(generics.GenericAPIView):
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    def post(self, request):
        username = request.data.get("username")
        password = request.data.get("password")

        user = authenticate(username=username, password=password)
        if not user:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.is_approved:
            return Response({"error": "Your account is not yet approved by admin."}, status=status.HTTP_403_FORBIDDEN)

        refresh = RefreshToken.for_user(user)
        data = {
            "access": str(refresh.access_token),
            "refresh": str(refresh),
            "user": UserSerializer(user).data,
        }
        return Response(data, status=status.HTTP_200_OK)


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def approve_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_approved = True
        user.save()
        return Response({"message": f"User '{user.username}' approved successfully."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)


@api_view(["PATCH"])
@permission_classes([IsAdminUser])
def reject_user(request, user_id):
    try:
        user = User.objects.get(id=user_id)
        user.is_approved = False
        user.save()
        return Response({"message": f"User '{user.username}' rejected successfully."}, status=status.HTTP_200_OK)
    except User.DoesNotExist:
        return Response({"error": "User not found."}, status=status.HTTP_404_NOT_FOUND)
