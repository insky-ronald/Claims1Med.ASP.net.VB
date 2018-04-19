// *************************************************************************************************
// File name: desktop-painters-5.js
// Last modified on
// 3:20 PM Monday, October 9, 2017
// *************************************************************************************************
// *************************************************************************************************
// DesktopPainter5
// *************************************************************************************************
Class.Inherits(DesktopPainter5, JBasePainter);
function DesktopPainter5(Control) {
    DesktopPainter5.prototype.parent.call(this, Control);
    this.desktop = Control;
};

DesktopPainter5.prototype.classID = "DesktopPainter5";

DesktopPainter5.prototype.Paint = function() {
	DesktopPainter5.prototype.parent.prototype.Paint.call(this);
	
	var self = this;
	
	new jSplitContainer($.extend({}, {
		paintParams: {
			theme: "white-green-dark",
			css: "main-desktop-split"
		},
		container: $("body"),
		orientation: "vert",
		size: 250,
		usePercent: false,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				CreateElementEx("div", container, function(userInfo) {
					CreateElementEx("div", userInfo, function(userPhoto) {
						CreateElementEx("img", userPhoto, function(photo) {
							photo.attr("src", "/images/user-48.jpg");
						});
					}, "user-photo");

					CreateElementEx("div", userInfo, function(userDetail) {
						CreateElementEx("span", userDetail, function(name) {
							CreateElementEx("div", name, function(name) {
								name.attr("x-sec", "name")
								name.html(desktop.userName)
							});
							CreateElementEx("div", name, function(name) {
								name.attr("x-sec", "role")
								name.html(desktop.userRole)
								// name.html(location.hostname)
							});
						}, "user-name");
					}, "user-detail");
					
				}, "user-info");
				
				self.navContainer = CreateElementEx("div", container, function(nav) {
					// new jScroller({
						// target: nav
					// })
				}, "nav-container");
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				self.rightPanel = container;
				self.headerContainer = CreateElementEx("div", container, function(header) {
					
				}, "header");
				
				CreateElementEx("div", container, function(content) {
					// CreateElement("div", content).attr("id", "parent-sub-container");
					content.attr("id", "parent-sub-container");
				}, "content");
			});
		}
	});	
};

DesktopPainter5.prototype.setTitle = function(title, subTitle, icon) {
	this.desktopTitle.html(title);
	if(subTitle)
		this.desktopSubTitle.html(subTitle);
};

DesktopPainter5.prototype.setSubTitle = function(subTitle, icon) {
	this.desktopSubTitle.html(subTitle);
};

DesktopPainter5.prototype.paintHeader = function(container, data) {
	var self = this;
	
	CreateElementEx("div", this.headerContainer, function(header1) {
		CreateElementEx("div", header1, function(titleContainer) {
			self.desktopTitle = CreateElementEx("span", titleContainer, function(title) {
				title.html("Title")
			});
			
			self.desktopSubTitle = CreateElementEx("span", titleContainer, function(subTitle) {
				subTitle.html("Sub-title")
			});
			
		}, "title-container");
		
		CreateElementEx("div", header1, function(toolbarContainer) {
			var toolbar = new JToolbar({
					container: toolbarContainer,
					css: "toolbar",
					theme: "svg",
					hintAlign: "bottom",
					buttonSize: 24
			});
			
			toolbar.NewItem({
				id: "menu",
				icon: "menu",
				iconColor: "slategray",
				align: "right",
				click: function() {
					if(!self.userMenu)
						self.userMenu = new jSideMenu({
							container: self.rightPanel,
							headerContainer: self.headerContainer,
							initPageControl: desktop.Events.OnSideMenuPageControl
						})
					else
						self.userMenu.show();
					// self.showSideMenu();
				}
			});
			
			toolbar.NewItem({
				id: "developer",
				// icon: "a-O+settings",
				icon: "settings",
				// icon: "test-01",
				// iconColor: "firebrick",
				iconColor: "slategray",
				hint: "Developer's Workspace",
				// align: "left",
				align: "right",
				click: function() {
					if(!self.developerMenu)
						self.developerMenu = new jSideMenu({
							container: self.rightPanel,
							headerContainer: self.headerContainer,
							initPageControl: desktop.Events.OnDeveloperMenuPageControl
						})
					else
						self.developerMenu.show();
				}
			});
			
			toolbar.NewDropDownConfirmItem({
				id: "logout",
				icon: "logout",
				iconColor: "slategray",
				color: "firebrick",
				noIndicator: true,
				align: "right",
				hint: "Logout",
				title: "Logout",
				subTitle: "Are you sure you want to log out?",
				s: true,
				confirm: function() {
					desktop.Ajax(self, "/api/session/logout", undefined, function(data) {
						if (data.Status == 0) {
							window.location.href = ""
						}
					})
				}
			});
			
			desktop.Events.OnHeaderToolbar.trigger(toolbar);
			
			// toolbar.NewItem({
				// id: "logout",
				// icon: "logout",
				// iconColor: "#8DCF6E",
				// hint: "Logout",
				// align: "right",
				// click: function(item) {
					// desktop.Ajax(self, "/api/session/logout", undefined, function(data) {
						// if (data.Status == 0) {
							// window.location.href = ""
						// }
					// })
				// }
			// });
			
			if(window.location.pathname !== "/" ) {
				toolbar.NewItem({
					id: "home",
					icon: "home",
					// iconColor: "#8DCF6E",
					iconColor: "slategray",
					align: "right",
					click: function(item) {
						window.location = "/";
					}
				});
			};
			
		}, "toolbar-container");
	}, "page-header");
	
	CreateElementEx("div", this.headerContainer, function(header2) {
		header2.attr("id", "page-custom-header")
		self.Control.Events.OnPaintCustomHeader.trigger(header2)
	}, "");
};

DesktopPainter5.prototype.paintSubContainer = function(container, data) {
};

DesktopPainter5.prototype.paintNavigator = function(container, menus) {
	var dataContainer = $("#parent-sub-container");

	// console.log("OK")
	var self = this;
	this.createNavigatorMenu({
		// container: container,
		container: this.navContainer,
		theme: this.Control.navigatorTheme,
		menus: menus,
		click: function(e) {
			// location.hash = $(e.target).attr("href");
		},
		init: function(container, item) {
			container
				.attr("href", "#"+item.id);
				
			item.subContainer = CreateElement("div", dataContainer)
				.addClass("sub-container")
				.attr("id", "sub-"+ item.id)
				// .css("visibility", "hidden");
				
			self.showSubContainer(item.subContainer, false)
		}
	});
};

DesktopPainter5.prototype.showSubContainer = function(container, visible) {
	if(visible)
		container.css({
			"visibility": "visible",
			"opacity": 1,
			"pointer-events": "",
			"z-index": 1
		})
	else
		container.css({
			"visibility": "hidden",
			"opacity": 0,
			"pointer-events": "none",
			"z-index": 0
		});
};

DesktopPainter5.prototype.createNavigatorMenu = function(params) {
	params.container.addClass("navtree").attr("theme", params.theme);
	
	var clickMain = function(e) {
		var img = $(e.target).data("icon");
		var items = $(e.target).data("items");
		var expand = !img.data("expand");
		
		img.data("expand", expand);
		img.attr("x-exp", expand ? "1" : "0");
		if(expand) {
			img.html("");
			desktop.GetSvg(img, "tree-expand", 0);
			items.css("display", "block");
		} else {
			img.html("");
			desktop.GetSvg(img, "tree-collapse", 0);
			items.css("display", "none");
		};
	};
	
	// var clickItem = function(e) {
		// location.hash = $(e.target).attr("href");
	// };
	
	var addItem = function(container, type, label, icon) {
		var main;
		
		if(type == "main")
			main = CreateElement("div", container)
				.attr("x-sec", type)
		else
			main = CreateElement("a", container)
				.attr("x-sec", type)
		
		// var a = CreateElement("a", main);
		var img = CreateElement("span", main)
		// var img = CreateElement("span", a)
			.attr("x-sec", "icon")
			.attr("x-exp", "1")
			.data("expand", true)
			
		desktop.GetSvg(img, icon, type=="main" ? 0: 0);
			
		main.data("icon", img);
			
		CreateElement("span", main)
			.attr("x-sec", "label")
			.html(label)
			
		if(type == "main")
			main.click(clickMain)
		else
			main.click(params.click);
		
		return main;
	};
	
	$(params.menus).each(function(i, item) {
		var branch = CreateElement("div", params.container)
			.attr("x-sec", "branch")
			
		var main = addItem(branch, "main", item.title, "tree-expand")
		
		var items = CreateElement("div", branch)
			.attr("x-sec", "items")
			
			if(item.subItems) {
				$(item.subItems).each(function(i, item) {
					var div = addItem(items, "item", item.title, item.icon == "" ? "&#xf015;": item.icon)
								.attr("id", "menu-"+item.id)
								.attr("data-selected", "0")
								.attr("data-id", item.id)
								// .attr("href", "#"+item.id)
								.data("menu", item);
					
					params.init(div, item);
				};
			};
			
		main.data("items", items);
	});
};

DesktopPainter5.prototype.selectMenu = function(id) {
	if(desktop.selectedMenu) {
		var sub = $("#sub-"+desktop.selectedMenu.data("menu").id);
		desktop.selectedMenu.attr("data-selected", "0");
		// sub.css("visibility", "hidden");
		this.showSubContainer(sub, false);
	};
	
	desktop.selectedMenu = $("#menu-" + id).attr("data-selected", "1");
	// $("#sub-" + id).css("visibility", "visible");
	this.showSubContainer($("#sub-" + id), true);
}; 

DesktopPainter5.prototype.selectMenuAnimate = function(id) {
	if(desktop.selectedMenu) {
		desktop.selectedMenu.attr("data-selected", "0");
		var o = $("#sub-"+desktop.selectedMenu.data("menu").id);
		var n = $("#sub-"+id)
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
		$("#sub-"+id).css("display", "block");
	};
	desktop.selectedMenu = $("#menu-" + id).attr("data-selected", "1");
}

// Called from desktop-base-2.js, in DesktopBase.prototype.Initialize
DesktopPainter5.prototype.loadSubPage = function(menu) {
	if(menu && !menu.loaded) {
		var url, src, pid, cssUrl, scriptUrl;

		url = menu.url.split("?"); // There really should be no ?params=xxxxx, in the url!
		pid = url[0].split("/")[1];
		src = url[0].split("/")[0];

		if(menu.css == "*")
			cssUrl = ""
		else if(menu.css == "")
			// cssUrl = ("/loadcss/{0}/css/{1}?pid={0}&sub-name={2}").format(src, pid, menu.id)
			// cssUrl = ("/loadcss/{0}/css/{1}.css?pid={0}&sub-name={2}").format(src, pid, menu.id)
			cssUrl = ("/loadcss/{0}/css/{1}.css").format(src, pid, menu.id)
		else
			cssUrl = ("/loadcss/{0}/css/{1}?pid={0}&sub-name={2}").format(src, menu.css, menu.id)
		
		if(menu.scripts == "*")
			scriptUrl = ""
		else
			// scriptUrl = ("/loadscript/{0}/scripts/{1}?pid={1}").format(src, pid);
			scriptUrl = ("/loadscript/{0}/scripts/{1}.js").format(src, pid);
			
		if(cssUrl)
			CreateElement("link", $("head"))
				.attr("href", cssUrl)
				.attr("rel", "stylesheet")
				.attr("type", "text/css");
					
		desktop.subModule = new LoadModule(menu); // LoadModule refer to desktop-2.js

		if(menu.content) {
			var self = this;
			var loadContent = ("/{0}").format(menu.content);
			
			// we expect HTML data from this call
			menu.subContainer.load(loadContent, function(content) {
				self.loadScript(menu, scriptUrl)
			});
		} else
			this.loadScript(menu, scriptUrl)
	};
	
	if(menu) {
		// this.setSubTitle(menu.title);
		this.setSubTitle(menu.description);
	}
};

DesktopPainter5.prototype.loadScript = function(menu, url) {
	if(menu.run) {		
		eval(("desktop.subModule.load({0})").format(menu.run));
	} else if(url) {
		// $.getScript(url, function(script, textStatus) {	
		desktop.getScript(url, function(script, textStatus) {	
			if(script && !menu.loaded) {
				menu.page = CreateSubPage({id:menu.id, host:desktop, container:menu.subContainer, url:menu.url, requestParams:menu.params});
				menu.loaded = true;
			};
		}, {
			cache: true
		});
	} else 
		menu.loaded = true;
};

// *************************************************************************************************
// jSideMenu
// *************************************************************************************************
function jSideMenu(params) {
	
	this.parentContainer = params.container; // this.rightPanel
	this.snapHeaderContainer = params.headerContainer; // this.headerContainer
	this.initPageControl = params.initPageControl; // this.headerContainer
	this.iconSize = defaultValue(params.iconSize, 24);
	this.iconColor = defaultValue(params.iconColor, "#1AB394");
	this.theme = defaultValue(params.theme, "side-menu");
	this.created = false;
	this.visible = false;
	
	this.show();
};

jSideMenu.prototype.toggle = function() {
	var self = this;
	$("body").on("mousedown", function(e) {	
		var dialog = $(e.target).closest("div[control-type='dlg']");
		var targetIndex = defaultValue(dialog.css("z-index"), 0);
		if(targetIndex != desktop.GetTopMostDialogIndex()) // BUT! if there is a dialog box on top of this then do not hide
			self.show();
	});
};

jSideMenu.prototype.show = function() {
	var self = this;
	
	if(this.created) {
		this.sideMenuContainer.css("display", this.visible ? "none" : "block");
		this.visible = !this.visible;
		if(!this.visible)
			$("body").off("mousedown")
		else {
			this.sideMenuContainer.css("z-index", ++desktop.zIndex);
			this.toggle();
		};
		
		return;
	};
	
	this.sideMenuContainer = CreateElementEx("div", this.parentContainer, function(sideMenuContainer) {
	// this.sideMenuContainer = CreateElementEx("div", $("body"), function(sideMenuContainer) {
		var header = self.snapHeaderContainer.find(".page-header");
		
		sideMenuContainer.addClass("side-panel");
		sideMenuContainer.attr("control-type", "dlg");
		
		sideMenuContainer.css({
			"top": header.outerHeight(),
			"height": "Calc(100% - " +header.outerHeight()+"px)",
			"z-index": ++desktop.zIndex
		});
		
		self.created = true;
		self.visible = true;
		
		new jPageControl({
			paintParams: {
				theme: self.theme,
				leftBorder: true,
				// tabsAlign: "right",
				// fullBorder: true,
				icon: {
					size: self.iconSize,
					position: "left",
					color: self.iconColor
				}
			},
			indent: 0,
			container: sideMenuContainer,
			init: function(pg) {
				self.initPageControl.trigger(pg);
			}
		});
		
		self.toggle();
	});
};
