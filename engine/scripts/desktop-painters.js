// *************************************************************************************************
// File name: desktop-painters.js
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
// *************************************************************************************************
// DesktopPainter
// *************************************************************************************************
Class.Inherits(DesktopPainter, JBasePainter);
function DesktopPainter(Control) {
    DesktopPainter.prototype.parent.call(this, Control);
    this.desktop = Control;
};

DesktopPainter.prototype.classID = "DesktopPainter";

DesktopPainter.prototype.paintNavigator = function(container, menus) {
	var dataContainer = $("#sub-data-container");
	$(menus).each(function(i, item) {
		var li = CreateElement("li", container);
		var a = CreateElement("a", li)
			.attr("id", "menu_"+item.id)
			.attr("data-selected", "0")
			.attr("data-id", item.id)
			.attr("href", "#"+item.id)
			.data("menu", item);
		
		var img = CreateElement("img", a);
		if(item.icon == "")
			img.attr("src", "/engine/images/control-right-orange.png")
		else
			img.attr("src", item.icon);
		
		a.append(item.title);
		
		item.subContainer = CreateElement("div", dataContainer)
			.addClass("sub-container")
			.attr("id", "sub_"+ item.id)
			.css("visibility", "hidden")
		
		desktop.SetHint(li, function(dialog, container) {
			container.css("padding", "10px");
			container.html(defaultValue(item.description, item.title));
		}, "right");
	});
};

DesktopPainter.prototype.selectMenu = function(id) {
	if(desktop.selectedMenu) {
		var sub = $("#sub_"+desktop.selectedMenu.data("menu").id);
		desktop.selectedMenu.attr("data-selected", "0");
		sub.css("visibility", "hidden")
	};
	
	desktop.selectedMenu = $("#menu_" + id).attr("data-selected", "1");
	$("#sub_" + id).css("visibility", "visible")
}; 

DesktopPainter.prototype.selectMenuAnimate = function(id) {
	if(desktop.selectedMenu) {
		desktop.selectedMenu.attr("data-selected", "0");
		var o = $("#sub_"+desktop.selectedMenu.data("menu").id);
		var n = $("#sub_"+id)
			.css("left", -o.width())
			.css("display", "block");
			
		o.animate({left: o.width()}, {
			complete: function() {
				o.css("display", "none");
			}
		});
			
		n.animate({left: 0}, {
			complete: function() {
				n.css("left", 0);
				n.css("display", "block");
			}
		});
	} else {
		$("#sub_"+id).css("display", "block");
	};
	desktop.selectedMenu = $("#menu_" + id).attr("data-selected", "1");
}

DesktopPainter.prototype.loadSubPage = function(menu) {
	if(!menu.loaded) {
		var url = menu.url.split("?");
		var pid = url[0].split("/")[1];
		var cssUrl, scriptUrl;
		
		// if(this.desktop.ver == 2) {
			// cssUrl = ("/loadcss/app?sid={0}&p=sub").format(pid);
			// scriptUrl = ("/loadscript/app?sid={0}&p=sub").format(pid);
			cssUrl = ("/loadcss/app/css/{0}?pid={0}").format(pid);
			scriptUrl = ("/loadscript/app/scripts/{0}?pid={0}").format(pid);
		// } else {
			// cssUrl = "/" + url[0].replace("/callback", "/css") +"?pid="+ pid;
			// scriptUrl = "/" + url[0].replace("/callback", "/script") +"?pid="+ pid;
		// }
			
		CreateElement("link", $("head"))
			.attr("href", cssUrl)
			.attr("rel", "stylesheet")
			.attr("type", "text/css");
			
		$.getScript(scriptUrl, function(script, textStatus) {	
			if(script) {
				menu.page = CreateSubPage({id:menu.id, host:desktop, container:menu.subContainer, url:menu.url});
			};
			
			menu.loaded = true;
		});
	};
};