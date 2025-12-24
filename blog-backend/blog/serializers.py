from rest_framework import serializers
from .models import Post

class PostSerializer(serializers.ModelSerializer):
    class Meta:
        model = Post
        fields = '__all__'

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        if instance.image:
            # Prepend /media/ to the image name for the output
            representation['image'] = f"/media/{instance.image.name}"
        return representation

    