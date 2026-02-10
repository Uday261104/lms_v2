from django.urls import path
from .views import handle_action

urlpatterns = [
    path("action/<int:action_id>/", handle_action),
]
