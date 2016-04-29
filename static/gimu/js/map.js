var Map=function(div_id){
	var me={};
	me.div_id=div_id;
	me.featureOverlay=null;
	me.HILIGHTS=[];

	//MAP
	me.controlsCB = function() {
		if(document.getElementById("control_panel").className.indexOf("show") > -1)
		if(document.getElementById("popout_panel").className.indexOf("show") > -1)
			$(".popout_panel").toggleClass("show");

		$(".control_panel").toggleClass("show");
		console.log("controlCB show off");


	};

	me.setup_map=function(){

		console.log('setup_map');

		var gear_opts={"CB":me.controlsCB,"title":"Layers","innerHTML":'<img src="/static/gimu/img/flaticon/layers.png" class="icon"/>','id':'gearB','className':'gearB map_button'};
		var gearB=new MapButton(gear_opts);

		console.log('creating map ...'+window.app.get_center());

		window.map = new ol.Map({
			layers:[],
			target: me.div_id,
			view: new ol.View({
				center:ol.proj.transform(window.app.get_center(), 'EPSG:4326', 'EPSG:3857'),
				zoom: 7
			}),
//			interactions:[],
			controls: ol.control.defaults({
				attributionOptions:  ({
					collapsible: false
				})
			}).extend([
				gearB,
			])
		});

		console.log('map created');


		window.map.on('singleclick', function(evt){

			console.log("click");

			var pixel = window.map.getEventPixel(evt.originalEvent);
			var html = '';
			var viewResolution = /** @type {number} */ (window.map.getView().getResolution());
			var pixel = window.map.getEventPixel(evt.originalEvent);

			//NEED: maintain array of candidate layers
			var hit = window.map.forEachLayerAtPixel(pixel, function(layer) {

				console.log("hit");

				for(var bidx=0;bidx<window.app.BASE_LAYERS['keys'].length;bidx++){
					if(layer.get("title")==window.app.BASE_LAYERS['keys'][bidx]){
						console.log("hit base layer: "+layer.get("title"));
						return false;
					}
				}

				var sidx=window.MAP_LAYER_NAMES.indexOf(layer.get("title"));
				console.log("sidx="+sidx+"/"+window.MAP_LAYER_NAMES.length+"/"+window.SOURCES.length);

				var html_url = window.SOURCES[sidx].getGetFeatureInfoUrl(
					evt.coordinate, viewResolution, 'EPSG:3857',
					{'INFO_FORMAT': 'text/html'}
				);

				var json_url = window.SOURCES[sidx].getGetFeatureInfoUrl(
					evt.coordinate, viewResolution, 'EPSG:3857',
					{'INFO_FORMAT': 'application/json'}
				);

				console.log("html_url="+html_url);
				console.log("json_url="+json_url);

				xhr=new_xhr();
				xhr.onreadystatechange=function(){
					if(xhr.readyState==4){
						if(xhr.status==200){
							try{
								console.log(xhr.responseText);
								var xpopup = document.getElementById('xpopup');
								xpopup.innerHTML=xhr.responseText;
								overlay.setPosition(evt.coordinate);
							}
							catch(e){alert(e);}
						}
					}
				}
				xhr.open('Get',html_url,true);
				xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
				xhr.send("");

				return true;
			});



		});

		window.map.on('click',function(evt){
			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");
				if(String.toLowerCase(target_name)==window.app.current){;}
				console.log(target_name);
				window.app.check_feature(evt.pixel);
			});
		});
		console.log('click listener set');

		window.map.on('pointermove',function(evt){
			if (evt.dragging) {
				return;
			}

			for(var hidx=0;hidx<me.HILIGHTS.length;hidx++){
				me.featureOverlay.removeFeature(me.HILIGHTS[hidx]);
			}

			dummmy=window.map.forEachFeatureAtPixel(evt.pixel,function(target_feature,layer){
				var target_name=target_feature.get("NAME");
				if(!target_name)target_name=target_feature.get("Name");

				if(String.toLowerCase(target_name)==window.app.current){
					//this skips printing boundary to console.log
				}
				else if(target_name==window.app.current){
					//this skips printing boundary to console.log
				}
				else if(target_feature){
					me.featureOverlay.addFeature(target_feature);
					me.HILIGHTS.push(target_feature);
					//console.log(target_name);
				}
			});
		});
		console.log("pointermove listener set");

		me.featureOverlay = new ol.FeatureOverlay({
		  map: window.map,
		  style: new ol.style.Style({
		  	stroke: new ol.style.Stroke({
		    	color: 'orange',
		    	width: 2
		    }),
		  }),
		});
		console.log("featureOverlay created");

	}//END:me.setup_map
	return me;
}
