// *************************************************************************************************
// File name: wizard.js
// Last modified on
// 
// *************************************************************************************************
// jWizard
//**************************************************************************************************
function jWizard(params) {
	var self = this;
	this.btns = {};
	
	this.methods = new MethodHandler(this);
	this.methods.add("canNext", function(wizard, def) {
		return def;
	});
	
	this.methods.add("canBack", function(wizard, def) {
		return def;
	});
	
	this.methods.add("canFinish", function(wizard, def) {
		return def;
	});
	
	this.events = {};
	this.events.OnClose = new EventHandler(this);
	this.events.OnFinish = new EventHandler(this);
	this.events.OnUpdate = new EventHandler(this);
	this.events.OnSubTitle = new EventHandler(this);
	this.events.OnSubTitle.add(function(wizard, container) {
		container.attr("x-tab", wizard.activeTabIndex());
		if (wizard.activeTab().OnSubTitle) {
			wizard.activeTab().OnSubTitle(wizard, container);
		}
	});
	this.events.OnDrawHeader = new EventHandler(this);
	
	this.events.OnUpdate.add(function(wizard) {
		var canNext = wizard.activeTab().OnNext ? wizard.activeTab().OnNext(wizard): true;
		var canBack = wizard.activeTab().OnBack ? wizard.activeTab().OnBack(wizard): true;
		var canFinish = wizard.activeTab().OnFinish ? wizard.activeTab().OnFinish(wizard): true;
		// if (wizard.activeTab().OnNext) {
			// canNext = wizard.activeTab().OnNext(wizard);
		// };
		
		// wizard.btns.back.SetEnabled((wizard.activeTabIndex() > 1) && wizard.methods.call("canBack", true));
		// wizard.btns.next.SetEnabled((wizard.activeTabIndex() < wizard.tabCount()) && wizard.methods.call("canNext", true));
		// wizard.btns.finish.SetEnabled((wizard.activeTabIndex() == wizard.tabCount()) && wizard.methods.call("canFinish", true));
		wizard.btns.back.SetEnabled((wizard.activeTabIndex() > 1) && canBack);
		wizard.btns.next.SetEnabled((wizard.activeTabIndex() < wizard.tabCount()) && canNext);
		wizard.btns.finish.SetEnabled(wizard.activeTabIndex() == wizard.tabCount() && canFinish);
		// wizard.btns.finish.SetEnabled(!((wizard.activeTabIndex() < wizard.tabCount()) && canNext));
	});
	
	CreateElementEx("div", params.container, function(container) {
		container.addClass("wizard");
		container.addClass(params.css);
		container.attr("control-type", "wizard");
		
		CreateElementEx("div", container, function(header) {
			header.attr("x-sec", "header");
			
			CreateElement("div", header)
				.attr("x-sec", "title")
				.css("color", params.color)
				.html(params.title)
			
			self.subTitle = CreateElement("div", header)
				.attr("x-sec", "sub-title")
		});
		
		new jPageControl({
			paintParams: {
				css: "pg-claim2",
				theme: "search",
				icon: {
					size: 16,
					position: "left"
				}
			},
			showScrollButtons:true,
			container: container,							
			init: function(pg) {
				self.pg = pg;
				params.prepare(self);
			}
		});
		
		self.pg.showTabs(false);
		
		CreateElementEx("div", container, function(footer) {
			footer.attr("x-sec", "footer");
			self.btns.back = CreateButton({
				container: footer,
				caption: "Back",
				style: "green",
				click: function(button) {
					if (button.enabled == "enabled") {
						self.back();
					}
				}
			});
			
			self.btns.next = CreateButton({
				container: footer,
				caption: "Next",
				style: "green",
				click: function(button) {
					if (button.enabled == "enabled") {
						self.next();
					}
				}
			});
			
			self.btns.finish = CreateButton({
				container: footer,
				caption: "Finish",
				style: "green",
				click: function(button) {
					if (button.enabled == "enabled") {
						self.finish();
					}
				}
			});
				
			CreateButton({
				container: footer,
				caption: "Close",
				enabled: true,
				style: "text",
				click: function(button) {
					self.close();
				}
			});			
		});
	});
	
	this.events.OnUpdate.trigger();
	this.events.OnSubTitle.trigger(this.subTitle);
	this.events.OnDrawHeader.trigger(this.subTitle);
};

jWizard.prototype.classID = "jWizard";

jWizard.prototype.finish = function() {
	this.events.OnFinish.trigger();
	// this.events.OnClose.trigger();
};

jWizard.prototype.close = function() {
	this.events.OnClose.trigger();
};

jWizard.prototype.update = function() {
	this.events.OnUpdate.trigger();
};

jWizard.prototype.next = function() {
	this.pg.tabs[this.activeTabIndex() + 1 -1].show();
	this.update();
	this.events.OnSubTitle.trigger(this.subTitle);
};

jWizard.prototype.back = function() {
	this.pg.tabs[this.activeTabIndex() - 1 -1].show();
	this.update();
	this.events.OnSubTitle.trigger(this.subTitle);
};

jWizard.prototype.tabCount = function() {
	return this.pg.tabs.length;
};

jWizard.prototype.activeTab = function() {
	return this.pg.activeTab;
};

jWizard.prototype.activeTabIndex = function() {
	return this.pg.activeTab.id;
};

jWizard.prototype.add = function(options) {
	var self = this;
	var tab = this.pg.addTab({caption: ("Wiz {0}").format(this.pg.tabs.length+1),
		icon: {
			name: "table",
			color: "forestgreen"
		},
		OnVisibility: function(tab, visible) {
			// if (options.OnVisibility) {
				// options.OnVisibility(wizard, visible)
			// }
		},
		OnActivate: function(tab) {
			// console.log("here")
			// self.events.OnUpdate.trigger();
			// wizard.update();
			// if (options.OnActivate) {
				// options.OnActivate(wizard)
			// }
		},
		OnCreate: function(tab) {
			tab.OnSubTitle = options.OnSubTitle;
			tab.OnNext = options.OnNext;
			tab.OnFinish = options.OnFinish;
			// if (tab.id > 1) {
				// wizard.update();
			// };
			
			options.OnCreate(self, tab.container);
			// if (options.OnActivate) {
				// options.OnActivate(wizard)
			// }
		}
	});
	
	// tab.OnSubTitle = options.OnSubTitle;
};
