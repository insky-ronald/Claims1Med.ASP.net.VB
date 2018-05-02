// *************************************************************************************************
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//==================================================================================================
// File name: desktop-base-2.js
//==================================================================================================
//  Class.Inherits(Desktop, JBasePage);
//==================================================================================================
var desktop;

//**************************************************************************************************
// DesktopBase()
//**************************************************************************************************
Class.Inherits(DesktopBase, JBasePage);
function DesktopBase(Params) {
    DesktopBase.prototype.parent.call(this, Params);
};

DesktopBase.prototype.classID = "DesktopBase";

DesktopBase.prototype.DefaultPainter = function() {
	return new DesktopPainter(this);
}

DesktopBase.prototype.GetHome = function() {
	return this.Home;
};

DesktopBase.prototype.PostInitialize = function(data) {
};

DesktopBase.prototype.Initialize = function(Params) {
	DesktopBase.prototype.parent.prototype.Initialize.call(this, Params);
	// console.log(this.DefaultPainter())
	// this.userName = "Matthew Bleach";
	// this.userRole = "Administrator";
	
	this.dataCallback = Params.cb;
	this.ver = Params.ver;
	
	this.cacheDataset = new JList();
	this.svg = new SvgCollection();
	
	this.Events = {};
	this.Events.OnInitSession = new EventHandler(this);
	this.Events.OnInitSession.add(function(desktop, data) {
		desktop.pid = data.pid;
		desktop.userName = data.user_name;
		// desktop.userFullName = "Matthew Bleach";
		desktop.userFullName = data.user_full_name;
		desktop.userRole = "Administrator";
		document.title = data.page_title;
		desktop.InitializeSession(data);
	})

	this.Events.OnInitDesktop = new EventHandler(this);
	this.Events.OnInitDesktop.add(function(desktop, data) {
		desktop.Painter.paintHeader($("#desktop-header-container"), data);
		desktop.Painter.paintSubContainer($("#navigator-menu"), data);
		desktop.Painter.paintNavigator($("#navigator-menu"), data.menu_items);
		desktop.Painter.setTitle(data.window_title);
	});

	this.Events.OnInitNavigator = new EventHandler(this);
	this.Events.OnInitNavigator.add(function(desktop, menu) {
	});
	
	this.Events.OnSelectMenu = new EventHandler(this);
	this.Events.OnSelectMenu.add(function(desktop, id) {
		desktop.Painter.selectMenu(id);
		desktop.Events.OnChangeMenu.trigger(desktop.selectedMenu.data("menu"));
	});
		
	this.Events.OnResizeMenu = new EventHandler(this);
	
	this.Events.OnChangeMenu = new EventHandler(this);
	this.Events.OnChangeMenu.add(function(desktop, menu) {
		// console.log(menu)
		desktop.Painter.loadSubPage(menu);
	});
	
	this.Events.OnPaintLogo = new EventHandler(this);
	this.Events.OnPaintHeader = new EventHandler(this);
	this.Events.OnHeaderToolbar = new EventHandler(this);
	this.Events.OnSideMenuPageControl = new EventHandler(this);
	this.Events.OnDeveloperMenuPageControl = new EventHandler(this);
	this.Events.OnCustomPaintMenuHint = new EventHandler(this);
	this.Events.AfterPaint = new EventHandler(this);

	this.Events.OnPaintCustomHeader = new EventHandler(this);
	
	var self = this;

	this.zIndex = 10000;
	this.firstItem = "";
    $(window).bind("hashchange", function() {
		if(location.hash.slice(1) == "")
			self.Events.OnSelectMenu.trigger(self.firstItem)
		else
			self.Events.OnSelectMenu.trigger(location.hash.slice(1));
    });
			
	this.OnAfterUpload = new EventHandler(this);

    $.ajaxSetup({
        global: true,
		cache: true,
		headers: { "X-Authorization": defaultValue($("#__UID").attr("value"), "NA") }
    });
	
	// $.ajax({
	this.ajax({
		url: this.InitCallbackUrl(),
		type: "POST",
		global: false,
		cache: false,
		dataType: "json",
		data: this.InitCallbackParams()
	}).done(function(data) {	
		if(data.status == 0) {
			self.systemData = data;
			self.customData = data.custom_data;
			if(data.Locked) {
				self.InitializeSession(data);
				self.Paint();
				self.AfterPaint();
				self.Login("lock", function() {
					self.InitDesktop(self.MenuItems = data.MenuItems);
					self.UpdateSvgs();
				});
			} else {
				self.Events.OnInitSession.trigger(data);
				self.Paint();
				self.AfterPaint();
				self.PostInitialize(data);
				self.Events.OnInitDesktop.trigger(data);
				
				if(location.hash == "") {
					// get the first sub-item in the menus
					// location.hash = data.menu_items[0].subItems[0].id
					self.Events.OnSelectMenu.trigger(self.firstItem = data.menu_items[0].subItems[0].id);
				} else
					self.Events.OnSelectMenu.trigger(location.hash.slice(1));
			};
		} else {
			if(data.status == -1) {
			}
		};
	}).fail(function() {

	});
	
	Params.DelayPainting = true;
};

DesktopBase.prototype.ajax = function(settings) {
	this.StayAlive();
	return $.ajax(settings);
}

DesktopBase.prototype.getScript = function(url, callback) {
	this.StayAlive();
	return $.ajax({
		type: "GET",
		url: url,
		success: callback,
		dataType: "script",
		cache: true
	});
}

DesktopBase.prototype.LoadCacheData = function(data, name, key) {
	var dataset = new Dataset(data, name);
	dataset.primaryKey = key;

	this.cacheDataset.add(name, dataset.data, function(data) {
		return {
			page: 1,
			row_count: 0,
			page_count: 0,
			table_count: 1,
			crud: {"add":false,"edit":false,"delete":false},
			data_0: data
		};
	});
	
	return dataset;
};

DesktopBase.prototype.InitializeSession = function(data) {	
};

DesktopBase.prototype.InitCallbackUrl = function() {
	if(this.dataCallback)
		return this.dataCallback
	else
		return $("#__callback").attr("value")
};

DesktopBase.prototype.InitCallbackParams = function() {
	var params = {
		action: "navigator"
	};

	if(this.VID !== undefined) {
		params.vid = this.VID;
	} else {
		params.PageID = this.PageID;
	};
	
	var searchString = window.location.search.substring(1);
	if(searchString !== "") {
		var reqparams = searchString.split("&");
		for (var i = 0; i < reqparams.length; i++) {
			var val = reqparams[i].split("=");
			params[unescape(val[0])] = unescape(val[1]);
		};
	};
	
	return params;
};

DesktopBase.prototype.GetTopMostDialogIndex = function() {
	var index = 0;

	$('div[control-type="dlg"]:not([hint])').each(function(){
		var z = parseInt($(this).css('z-index'));
		if(z > index){
			index = z;
		}
	});
	
	return index;
}

DesktopBase.prototype.AfterPaint = function() {
	DesktopBase.prototype.parent.prototype.AfterPaint.call(this);	
	
	// calculate the width of the scroll bar in the user OS
	this.scrollbarWidth = 0;
	
	var t1 = CreateElement("div", $("body"))
		.css("visibility", "hidden")
		.css("width", 100)
		.css("height", 100)
		.css("overflow", "scroll")
		.css("-ms-overflow-style", "scrollbar")
		
	var t2 = CreateElement("div", t1)
		.css("width", "100%")
		.css("height", "100%")
		.css("background", "wheat")
		
	var w1 = t1.outerWidth();
	var w2 = t2.outerWidth();
	
	this.scrollbarWidth = w1-w2;
	t1.remove();
    
	this.Events.AfterPaint.trigger();	
	
	var self = this;
	// new JSplitter({
		// target: $("#navigator-container"),
		// splitter: $("#inner-data-container div[x-sec='splitter']"),
		// onresize: function() {
			// self.Events.OnResizeMenu.trigger()
		// }
	// });
	new jResize({
		owner: this, 
		sizer: $("#inner-data-container div[x-sec='splitter']"),
		target: $("#navigator-container"),
		parent: $("#inner-data-container"),
		orientation: "vert",
		initDrag: function(drag) {
			$("body").addClass("resizing-" + drag.orientation);		
			$("#desktop-container").css("pointer-events", "none");			
			drag.baseSize = drag.target.outerWidth()
		},
		dragging: function(drag, x, y) {
			drag.target.css("flex-basis", drag.baseSize + x);
			self.Events.OnResizeMenu.trigger()
		},
		dragEnd: function(drag) {
			$("body").removeClass("resizing-" + drag.orientation);
			$("#desktop-container").css("pointer-events", "");
		}
	});
	
	
	// this.StayAlive();
	// var val = localStorage.getItem(location.hostname+"-stayAlive2");
	// if(!val) {
		// console.log("not initialized");
		// this.hasStayAlive = true;
		// localStorage.setItem(location.hostname+"-stayAlive2", 12345);
	// } else
		// console.log("alread initialized")
};

DesktopBase.prototype.StayAlive = function(callback) {
	// if(!this.hasStayAlive) return;
	// var val = parseInt(localStorage.getItem(location.hostname+"-stayAlive"));
	// this.stayAlive = parseInt(localStorage.getItem(location.hostname+"-stayAlive"));
	
	if(this.stayAlive) clearInterval(this.stayAlive);
	
	this.stayAlive = setInterval(function() {
		desktop.ajax({
			url: "/api/session/alive",
			type: "GET",
			success: function(response) {
				// sessionContainer.html(response);
			}
		});
	}, 1000*60*10); // 10 minutes	
	// }, 5000); // 5 seconds
	// }, 5000*2); // 10 seconds
	
	// localStorage.setItem(location.hostname+"-stayAlive", this.stayAlive);
	
	if(callback) callback();
};

DesktopBase.prototype.HideHints = function() {
	$(document).find(".hint").remove();
};

DesktopBase.prototype.SetHint = function(e, hint, snap) {
	 // Hint(): refer to dialogs.js
	var self = this;
	e.data("hintData", hint);
	e.data("hintSnap", snap);
	e.on("hint", function() {
		
	})
	.on("mouseleave", function() {
		var target = $(this).data("hintTarget")
		var hint = target ? target: $(this);
		
		setTimeout(function() {
			Hint(hint, false);
		}, 100);
	})
	.on("mouseenter", function() {
		if($(this).data("hintTarget"))
			Hint($(this).data("hintTarget"))
		else
			Hint($(this))
	});
};

DesktopBase.prototype.showBusy = function(container2) {
	var container = container2 ? container2: $("#desktop-container");
	// var container = container ? container: $("#desktop-container");
	
	this.busyContainer = CreateElement("div", container, "", "busy2")
		.css("z-index", this.zIndex++);
		
	container.data("busy", this.busyContainer);
	this.svg.draw(this.busyContainer, "refresh");
}

DesktopBase.prototype.hideBusy = function(container) {
	if(container) 
		container.data("busy").remove()
	else if(this.busyContainer) 
		this.busyContainer.remove();
}


DesktopBase.prototype.windowResizeWatch = function(e) {
	if(!this.windowResizeWatching) {
		this.windowResizeWatching = [];
		var self = this;
		$(window).on("resize", function(e) {
			$(self.windowResizeWatching).each(function(i, e) {
				$(e).trigger("resize-check");
			})
		})	
	};
	
	this.windowResizeWatching.push(e)
}

