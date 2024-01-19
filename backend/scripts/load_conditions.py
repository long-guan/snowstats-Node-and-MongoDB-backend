from stevenspass.models import SnowConditionVO, TrailFeatureVO

snow_conditions = [
    "Champagne Powder",
    "Deep",
    "Pow",
    "Groomers",
    "Slush",
    "Wet",
    "Choppy",
    "Corn",
    "Mashed Potatoes",
    "Moguls",
    "Hard Pack",
    "Dust on Crust",
    "Cascade Concrete",
    "Icy"
]

trail_features = [
    "Crowded",
    "Narrow",
    "Wide",
    "Side Hits",
    "Cat Track",
    "Flat",
    "Straight",
    "Curvy"
]


def run():
    for condition in snow_conditions:
        SnowConditionVO.objects.create(category=condition)

    for feature in trail_features:
        TrailFeatureVO.objects.create(category=feature)

    print("condition data successfully imported")
