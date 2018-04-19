// ****************************************************************************************************
// Last modified on
// 26-NOV-2014 ihms.0.0.1.6
// ****************************************************************************************************
//**************************************************************************************************
// File name: dbpager.js
// used in card-view-v2.js
//**************************************************************************************************
// function BasePager(options) {
	// this.dataset = options.dataset;
	// this.container = options.container;
	// this.css = defaultValue(options.css, "pager");
// };

//**************************************************************************************************
// BasePager
//**************************************************************************************************
Class.Inherits(BasePager, JControl);
function BasePager(Params) {
	BasePager.prototype.parent.call(this, Params);
};

BasePager.prototype.classID = "BasePager";

BasePager.prototype.DefaultPainter = function() {
	// return new BasePagerPainter(this);
	return new FlatPagerPainter(this);
}

BasePager.prototype.Initialize = function(Params) {
	BasePager.prototype.parent.prototype.Initialize.call(this, Params);
	this.grid = Params.grid;
	this.dataset = Params.dataset;
	this.rowsPerPage = defaultValue(Params.rowsPerPage, [25,50,75,100]);
	this.container = Params.container;
	this.css = defaultValue(Params.css, "pager");
};

BasePager.prototype.GotoPage = function(page) {
	// this.dataset.set("page", page);
	// this.RefreshData();
	this.dataset.Methods.call("gotoPage", page);	
}

BasePager.prototype.CurrentPage = function() {
	return this.dataset.get("page")
}

BasePager.prototype.RefreshData = function() {
	this.dataset.Methods.call("query");
}

BasePager.prototype.GetPageArray = function(pageNo, pageCount) {
	var pages = [];
	var nextPage;
	
	pages.push(1);
	pages.push(2);
	pages.push(3);
	
	if(pageNo > 5 && pageCount > 10) {
		if(pageCount - pageNo < 5) {
			nextPage = pageCount - 5;		
		} else {
			nextPage = pageNo;		
		}
	} else {
		nextPage = 5;
	};

	if(nextPage != 5 && pageCount > 10) {
		pages.push("...");	
	};		
	
	pages.push(nextPage-1);
	pages.push(nextPage);
	pages.push(nextPage+1);
	pages.push(nextPage+2);
	nextPage = nextPage+3;

	if(pageCount > 7) {
		if(nextPage != pageCount-2 && pageCount > 10) {
			pages.push("...");
			nextPage = pageCount-2;
		};

		pages.push(nextPage);
		pages.push(nextPage+1);
		pages.push(nextPage+2);	
	};
	
	return pages;
}

//**************************************************************************************************
// Pager
//**************************************************************************************************
Class.Inherits(Pager, BasePager);
function Pager(Params) {
	Pager.prototype.parent.call(this, Params);
};

Pager.prototype.classID = "Pager";

Pager.prototype.Update = function() {
	this.Painter.Update();
};

//**************************************************************************************************
// FlatPagerPainter
// This is called from dbgrid-painters.js
//**************************************************************************************************
Class.Inherits(FlatPagerPainter, JBasePainter);
function FlatPagerPainter(Control) {
    FlatPagerPainter.prototype.parent.call(this, Control);
	
	this.CreatePageButton = function(container, page) {
		var btn = CreateElement("div", container)
			.attr("dsec","title")
			.attr("page", page)
			.attr("flat", "1")
			.attr("active", "0")
			.data("pagesize", page)
			.data("pager", this.Control)
			.html(page);
			
		if(page == this.Control.dataset.get("pagesize")) {
			btn.attr("active", "1");
		} else {
			btn.click(function() {
				var dataset = $(this).data("pager").dataset;
				dataset.edit();
				dataset.set("pagesize", $(this).data("pagesize"));
				dataset.post();
				if($(this).data("pager").page) {
					$(this).data("pager").page.Refresh();
				} else {
					dataset.Methods.call("gotoPage", dataset.get("page"));
				};
			});
		}
		
		return btn;
	};
};

FlatPagerPainter.prototype.classID = "FlatPagerPainter";

FlatPagerPainter.prototype.PaintPages = function(container) {
	var self = this;
	var Pager = this.Control;
	
	var pageNo = Pager.grid.page;
	// var rowCount = Pager.dataset.get("page");
	var pageCount = Pager.grid.page_count;
	
	if(this.pageInput2) this.pageInput2.val(pageNo);
	
	// container.html("");
	var pageArray = Pager.GetPageArray(pageNo, pageCount);
	$(pageArray).each(function(i,e) {
		if(i < pageCount) {
			if(isNaN(e)) {
				var page = CreateElement("div", container).attr("dsec","ellipse").html(e);
			} else {
				i = e;
				var page = CreateElement("div", container).attr("dsec","page").html(e);
				if(e == pageNo) {
					page.attr("pstate", "current");
				} else {
					page.attr("pstate", "num")
						.on({
							click: function()	 {
								Pager.dataset.Methods.call("gotoPage", parseInt($(this).html()));
								self.PaintPages(container);								
							}
						})					
				};			
			};
			
			// CreateElement("div", c1).attr("dsec","sep");
		};			
	});
};

FlatPagerPainter.prototype.Paint = function() {
    FlatPagerPainter.prototype.parent.prototype.Paint.call(this);
	var Pager = this.Control;
	
	Pager.container.html("");
	Pager.container.attr("flat", "1");
		
	var pageNo = Pager.grid.page;
	var rowCount = Pager.grid.row_count;
	var pageCount = Pager.grid.page_count;
	
	var c1 = CreateElement("div", Pager.container, "", Pager.css)
		.attr("flat", "1");
		
	this.btnPrev = CreateElement("div", c1)
		.attr("dsec","button")
		.attr("fsec","prev")
		.on({
			click: function()	 {
				if($(this).attr("bstate") == "enabled"
					Pager.GotoPage(Pager.CurrentPage()-1);
			}
		});
		
	desktop.GetSvg(this.btnPrev, "db-prevpage");
	
	this.btnNext = CreateElement("div", c1)
		.attr("dsec","button")
		.attr("fsec","next")
		.on({
			click: function()	 {
				if($(this).attr("bstate") == "enabled"
					Pager.GotoPage(Pager.CurrentPage()+1);
			}
		});
	
	desktop.GetSvg(this.btnNext, "db-nextpage");
		
	var self = this;
	var pageSelection;
	var c2 = CreateElement("div", Pager.container, "", Pager.css)
		.attr("flat", "1")
		.mouseenter(function() {
			// var p = $(this).offset();
			// var h = $(this).outerHeight();
			// var w = $(this).outerWidth();
			
			// var c = CreateElement("div", $("body"), "", "page-dialog")
				// .css("position", "absolute")
				// .css("z-index", desktop.zIndex++)
				
			// var c1 = CreateElement("div", c)
				// .attr("xsec", "content")
				
			// if(Pager.dataset.get("page_count") > 1) {
				// self.PaintPages(pageSelection = CreateElement("div", c1, "", "page-selection"));
			// };
			
			// var gotoPage = CreateElement("div", c1).attr("xsec", "goto")
				// var a = CreateElement("a", gotoPage).html("Go to page")
				// self.pageInput2 = CreateElement("input", gotoPage)
					// .val(Pager.dataset.get("page"))
					// .focus().select()
					// .keyup(function(e){
						// if(e.keyCode  == 27) {
							// $(this).blur();
						// }
					// })
					// .keypress(function(e){
						// if(e.which == 13) {						
							// if($(this).val()) {
								// Pager.GotoPage(parseInt($(this).val()));
								// self.PaintPages(pageSelection);
							// };
						// };
					// })
				
			// var c2 = CreateElement("div", c)
				// .css("height", h)
				
			// var offsetY = c.outerHeight();
			// var pos = {x:p.left, y:p.top+h-offsetY};
			
			// c.css("left", pos.x);
			// c.css("top", pos.y);
			// c.mouseleave(function() {
				// $(this).remove();
			// });
		})
		
	this.pageLabel = CreateElement("a", c2)
		.attr("dsec", "pageno")
		.click(function() {
			$(this).data("input").css("max-width", $(this).outerWidth());
			$(this).css("display", "none");
			$(this).data("input").css("display", "");
			$(this).data("input").select();
		})
	
	desktop.SetHint(this.pageLabel, function(dialog, container) {
		container.html("Enter page number...");
	}, "top");
	
	this.pageInput = CreateElement("input", c2)
		.css("display", "none")
		.keyup(function(e){
			if(e.keyCode  == 27) {
				$(this).blur();
			}
		})
		.keypress(function(e){
			if(e.which == 13) {						
				if($(this).val()) {
					Pager.GotoPage(parseInt($(this).val()));
				};
			};
		})
		.blur(function() {
			$(this).css("display", "none");
			$(this).data("label").css("display", "");
		});
		
	this.pageInput.data("label", this.pageLabel);
	this.pageLabel.data("input", this.pageInput);
	
	this.pageText = CreateElement("div", c2)
			.attr("dsec","title")
			.attr("flat", "1")
			.html("No records found");
			
	var p = CreateElement("div", Pager.container, "", Pager.css)
			.attr("flat", "1")
			.attr("xsec", "right");
			
	this.perPage = CreateElement("div", p)
			.css("float", "left")
			
	var self = this;
	$(Pager.rowsPerPage).each(function(i, v) {
		self.CreatePageButton(self.perPage, v);
	});
	// this.CreatePageButton(this.perPage, 25);
	// this.CreatePageButton(this.perPage, 50);
	// this.CreatePageButton(this.perPage, 75);
	// this.CreatePageButton(this.perPage, 100);
		
	CreateElement("div", p)
		.attr("dsec","title")
		.attr("flat", "1")
		.html("per page");
};	

FlatPagerPainter.prototype.Update = function() {
	var Pager = this.Control;
	// var PageNo = defaultValue(pageNo, Pager.dataset.get("page"));
	// var RowCount = defaultValue(rowCount, Pager.dataset.get("row_count"));
	// var PageCount = defaultValue(pageCount, Pager.dataset.get("page_count"));
	var PageNo = Pager.grid.page;
	var RowCount = Pager.grid.row_count;
	var PageCount = Pager.grid.page_count;
	// alerts(PageNo);
	if(PageNo > PageCount) {
		Pager.dataset.set("page", PageNo = PageCount);
		Pager.dataset.set("page", PageNo = 1);
	};
	
	this.pageLabel.html(PageNo);
	this.pageInput.val(PageNo);
	
	if(PageNo > 1 && PageNo <= PageCount) {
		this.btnPrev.attr("bstate", "enabled")
	} else {
		this.btnPrev.attr("bstate", "disabled")
	};

	if(PageNo < PageCount) {
		this.btnNext.attr("bstate", "enabled")
	} else {
		this.btnNext.attr("bstate", "disabled")
	};
	
	// this.pageText.html(("<a>Page {0} of {1} ({2} records)</a>").format(PageNo, PageCount, RowCount));
	this.pageText.html(("<a>of {0} ({1} records)</a>").format(PageCount, RowCount));
	
	var self = this;
	this.perPage.html("");
	$(Pager.rowsPerPage).each(function(i, v) {
		self.CreatePageButton(self.perPage, v);
	});
	// this.CreatePageButton(this.perPage, 25);
	// this.CreatePageButton(this.perPage, 50);
	// this.CreatePageButton(this.perPage, 75);
	// this.CreatePageButton(this.perPage, 100);
};
