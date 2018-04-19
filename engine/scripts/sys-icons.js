function SystemIcons(params){
	var container = params.container;
	desktop.svg.each(function(i, name) {
		var c = CreateElement("div", container).addClass("icon");
		if(desktop.svg.isClone(name)) {
			c.attr("clone", "1");
			desktop.SetHint(c, function(dialog, container) {
				container.html(name);
				container.append("<div class='clone'>"+desktop.svg.getClone(name)+"<div>");
			}, "top");
		} else {
			c.attr("clone", "0");
			desktop.SetHint(c, name, "top");
		};
		
		desktop.svg.draw(c, name, 32);
	});
};
