
// http://stackoverflow.com/questions/2644299/jquery-removeclass-wildcard
$.fn.removeClassRegex = function(regex) {
  return $(this).removeClass(function(index, classes) {
    return classes.split(/\s+/).filter(function(c) {
      return regex.test(c);
    }).join(' ');
  });
};

$.fn.protoSetSlider = function(inorout,direction) {
	return this.removeClassRegex(/^proto-slide-/).addClass("proto-slide-"+inorout+"-"+direction);
};

$.fn.getProtoAttribute = function(reg) {
	var proto_attr = false;
	// I don't think I did this right... but it worked...
	$.each(this[0].attributes, function() {
		if(this.name.search(reg)!=-1) {
			proto_attr = {
				n:this.name,
				v:this.value
			};
			return false;
		}
	});
	return proto_attr;
};

function protoMakeSliderData(data){
	data = data.split(" ");
	var slider = $(data[0]);
	var inorout = data[1];
	var direction = data[2];

	var result = /proto\-slide\-(\w+)\-(\w+)/.exec(slider.attr("class"));
	var result2 = /proto\-set\-(\w+)/.exec(slider.attr("class"));
	
	if(inorout == "toggle" || inorout == undefined) {
		inorout = result===null?
			(result2===null?"out":"in"):
			(result[1]=="out"?"in":"out");
	}
	if(direction == undefined) {
		direction = result===null||result[2]=="origin"?"right":result[2];
	}

	slider.protoSetSlider(inorout,direction);
}

function protoSliderActivator(){
	var attr = $(this).getProtoAttribute(/^proto\-slide$|\-/);
	if(attr!==false) {
		var data = attr.v.split(",");
		for(var i in data) {
			protoMakeSliderData(data[i]);
		}
	} else {
		console.log("I haven't written this yet.")
	}
}

$(function(){
	$("body").on("click","[data-proto-slide]",protoSliderActivator);
	$("body").on("click","[data-proto-slide-click]",protoSliderActivator);
	$("body").on("mouseenter","[data-proto-slide-mouseenter]",protoSliderActivator);
	$("body").on("mouseleave","[data-proto-slide-mouseleave]",protoSliderActivator);
	$("body").on("mouseenter mouseleave","[data-proto-slide-hover]",protoSliderActivator);
})