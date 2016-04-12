var GIMU=function(){
	var me={};
	
	me.gy_center=[-58.9,4.9];
	me.get_center=function(){
		console.log("get_center: "+me.gy_center);
		return me.gy_center;
	}
	
	me.gy_bbox=[-61.5,1.1,-56.3,8.7];
	me.get_bbox=function(){return me.gy_bbox;}

	me.BASE_ENABLED=true;
	BASE_SOURCES={
		'Satellite':new ol.source.MapQuest({layer:'sat'}),
		'OpenStreetMap':new ol.source.MapQuest({layer:'osm'}),
		'OpenStreetMap2':new ol.source.OSM(),
	};
	me.BASE_LAYERS={
		'keys':['Satellite','OpenStreetMap','OpenStreetMap2'],
		'Satellite':{
			'type':'tile',
			'api':'ol.layer.Tile',
			'layer':new ol.layer.Tile({minResolution:500,preload:14,opacity:1.0,title:'Satellite',source:BASE_SOURCES['Satellite']}),
			'source':BASE_SOURCES['Satellite'],
			'feature_names':[],
			'style':null,
			'colors':{},
			'toggle':false,
		},
		'OpenStreetMap':{
			'type':'tile',
			'api':'ol.layer.Tile',
			'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap',source:BASE_SOURCES['OpenStreetMap']}),
			'source':BASE_SOURCES['OpenStreetMap'],
			'feature_names':[],
			'style':null,
			'colors':{},
			'toggle':false,
		},
		'OpenStreetMap2':{
			'type':'tile',
			'api':'ol.layer.Tile',
			'layer':new ol.layer.Tile({preload:14,opacity:1.0,title:'OpenStreetMap2',source:BASE_SOURCES['OpenStreetMap2']}),
			'source':BASE_SOURCES['OpenStreetMap2'],
			'feature_names':[],
			'style':null,
			'colors':{},
			'toggle':true,
		},
	};
	
	me.CATEGORIES={'keys':[],}
		
	me.request_data=function(){
		
		if(me.BASE_ENABLED){
			console.log("adding base layers");
			var keys=me.BASE_LAYERS['keys'];
			for(var kidx=0;kidx<keys.length;kidx++){
				var key=keys[kidx];
				if(me.BASE_LAYERS[key]['toggle']==true)
					window.map.getLayers().insertAt(0, me.BASE_LAYERS[key]['layer']);
			}
			console.log("BASE_LAYERS Loaded");
		}
		
		
		xhr=new_xhr();
		xhr.onreadystatechange=function(){
			if(xhr.readyState==4){
				if(xhr.status==200){
					try{
						//console.log(xhr.responseText);
						var pyld=JSON.parse(decode(xhr.responseText));
						window.control_panel.take_pyld(pyld);
					}catch(e){
						console.log(e);
					}
				}
			}
		}	
		xhr.open('Get',"/frontpage?get_layers",true);
		xhr.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		xhr.send("");
	}	
		
	return me;
}
