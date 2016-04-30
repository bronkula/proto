/*
BaseProtoType v0.3
Developed by Hamilton Cline
hamdiggy@gmail.com
http://www.hamiltondraws.com

Changelog
0.4 - Added implementation of browser history
    - Fixed accordion implementation
0.3 - Updated to newer version of HameBase
    - Improved popups with transitions
    - Added centered navbar buttons
    - Added Mustache Templates for most elements
    - Mustache Templates can be given default values
    - Added accordion lists
0.2 - Added asides and figures
0.1 - Initial Release
*/

(function(w){

    var baseProto = {
        // debugMode should be set to true for tabs and rolloverInfo
        // false will allow you to use proto as if it was just a good framework
        debugMode : true,
        // debugMode : false,

        originalHash : location.hash,
        updateUrl: false,
        stateObj:{title:null,url:location.href},
        currentSection : null,
        navHistory : [],
        sections : []
    };



    baseProto.init = function() {
        baseProto.makeTabList();
        if(baseProto.debugMode!==false){
            baseProto.writeTabList();
        }
        baseProto.setInitialActive();

        baseProto.setDebug();
        baseProto.setFigures();
        baseProto.setEvents($("body"));
    };

    baseProto.makeTabList = function() {
        // Search through the sections and pull out all the ids for links and tabs
        baseProto.sections = [];
        $("section").each(function(index){
            var sid = $(this).attr("id");
            $(this).addClass(sid);
            baseProto.sections.push(sid);
        });
    };
    baseProto.writeTabList = function() {
        var $el = $("<ul>");
        for(var i in baseProto.sections) {
            sid = baseProto.sections[i];
            $el.append($("<li>").addClass(sid).append("<a href='#"+sid+"' class='proto-jump'>"+sid+"</a>"));
        }
        $("body")
            .prepend($("<nav class='nav nav-tabs proto-nav margin-vm'>").append($el))
            .append("<div class='proto-info'>");
    };
    baseProto.setInitialActive = function() {
        // check if the hash was empty
        var h = baseProto.originalHash!=="" ? baseProto.originalHash.substr(1) : "";
        // if the hash was not one of the sections, the active one is the first
        if($.inArray(h,baseProto.sections)===-1) {
            h = baseProto.sections[0];
        }
        baseProto.stateObj.title = h;
        baseProto.setActive(h);
    };
    baseProto.setActive = function(str) {
        baseProto.currentSection = str;
        $(".active").removeClass("active");
        $("."+str).addClass("active");
        
        if (baseProto.updateUrl) {
            history.pushState(baseProto.stateObj, baseProto.stateObj.title, baseProto.stateObj.url);
            baseProto.updateUrl = false;
        }
    };

    baseProto.setSection = function(str) {

        if(str=="back") {
            if(history.state != null) window.history.back();
        }
        else if (history.pushState) {
            baseProto.stateObj = {
                title: str,
                url: window.location.origin + window.location.pathname + "#" + str
            };
            baseProto.updateUrl = true;
            baseProto.setActive(str);
        } else {
            /* Ajax navigation is not supported */
            location.assign(baseProto.stateObj.url);
        }
    };
    baseProto.setPopup = function(str) {
        var $aside = $("<aside class='"+str+"'>").append(
                $("<div class='proto-aside-cover'>"),
                $("<div class='proto-aside-content'>").html( baseProto.mt($("#"+str).html()) )
            );
        $("section."+baseProto.currentSection).append(
            $aside
        );
        setTimeout(function(){$aside.addClass("proto-show")},15);
        // location.hash = baseProto.currentSection;
        return false;
    };
    baseProto.setPopdown = function() {
        var $aside = $(this).parents("aside").removeClass("proto-show");
        setTimeout(function(){$aside.remove()},300);
        // location.hash = baseProto.currentSection;
        return false;
    };
    baseProto.removePops = function() {
        $("aside[class],.aside-cover").remove();
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
            $("<input type='button' class='btn btn-small warning pull-right proto-info-close' value='&times;'>")
                
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
            $(this).html(
                baseProto.mt($("#"+$(this).attr("class")).html(),$(this).data())
            );
        });
    };
    baseProto.toggleAccordion = function(o){
        o.parents(".proto-list-accordion")
            .find(".proto-list-item").not(o).removeClass("proto-nextopen");
        o.toggleClass("proto-nextopen");
    }

    baseProto.setEvents = function(e) {
        e
            .on("click",".proto-jump",function(e){
                e.preventDefault();
                return baseProto.setSection($(this).attr("href").substr(1)); })
            .on("click",".proto-popup",function(){
                return baseProto.setPopup($(this).attr("href").substr(1)); })
            .on("click",".proto-popdown,.proto-aside-cover",baseProto.setPopdown)
            .on("click",".proto-info-close",function(){
                $(".proto-info").removeClass("active"); })
            .on("click",".proto-toggle-next",function(){
                $(this).toggleClass("proto-nextopen"); })
            .on("click",".proto-toggle-parentnext",function(){
                $(this).parent().toggleClass("proto-nextopen"); })
            .on("click",".proto-toggle-nextaccordion",function(){
                baseProto.toggleAccordion($(this)); })
            .on("click",".proto-toggle-parentnextaccordion",function(){
                baseProto.toggleAccordion($(this).parent()); })
        return e;
    };

    // Mustache Template with default values
    baseProto.mt = function(template,data){
        for(var key in data){
            if(data.hasOwnProperty(key) === false) continue;
            template = template.replace(RegExp('\{\{' + key + '(\:.+?)?}}', 'g'), data[key]);
        }
        template = template.replace(RegExp('\{\{.+?\:(.+?)}}', 'g'), '$1');
        return template;
    }

    w.baseProto = baseProto;

    w.onpopstate = function(o){
        if(o.state!=null) {
            console.log("pop")
            baseProto.updateUrl = false;
            baseProto.stateObj.title = o.state.title;
            baseProto.stateObj.url = o.state.url;
            baseProto.setActive(baseProto.stateObj.title);
        } else {
            console.log("initial")
            baseProto.setInitialActive();
        }
    }

    $(function(){ baseProto.init(); });
})(window);