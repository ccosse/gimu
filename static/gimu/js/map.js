var Map=function(div_id){
	var me={};
	me.div_id=div_id;
	me.featureOverlay=null;
	me.HILIGHTS=[];
	var HILITE=null;
	//MAP
	me.controlsCB = function() {
		if(document.getElementById("control_panel").className.indexOf("show") > -1)
		if(document.getElementById("popout_panel").className.indexOf("show") > -1)
			$(".popout_panel").toggleClass("show");

		$(".control_panel").toggleClass("show");
		console.log("controlCB show off");
		
		
	};
	

	me.popup_container = document.getElementById('popup');
	me.xpopup = document.getElementById('xpopup');
	console.log('xpopup found by map.js');
	me.popup_closer = document.getElementById('popup-closer');
	
	me.overlay = new ol.Overlay({
		element: me.popup_container,
		autoPan: true,
		autoPanAnimation: {
			duration: 250
		}
	});
	
	me.popup_closer.onclick = function() {
		me.overlay.setPosition(undefined);
		me.popup_closer.blur();
		return false;
	};

	var hilite_style=new ol.style.Style({
		stroke: new ol.style.Stroke({color: '#0F0',width: 3}),
		fill: new ol.style.Fill({color: 'rgba(0,200,0,0.1)'}),
	});
	var pac_style=new ol.style.Style({
		stroke: new ol.style.Stroke({color: '#0a0',width: 2}),
		fill: new ol.style.Fill({color: 'rgba(0,200,0,0.1)'}),
	});

	var konashen_layer = new ol.layer.Vector({
		source: new ol.source.Vector({url: './static/gimu/geojson/konashen.geojson',format: new ol.format.GeoJSON()}),
		style:pac_style,
	});
	
	me.setup_map=function(){
		
		console.log('setup_map');
		
		var gear_opts={"CB":me.controlsCB,"title":"Configuration","innerHTML":'<img src="/static/gimu/img/flaticon/gear.png" class="icon"/>','id':'gearB','className':'gearB map_button'};
		var gearB=new MapButton(gear_opts);
		
		console.log('creating map ...'+window.app.get_center());
		
		window.map = new ol.Map({
			layers:[konashen_layer],
			overlays: [me.overlay],
			target: me.div_id,
			view: new ol.View({
				center:ol.proj.transform(window.app.get_center(), 'EPSG:4326', 'EPSG:3857'),
				zoom: 7
			}),
			controls: ol.control.defaults({
				attributionOptions:  ({
					collapsible: false
				})
			}).extend([
				gearB,
			])
		});
		
		window.map.on('pointermove',function(evt) {
			me.highlightFeature(evt);
		});
		
	}
	me.highlightFeature=function(evt){
		//console.log("highlightFeature");
		var pixel = window.map.getEventPixel(evt.originalEvent);
		//console.log(pixel);
		var feature = window.map.forEachFeatureAtPixel(pixel, function(feature, layer) {
			return feature;
		});
		var layer = window.map.forEachLayerAtPixel(pixel, function(layer) {
			return layer;
		});
		if(feature){
			console.log("yes feature");
			feature.setStyle(hilite_style);
			HILITE=feature;

			var coordinate = evt.coordinate;
			var hdms = ol.coordinate.toStringHDMS(ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326'));
			var lonlat=ol.proj.transform(coordinate, 'EPSG:3857', 'EPSG:4326');
			var lon=parseFloat(parseInt(lonlat[0]*1E4)/1E4);
			var lat=parseFloat(parseInt(lonlat[1]*1E4)/1E4);
			
			me.xpopup.innerHTML = '<p>'+feature.getProperties().Name+'</p><code>';
			me.xpopup.innerHTML += lon+", "+lat;
			me.xpopup.innerHTML += '</code>';
			me.xpopup.innerHTML += '<br>';
			
			me.overlay.setPosition(coordinate);
			
			return feature;
		}
		else if(HILITE){
			HILITE.setStyle(pac_style);
			HILITE=null;
			me.overlay.setPosition(undefined);
			me.popup_closer.blur();
		}
		if(layer){
			var title=layer.get("title");
			if(window.app.BASE_LAYERS['keys'].indexOf(title)<0){
				//console.log(layer.get("title"));
				
				var viewResolution=window.map.getView().getResolution();
				//console.log(pixel);
				//console.log(evt.coordinate);
		
		var sidx=window.MAP_LAYER_NAMES.indexOf(title);
		
		var html_url = window.SOURCES[sidx].getGetFeatureInfoUrl(
	      evt.coordinate, viewResolution, 'EPSG:3857',
	      {'INFO_FORMAT': 'text/html'}
	  	);
/*		
		var json_url = window.SOURCES[sidx].getGetFeatureInfoUrl(
	      evt.coordinate, viewResolution, 'EPSG:3857',
	      {'INFO_FORMAT': 'application/json'}
	  	);
*/	    
//		var dummy1="http://geonode.asymptopia.org/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=geonode%3Aguyana_protected_areas&LAYERS=geonode%3Aguyana_protected_areas&INFO_FORMAT=text%2Fhtml&I=211&J=46&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=-6887893.4928338025%2C313086.06785608083%2C-6574807.424977721%2C626172.1357121628";
//		var dummy2="http://geonode.asymptopia.org/geoserver/wms?SERVICE=WMS&VERSION=1.3.0&REQUEST=GetFeatureInfo&FORMAT=image%2Fpng&TRANSPARENT=true&QUERY_LAYERS=geonode%3Aguyana_protected_areas&LAYERS=geonode%3Aguyana_protected_areas&INFO_FORMAT=application%2Fjson&I=211&J=46&WIDTH=256&HEIGHT=256&CRS=EPSG%3A3857&STYLES=&BBOX=-6887893.4928338025%2C313086.06785608083%2C-6574807.424977721%2C626172.1357121628";
		
		xhr=new_xhr();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					try{
						//alert(xhr.responseText);
						//console.log(xhr.responseText);
						//var pyld=JSON.parse(window.decode(xhr.responseText));
						//alert(pyld);
						if(xhr.responseText.length>10){
							me.xpopup.innerHTML=xhr.responseText;
							me.overlay.setPosition(evt.coordinate);
						}
					}
					catch(e){alert(e);}
				}
			}
		}
		xhr.open('Get',html_url,true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send("");
		
					}
		}
		else{
			me.overlay.setPosition(undefined);
			me.popup_closer.blur();
		}
	}
	
	return me;

}
