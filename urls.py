from django.conf.urls import patterns, url
from django.views.generic import TemplateView

from geonode.urls import *

urlpatterns = patterns('',
   url(r'^frontpage','my_geonode.views.frontpage',name='frontpage'),
   url(r'^/?$',TemplateView.as_view(template_name='site_index.html'),name='home'),
 ) + urlpatterns
