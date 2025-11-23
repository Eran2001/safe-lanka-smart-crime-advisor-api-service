from rest_framework import generics, permissions
from .models import CrimeRecord
from .serializers import CrimeRecordSerializer

class CrimeRecordListCreateView(generics.ListCreateAPIView):
    serializer_class = CrimeRecordSerializer
    queryset = CrimeRecord.objects.all()
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user)


class CrimeRecordDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = CrimeRecordSerializer
    queryset = CrimeRecord.objects.all()
    permission_classes = [permissions.IsAuthenticated]
