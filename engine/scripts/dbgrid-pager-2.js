// *************************************************************************************************
// File name: dbgrid-pager-2.js
// Last modified on
// 25-JUL-2017
// *************************************************************************************************
//**************************************************************************************************
// jPager
//**************************************************************************************************
Class.Inherits(jPager, jControl)
function jPager(params) {
	jPager.prototype.parent.call(this, params)
}

jPager.prototype.classID = "jPager"
jPager.prototype.controlType = "pager"
jPager.prototype.painterClass = jPagerPainter
jPager.prototype.paintImediately = true

jPager.prototype.initialize = function(params) {
    jPager.prototype.parent.prototype.initialize.call(this, params)
	
	this.grid = params.grid
	this.dataset = params.grid.dataset
	this.rowsPerPage = defaultValue(params.rowsPerPage, [25,50,75,100])
	
	// this.dataset = params.grid.dataset
}

jPager.prototype.gotoPage = function(page) {
	this.grid.dataParams.set("page", page)
	this.grid.refresh()	
}

jPager.prototype.prevPage = function() {
	var page = this.grid.dataParams.get("page")
	
	if(page > 1) 
		this.gotoPage(page-1)
	else
		// this.painter.label1.trigger("off")
}

jPager.prototype.nextPage = function() {
	var page = this.grid.dataParams.get("page")
	
	if(page < this.grid.page_count)
		this.gotoPage(page+1)
	else
		
}

jPager.prototype.update = function() {
	this.painter.update()
}

//**************************************************************************************************
// jPagerPainter
//**************************************************************************************************
Class.Inherits(jPagerPainter, jBasePainter)
function jPagerPainter(params) {
	jPagerPainter.prototype.parent.call(this, params)
}

jPagerPainter.prototype.type = "grid"
jPagerPainter.prototype.classID = "jPagerPainter"

jPagerPainter.prototype.update = function() {
	this.label1.trigger("update")
	this.label2.trigger("update")
	this.btnPrev.trigger("update")
	this.btnNext.trigger("update")
	this.pages.trigger("update")
}

jPagerPainter.prototype.paint = function(container) {
    jPagerPainter.prototype.parent.prototype.paint.call(this, container)
	
	var self = this
	var grid = this.control.grid
	var mainContainer = this.creaMainContainer(container, "pager2", this.control.paintParams.theme)
	
	CreateElementEx("div", mainContainer, function(buttonContainer) {
		buttonContainer.attr("pager-sec", "button-container")
		
		CreateElementEx("div", buttonContainer, function(btn) {
			btn.attr("button-sec", "prev")
			
			self.btnPrev = desktop.GetSvg(btn, "db-prevpage")
				.on("update", function() {
					if(grid.page == 1)
						$(this).attr("active", "off")
					else
						$(this).attr("active", "on")
				})
				.click(function() {
					self.control.prevPage()
				})
		})
		
		CreateElementEx("div", buttonContainer, function(btn) {
			btn.attr("button-sec", "next")
			
			self.btnNext = desktop.GetSvg(btn, "db-nextpage")
				.on("update", function() {
					if(grid.page == grid.page_count)
						$(this).attr("active", "off")
					else
						$(this).attr("active", "on")
				})
				.click(function() {
					self.control.nextPage()
				})
		})
	})
	
	CreateElementEx("div", mainContainer, function(pageLabel) {
		pageLabel.attr("pager-sec", "page-label-container")
		
		self.label1 = CreateElementEx("label", pageLabel, function(label) {
			label.attr("pager-sec", "page-label-1")
				.on("update", function() {
					$(this).html(grid.page)
				})
		})
		
		self.label2 = CreateElementEx("label", pageLabel, function(label) {
			label.attr("pager-sec", "page-label-2")
				.on("update", function() {
					$(this).html(("of {0} ({1} records)").format(grid.page_count, grid.row_count))
				})
		})
	})

	self.pages = CreateElementEx("div", mainContainer, function(pagesContainer) {
		pagesContainer.attr("pager-sec", "pages-container")
		
		$(self.control.rowsPerPage).each(function(i, pages) {
			CreateElement("div", pagesContainer)
				.attr("page-sec", "page-count")
				.attr("active", "0")
				.attr("page", pages)
				.html(pages)
				.click(function() {
					var pageSize = parseInt($(this).attr("page"))
					
					if(pageSize !== grid.dataParams.get("pagesize")) {
						grid.dataParams.set("pagesize", pageSize)
						grid.refresh()
					}
				})
		})
		
		CreateElement("label", pagesContainer).html("per page")
	}).on("update", function() {
		$(this).find("div[active='1']")
			.attr("active", "0")
			
		$(this).find("div[page='"+grid.dataParams.get("pagesize")+"']")
			.attr("active", "1")
	})

}

jPagerPainter.prototype.getPageArray = function(pageNo, pageCount) {
	var pages = []
	var nextPage
	
	pages.push(1)
	pages.push(2)
	pages.push(3)
	
	if(pageNo > 5 && pageCount > 10) {
		if(pageCount - pageNo < 5) {
			nextPage = pageCount - 5		
		} else {
			nextPage = pageNo		
		}
	} else {
		nextPage = 5
	}

	if(nextPage != 5 && pageCount > 10) {
		pages.push("...")	
	}		
	
	pages.push(nextPage-1)
	pages.push(nextPage)
	pages.push(nextPage+1)
	pages.push(nextPage+2)
	nextPage = nextPage+3

	if(pageCount > 7) {
		if(nextPage != pageCount-2 && pageCount > 10) {
			pages.push("...")
			nextPage = pageCount-2
		}

		pages.push(nextPage)
		pages.push(nextPage+1)
		pages.push(nextPage+2)	
	}
	
	return pages
}

