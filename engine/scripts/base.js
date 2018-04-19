//==================================================================================================
// File name: base.js
//==================================================================================================
// http://javascript.crockford.com/prototypal.html
var Class = new __Class();

function __Class() {
    // this.classes = [];
};

__Class.prototype.Inherits = function(C, P) {
    C.prototype = new P();
    C.prototype.constructor = C;
    C.prototype.parent = P;
    // this.classes.push(C);
};

//**************************************************************************************************
// jObject
//**************************************************************************************************
function jObject(params) {
    if (params == undefined) {		
		return
	}
	
	this.initialize(this.params = params)
	// this.initEvents(this.events = {})
	// this.initMethods(this.methods = new MethodHandler(this))
	
	// if (params.init) 
		// params.init(this)
	
	// this.events.OnInit.trigger(function(sender) {
		// sender.afterInitialize();
	// });
	
	this.events.OnPreInit.trigger2(function(sender) {
		sender.events.OnInit.trigger2(function(sender) {
			sender.afterInitialize();
		});
	});
	
	// this.afterInitialize();
}

jObject.prototype.classID = "jObject"

jObject.prototype.debug = function(message) {
	// console.log("debug (" + this.classID +"): "+ message)
	var debugMsg = {
		at: this.classID,
		debug: message
	}
	console.log(debugMsg)
	// console.log("debug (" + this.classID +"): "+ message)
}

jObject.prototype.logTimeout = function(timeout, message) {
	var self = this
	setTimeout(function() {
		self.log(message)
	}, timeout)
}

jObject.prototype.initialize = function(params) {
	this.log = this.debug // I really prefer log instead of debug
	
	this.id = params.id
	this.creator = params.creator
	
	this.events = {}
	this.methods = new MethodHandler(this)
	
	this.events.OnPreInit = new EventHandler(this)
	this.events.OnPreInit.add(function(sender) {
		// sender.debug(sender.classID)
		if (sender.params.init)
			sender.params.init(sender)
	})
	
	this.events.OnInit = new EventHandler(this)
	
	// this.initEvents(this.events = {})
	// this.initMethods(this.methods = new MethodHandler(this))
}

jObject.prototype.initEvents = function(events) {
	// events.OnPreInit = new EventHandler(this)
	// events.OnPreInit.add(function(sender) {
		// if (sender.params.init) 
			// sender.params.init(sender)
	// })
	
	// events.OnInit = new EventHandler(this)
}

jObject.prototype.initMethods = function(methods) {
}

jObject.prototype.afterInitialize = function() {
}

//**************************************************************************************************
// JObject
//**************************************************************************************************
function JObject(params) {
    if(params == undefined) {
        return;
    } else {
		this.initialize(params);
		this.afterInitialize(params);
	};
};

JObject.prototype.classID = "JObject";

JObject.prototype.initialize = function(params) {
	this.params = params;
};

JObject.prototype.afterInitialize = function(params) {
};

//**************************************************************************************************
// JBasePainter
//**************************************************************************************************
function JBasePainter(Control) {
    if(Control == undefined) {
        return;
    };

    this.Control = Control;
};

JBasePainter.prototype.classID = "JBasePainter";

JBasePainter.prototype.Paint = function() {
};

JBasePainter.prototype.AfterPaint = function() {
};

JBasePainter.prototype.DefaultStyles = function() {
    return undefined;
};

JBasePainter.prototype.GetParam = function(name, value) {
    return this.Control.PaintParam(name, value);
};

//**************************************************************************************************
// JList
//**************************************************************************************************
function JList(numericName) {
	this.numericName = numericName
	this.items = []
	this.names = []
};

JList.prototype.add = function(name, item, callback) {
	// var i = this.names.indexOf(name);
	// if(i > -1) {
		// this.names.splice(i, 1);
		// this.items.splice(i, 1);
	// };
	
	if(this.numericName)
		this.names.push(parseInt(name))
	else
		this.names.push(name);
	
	if(callback)
		this.items.push(callback(item))
	else
		this.items.push(item);
	
	return item;
};

JList.prototype.clear = function() {
	this.items = [];
	this.names = [];
};

JList.prototype.get = function(name) {
	if(this.numericName)
		name = parseInt(name)
		
	var index = this.names.indexOf(name);
    
	if(index > -1)
		return this.items[index]
	else
		return undefined;
};

JList.prototype.getByIndex = function(index) {
	return this.items[index];
};

JList.prototype.exists = function(name) {
	if(this.numericName) name = parseInt(name)	
	return this.names.indexOf(name) > -1;
};

JList.prototype.each = function(callback) {
	// $(this.items).each(function(i, item) {
		// callback(i, item);
	// };

	var items = $(this.items);
	items.each(function(i, item, itemsx) {
		callback(i, item, items);
	};
};

JList.prototype.each2 = function(callback) {
	var items = $(this.items);
	// var items = this.items;
	items.each(function(i, itemsx) {
		callback(i, items);
	};
};

JList.prototype.getValues = function(callback) {
	$(this.items).each(function(i, value) {
		callback(i, value);
	};
};

JList.prototype.getNames = function(callback) {
	$(this.names).each(function(i, name) {
		if(this.numericName) name = parseInt(name)
		callback(i, name);
	};
};

JList.prototype.count = function() {
	return this.items.length
};
