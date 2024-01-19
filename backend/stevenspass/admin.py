from django.contrib import admin
from .models import (
    Run, CategoryVO, Video, Like, Dislike,
    Condition, SnowConditionVO, TrailFeatureVO
)


@admin.register(Run)
class RunAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "title",
        "category",
    )


@admin.register(CategoryVO)
class CategoryVOAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "category",
    )


@admin.register(SnowConditionVO)
class SnowConditionVOAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "category",
    )


@admin.register(TrailFeatureVO)
class TrailFeatureVOAdmin(admin.ModelAdmin):
    list_display = (
        "category",
    )


@admin.register(Video)
class VideoAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "src",
        "run",
        "created_at",
    )


@admin.register(Like)
class LikeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "video",
    )


@admin.register(Dislike)
class DislikeAdmin(admin.ModelAdmin):
    list_display = (
        "id",
        "video",
    )


@admin.register(Condition)
class ConditionAdmin(admin.ModelAdmin):
    list_display = (
        "comment",
        "run",
        "created_at",
    )
