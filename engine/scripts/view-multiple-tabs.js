// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: view-multiple-tabs.js
//==================================================================================================
function MultiTabsView(params, init) {
	this.pageControl = new JPageControl({
		owner: this,
		container: params.container,
		Painter: {
			autoHeight: false,
			theme: "main"
		},
		init: function(pg) {
			pg.add = function(caption, init) {
					pg.NewTab(caption, {
						OnCreate: function(tab) {
							// console.log(init)
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
