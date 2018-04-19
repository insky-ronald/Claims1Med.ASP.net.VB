// ****************************************************************************************************
// File name: edit-claim-details.js
// Last modified on
// 
// ****************************************************************************************************
function jScroller(params) {
	this.scroll = defaultValue(params.scroll, "vert");
	this.target = params.target;
	this.target.css({
		"overflow": "hidden"
	});
	
	var self = this;
	this.target.on("mouseenter", function(e) {
		if(self.scroll == "vert")
			showScrollbarV()
		else if(self.scroll == "horz")
			showScrollbarH();
	});
	
	this.target.on("mouseleave", function(e) {
		// if(self.scroll == "vert")
			$("body").data("scrollbar").remove();
	});
	
	
	var self = this;

	if(self.scroll == "horz") {
		this.target.on("scroll", function(e) {
			var scroll = $(this).scrollLeft();
			var offsetX = self.calcTopPositionX(scroll, self.barX.outerWidth());
			var targetWidth = $(this).outerWidth();
			var barWidth = self.barX.outerWidth();
			var left =(targetWidth - barWidth) * offsetX;
			
			// console.log(left)
			self.barX.css("left", left);
		});
		
		this.target.on("wheel", function(e) {
		// this.target.on("wheel DOMMouseScroll", function(e) {
		// this.target.on("DOMMouseScroll", function(e) {
			var direction;
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				direction = "left"
			}
			else {
				direction = "right"
			};
			
			// console.log(e.originalEvent.deltaY);
			var deltaX = e.originalEvent.deltaY;
			// var deltaX = direction = "left" ? 100: -100;
			var scroll = (deltaX) + $(this).scrollLeft();
			
			console.log({deltaX:deltaX,scroll:scroll})
			// var offsetX = self.calcTopPositionX(scroll, self.barX.outerWidth());
			// var scrollLeft = $(this).scrollLeft();
			// if(offsetX >= 0 && offsetX <= 1) {
				// $(this).scrollLeft(scroll);
				// $(this).animate({scrollTop:scroll}, 100);
				// $(this).velocity("scroll", {duration:50, axis:"y", container:$(this), offset: direction = "down" ? deltaX : -deltaX});
				$(this).velocity("scroll", {duration:50, axis:"x", container:$(this), offset: direction = "left" ? deltaX : -deltaX});
			// };
			
		});
	} else if(self.scroll == "vert") {
		this.target.on("scroll", function(e) {
			var scroll = $(this).scrollTop();
			var offsetY = self.calcTopPositionY(scroll, self.barY.outerHeight());
			var targetHeight = $(this).outerHeight();
			var barHeight = self.barY.outerHeight();
			var top =(targetHeight - barHeight) * offsetY;
			
			self.barY.css("top", top);
			// self.barY.velocity({"top": top}, {duration:50});
		});
		
		this.target.on("wheel DOMMouseScroll", function(e) {
			var direction;
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				direction = "up"
			}
			else {
				direction = "down"
			};
			
			// https://stackoverflow.com/questions/5527601/normalizing-mousewheel-speed-across-browsers
			// Reasonable defaults
			var PIXEL_STEP = 10;
			var LINE_HEIGHT = 40;
			var PAGE_HEIGHT = 800;

			var sX = 0,
				sY = 0; // spinX, spinY
			var pX = 0,
				pY = 0; // pixelX, pixelY

			// Legacy
			if ('detail' in e) {
				// sY = e.detail;
				sY = e.originalEvent.detail;
			}
			if ('wheelDelta' in e) {
				// sY = -e.wheelDelta / 120;
				sY = -e.originalEvent.wheelDelta / 120;
			}
			if ('wheelDeltaY' in e) {
				// sY = -e.wheelDeltaY / 120;
				sY = -e.originalEvent.wheelDeltaY / 120;
			}
			if ('wheelDeltaX' in e) {
				// sX = -e.wheelDeltaX / 120;
				sX = -e.originalEvent.wheelDeltaX / 120;
			}

			// console.log({sX:sX, sY:sY, pX:pX, pY:pY});
			// console.log({detail:e.originalEvent.detail, wheelDelta:e.originalEvent.wheelDelta, wheelDeltaY:e.originalEvent.wheelDeltaY, wheelDeltaX:e.originalEvent.wheelDeltaX });
			// console.log({detail:e.detail, wheelDelta:e.wheelDelta, wheelDeltaY:e.wheelDeltaY, wheelDeltaX:e.wheelDeltaX });
			// console.log({axis:e, wheelDelta:e.wheelDelta, wheelDeltaY:e.wheelDeltaY, wheelDeltaX:e.wheelDeltaX });
			// console.log(e);
			
			if ('axis' in e && e.originalEvent.axis === e.HORIZONTAL_AXIS) {
				sX = sY;
				sY = 0;
			};

			pX = sX * PIXEL_STEP;
			pY = sY * PIXEL_STEP;

			if ((pX || pY) && e.originalEvent.deltaMode) {
				if (e.originalEvent.deltaMode == 1) { // delta in LINE units
					pX *= LINE_HEIGHT;
					pY *= LINE_HEIGHT;
				} else { // delta in PAGE units
					pX *= PAGE_HEIGHT;
					pY *= PAGE_HEIGHT;
				}
			}

			// Fall-back if spin cannot be determined
			if (pX && !sX) {
				sX = (pX < 1) ? -1 : 1;
			}
			if (pY && !sY) {
				sY = (pY < 1) ? -1 : 1;
			}
  
			
			
			var deltaY = e.originalEvent.deltaY;
			var scroll = deltaY + $(this).scrollTop();
			var offsetY = self.calcTopPositionY(scroll, self.barY.outerHeight());
			var scrollTop = $(this).scrollTop();
			
			// if(offsetY >= 0 && offsetY <= 1) {
				$(this).velocity("scroll", {duration:50, axis:"y", container:$(this), offset: direction = "down" ? deltaY : -deltaY});
				// $(this).scrollTop(scroll);
			// };
			
			e.preventDefault();
		});
	};
	var showScrollbarH = function() {
		CreateElementEx("div", $("body"), function(container) {
			$("body").data("scrollbar", container);
			
			var offset = self.target.offset();
			var height = self.target.outerHeight();
			var scrollWidth = self.target.prop("scrollWidth");
			var targetWidth = self.target.outerWidth();
			
			container.css({
				top: offset.top + height - 12 + 3,
				left: offset.left,
				width: targetWidth,
				"z-index": ++desktop.zIndex
			});
			
			self.barX = CreateElementEx("div", container, function(bar) {
				var barWidth = 0;
				
				if(scrollWidth > targetWidth) {
					barWidth = targetWidth / scrollWidth;// * 100;
					barWidth = Math.round(targetWidth * barWidth);
				};
				
				// console.log(barWidth)
				if(barWidth > 0 && barWidth < 24)
					barWidth = 24;
				
				var left = (targetWidth - barWidth) * self.calcTopPositionX(self.target.scrollLeft(), barWidth);
				
				bar.css({
					left: left,
					width: barWidth
				});
				
			}, "__scrollx");
		}, "__scroller __scroll_container_x");
	};
	
	var showScrollbarV = function() {
		CreateElementEx("div", $("body"), function(container) {
			$("body").data("scrollbar", container);
			
			var offset = self.target.offset();
			var width = self.target.outerWidth();
			var scrollHeight = self.target.prop("scrollHeight");
			var targetHeight = self.target.outerHeight();
			
			container.css({
				top: offset.top,
				left: offset.left + width - 12,
				height: targetHeight,
				"z-index": ++desktop.zIndex
			});
			
			self.barY = CreateElementEx("div", container, function(bar) {
				var barHeight = 100;
				
				if(scrollHeight > targetHeight) {
					barHeight = targetHeight / scrollHeight;// * 100;
					barHeight = Math.round(targetHeight * barHeight);
				};
				
				if(barHeight < 24)
					barHeight = 24;
				
				var top = (targetHeight - barHeight) * self.calcTopPositionY(self.target.scrollTop(), barHeight);
				
				// console.log({scroll:scroll, barHeight:barHeight, top:top, offsetY:offsetY});
				
				bar.css({
					top: top,
					height: barHeight
				});
				
			}, "__scrolly");
		}, "__scroller __scroll_container_y");
		
		
	};
};

jScroller.prototype.calcTopPositionY = function(scroll, barHeight) {
	var scrollHeight = this.target.prop("scrollHeight");
	var targetHeight = this.target.outerHeight();
	var offsetY =  Math.round(scroll / (scrollHeight - targetHeight) * 100);
	if(offsetY < 1) 
		offsetY = 0
	else if(offsetY > 100) 
		offsetY = 1
	else
		offsetY = offsetY / 100;
	
	return offsetY;
};

jScroller.prototype.calcTopPositionX = function(scroll, barWidth) {
	var scrollWidth = this.target.prop("scrollWidth");
	var targetWidth = this.target.outerWidth();
	var offsetX =  Math.round(scroll / (scrollWidth - targetWidth) * 100);
	if(offsetX < 1) 
		offsetX = 0
	else if(offsetX > 100) 
		offsetX = 1
	else
		offsetX = offsetX / 100;
	
	return offsetX;
};
