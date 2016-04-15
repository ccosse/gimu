var ControlPanel=function(){
	
	//takes no div id, just assumes existence of #control_panel
	var me={};
	
	me.take_pyld=function(pyld){
		
		$("#control_panel").append(make_hr());

		var opts={'is_base':true,'parent_id':'control_panel','id':"Satellite",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"Base Layers",'roll_up_icon_src':"./static/gimu/img/arrow.png",};
//		me.layer_block(["Satellite","OpenStreetMap","OpenStreetMap2"],opts);
		me.category_block("Base Layers");
		$("#control_panel").append(make_hr());
/*		
		var opts={'parent_id':'control_panel','id':"OpenStreetMap",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"OpenStreetMap",'roll_up_icon_src':"./static/gimu/img/arrow.png",};
		me.layer_block(["OpenStreetMap"],opts);
		$("#control_panel").append(make_hr());
		
		var opts={'parent_id':'control_panel','id':"OpenStreetMap2",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"OpenStreetMap2",'roll_up_icon_src':"./static/gimu/img/arrow.png",};
		me.layer_block(["OpenStreetMap2"],opts);
		$("#control_panel").append(make_hr("hr3"));
*/
		console.log(pyld);
		var HOSTNAME="http://data.gim.gov.gy";
		window.app.CATEGORIES={'keys':[],};
			
		for(var kidx=0;kidx<pyld.categories.length;kidx++){
			
			var category=pyld.categories[kidx];
			console.log("category: "+category);
			window.app.CATEGORIES['keys'].push(category);
			window.app.CATEGORIES[category]={'keys':[],};
			
			for(var lidx=0;lidx<pyld[category].length;lidx++){
				
				layer_name=pyld[category][lidx]['layer_name'];
				window.app.CATEGORIES[category]['keys'].push(layer_name);
				
				window.MAP_LAYER_NAMES.push(layer_name);
				
				var layer_source=new ol.source.TileWMS({
									url: HOSTNAME+'/geoserver/wms',
									params: {'LAYERS': layer_name},
									serverType: 'geoserver',
									crossOrigin: ''
								});
				
				window.SOURCES.push(layer_source);
				
				window.app.CATEGORIES[category][layer_name]={
					'api':'ol.layer.Vector',
					'layer_typename':pyld[category][lidx]['layer_typename'],
					'layer_name':layer_name,
					'layer':new ol.layer.Tile({
								title: layer_name,
								source: layer_source
							}),
					'source':'WMS',
					'feature_names':[],//just string names
					'features':{},
					'features_off':[],//actual feature objs removed from the source
					'style':null,
					'colors':{},
					'toggle':false,
					'type':'Polygon',
				};
				console.log(window.app.CATEGORIES[category][layer_name]);
			}
			
			me.category_block(category);
			$("#control_panel").append(make_hr());
			
		}
		
	}
	me.category_block=function(category){
		
		var is_base=false;
		if(category=="Base Layers")is_base=true;
		
		opts={
			'is_base':is_base,
			'parent_id':'control_panel',
			'id':category,
			'className':'roll_up_div',
			'roll_up_class':'rollup',
			'roll_up_name':category,
			'roll_up_icon_src':"/static/gimu/img/arrow.png",
		};
		
		var rollup=new RollUpDiv(opts);
		
		var cat_layers_div=document.createElement("div");
		
		var solid_id=opts['roll_up_name'];//handles up to 10 spaces!
		for(var dummy=0;dummy<10;dummy++)
			solid_id=solid_id.replace(" ","ZZZ");//can't be _ b/c splitting on _ already

		cat_layers_div.id=solid_id+"_cat_layers_div";
		cat_layers_div.className="cat_layers_div";
		
		var layers_table=document.createElement("table");
		layers_table.className="layers_table";
		
		cat_layers_div.appendChild(layers_table);
		rollup.rollup.appendChild(cat_layers_div);

		var layer_names=null;
		if(category=="Base Layers")
			layer_names=window.app.BASE_LAYERS['keys'];
		else
			layer_names=window.app.CATEGORIES[category]['keys'];
		
		for(var lidx=0;lidx<layer_names.length;lidx++){
			
			var r=layers_table.insertRow(-1);
			r.className="layer_row";
			var c=r.insertCell(-1);
			
			if(is_base)
				var tt_div=me.make_layer_row(is_base,category,layer_names[lidx]);
			else
				var tt_div=me.make_layer_row(is_base,category,layer_names[lidx]);
			
			c.appendChild(tt_div);
		}
		
	}
	me.make_layer_row=function(is_base,category,layer_name){
			
			console.log("make_layer_row: "+is_base+" "+category+" "+layer_name);
			
			var tt_div=document.createElement("div");
			
			var tt=document.createElement("table");
			tt.className="tt";
			var ttr=tt.insertRow(-1);
			
			var layer_label=document.createElement("div");
			layer_label.innerHTML=layer_name;
			layer_label.className="layer_label";
			var id=layer_name+parseInt(1E9*Math.random()).toString();
			layer_label.id=id;
			var ttc=ttr.insertCell(-1);
			ttc.className="layer_cell";
			ttc.appendChild(layer_label);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn="toggle_"+category+"_"+layer_name;//+"_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			
			var toggle=false;
			if(is_base)toggle=window.app.BASE_LAYERS[layer_name]['toggle'];
			else toggle=window.app.CATEGORIES[category][layer_name]['toggle'];
			console.log(category+"."+layer_name+" "+toggle.toString());
			if(toggle)
				img.src="/static/gimu/img/checkbox-1.png";
			else
				img.src="/static/gimu/img/checkbox-0.png";
			
			ttc.appendChild(img);
			img.addEventListener("click",me.layer_checkboxCB,false);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn="hamburger_"+category+"_"+layer_name;//_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			img.src="/static/gimu/img/flaticon/interface-1.png";
			ttc.appendChild(img);
			img.addEventListener("click",me.popoutCB,false);
			
			tt_div.appendChild(tt);
			return tt_div;
	}
	me.layer_checkboxCB=function(e){
		
		console.log("controls.js: layer_checkboxCB "+e.target.id);
		console.log(window.app.CATEGORIES["National Data"]);
		
		var img=e.target;
		var button_type=e.target.id.split("_",1)[0];
		console.log("button_type="+button_type);
		var category_name=e.target.id.split("_",2)[1];
		category_name=category_name.replace("ZZZ"," ");
		console.log("category_name="+category_name);
		
		var layer_start=e.target.id.split("_",3)[2];
		var start_idx=e.target.id.indexOf(layer_start);
		var end_idx=e.target.id.length;
		console.log(start_idx+", "+end_idx);
		var layer_name=e.target.id.slice(start_idx,end_idx);
		console.log("layer_name="+layer_name);
		
		if(get_basename(img.src)=="checkbox-0.png"){
			img.src="/static/gimu/img/checkbox-1.png";
			
			if(is_base_by_name(layer_name)){
				window.map.getLayers().insertAt(0, window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=true;
			}
			else{
				console.log("adding layer: "+category_name+"."+layer_name);
				console.log(window.app.CATEGORIES[category_name]);
				window.map.addLayer(window.app.CATEGORIES[category_name][layer_name]['layer']);
				window.app.CATEGORIES[category_name][layer_name]['toggle']=true;
			}
		}
		else{
			img.src="/static/gimu/img/checkbox-0.png";
			
			if(is_base_by_name(layer_name)){
				window.map.removeLayer(window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=false;
			}
			else{
				window.map.removeLayer(window.app.CATEGORIES[category_name][layer_name]['layer']);
				window.app.CATEGORIES[category_name][layer_name]['toggle']=false;
			}
			
		}
	}
	me.rangeCB=function(e){
		console.log("rangeCB: "+e.target.id);
		
		var img=e.target;
		var attribute_name=e.target.id.split("_",1)[0];
		var category_name=e.target.id.split("_",2)[1];
		category_name=category_name.replace("ZZZ"," ");
		console.log("category_name="+category_name);
		
		var layer_start=e.target.id.split("_",3)[2];
		var start_idx=e.target.id.indexOf(layer_start);
		var end_idx=e.target.id.length;
		console.log(start_idx+", "+end_idx);
		var layer_name=e.target.id.slice(start_idx,end_idx);
		console.log("layer_name="+layer_name);
		
		
		range=document.getElementById(e.target.id);
		if(is_base_by_name(layer_name)){
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.BASE_LAYERS[layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.BASE_LAYERS['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
		else{
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.CATEGORIES[category_name][layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.CATEGORIES['"+category_name+"']['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
	}
	me.popoutCB = function(e) {
		
		console.log(e.target.id);
		
		var img=e.target;
		var button_type=e.target.id.split("_",1)[0];
		console.log("button_type="+button_type);
		var category_name=e.target.id.split("_",2)[1];
		category_name=category_name.replace("ZZZ"," ");
		console.log("category_name="+category_name);
		
		var layer_start=e.target.id.split("_",3)[2];
		var start_idx=e.target.id.indexOf(layer_start);
		var end_idx=e.target.id.length;
		console.log(start_idx+", "+end_idx);
		var layer_name=e.target.id.slice(start_idx,end_idx);
		console.log("layer_name="+layer_name);

		$(".popout_panel").css({"top":(e.clientY-100)+"px"});
		$(".popout_panel").html("");
		$(".popout_panel").html(layer_name);
		
		var t=document.createElement("table");
		t.align="center";
		
		var attribute_names=['Opacity'];//,'Brightness','Saturation','Contrast','Hue'
		for(var aidx=0;aidx<attribute_names.length;aidx++){
			var r=t.insertRow(-1);
			var c=r.insertCell(-1);
			var label=document.createElement("div");
			label.style.color="white";
			label.innerHTML=attribute_names[aidx];
			label.className="popout_label";
			c.appendChild(label);

			var w=document.createElement("input");
			w.type="range";
			w.id=attribute_names[aidx]+"_"+category_name+"_"+layer_name;
			w.setAttribute("min",0);
			w.setAttribute("max",100);
			console.log("calling is_base_by_name with "+layer_name);
			if(is_base_by_name(layer_name)){
				var val=window.app.BASE_LAYERS[layer_name]['layer'].getOpacity()*100;
				console.log(val);
				var cmd="window.app.BASE_LAYERS[layer_name]['layer'].get"+attribute_names[aidx]+"()*100";
				console.log(cmd);
				val=eval(cmd);
				console.log(val);
				w.setAttribute("value",val);
			}
			else{
				var val=window.app.CATEGORIES[category_name][layer_name]['layer'].getOpacity()*100;
				console.log(val);
				var cmd="window.app.CATEGORIES['"+category_name+"']['"+layer_name+"']['layer'].get"+attribute_names[aidx]+"()*100";
				console.log(cmd);
				val=eval(cmd);
				console.log(val);
				w.setAttribute("value",val);
			}
			w.style.width="100px";
			c=r.insertCell(-1);
			c.appendChild(w);
			w.addEventListener("change",me.rangeCB,false);
		}
		$("#popout_panel").append(t);
		$(".popout_panel").toggleClass("show");
	};
	
	return me;

}
