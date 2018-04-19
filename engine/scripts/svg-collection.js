//**************************************************************************************************
// SvgCollection()
//**************************************************************************************************
function SvgCollection() {
	this.list = new JList();
	this.map = new JList();
};

SvgCollection.prototype.add = function(name, size, html) {
	var svg = new Svg(name, size, html);
	svg.register();
	
	this.list.add(name, svg);
	this.map.add(name, name);
}

SvgCollection.prototype.clone = function(as, name) {
	if(!this.map.exists(as)) {
		this.map.add(as, name);
	};
};

SvgCollection.prototype.draw = function(c, name, size) {		
	var parts = name.split(",");
	if(parts.length > 1)
		name = parts[0];
		
	if(this.map.exists(name)) {
		var svg = this.list.get(this.map.get(name)).draw(c, size);
		if(parts.length > 1) svg.attr("x-sec", parts[1]);
		return svg;
	} else {
		return undefined;
	}
};

SvgCollection.prototype.draw2 = function(c, name, callback) {		
	if(this.map.exists(name)) {
		var svg = this.list.get(this.map.get(name)).draw(c);
		if(callback) callback(svg)
		return svg;
	} else {
		return undefined;
	}
};

SvgCollection.prototype.isClone = function(name) {	
	return !this.list.exists(name);
};

SvgCollection.prototype.getClone = function(name) {	
	return this.map.get(name);
};

SvgCollection.prototype.each = function(callback) {
	// var names = this.map.names;
	var names = JSON.parse(JSON.stringify(this.map.names));
	names.sort();
	
	for(var i = 0; i < names.length; i++) {
		callback(i, names[i]);
	};
	// this.map.getNames(callback);
};

//**************************************************************************************************
// Svg()
//**************************************************************************************************
function Svg(name, size, html) {
	this.name = name;
	this.size = size;
	this.html = html;
};

Svg.prototype.register = function() {
	var container = $("#svg-collection");
	
	var svg = [];
	svg.push(("<svg id='svg-{0}'").format(this.name);
	svg.push("x='0px'");
	svg.push("y='0px'");	
	svg.push("stroke-width='4'");
	
	if(isNaN(this.size))
		svg.push(("viewBox='{0}'").format(this.size))
	else
		svg.push(("viewBox='0 0 {0} {0}'").format(this.size))
	
	svg.push(">");
	svg.push(this.html);
	svg.push("</svg>");
	
	container.append(svg.join(" "));
};

Svg.prototype.prepare = function(e, scale, init, done) {
	var svg = [];
	svg.push("<svg ");
	// svg.push("x='0px'");
	// svg.push("y='0px'");
	if(scale) {
		svg.push(("width='{0}px'").format(scale));
		svg.push(("height='{0}px'").format(scale));
	};
	svg.push(">");
	init(svg);
	svg.push("</svg>");
	var s = $(svg.join(" "));
	e.append(s);
	done(s);
	
	return $(s);
};

Svg.prototype.draw = function(c, size) {	
	var self = this;
	var svg = this.prepare(c, size, function(svg) {
		svg.push(("<use xlink:href='#svg-{0}'/>").format(self.name);
	}, function(svg) {
		
	});	
	
	return svg;
};
