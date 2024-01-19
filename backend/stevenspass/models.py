from django.db import models
from django.contrib.auth.models import User


class CategoryVO(models.Model):
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.category}"


class SnowConditionVO(models.Model):
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.category}"


class TrailFeatureVO(models.Model):
    category = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.category}"


class Run(models.Model):
    id = models.IntegerField(primary_key=True)
    title = models.CharField(max_length=50)
    category = models.ForeignKey(
        CategoryVO,
        related_name="runs",
        on_delete=models.CASCADE
    )

    def __str__(self):
        return f"{self.title}"


class Video(models.Model):
    src = models.CharField(max_length=150)
    run = models.ForeignKey(
        Run,
        related_name="videos",
        on_delete=models.CASCADE
    )
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
    user = models.ForeignKey(
        User,
        related_name="added_videos",
        on_delete=models.CASCADE
    )

    def get_total_likes(self):
        try:
            return self.likes.users.count()
        except Exception as e:
            print(e)
            return 0

    def get_total_dislikes(self):
        try:
            return self.dislikes.users.count()
        except Exception as e:
            print(e)
            return 0

    def get_overall(self):
        return self.get_total_likes() - self.get_total_dislikes()


class Like(models.Model):
    video = models.OneToOneField(
        Video,
        related_name="likes",
        on_delete=models.CASCADE
    )
    users = models.ManyToManyField(
        User,
        related_name="users_likes",
    )


class Dislike(models.Model):
    video = models.OneToOneField(
        Video,
        related_name="dislikes",
        on_delete=models.CASCADE
    )
    users = models.ManyToManyField(
        User,
        related_name="user_dislikes",
    )


class Condition(models.Model):
    run = models.ForeignKey(
        Run,
        related_name="conditions",
        on_delete=models.CASCADE
    )
    user = models.ForeignKey(
        User,
        related_name="conditions",
        on_delete=models.CASCADE
    )
    snow_condition = models.ManyToManyField(
        SnowConditionVO,
        related_name="conditions"
    )
    trail_feature = models.ManyToManyField(
        TrailFeatureVO,
        related_name="conditions"
    )
    date = models.DateField(auto_now=False, auto_now_add=False)
    comment = models.CharField(max_length=150)
    created_at = models.DateTimeField(auto_now=False, auto_now_add=True)
