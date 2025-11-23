from rest_framework import status, permissions, views
from rest_framework.response import Response
from alerts.models import create_high_risk_alert

class RiskAnalysisView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        data = request.data
        division = data.get("division")
        risk_level = data.get("risk_level")  # could be 'Low', 'Medium', 'High'

        # example: create an alert if risk is high
        if risk_level == "High":
            create_high_risk_alert(division, request.user)

        return Response({"message": "Risk processed successfully"}, status=status.HTTP_200_OK)
