var layers={
	'keys':['Base Layers','National Data','Lands and Surveys','Environmental','Protected Areas'],
	'Base Layers':['Satellite','OpenStreetMap','OpenStreetMap2'],
	'National Data':['Guyana Rivers','Guyana Creeks','Guyana Roads','Guyana Towns','Guyana Villages'],
	'Lands and Surveys':['Admin Borders','Local Government',],
	'Environmental':['Forest Increas','2016 Watershed',],
	'Protected Areas':['Kaieteur','Shell Beach','Kanuku Mountains','Konashens','Iwokrama'],
};

var ControlPanel=function(){
		
	//takes no div id, just assumes existence of #control_panel
	var me={};

	var closeB=new Image();
	closeB.src="./static/gimu/img/close.png";
	closeB.id="closeB";		
	
	var close_div=document.createElement("div");
	close_div.className="close_div";
	close_div.appendChild(closeB);
	
	var span_div=document.createElement("div");
	span_div.className="right-twofifty";
	span_div.appendChild(close_div);
	
	$("#control_panel").append(span_div);

	
	
	var category=layers.keys[kidx];
	
	var h=document.createElement("div");
	h.className='layer_category';
	h.id=parseInt(100000*Math.random());
	
	var t=document.createElement("table");
	t.style.width="100%";

	var tr=t.insertRow(-1);
	var td;
	
	h.appendChild(t);
	
	$("#control_panel").append(h);
//	$(".mode_toggleB").bootstrapSwitch();

	
	//Callbacks:
	$("#closeB").click(function(){
		$(".control_panel").toggleClass("show");
	});

	$(".close_div").mouseover(function(){
		$(".close_div").toggleClass("hilighted");
	});
	$(".close_div").mouseout(function(){
		$(".close_div").toggleClass("hilighted");
	});
	


	//Hard-coded layers (for now):
	for(var kidx=0;kidx<layers.keys.length;kidx++){
		
		var hr=document.createElement("hr");
		hr.className="hr";
		$("#control_panel").append(hr);
		
		var category=layers.keys[kidx];
		
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
		td.appendChild(label);
		
		td=tr.insertCell(-1);
		td.className="arrow_cell";
		var arrow=new Image();
		arrow.id=h.id+"_arrow";
		arrow.className="arrow";
		arrow.src="./static/gimu/img/arrow.png";
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
		
		for(var lidx=0;lidx<layers[category].length;lidx++){
			var layer_label=document.createElement("div");
			layer_label.innerHTML=layers[category][lidx];
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
	
	return me;

}
var controlB=function(opt_options) {
	
	//http://openlayers.org/en/v3.14.0/examples/custom-controls.html
	
	var options = opt_options || {};
	var button = document.createElement('button');
	button.id="gearB";
	button.className="controlB";
	button.innerHTML = '<img src="./static/gimu/img/gear-white.png"/>';
	button.title="Configuration";
	
	var controlCB = function() {
		$(".control_panel").toggleClass("show");
		console.log("controlCB show off");
	};
	
	button.addEventListener('click', controlCB, false);
	button.addEventListener('touchstart', controlCB, false);
	
	var element = document.createElement('div');
	element.className = 'controlB ol-unselectable ol-control';
	element.appendChild(button);
	
	ol.control.Control.call(this, {
		element: element,
		target: options.target
	});
};
ol.inherits(controlB, ol.control.Control);
