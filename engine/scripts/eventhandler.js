// ****************************************************************************************************
function EventHandler(target, nextEvent) {
	this.handlers = [];
	this.target = target;
	this.nextEvent = nextEvent;
};

EventHandler.prototype.add = function(handler) {
	this.handlers.push(handler);
};

EventHandler.prototype.remove = function(handler) {
	var i = this.handlers.indexOf(handler);
	if(i > -1) {
		this.handlers.splice(i, 1);
	};
};

EventHandler.prototype.trigger = function(params) {
	var self = this;
	$(this.handlers).each(function(i, handler) {
		handler(self.target, params);
	});

	// if (typeof(params) === "function")
		// params(self.target)
	
	// if(this.nextEvent)
		// this.nextEvent(self.target, params)
};

// EventHandler.prototype.trigger2 = function(params, callback) {
	// var self = this;
	// $(this.handlers).each(function(i, handler) {
		// handler(self.target, params);
	// });
	
	// if(callback)
		// callback(self.target, params)
// };

EventHandler.prototype.trigger2 = function(params, callback) {
	var self = this;
	$(this.handlers).each(function(i, handler) {
		handler(self.target, params);
	});

	if (typeof(params) === "function")
		params(self.target)
};

// ****************************************************************************************************
function MethodHandler(target) {
	this.handlers = [];
	// this.handlers2 = [];
	this.handlerNames = [];
	// this.handlerNames2 = [];
	this.target = target;
	
	this.list = new JList();
};

MethodHandler.prototype.add = function(name, handler) {
	var item = this.list.get(name);
	
	if(item) {
		item.push(handler);
	} else {
		this.list.add(name, [handler]);
	};
	
	// var j = this.handlerNames2.indexOf(name);
	
	// if(j == -1) {
		// var k = this.handlers2.push({name:name, handlers:[]});
		// this.handlers2[k-1].handlers.push(handler);
	// } else {
		// this.handlers2[j].handlers.push(handler);
	// };
	
	var i = this.handlerNames.indexOf(name);
	
	if(i > -1) {
		this.handlers.splice(i, 1);
		this.handlerNames.splice(i, 1);
	};
	
	// if(i == -1) {
		this.handlers.push(handler);
		this.handlerNames.push(name);
	// } else {
		// this.handlers.push[i] = handler;
	// };
};

MethodHandler.prototype.call = function(name, params) {
	// var result = undefined;
	// var i = this.handlerNames.indexOf(name);
	// if(i > -1) {
		// result = this.handlers[i](this.target, params);
	// };
	
	// return result;
	var item = this.list.get(name);
	var self = this;
	var result = undefined;
	$(item).each(function(i, handler) {
		result = handler(self.target, params, result);
	});
	
	return result;
};

MethodHandler.prototype.call2 = function(name, params) {
	var item = this.list.get(name);
	var self = this;
	var result;
	$(item).each(function(i, handler) {
		result = handler(self.target, params, result);
	});
	
	return result;
};

//****************************************************************************************************
//**************************************************************************************************
// TrackViewport is for responsive design. 
// Allows elements to re-position depending on the screen size.
//**************************************************************************************************
function TrackViewport(options) {
	this.view = "";
	this.options = options;
	this.trackElement = $("#body-container");
};

TrackViewport.prototype.width = function() {
	return this.trackElement.width();
	// return $("#body-container").width();
}

TrackViewport.prototype.reset = function() {
	this.view = "";
}

TrackViewport.prototype.refresh = function() {
	var v =  this.options.calc(this);
	if(v != this.view) {
		this.view = v;
		this.options.update(this);
	}
}
