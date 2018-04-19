// ****************************************************************************************************
// Last modified on
// 06-JUL-2017
// ****************************************************************************************************
//**************************************************************************************************
// JSplitterPainter
// The default painter used by JDatePicker
//**************************************************************************************************
Class.Inherits(JSplitterPainter, JBasePainter);
function JSplitterPainter(Control) {
    JSplitterPainter.prototype.parent.call(this, Control);
};

JSplitterPainter.prototype.classID = "JSplitterPainter";

JSplitterPainter.prototype.Paint = function() {
    JSplitterPainter.prototype.parent.prototype.Paint.call(this);
	
	// console.log(this.Control.Params)
	if(this.Control.Params.container) {
		this.container = CreateElement("div", this.Control.Params.container)
			.attr("splitter-mode", "dynamic")
		
		this.target = CreateElement("div", this.container)
			.css("width", this.Control.Params.targetSize)
			
		this.splitter = CreateElement("div", this.container)
			// .css("width", "6px")
			// .css("min-width", "6px")
		
		this.target2 = CreateElement("div", this.container)
			.attr("splitter-sec", "target2")
			.css("width", "auto")
			
	} else {
		this.container = this.Control.Params.target.parent();
		this.target = this.Control.Params.target;
		this.splitter = this.Control.Params.splitter;
	};
	
	this.container.attr("control-type", "splitter");
	this.container.addClass("splitter");
	
	this.target.attr("splitter-sec", "target");
	this.splitter.attr("splitter-sec", "sizer");
	
	if(this.Control.Params.noBorder) 
		this.splitter.css("border", "0");
	
	var self = this;
	new JDrag(this.splitter, this.target, {
		Moving: true,
		Sizing: false,
		SizeOffset: 1,
		AllowDrag: function(s) {
			return true;
		},
		AllowSize: function(s) {
			return false;
		},
		InitDrag: function(s, ready) {
			// console.log("InitDrag");
			// if(ready) {
				// op = container.parent().parent().offset();
			// }
		},
		Dragging: function(s, x, y, w, h) {
			var w = s.Target.OffsetW + x;
			
			if(self.Control.Params.usePercent) {
				var ww = self.container.width();
				w = ("{0}%").format(w / ww * 100);
				// console.log({w: w, ww: ww});
			};
			
			self.target.css("width", w);
			self.target.css("min-width", w);
			
			if(self.Control.onresize)
				self.Control.onresize()
			// console.log({s:s, x:x, y:y})
			// container.parent().parent()
				// .css("top", op.top+y)
				// .css("left", op.left+x)
		},
		DragEnd: function(s) {
			// self.DisableFrame(false);
		}
	});
	
};
