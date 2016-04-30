/*
BaseProtoType v0.2
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
0.2 - Added asides and figures
0.1 - Initial Release
*/

(function(w){

	var baseProto = {
		// debugMode should be set to true for tabs and rolloverInfo
		// false will allow you to use proto as if it was just a good framework
		debugMode : true,

		originalHash : location.hash,
		currentSection : null,
		navHistory : [],
		sections : []
	};

	baseProto.makeTabList = function() {
		// Search through the sections and pull out all the ids for links and tabs
		baseProto.sections = [];
		$("section").each(function(index){
			var sid = $(this).attr("id");
			$(this).addClass(sid).removeAttr("id");
			baseProto.sections.push(sid);
		});
	};
	baseProto.writeTabList = function() {
		var $el = $("<ul>");
		for(var i in baseProto.sections) {
			sid = baseProto.sections[i];
			$el.append($("<li>").addClass(sid).append("<a href='#"+sid+"'>"+sid+"</a>"));
		}
		$("body")
			.prepend($("<nav class='tabs proto-nav margin-vm'>").append($el))
			.append("<div class='proto-info'>");
	};
	baseProto.setInitialActive = function() {
		// check if the hash was empty
		var h = baseProto.originalHash!=="" ? baseProto.originalHash.substr(1) : "";
		// if the hash was not one of the sections, the active one is the first
		if($.inArray(h,baseProto.sections)===-1) {
			h = baseProto.sections[0];
		}
		baseProto.setActive(h);
	};
	baseProto.setActive = function(str) {
		baseProto.currentSection = str;
		$(".active").removeClass("active");
		$("."+str).addClass("active");
		location.hash = str;
	};

	baseProto.setSection = function(str) {
		if($("."+str).hasClass("active")) return;
		if(str == "back") {
			if(baseProto.navHistory.length===0) {
				str = baseProto.sections[0];
			} else {
				str = baseProto.navHistory.pop();
			}
		} else {
			if(baseProto.navHistory.length>20) baseProto.navHistory.shift();
			baseProto.navHistory.push(baseProto.currentSection);
		}
		// baseProto.removePops();
		baseProto.setActive(str);
		return false;
	};
	baseProto.setPopup = function(str) {
		$("section."+baseProto.currentSection).append(
			baseProto.setEvents($("<aside class='"+str+"'>").html($("#"+str).html()))
		);
		location.hash = baseProto.currentSection;
		return false;
	};
	baseProto.setPopdown = function() {
		$(this).parents("aside").remove();
		location.hash = baseProto.currentSection;
		return false;
	};
	baseProto.removePops = function() {
		$("aside[class]").remove();
	};
	baseProto.init = function() {
		baseProto.makeTabList();
		if(baseProto.debugMode!==false){
			baseProto.writeTabList();
		}
		baseProto.setInitialActive();

		baseProto.setDebug();
		baseProto.setFigures();
		baseProto.setEvents($("section"));
	};
	baseProto.infoMouseover = function() {
		var info = $.parseJSON($(this)
			.data("info")
			.replace(/([\{|\,}])\s*([a-zA-Z]+)\:/g, '$1 "$2":')
			.replace(/\'/g, '"'));
		var str = "<dl>";
		for(var i in info) {
			var out = "";
			if(i=="href") {
				out = "<a href='"+info[i]+"'>"+info[i]+"</a>";
			}
			else if(i=="src") {
				out = info[i]+"<br><img src='"+info[i]+"'>";
			}
			else {
				out = info[i];
			}
			str += "<dt>"+i+"</dt><dd>"+out+"</dd>";
		}
		$(".proto-info").addClass("active").html(str+"</dl>")
		.prepend(
			$("<input type='button' class='btn btn-small warning pull-right' value='&times;'>")
				.on("click",function(){$(".proto-info").removeClass("active");})
			);
	};
	baseProto.setDebug = function() {
		if(baseProto.debugMode) {
			$(".proto-nav")
				.on("click","a",function(){
					return baseProto.setSection($(this).attr("href").substr(1)); });
			$("section")
				.on("mouseover","[data-info]",baseProto.infoMouseover);
		}
	};
	baseProto.setFigures = function() {
		$("figure[class]").each(function(){
			$(this).html($("#"+$(this).attr("class")).html());
		});
	};
	baseProto.setEvents = function(e) {
		e
			.on("click",".proto-jump",function(){
				return baseProto.setSection($(this).attr("href").substr(1)); })
			.on("click",".proto-popup",function(){
				return baseProto.setPopup($(this).attr("href").substr(1)); })
			.on("click",".proto-popdown",baseProto.setPopdown);
		return e;
	};

	w.baseProto = baseProto;

	$(function(){ baseProto.init(); });
})(window);