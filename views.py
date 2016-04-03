# -*- coding: UTF-8 -*-
from django.shortcuts import render_to_response,render
from django.template import Template, Context, RequestContext, loader
from django.utils.translation import ugettext as _
from django.utils.translation import ugettext
import datetime,string,os,random,logging,json
from django.conf import settings
from django.http import HttpResponse
import logging
import geonode

FORMAT = '%(asctime)-15s %(message)s'
logging.basicConfig(filename='/var/log/gimu/gimu.log',level=logging.DEBUG, format=FORMAT)


def frontpage(request):
	logging.debug("views.frontpage")
	try:
		qs=request.META['QUERY_STRING']
		if len(qs)>1:
			if qs=='get_layers':
				x=geonode.geoserver.models.Layer.objects.all()
				categories=[]
				rval={}
				for idx in range(len(x)):
					category="Unknown";
					try:category=x[idx].category.description
					except:pass;
					logging.debug(category)
					
					try:
						cidx=categories.index(category)
					except Exception,e:
						categories.append(category)
						rval[category]=[]
					
					pyld={
						'layer_typename':x[idx].typename,
						'layer_name':x[idx].name,
						'srid':x[idx].srid,
						#'is_vector':x[idx].is_vector,
						'id':x[idx].id,
						'legend_url':x[idx].get_legend_url(),
						#'legend':x[idx].get_legend(),
						'thumbnail_url':x[idx].get_thumbnail_url(),
						#'has_thumbnail':x[idx].has_thumbnail,
						'tiles_url':x[idx].get_tiles_url(),
						#'geographic_bounding_box':x[idx].geographic_bounding_box,
						#'all_level_info':x[idx].get_all_level_info(),
						#'download_links':x[idx].download_links,
						'abstract':x[idx].abstract,
					}
					
					rval[category].append(pyld)
				
				logging.debug(`categories`)	
				rval['categories']=categories
				
				logging.debug(`rval`)	
				return HttpResponse( json.dumps(rval) )
				
	except Exception,e:
		logging.exception("oops")
	
	return render_to_response(
		'gimu_index.html',
		{'title':'GIM GeoNode',},
		context_instance=RequestContext(request)
	)
