from rest_framework import serializers
from django.contrib.auth import get_user_model
from django.contrib.auth.models import Group

User = get_user_model()


class RegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    group = serializers.CharField(write_only=True, required=False)

    class Meta:
        model = User
        fields = ["id", "email", "user_name", "password", "group"]

    def create(self, validated_data):
        group_name = validated_data.pop("group", "Student")

        user = User.objects.create_user(
            email=validated_data["email"],
            user_name=validated_data["user_name"],
            password=validated_data["password"],
        )

        group_map = {
            "Student": "STUDENT",
            "Creator": "CREATOR",
        }

        role = group_map.get(group_name, "STUDENT")
        group, _ = Group.objects.get_or_create(name=role)
        user.groups.add(group)

        return user
