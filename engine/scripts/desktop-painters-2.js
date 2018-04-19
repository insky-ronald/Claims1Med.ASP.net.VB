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

DesktopPainter.prototype.setTitle = function(title, subTitle, icon) {
	this.desktopTitle.html(title);
	if(subTitle)
		this.desktopSubTitle.html(subTitle);
};

DesktopPainter.prototype.setSubTitle = function(subTitle, icon) {
	this.desktopSubTitle.html(subTitle);
};

DesktopPainter.prototype.paintHeader = function(container, data) {
	
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
					name.html("Matthew Bleach")
				});
				CreateElementEx("div", name, function(name) {
					name.attr("x-sec", "role")
					name.html("Administrator")
					// name.html(location.hostname)
				});
			}, "user-name");
		}, "user-detail");
	}, "user-info");
	
	var self = this;
	var btnSize = 32;
	
	CreateElementEx("div", container, function(toolbarContainer) {
		CreateElementEx("div", toolbarContainer, function(toolbar) {
			toolbar.attr("control-type", "toolbar");
			
			CreateElementEx("ul", toolbar, function(buttons) {
				
				// Right side panel menu button
				CreateElementEx("li", buttons, function(menu) {
					menu
						.attr("control-type", "tool-btn")
						.css("float", "right")
						.click(function() {
							if(!desktop.links) {
								desktop.links = CreateElement("div", $("#inner-data-container")).attr("id", "tools-container");
								var div = CreateElement("div", desktop.links).attr("tool-sec", "menu");
											
								self.createNavigatorMenu({
									container: CreateElement("div", div),
									theme: "links",
									menus: desktop.systemData.link_items,
									init: function(container, item) {
										if(item.url)
											container.attr("href", "/" + item.url)
										else
											container.attr("href", "/app/" + item.id);
									}
								});
							} else {
								desktop.links.remove();
								desktop.links = null;
							}
						});
						
					desktop.GetSvg(menu, "menu", btnSize);
				})
					
				// Logout button
				CreateElementEx("li", buttons, function(logout) {
					logout.attr("control-type", "tool-btn").css("float", "right");
					desktop.GetSvg(logout, "logout", btnSize, {noTopMargin: true}); //.css("margin-top", "25%")
					desktop.SetHint(logout, function(dialog, container) {
						container.html("Logout");
					}, "bottom");
				}).click(function() {
						desktop.Ajax(self, "/api/session/logout", undefined, function(data) {
							if (data.Status == 0) {
								window.location.href = ""
							}
						})
						});

				// Home button
				if(window.location.pathname != "/" ) {
					CreateElementEx("li", buttons, function(home) {
						home.attr("control-type", "tool-btn").css("float", "right");
						desktop.GetSvg(home, "home", btnSize, {noTopMargin: true});
						desktop.SetHint(home, function(dialog, container) {
							container.html("Go to home page");
						}, "bottom");
					}).click(function() {
						window.location = "/"
					});
				};
				
				desktop.Events.OnHeaderToolbar.trigger(buttons);
			});
			
		}, "toolbar tb-theme-main")
	}, "toolbar-container")
	
	// var toolbarContainer = CreateElement("div", container).addClass("toolbar-container")
	// var toolbar = CreateElement("div", toolbarContainer).addClass("toolbar tb-theme-main").attr("control-type", "toolbar");
	// var buttons = CreateElement("ul", toolbar);

};

DesktopPainter.prototype.paintSubContainer = function(container, data) {
	var self = this, parentContainer = $("#sub-data-container");
	
	CreateElementEx("div", parentContainer, function(titleContainer) {
		CreateElementEx("div", titleContainer, function(dataHeader) {
			dataHeader.attr("id", "parent-sub-header");
			self.desktopIcon = CreateElement("label", dataHeader).attr("x-sec", "icon");
			self.desktopTitle = CreateElement("label", dataHeader).attr("x-sec", "title");
			CreateElement("label", dataHeader).attr("x-sec", "quo").html("»");
			self.desktopSubTitle = CreateElement("label", dataHeader).attr("x-sec", "sub-title");
		});
	});

	CreateElementEx("div", parentContainer, function(container) {
		container.attr("id", "page-custom-header");
		self.Control.Events.OnPaintCustomHeader.trigger(container)
	});
	
	CreateElement("div", parentContainer).attr("id", "parent-sub-container");
	
	// var dataHeader = CreateElement("div", parentContainer).attr("id", "parent-sub-header");
		// this.desktopIcon = CreateElement("label", dataHeader).attr("x-sec", "icon");
		// this.desktopTitle = CreateElement("label", dataHeader).attr("x-sec", "title")
		// CreateElement("label", dataHeader).attr("x-sec", "quo").html("»")
		// this.desktopSubTitle = CreateElement("label", dataHeader).attr("x-sec", "sub-title")
	
	// var dataContainer = CreateElement("div", parentContainer).attr("id", "parent-sub-container");
};

DesktopPainter.prototype.paintNavigator = function(container, menus) {
	var dataContainer = $("#parent-sub-container");
	// this.paintNavigatorMenu(container, "default", menus, function(item) {
		// item.subContainer = CreateElement("div", dataContainer)
			// .addClass("sub-container")
			// .attr("id", "sub-"+ item.id)
			// .css("visibility", "hidden")
	// })
	// console.log(menus);
	var self = this;
	this.createNavigatorMenu({
		container: container,
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

DesktopPainter.prototype.showSubContainer = function(container, visible) {
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

DesktopPainter.prototype.createNavigatorMenu = function(params) {
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

DesktopPainter.prototype.selectMenu = function(id) {
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

DesktopPainter.prototype.selectMenuAnimate = function(id) {
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
DesktopPainter.prototype.loadSubPage = function(menu) {
	if(menu && !menu.loaded) {
		var url, src, pid, cssUrl, scriptUrl;

		url = menu.url.split("?"); // There really should be no ?params=xxxxx, in the url!
		pid = url[0].split("/")[1];
		src = url[0].split("/")[0];

		if(menu.css == "*")
			cssUrl = ""
		else if(menu.css == "")
			cssUrl = ("/loadcss/{0}/css/{1}?pid={0}&sub-name={2}").format(src, pid, menu.id)
		else
			cssUrl = ("/loadcss/{0}/css/{1}?pid={0}&sub-name={2}").format(src, menu.css, menu.id)
		
		if(menu.scripts == "*")
			scriptUrl = ""
		else
			scriptUrl = ("/loadscript/{0}/scripts/{1}?pid={1}").format(src, pid);
			
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

DesktopPainter.prototype.loadScript = function(menu, url) {
	if(menu.run) {		
		eval(("desktop.subModule.load({0})").format(menu.run));
	} else if(url) {
		$.getScript(url, function(script, textStatus) {	
			if(script && !menu.loaded) {
				menu.page = CreateSubPage({id:menu.id, host:desktop, container:menu.subContainer, url:menu.url, requestParams:menu.params});
				menu.loaded = true;
			};
		}, {
			cache: false
		});
	} else 
		menu.loaded = true;
};