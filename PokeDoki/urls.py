from django.urls import path
from . import views

urlpatterns = [
    path("",views.index,name= "index"),
    path("all_pokemons", views.allpoke, name = "all_pokemons"),
]