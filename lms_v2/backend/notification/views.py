from django.core.mail import send_mail
from django.db import connection
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def handle_action(request, action_id):
    user = request.user

    with connection.cursor() as cursor:
        cursor.execute(
            "SELECT message, email_subject, email_body FROM notification_actions WHERE id = %s",
            [action_id]
        )
        row = cursor.fetchone()

    if not row:
        return Response({"message": "Invalid action"}, status=400)

    message, email_subject, email_body = row

    # send email ONLY if email exists (signup & enroll)
    if email_subject and email_body:
        send_mail(
            subject=email_subject,
            message=email_body,
            from_email="noreply@nextgenlms.com",
            recipient_list=[user.email],
            fail_silently=False
        )

    return Response({"message": message})
