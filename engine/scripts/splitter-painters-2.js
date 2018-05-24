// ****************************************************************************************************
// Last modified on
// 06-JUL-2017
// ****************************************************************************************************
// ****************************************************************************************************
//**************************************************************************************************
// jSplitterPainter
//**************************************************************************************************
Class.Inherits(jSplitterPainter, jBasePainter);
function jSplitterPainter(params) {
    jSplitterPainter.prototype.parent.call(this, params);
};

jSplitterPainter.prototype.classID = "jSplitterPainter";

jSplitterPainter.prototype.initialize = function(params) {
    jSplitterPainter.prototype.parent.prototype.initialize.call(this, params);
	
};

jSplitterPainter.prototype.paint = function(container) {
    jSplitterPainter.prototype.parent.prototype.paint.call(this, container);

	this.mainContainer = this.creaMainContainer(container, "splitter2", this.control.paintParams.theme)
		.attr("orientation", this.control.params.orientation)

	// CreateElementEx("div", this.mainContainer, function(container) {
	// });
	
	var self = this;
	this.pane1 = CreateElementEx("div", this.mainContainer, function(pane1) {
		var size = self.control.params.size;
		if(self.control.params.usePercent) 
			size = self.control.params.size +"%";
		
		pane1.css("flex-basis", size);
		if(self.control.params.orientation === "vert") {
			pane1.css("width", size)
			// pane1.css("height", "100%")
		} else {
			pane1.css("height", size);
			// pane1.css("width", "100%")
		}
		
	}, "pane1");
	
	this.sizer = CreateElementEx("div", this.mainContainer, function(sizer) {
		CreateElementEx("div", sizer, function(sizerPanel) {
			
		}, "sizer-panel")
	}, "sizer");
	
	this.pane2 = CreateElementEx("div", this.mainContainer, function(pane2) {
		var size = self.control.params.size;
		if(self.control.params.usePercent && self.control.params.orientation === "horz") 
			pane2.css("height", (100 - 6 - size) + "%") // this is for compatibility with Chrome issue
		else
			pane2.css("width", (100 - 6 - size) + "%") // this is for compatibility with Chrome issue
		
		
	}, "pane2");
	
	new jResize({
		owner:this, 
		sizer:this.sizer, 
		target:this.pane1, 
		target2:this.pane2, 
		parent:this.mainContainer, 
		orientation: this.control.params.orientation,
		initDrag: function(drag) {
			$("body").addClass("resizing-" + drag.orientation);			
			$("#desktop-container").css("pointer-events", "none");
			$(".main-desktop-split").css("pointer-events", "none");
			if(drag.orientation === "vert") {
				drag.baseSize = drag.target.outerWidth()
				drag.parentSize = drag.parent.outerWidth()
			} else {
				drag.baseSize = drag.target.outerHeight();
				drag.parentSize = drag.parent.outerHeight();
			}
		},
		dragging: function(drag, x, y) {
			var size, size2;
			if(drag.orientation === "vert")
				size = drag.baseSize + x
			else
				size = drag.baseSize + y;
			
			if(drag.owner.control.params.usePercent) {
				if(drag.orientation === "horz")
					drag.target2.css("height", 100 - 6 - (size / drag.parentSize * 100) + "%"); // this is for compatibility with Chrome issue
				else
					drag.target2.css("width", 100 - 6 - (size / drag.parentSize * 100) + "%"); // this is for compatibility with Chrome issue
				size = size / drag.parentSize * 100 + "%";
			};
			
			drag.target.css("flex-basis", size);
			if(drag.orientation === "vert")
				drag.target.css("width", size)
			else
				drag.target.css("height", size);
			
			// if(drag.owner.control.params.usePercent)
				// drag.target2.css("height", size);
		},
		dragEnd: function(drag) {
			$("body").removeClass("resizing-" + drag.orientation);
			$("#desktop-container").css("pointer-events", "");
			$(".main-desktop-split").css("pointer-events", "");
		}
	});
	
	
	this.control.events.OnPaintSizer.trigger(this.sizer);
	this.control.events.OnPaintPane1.trigger(this.pane1);
	this.control.events.OnPaintPane2.trigger(this.pane2);
};
