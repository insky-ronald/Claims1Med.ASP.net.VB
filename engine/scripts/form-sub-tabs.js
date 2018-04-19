// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: form-sub-tabs.js
//==================================================================================================
function MultiTabsView(params, init) {
	this.pageControl = new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: false,
			theme: "data-entry"
			// theme: defaultValue(params.theme, "main")
		},
		init: function(pg) {
			pg.add = function(caption, init) {
					pg.NewTab(caption, {
						OnCreate: function(tab) {
							tab.content.attr("x-sec", "tabview");
							init(tab);
						}
					})
			};
			
			// pg.owner.PrepareTabs(pg);
			init(pg);
		}
	});
};

Class.Inherits(SubPageTabs, SubPageData);
function SubPageTabs(Params) {
	SubPageTabs.prototype.parent.call(this, Params);
};

SubPageTabs.prototype.classID = "SubPageTabs";
SubPageTabs.prototype.showHeader = false;
SubPageTabs.prototype.showFooter = false;

SubPageTabs.prototype.PrepareTabs = function(pg) {
};

SubPageTabs.prototype.Paint = function() {
	SubPageTabs.prototype.parent.prototype.Paint.call(this);
	
	this.pageControl = new JPageControl({
		owner: this,
		container: this.Painter.content,
		Painter: {
			// indent: 0,
			// spacing: 1,
			// margin: 4,
			// gutter: 20,
			autoHeight: false,
			theme: "main"
		},
		init: function(pg) {
			pg.add = function(caption, init) {
					pg.NewTab(caption, {
						OnCreate: function(tab) {
							tab.content.attr("x-sec", "tabview");
							init(tab);
						}
					})
			};
			
			pg.owner.PrepareTabs(pg);
		}
	});
};
