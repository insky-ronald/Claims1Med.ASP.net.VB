// *************************************************************************************************
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//==================================================================================================
// File name: desktop-base.js
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
// DesktopBase.prototype.DefaultWindowPainter = DesktopWindowPainter;
// DesktopBase.prototype.DefaultPagerPainter = BasePagerPainter;
// DesktopBase.prototype.DefaultHintSettings = {
	// foreColor: "black",
	// backgroundColor: "Goldenrod",
// };

// DesktopBase.prototype.DefaultToolbarSettings = {
	// painterClass: PopupOverlayPainter,
	// css: "toolbar",
	// dropDownColor: "dimgray"
// };

DesktopBase.prototype.DefaultPainter = function() {
	return new DesktopPainter(this);
	// return undefined;
}

DesktopBase.prototype.GetHome = function() {
	return this.Home;
};

DesktopBase.prototype.Initialize = function(Params) {
	DesktopBase.prototype.parent.prototype.Initialize.call(this, Params);
	
	this.dataCallback = Params.cb;
	this.ver = Params.ver;
	
	this.Events = {};
	this.Events.OnInitSession = new EventHandler(this);
	this.Events.OnInitSession.add(function(desktop, data) {
		desktop.pid = data.pid;
		// desktop.Home = data.Home;
		// desktop.UserNo = data.UserNo;
		// desktop.UserName = data.UserName;
		// desktop.Groups = data.Groups;
		// desktop.MenuStyle = data.MenuStyle;
		// desktop.ManageMenu = data.ManageMenu;
		// desktop.CustomData = data.CustomData;
		// desktop.Roles = data.Roles;
		// desktop.PageName = data.PageName;
		// desktop.Activate = data.Activate;
		// desktop.PageTitle = data.PageTitle;
		// document.title = data.window_title;		
	})

	this.Events.OnInitDesktop = new EventHandler(this);
	this.Events.OnInitDesktop.add(function(desktop, data) {
		// alerts("OnInitDesktop");
		// desktop.Events.OnInitNavigator.trigger(data.menu_items);
		desktop.Painter.paintNavigator($("#navigator"), data.menu_items);
	});

	this.Events.OnInitNavigator = new EventHandler(this);
	this.Events.OnInitNavigator.add(function(desktop, menu) {
		// desktop.Painter.paintNavigator($("#navigator"), menu);
		// var items = [];
		// var container = $("#navigator");
		// container.css("opacity", 0);
		// $(menu).each(function(i, item) {
			// var li = CreateElement("li", container);
			// var a = CreateElement("a", li)
				// .attr("id", "menu_"+item.id)
				// .attr("data-selected", "0")
				// .attr("href", "#"+item.id)
			
			// var img = CreateElement("img", a)
				// .attr("src", "/engine/images/control-right-orange.png");
			
			// a.append(item.title);
			
			// items.push(li);
		// });
		
		// container.animate({opacity:1}, "slow");
	});
	
	this.Events.OnSelectMenu = new EventHandler(this);
	this.Events.OnSelectMenu.add(function(desktop, id) {
		desktop.Painter.selectMenu(id);
		// desktop.Painter.selectMenuAnimate(id);
		desktop.Events.OnChangeMenu.trigger(desktop.selectedMenu.data("menu"));
	});
		
	this.Events.OnChangeMenu = new EventHandler(this);
	this.Events.OnChangeMenu.add(function(desktop, menu) {
		desktop.Painter.loadSubPage(menu);
	});
	
	this.Events.OnPaintLogo = new EventHandler(this);
	this.Events.OnPaintHeader = new EventHandler(this);
	this.Events.OnCustomPaintMenuHint = new EventHandler(this);
	this.Events.AfterPaint = new EventHandler(this);

	var self = this;
	
	// this.svgs = [];
	// this.svgNames = [];
	// this.svgBases = [];
	// this.svgSizes = [];

	// this.Links = [];
	// this.Icons = [];
	// this.Windows = [];
	// this.WindowNames = [];
	// this.History = [];
	// this.Home = "";
	// this.MenuStyle = "default";
	// this.ManageMenu;
	// this.MenuItems;
	// this.CustomData = {};
	// this.PageTitle;
	this.zIndex = 10000;
	// this.VID = DefaultValue($("#__VID").val(), 0);
	// this.PageID = DefaultValue($("#__UID").val(), 0);

    $(window).bind("hashchange", function() {
		self.Events.OnSelectMenu.trigger(location.hash.slice(1));
		// alerts(location.hash.slice(1));
		// if(location.hash.slice(1).length == 0) 
			// self.OpenWindowFromHash(self.Toolbar.Items[0].Link.ID.toLowerCase())
		// else
			// self.OpenWindowFromHash();
    });
			
	this.OnAfterUpload = new EventHandler(this);

    $.ajaxSetup({
        global: true,
		headers: { "X-Authorization": defaultValue($("#__UID").attr("value"), "NA") }
    });
	
	$.ajax({
		url: this.InitCallbackUrl(),
		type: "POST",
		global: false,
		cache: true,
		dataType: "json",
		data: this.InitCallbackParams()
		// headers: { "X-Authorization": $("#__UID").attr("value") }
	}).done(function(data) {
		if(data.status == 0) {
			if(data.Locked) {
				self.InitializeSession(data);
				self.Paint();
				self.AfterPaint();
				self.Login("lock", function() {
					self.InitDesktop(self.MenuItems = data.MenuItems);
					self.UpdateSvgs();
				});
			} else {
					// alerts("here");
				// self.InitializeSession(data);
				self.Events.OnInitSession.trigger(data);
				self.Paint();
				self.AfterPaint();
				self.Events.OnInitDesktop.trigger(data);
				
				if(location.hash == "")
					location.hash = data.menu_items[0].id
					// self.Events.OnSelectMenu.trigger(data.menu_items[0].id)
				else
					self.Events.OnSelectMenu.trigger(location.hash.slice(1));
				
				// self.InitDesktop(self.MenuItems = data.MenuItems);
				// self.UpdateSvgs();
			};
		} else {
			if(data.status == -1) {
			}
		};
	}).fail(function() {

	});
	
    // if(location.hash == "")
		// this.OpenWindowFromHash(this.Toolbar.Items[0].Link.ID.toLowerCase())
    // else
        // this.OpenWindowFromHash();
	
	Params.DelayPainting = true;
};

DesktopBase.prototype.InitializeSession = function(data) {
};
		
// DesktopBase.prototype.GetManageMenuItem = function() {
	// return this.ManageMenu;
// }

DesktopBase.prototype.InitCallbackUrl = function() {
	if(this.dataCallback)
		return this.dataCallback
	else if(GetPathName() == "/")
		// return "nav/default/home"
		return ("{0}/callback").format("nav/home")
	else
		return ("{0}/callback").format(GetPathName())
};

DesktopBase.prototype.InitCallbackParams = function() {
	// var params = {};
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

	// $('div[control-type="dlg"]').each(function(){
		// ignore the hints
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
		// .attr("measure-scrollbar", "1")
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
    
	// capture escape key event
	// $(window).bind('keyup', function(event) {
	$(window).bind('keypress', function(event) {
		if(event.keyCode === 27) {
			var zIndex = 0;
			var topMostDialog;

			$('div[control-type="dlg"]').each(function(){
				var z = parseInt($(this).css('z-index'));
				if(z > zIndex){
					zIndex = z;
					topMostDialog = $(this);
				}
			});
			
			if(topMostDialog) {
				topMostDialog.trigger("dlgclose");			
			};

			event.preventDefault();
		}
	});
	
	this.Events.AfterPaint.trigger();	
};

DesktopBase.prototype.SetHint = function(e, hint, snap) {
// alert(typeof booleanValue) // displays "boolean"
// alert(typeof numericalValue) // displays "number"
// alert(typeof stringValue) // displays "string"
	e.data("hintData", hint);
	e.data("hintSnap", snap);
	e.on("hint", function() {
	})
	.on("mouseleave", function() {
		$(this).removeData("activated");
		if($(this).data("visible")) {
			$(this).removeData("visible");
			$(this).data("hint-dlg").Hide();
			$(this).removeData("hint-dlg");
		};
	})
	.on("mouseenter", function() {
		var item = $(this);
		item.data("activated", true);
		setTimeout(function() {
			if(item.data("activated") {
				var hint = item.data("hintData");
				var snap = item.data("hintSnap");
				
				item.data("visible", true);
				var popup = new JPopupDialog({
					Target: item,
					Modal: false,
					Painter: {
						// painterClass: PopupBasePainter,
						painterClass: PopupHintPainter,
						// painterClass: PopupOverlayPainter,
						color: "goldenrod",
						snap: defaultValue(snap, "bottom"),
						align: "",
						inset: false,
						OnRenderContent: function(dialog, container) {
							// container.html("XXX")
							if(typeof hint == "string")
								container.html(hint)
							else if(hint !== undefined)
								hint(dialog, container)
						}
					}
				});
				
				item.data("hint-dlg", popup);
			};
		}, 200);
	});
}
