var is_base_by_name=function(layer_name){
	var is_base=false;
	for(var kidx=0;kidx<window.app.BASE_LAYERS['keys'].length;kidx++){
		var key=window.app.BASE_LAYERS['keys'][kidx];
		if(key==layer_name){is_base=true;}
	}
	console.log(layer_name+" is_base= "+is_base);
	return is_base;
}
var make_hr=function(idn){
	var hr=document.createElement("hr");
	hr.className="hr";
	if(idn!=null)hr.id=idn;
	return hr;
}
var make_vspace10=function(){
	var vspace10=document.createElement("div");
	vspace10.className="vspace10";
	return vspace10;
}
var make_hspace10=function(){
	var hspace10=document.createElement("div");
	hspace10.className="hspace10";
	return hspace10;
}
get_basename=function(path){
	return path.split('/').reverse()[0];
}
var make_random_color=function(){
	var rval="#";
	var chars=["0","1","5","6","A","B","C","D","E","F"];
	for(var dummy=0;dummy<6;dummy++){
		var cidx=parseInt(Math.random()*chars.length);
		try{rval+=chars[cidx];}
		catch(e){rval+="F";}
	}
	return rval;
}
var get_box_info=function(idn){
	try{
		var bcr=document.getElementById(idn).getBoundingClientRect();
		var msg=idn+": "+bcr.left+", "+bcr.top+", "+bcr.width+", "+bcr.height;
		console.log(msg);
		return bcr;
	}
	catch(e){
		console.log(e);
	}
}
var decode=function(str){
	var div = document.createElement('div');
	div.innerHTML = str;
	var decoded=str;
	try{
		decoded = div.firstChild.nodeValue;
	}
	catch(e){;}
	return decoded;
}
var new_xhr=function(){
	var xhr=null;
	try{xhr=new ActiveXObject('Msxml2.XMLHTTP');}
	catch(e){
		try{xhr=new ActiveXObject('Microsoft.XMLHTTP');}
		catch(e2){
			try{xhr=new XMLHttpRequest();}
			catch(e3){xhr=null;}
		}
	}
	return xhr;
}
var compute_resolution=function(bbox,is3857,W,H){
	
	var xmax=bbox[2];
	var xmin=bbox[0];
	var ymin=bbox[1];
	var ymax=bbox[3];
	
	var p1,p2;
	if(is3857){
		p2=[xmax,ymax];
		p1=[xmin,ymin];
	}
	else{
		p2=ol.proj.transform([xmax,ymax],"EPSG:4326","EPSG:3857");
		p1=ol.proj.transform([xmin,ymin],"EPSG:4326","EPSG:3857");
	}
	
	console.log(p1+", "+p2);
	
	var dx=p2[0]-p1[0];
	var dy=p2[1]-p1[1];
	
	
	var AR_win=W/H;
	var AR_shp=dx/dy;
	
	var res;
	if(AR_win>1){
		if(AR_shp<1){
			res=dy/H;
		}
		else if(AR_shp>AR_win){
			res=dx/W;
		}
		else{
			res=dy/H;
		}
	}
	else{//AR_win<1
		if(AR_shp>1){
			res=dx/W;
		}
		else if(AR_shp<AR_win){
			res=dy/H;
		}
		else{
			res=dx/W;
		}
	}
	console.log("res="+res);
	return res;
}
