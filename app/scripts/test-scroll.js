// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: claim-details.js
//==================================================================================================
function CreateTestContainer(parent, noScroll) {
	parent.addClass("test-scroll");
	CreateElementEx("div", parent, function(container) {
		for(var i = 1; i < 100; i++) {
			CreateElement("div", container).html(i);
		};
	}, "test-scroll-content");
	if(!noScroll)
		new jScroller({
			target: parent
		})
};

function CreateTestPageControl(parent) {
	new jPageControl({
		paintParams: {
			css: "default",
			theme: "default",
			icon: {
				size: 24,
				position: "left"
			}
		},
		// showScrollButtons:true,
		container: parent,
		init: function(pg) {
			pg.addTab({caption:"Member's Policy Information",
				icon: {
					name: "user",
					color: "dodgerblue"
				},
				OnCreate: function(tab) {
					CreateTestContainer(tab.container);
				}
			});
			pg.addTab({caption:"Plan History",
				icon: {
					name: "history",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
				}
			});
			pg.addTab({caption:"Medical Notes",
				icon: {
					name: "notes",
					color: "darkgoldenrod"
				},
				OnCreate: function(tab) {
				}
			});
			pg.addTab({caption:"Address",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
			pg.addTab({caption:"Contacts",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
			pg.addTab({caption:"This is a test",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
			pg.addTab({caption:"John Zapanta",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
			pg.addTab({caption:"IBSI",
				icon: {
					name: "view-list",
					color: "forestgreen"
				},
				OnCreate: function(tab) {
					
				}
			});
		}
	});
};

function TestScrollerView(viewParams) {	
	new jSplitContainer($.extend(viewParams, {
		paintParams: {
			theme: "white-green-dark",
			css: "split1"
		},
		container: viewParams.container,
		orientation: "vert",
		size: 50,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				new jSplitContainer($.extend(viewParams, {
					paintParams: {
						theme: "white-green-dark",
						css: "split2"
					},
					container: container,
					orientation: "horz",
					size: 50,
					usePercent: true,
					noBorder: true,
					init: function(splitter) {
						splitter.events.OnPaintPane1.add(function(splitter, container) {
							CreateTestPageControl(container);
						});
						
						splitter.events.OnPaintPane2.add(function(splitter, container) {
							CreateTestPageControl(container);
						});
					}
				});
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				new jSplitContainer($.extend(viewParams, {
					paintParams: {
						theme: "white-green-dark",
						css: "split2"
					},
					container: container,
					orientation: "horz",
					size: 50,
					usePercent: true,
					noBorder: true,
					init: function(splitter) {
						splitter.events.OnPaintPane1.add(function(splitter, container) {
							CreateTestPageControl(container);
						});
						
						splitter.events.OnPaintPane2.add(function(splitter, container) {
							CreateTestPageControl(container);
						});
					}
				});
			});
		}
	});
};

function TestScrollerView2(viewParams) {	
	new jSplitContainer($.extend(viewParams, {
		paintParams: {
			theme: "white-green-dark",
			css: "split1"
		},
		container: viewParams.container,
		orientation: "vert",
		size: 50,
		usePercent: true,
		noBorder: true,
		init: function(splitter) {
			splitter.events.OnPaintPane1.add(function(splitter, container) {
				new jSplitContainer($.extend(viewParams, {
					paintParams: {
						theme: "white-green-dark",
						css: "split2"
					},
					container: container,
					orientation: "horz",
					size: 50,
					usePercent: true,
					noBorder: true,
					init: function(splitter) {
						splitter.events.OnPaintPane1.add(function(splitter, container) {
							// CreateTestContainer(container, true);
						});
						
						splitter.events.OnPaintPane2.add(function(splitter, container) {
							// CreateTestContainer(container);
						});
					}
				});
			});
			
			splitter.events.OnPaintPane2.add(function(splitter, container) {
				new jSplitContainer($.extend(viewParams, {
					paintParams: {
						theme: "white-green-dark",
						css: "split2"
					},
					container: container,
					orientation: "horz",
					size: 50,
					usePercent: true,
					noBorder: true,
					init: function(splitter) {
						splitter.events.OnPaintPane1.add(function(splitter, container) {
							CreateTestContainer(container);
						});
						
						splitter.events.OnPaintPane2.add(function(splitter, container) {
							CreateTestContainer(container);
						});
					}
				});
			});
		}
	});
};
