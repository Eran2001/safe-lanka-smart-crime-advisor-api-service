from rest_framework import generics, permissions
from .models import ResearchRecord
from .serializers import ResearchRecordSerializer

class ResearchListCreateView(generics.ListCreateAPIView):
    queryset = ResearchRecord.objects.all().order_by("-date")
    serializer_class = ResearchRecordSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(researcher=self.request.user)


class ResearchDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = ResearchRecord.objects.all()
    serializer_class = ResearchRecordSerializer
    permission_classes = [permissions.IsAuthenticated]
