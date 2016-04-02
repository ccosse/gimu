var GIMU=function(map_div_id){
	me={};

	var BASE_LAYERS={};
	BASE_LAYERS['Satellite']=new ol.layer.Tile({minResolution:500,preload:14,opacity:0.5,title:'Satellite',source:new ol.source.MapQuest({layer:'sat'})});
	BASE_LAYERS['OpenStreetMap']=new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap',source:new ol.source.MapQuest({layer:'osm'})});
	BASE_LAYERS['OpenStreetMap2']=new ol.layer.Tile({title:'OpenStreetMap2',source:new ol.source.OSM()});

	me.gy_center=[-58.9,4.9];
	me.get_center=function(){return me.gy_center;}
	
	me.gy_bbox=[-61.5,1.1,-56.3,8.7];
	me.get_bbox=function(){return me.gy_bbox;}
	
	window.map = new ol.Map({
		layers: [BASE_LAYERS['OpenStreetMap2']],
		target: map_div_id,
		view: new ol.View({
			center:ol.proj.transform(me.gy_center, 'EPSG:4326', 'EPSG:3857'),
			zoom: 7
		}),
//		interactions:[],
		controls: ol.control.defaults({
			attributionOptions: /** @type {olx.control.AttributionOptions} */ ({
				collapsible: false
			})
		}).extend([
			new controlB(),
		])
	});

	return me;
}
