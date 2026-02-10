from django.db.models.signals import post_migrate
from django.dispatch import receiver
from django.contrib.auth.models import Group


@receiver(post_migrate)
def create_user_roles(sender, **kwargs):
    Group.objects.get_or_create(name="STUDENT")
    Group.objects.get_or_create(name="CREATOR")
    Group.objects.get_or_create(name="ADMIN")
