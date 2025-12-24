from django.db import models
from django.core.files.storage import FileSystemStorage

# Create your models here.
        
class Post(models.Model):
    title = models.CharField(max_length=100)
    slug = models.SlugField(default="-")
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    image = models.ImageField(upload_to='post_images/', storage=FileSystemStorage(), blank=True, null=True)
    
    def __str__(self):  
        return self.title   

