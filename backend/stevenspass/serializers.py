from rest_framework import serializers
from .models import Condition, CategoryVO, Run, SnowConditionVO, TrailFeatureVO
from django.contrib.auth.models import User


# for costumizing ConditionSerializer
class UserConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'username']


# for costumizing ConditionSerializer
class CategoryVOConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = CategoryVO
        fields = ["category"]


# for costumizing ConditionSerializer
class RunConditionSerializer(serializers.ModelSerializer):
    category = CategoryVOConditionSerializer()

    class Meta:
        model = Run
        fields = ["title", "category"]


# for costumizing ConditionSerializer
class SnowConditionVOConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = SnowConditionVO
        fields = ["category"]


# for costumizing ConditionSerializer
class TrailFeatureVOConditionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TrailFeatureVO
        fields = ["category"]


class ConditionSerializer(serializers.ModelSerializer):
    user = UserConditionSerializer()
    run = RunConditionSerializer()
    snow_condition = SnowConditionVOConditionSerializer(many=True)
    trail_feature = TrailFeatureVOConditionSerializer(many=True)

    class Meta:
        fields = [
            'run', 'user', 'snow_condition',
            'trail_feature', 'date', 'comment', "id"
        ]
        model = Condition
        depth = 1
