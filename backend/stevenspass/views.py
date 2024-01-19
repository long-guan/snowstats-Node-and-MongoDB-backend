from django.views.decorators.http import require_http_methods
from .models import (
    Run, Video, Like, Dislike, Condition
)
from django.http import JsonResponse
from common.json import ModelEncoder
import json
from django.contrib.auth.models import User
from rest_framework.views import APIView
from rest_framework.permissions import (
    IsAuthenticated,
    IsAuthenticatedOrReadOnly
)
from django.contrib.auth import authenticate
from rest_framework_simplejwt.tokens import RefreshToken
from datetime import datetime
from rest_framework_simplejwt.authentication import JWTAuthentication
from .serializers import ConditionSerializer
from django.db import IntegrityError


class RunListEncoder(ModelEncoder):
    model = Run
    properties = [
        "id",
        "title",
    ]

    def get_extra_data(self, o):
        return {"category": o.category.category}


class VideoListEncoder(ModelEncoder):
    model = Video
    properties = [
        "id",
        "src",
    ]

    def get_extra_data(self, o):
        return {
            "run": {
                "title": o.run.title,
                "id": o.run.id,
            },
            "vote": {
                "likes": o.get_total_likes(),
                "dislikes": o.get_total_dislikes(),
                "total": o.get_overall(),
            },
            "user": {
                "username": o.user.username,
            }
        }


@require_http_methods(["GET"])
def api_list_runs(request):
    if request.method == "GET":
        runs = Run.objects.all()
        return JsonResponse(
            {"runs": runs},
            encoder=RunListEncoder,
        )


class VideoView(APIView):
    # allows unauthenticated users to view videos
    # but only authenticated users to post
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request):
        content = json.loads(request.body)
        video_input = {}
        try:
            run = Run.objects.get(id=content["runId"])
            video_input["run"] = run
        except Run.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid run id"},
                status=400,
            )
        try:
            user = User.objects.get(id=content["userId"])
            if (request.user == user):
                video_input["user"] = user
            else:
                return JsonResponse(
                    {"message": "Unauthorized user"},
                    status=401
                )
        except User.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid user id"},
                status=400,
            )
        video_input["src"] = content["src"]
        video = Video.objects.create(**video_input)
        return JsonResponse(
            {
                "video": video,
                "like_status": {
                    "like_status": False,
                    "dislike_status": False
                }
            },
            encoder=VideoListEncoder,
            safe=False,
        )

    def get(self, request):
        videos = Video.objects.all()
        return JsonResponse(
            {"videos": videos},
            encoder=VideoListEncoder,
        )


@require_http_methods(['GET'])
def api_list_run_videos(request, id):
    if request.method == "GET":
        videos = Video.objects.filter(run_id=id)
        JWT_authenticator = JWTAuthentication()
        like_status = []
        # try to authenticate the request
        # if user is authenticated, check if user liked/disliked
        try:
            response = JWT_authenticator.authenticate(request)
            if response is not None:
                user, token = response
            for video in videos:
                currentVid = {
                    "like_status": False,
                    "dislike_status": False
                }
                if Like.objects.filter(video=video).exists():
                    if user in video.likes.users.all():
                        currentVid["like_status"] = True
                if Dislike.objects.filter(video=video).exists():
                    if user in video.dislikes.users.all():
                        currentVid["dislike_status"] = True
                like_status.append(currentVid)
        # return empty video_likes.videos if user not authenticated
        except Exception as e:
            print(e)
            for x in range(len(videos) - 1):
                like_status.append({
                    "like_status": False,
                    "dislike_status": False
                })
        return JsonResponse(
            {"videos": videos,
             "like_status": like_status},
            encoder=VideoListEncoder,
        )


@require_http_methods(["POST", "GET"])
def api_create_new_user(request, username=None):
    if request.method == "POST":
        content = json.loads(request.body)
        if User.objects.filter(username=content["username"]).exists():
            return JsonResponse(
                {"message": "username already exists"},
                status=400,
            )
        try:
            User.objects.create_user(
                content["username"],
                email=None,
                password=content["password"]
            )
        except Exception as e:
            return JsonResponse(
                {"message": e},
                status=400,
                safe=False
            )
        return JsonResponse(
            {"message": "account successfully created"},
            status=200,
        )
    else:
        if User.objects.filter(username=username).exists():
            return JsonResponse(
                {"message": "username already exists"},
                status=200,
            )
        else:
            return JsonResponse(
                {"message": "username is available"},
                status=404,
            )


class LikeView(APIView):
    permission_classes = (IsAuthenticated,)

    def post(self, request, video_id):
        if request.method == "POST":
            content = json.loads(request.body)
            # error handling if video_id doesn't exists
            if Video.objects.filter(id=video_id).exists() is False:
                return JsonResponse(
                    {"message": "video_id does not exists"},
                    status=404,
                )
            # error handling if username doesn't exists
            if User.objects.filter(
                username=content["username"]
            ).exists() is False:
                return JsonResponse(
                    {"message": "username does not exists"},
                    status=404,
                )
            video = Video.objects.get(id=video_id)
            user = User.objects.get(username=content["username"])
            # check if user token is the same as username
            if (request.user != user):
                return JsonResponse(
                    {"message": "Unauthorized user"},
                    status=401
                )
            #  if user is in Dislike, remove user from Dislike
            remove_dislike = False
            if Dislike.objects.filter(video=video).exists():
                dislikes = Dislike.objects.get(video=video)
                if user in dislikes.users.all():
                    dislikes.users.remove(user)
                    remove_dislike = True
            try:
                # create the Like object for video if it doesn't exist
                if Like.objects.filter(video=video).exists() is False:
                    # add user to Like if user not in Like
                    likes = Like.objects.create(video=video)
                    likes.users.add(user)
                else:
                    # remove user from Like if user already in Like
                    likes = Like.objects.get(video=video)
                    if user in likes.users.all():
                        likes.users.remove(user)
                        return JsonResponse(
                            {"message": "video unliked"},
                            status=200,
                        )
                    # add user to Like if user not in Like
                    else:
                        likes.users.add(user)
            except Exception as e:
                print(e)
                return JsonResponse(
                    {"message": "something went wrong"},
                    status=400,
                    safe=False
                )
            if remove_dislike is True:
                return JsonResponse(
                    {"message": "video liked and removed user from Dislike"},
                    status=200,
                )
            else:
                return JsonResponse(
                    {"message": "video liked"},
                    status=200,
                )


class DislikeView(APIView):
    permission_classes = (IsAuthenticated,)

    # removes the user from Like when adding to Dislike
    def post(self, request, video_id):
        if request.method == "POST":
            content = json.loads(request.body)
            # error handling if video_id doesn't exists
            if Video.objects.filter(id=video_id).exists() is False:
                return JsonResponse(
                    {"message": "video_id does not exists"},
                    status=404,
                )
            # error handling if username doesn't exists
            if User.objects.filter(
                username=content["username"]
            ).exists() is False:
                return JsonResponse(
                    {"message": "username does not exists"},
                    status=404,
                )
            video = Video.objects.get(id=video_id)
            user = User.objects.get(username=content["username"])
            # check if user token is the same as username
            if (request.user != user):
                return JsonResponse(
                    {"message": "Unauthorized user"},
                    status=401
                )
            #  if user is in Like, remove user from Like
            remove_like = False
            if Like.objects.filter(video=video).exists():
                likes = Like.objects.get(video=video)
                if user in likes.users.all():
                    likes.users.remove(user)
                    remove_like = True
            try:
                # create the Dislike object for video if it doesn't exist
                if Dislike.objects.filter(video=video).exists() is False:
                    # add user to Dislike if user not in Dislike
                    dislikes = Dislike.objects.create(video=video)
                    dislikes.users.add(user)
                else:
                    # remove user from Dislike if user already in Dislike
                    dislikes = Dislike.objects.get(video=video)
                    if user in dislikes.users.all():
                        dislikes.users.remove(user)
                        return JsonResponse(
                            {"message": "video undisliked"},
                            status=200,
                        )
                    # add user to Dislike if user not in Dislike
                    else:
                        dislikes.users.add(user)
            except Exception as e:
                print(e)
                return JsonResponse(
                    {"message": "something went wrong"},
                    status=400,
                    safe=False
                )
            if remove_like is True:
                return JsonResponse(
                    {"message": "video disliked and removed user from Like"},
                    status=200,
                )
            else:
                return JsonResponse(
                    {"message": "video disliked"},
                    status=200,
                )


class LoginView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')

        user = authenticate(
            username=username, password=password)

        refresh = RefreshToken.for_user(user)
        access_token_expiry = str(
            datetime.now() + refresh.access_token.lifetime
        )
        return JsonResponse(
            {
               'refresh': str(refresh),
               'access': str(refresh.access_token),
               'username': username,
               "user_id": user.id,
               "access_token_expiry": access_token_expiry
            }
        )


class ConditionView(APIView):
    # allows unauthenticated users to view reviews
    # but only authenticated users to post reviews
    permission_classes = (IsAuthenticatedOrReadOnly,)

    def post(self, request):
        content = json.loads(request.body)
        condition_input = {}
        try:
            run = Run.objects.get(id=content["run_id"])
            condition_input["run"] = run
        except Run.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid run id"},
                status=400,
            )
        try:
            user = User.objects.get(id=content["user_id"])
            if (request.user == user):
                condition_input["user"] = user
            else:
                return JsonResponse(
                    {"message": "Unauthorized user"},
                    status=401
                )
        except User.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid user id"},
                status=400,
            )
        date = content["date"]
        # validate that year, month, and day is all numbers
        if (
            date[0:4].isnumeric() is not True
            or
            date[5:7].isnumeric() is not True
            or
            date[8:].isnumeric() is not True
            or
            date[4] != "-"
            or
            date[7] != "-"
            or
            len(date) != 10
        ):
            return JsonResponse(
                {"message": "Date must be in YYYY-MM-DD format"},
                status=400,
            )
        # validate that year and month is > opening date
        if (int(date[0:4]) < 2023 and int(date[5:7]) < 12):
            return JsonResponse(
                {"message": "Reviews must be from this season"}
            )
        condition_input["date"] = (date)
        condition_input['comment'] = content['comment']
        condition = Condition.objects.create(**condition_input)
        try:
            for id in content["snow_condition"]:
                condition.snow_condition.add(id)
        except IntegrityError:
            # deletes the Condition
            condition.delete()
            return JsonResponse(
                {"message": "Invalid snow_condition category id"},
                status=400,
            )
        try:
            for id in content["trail_feature"]:
                condition.trail_feature.add(id)
        except IntegrityError:
            # deletes the Condition
            condition.delete()
            return JsonResponse(
                {"message": "Invalid trail_feature category id"},
                status=400,
            )
        data = ConditionSerializer(condition).data
        return JsonResponse(
            {"reviews": data},
        )

    def get(self, request):
        reviews = Condition.objects.all()
        data = ConditionSerializer(reviews, many=True).data
        return JsonResponse(
            {"reviews": data},
        )


@require_http_methods(['GET'])
def api_get_reviews(request, run_id):
    if request.method == "GET":
        try:
            run = Run.objects.get(id=run_id)
        except Run.DoesNotExist:
            return JsonResponse(
                {"message": "Invalid run id"},
                status=400,
            )
        reviews = Condition.objects.filter(run=run)
        data = ConditionSerializer(reviews, many=True).data
        return JsonResponse(
            {"reviews": data},
        )
