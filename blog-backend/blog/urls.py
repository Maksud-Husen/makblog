from django.urls import path
from .views import PostListView , PostDetailView , PostUpdateView , PostDeleteView , PostCreateView

urlpatterns = [
    path('', PostListView.as_view()),
    path('<int:pk>/', PostDetailView.as_view()),
    path('update/<int:pk>/', PostUpdateView.as_view(), name='post-update'),
    path('delete/<int:pk>/', PostDeleteView.as_view(), name='post-delete'),
    path('create/', PostCreateView.as_view(), name='post-create'),
] 
