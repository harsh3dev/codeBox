from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import CodeSubmissionViewSet  

router = DefaultRouter()
router.register(r'submissions', CodeSubmissionViewSet)

urlpatterns = [
    path('', include(router.urls)),  
]
