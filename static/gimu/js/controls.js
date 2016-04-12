var ControlPanel=function(){
	
	//takes no div id, just assumes existence of #control_panel
	var me={};
	
	me.take_pyld=function(pyld){
		
		$("#control_panel").append(make_hr());

		var opts={'is_base':true,'parent_id':'control_panel','id':"Satellite",'className':'roll_up_div','roll_up_class':'rollup','roll_up_name':"Base Layers",'roll_up_icon_src':"./static/gimu/img/arrow.png",};
		me.layer_block(["Satellite","OpenStreetMap","OpenStreetMap2"],opts);
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
		
		for(var kidx=0;kidx<pyld.categories.length;kidx++){
			
			var category=pyld.categories[kidx];
			console.log(category);
			window.app.CATEGORIES={'keys':[],};
			window.app.CATEGORIES['keys'].push(category);
			window.app.CATEGORIES[category]={'keys':[],};
			for(var lidx=0;lidx<pyld[category].length;lidx++){
				layer_name=pyld[category][lidx]['layer_name'];
				window.app.CATEGORIES[category]['keys'].push(layer_name);
				window.app.CATEGORIES[category][layer_name]={
					'api':'ol.layer.Vector',
					'layer_typename':pyld[category][lidx]['layer_typename'],
					'layer_name':layer_name,
					'source':'WMS',
					'feature_names':[],//just string names
					'features':{},
					'features_off':[],//actual feature objs removed from the source
					'style':null,
					'colors':{},
					'toggle':false,
					'type':'Polygon',
				};
			
			}
			
			//ADD TO CONTROL PANEL
			me.category_block(category);
			$("#control_panel").append(make_hr());
			
		}
		
	}
	me.category_block=function(category){
		opts={
			'is_base':false,
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

		var layer_names=window.app.CATEGORIES[category]['keys'];
		for(var lidx=0;lidx<layer_names.length;lidx++){
			
			var r=layers_table.insertRow(-1);
			r.className="layer_row";
			var c=r.insertCell(-1);
			
			
			//HACK HACK HACK!!!
			if(opts['is_base'])
				var tt_div=me.make_feature_row(opts['is_base'],feature_names[lidx],feature_names[lidx]);
			else
				var tt_div=me.make_feature_row(opts['is_base'],category,layer_names[lidx]);
			
			c.appendChild(tt_div);
		}
		
	}
	me.layer_block=function(layer_name,opts){
		
		var rollup=new RollUpDiv(opts);
		
		var cat_features_div=document.createElement("div");
		
		var solid_id=opts['roll_up_name'];//handles up to 10 spaces!
		for(var dummy=0;dummy<10;dummy++)
			solid_id=solid_id.replace(" ","ZZZ");//can't be _ b/c splitting on _ already

		cat_features_div.id=solid_id+"_cat_features_div";
		cat_features_div.className="cat_features_div";
		
		var features_table=document.createElement("table");
		features_table.className="features_table";
		
		cat_features_div.appendChild(features_table);
		rollup.rollup.appendChild(cat_features_div);
		
		var feature_names=[];
		
		var is_base=is_base_by_name(layer_name);
		if(opts['is_base']==true){
			console.log("is a base layer");
			feature_names=layer_name;
		}
		else{
			console.log("not a base layer");
			feature_names=window.app.LAYERS[layer_name]['feature_names'];
		}
		for(var lidx=0;lidx<feature_names.length;lidx++){
			
			var r=features_table.insertRow(-1);
			r.className="feature_row";
			var c=r.insertCell(-1);
			
			
			//HACK HACK HACK!!!
			if(opts['is_base'])
				var tt_div=me.make_feature_row(opts['is_base'],feature_names[lidx],feature_names[lidx]);
			else
				var tt_div=me.make_feature_row(opts['is_base'],layer_name,feature_names[lidx]);
			
			c.appendChild(tt_div);
		}
		
	}
	me.make_feature_row=function(is_base,layer_name,feature_name){
			
			console.log("make_feature_row: "+is_base+" "+layer_name+" "+feature_name);
			
			var tt_div=document.createElement("div");
//			tt_div.className="tt_div";
			
			var tt=document.createElement("table");
			tt.className="tt";
			var ttr=tt.insertRow(-1);
			//var ttc=ttr.insertCell(-1);
			
			var feature_label=document.createElement("div");
			feature_label.innerHTML=feature_name;
			feature_label.className="feature_label";
			var id=feature_name+parseInt(1E9*Math.random()).toString();
			feature_label.id=id;
			//console.log(id);
			//cat_features_div.appendChild(feature_label);
			var ttc=ttr.insertCell(-1);
			ttc.className="feature_cell";
			ttc.appendChild(feature_label);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn="toggle_"+layer_name+"_"+feature_name;//+"_"+parseInt(1E9*Math.random());
			var img=new Image();
			img.id=idn;
			img.className="icon";
			
			var toggle=false;
			if(is_base)toggle=window.app.BASE_LAYERS[layer_name]['toggle'];
			else toggle=window.app.CATEGORIES[layer_name][feature_name]['toggle'];
			console.log(layer_name+"."+feature_name+" "+toggle.toString());
			if(toggle)
				img.src="/static/gimu/img/checkbox-1.png";
			else
				img.src="/static/gimu/img/checkbox-0.png";
			
			ttc.appendChild(img);
			if(true)
				img.addEventListener("click",me.layer_checkboxCB,false);
			else
				img.addEventListener("click",me.feature_checkboxCB,false);
			
			var ttc=ttr.insertCell(-1);
			ttc.className="icon_cell";
			var idn="hamburger_"+layer_name+"_"+feature_name;//_"+parseInt(1E9*Math.random());
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
		
		var img=e.target;
		var button_type=e.target.id.split("_",1)[0];
		console.log("button_type="+button_type);
		var layer_name=e.target.id.split("_",2)[1];
		layer_name=layer_name.replace("ZZZ"," ");
		console.log("layer_name="+layer_name);
		var feature_name=e.target.id.split("_",3)[2];
		console.log("feature_name="+feature_name);
		
		if(get_basename(img.src)=="checkbox-0.png"){
			img.src="/static/gimu/img/checkbox-1.png";
			
			if(is_base_by_name(layer_name)){
				window.map.getLayers().insertAt(0, window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=true;
			}
			else{
				window.map.addLayer(window.app.LAYERS[layer_name]['layer']);
				window.app.LAYERS[layer_name]['toggle']=true;
			}
		}
		else{
			img.src="/static/gimu/img/checkbox-0.png";
			
			if(is_base_by_name(layer_name)){
				window.map.removeLayer(window.app.BASE_LAYERS[layer_name]['layer']);
				window.app.BASE_LAYERS[layer_name]['toggle']=false;
			}
			else{
				window.map.removeLayer(window.app.LAYERS[layer_name]['layer']);
				window.app.LAYERS[layer_name]['toggle']=false;
			}
			
		}
	}
	me.rangeCB=function(e){
		console.log("rangeCB: "+e.target.id);
		
		var split_id=e.target.id.split("_");
		var layer_name=split_id[0].replace("ZZZ"," ");
		var attribute_name=split_id[1];
		
		console.log(layer_name+" "+attribute_name+" "+e.target.value);
		
		range=document.getElementById(e.target.id);
		if(is_base_by_name(layer_name)){
			console.log(window.app.BASE_LAYERS[layer_name]['layer'].getKeys());
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.BASE_LAYERS[layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.BASE_LAYERS['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
		else{
			console.log(window.app.LAYERS[layer_name]['layer'].getKeys());
			console.log("setting "+attribute_name+" to "+parseFloat(range.value)/100.);
			window.app.LAYERS[layer_name]['layer'].set(attribute_name,parseFloat(range.value)/100.);
			cmd="window.app.LAYERS['"+layer_name+"']['layer'].set"+attribute_name+"("+parseFloat(range.value)/100.+")";
			console.log(cmd);
			var dummy=eval(cmd);
		}
	}
	me.popoutCB = function(e) {
		
		console.log(e.target.id);
		
		var img=e.target;
		var button_type=e.target.id.split("_",1)[0];
		console.log("button_type="+button_type);
		var layer_name=e.target.id.split("_",2)[1];
		layer_name=layer_name.replace("ZZZ"," ");
		console.log("layer_name="+layer_name);
		var feature_name=e.target.id.split("_",3)[2];
		console.log("feature_name="+feature_name);

		console.log(layer_name);
		
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
			w.id=layer_name+"_"+attribute_names[aidx];
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
				var val=window.app.CATEGORIES[layer_name]['layer'].getOpacity()*100;
				console.log(val);
				var cmd="window.app.LAYERS[layer_name]['layer'].get"+attribute_names[aidx]+"()*100";
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
	
	me.take_pyld_OFF=function(pyld){
		console.log("ControlPanel.take_pyld");
		console.log(pyld);
	
		//Hard-coded layers (for now):
		for(var kidx=0;kidx<pyld.categories.length;kidx++){
		
		   var hr=document.createElement("hr");
		   hr.className="hr";
		   $("#control_panel").append(hr);
		
		   var category=pyld.categories[kidx];
		
		   var h=document.createElement("div");
		   h.className='layer_category';
		   h.id=parseInt(100000*Math.random());
		
		   var t=document.createElement("table");
		   t.style.width="100%";
		   var tr=t.insertRow(-1);
		   var td;
		
		   td=tr.insertCell(-1);
		   td.className="arrow_cell";
		   td=tr.insertCell(-1);
		   td.className="arrow_cell";
		
		   td=tr.insertCell(-1);
		   td.className="category_cell";
		   var label=document.createElement("div");
		   label.className="label";
		   label.innerHTML=category;
		   label.draggable=true;
		   td.appendChild(label);
		
		   td=tr.insertCell(-1);
		   td.className="arrow_cell";
		   var arrow=new Image();
		   arrow.id=h.id+"_arrow";
		   arrow.className="arrow";
		   arrow.src="/static/gimu/img/arrow.png";
		   td.appendChild(arrow);
		
		   td=tr.insertCell(-1);
		   td.className="arrow_cell";
		
		   h.appendChild(t);
		
		   $("#control_panel").append(h);
		
		   var cat_lyrs_div=document.createElement("div");
		   cat_lyrs_div.id=h.id+"_cat_lyrs_div";
		   cat_lyrs_div.className="cat_lyrs_div";
		
		   var lyrs_table=document.createElement("table");
		   lyrs_table.className="lyrs_table";
		
		   for(var lidx=0;lidx<pyld[category].length;lidx++){
		       var layer_label=document.createElement("div");
		       layer_label.innerHTML=pyld[category][lidx]['layer_typename'];
		       layer_label.className="layer_label";
		       var id=parseInt(1E9*Math.random()).toString();
		       layer_label.id=id;
		       console.log(id);
		       //cat_lyrs_div.appendChild(layer_label);
		       var r=lyrs_table.insertRow(-1);
		       r.className="lyr_row";
		       
		       td=r.insertCell(-1);
		       td.className="arrow_cell";
		       td=r.insertCell(-1);
		       td.className="arrow_cell";
		
		       var c=r.insertCell(-1);
		       c.className="lyr_cell";
		       c.appendChild(layer_label);
		
		       td=r.insertCell(-1);
		       td.className="arrow_cell";
		
		       td=r.insertCell(-1);
		       td.className="arrow_cell";
		
		   }
		   cat_lyrs_div.appendChild(lyrs_table);
		   $("#control_panel").append(cat_lyrs_div);
		
		}
	
		var hr=document.createElement("hr");
		hr.className="hr";
		$("#control_panel").append(hr);
		
		for(var dummy=0;dummy<$(".arrow").length;dummy++){
			$($(".arrow")[dummy]).click(function(e){
				$(e.target).toggleClass("up");
				$("#"+e.target.id.split("_")[0]+"_cat_lyrs_div").animate({height:'toggle'},300,function(){});
			});
		}
		
		for(var dummy=0;dummy<$(".layer_label").length;dummy++){
			$($(".layer_label")[dummy]).mouseover(function(e){
				$(e.target).toggleClass("hilighted");
			});
			$($(".layer_label")[dummy]).mouseout(function(e){
				$(e.target).toggleClass("hilighted");
			});
		}

	}
	

	return me;

}
