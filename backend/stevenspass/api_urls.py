from django.urls import path
from .views import (
    api_list_runs,
    api_list_run_videos,
    api_create_new_user,
    LikeView,
    DislikeView,
    LoginView,
    VideoView,
    ConditionView,
    api_get_reviews
)


urlpatterns = [
    path("runs/", api_list_runs, name="api_list_runs"),
    path("videos/", VideoView.as_view(), name="api_add_video"),
    path("videos/<int:id>/", api_list_run_videos, name="api_list_run_videos"),
    path("videos/like/<int:video_id>/",
         LikeView.as_view(), name="api_like_video"),
    path("videos/dislike/<int:video_id>/",
         DislikeView.as_view(),
         name="api_dislike_video"),
    path("user/", api_create_new_user, name="api_create_new_user"),
    path("user/<slug:username>/",
         api_create_new_user,
         name="api_check_username"),
    path("login/", LoginView.as_view(), name="login"),
    path("conditions/", ConditionView.as_view(), name="condition_view"),
    path("conditions/<int:run_id>/", api_get_reviews, name="api_get_reviews")
]
