from django.urls import path
from . import views

urlpatterns = [
    path('', views.index, name='index'),
    path('about', views.about, name='about'),
    # path('about-founder', views.aboutFounder, name='about-founder'),
    # path('events', views.eventsAll, name='events'),
    # path('events/<str:pk>', views.events, name='events'),
    # path('staff', views.staff, name='staff'),
]