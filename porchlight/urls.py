from django.conf.urls import patterns, include, url
from django.contrib import admin
from porchlight import views

import porchlightapi

urlpatterns = patterns('',
    # Examples:
    # url(r'^$', 'porchlight.views.home', name='home'),
    # url(r'^blog/', include('blog.urls')),

    url(r'^admin/', include(admin.site.urls)),
    url(r'^porchlight/', include('porchlightapi.urls')),

    #Adding base route to serve up the index page
    url(r'index.html', views.index, name='index')
)
