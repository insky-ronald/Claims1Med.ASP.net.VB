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
		if(self.scroll == "vert") {
			if(!$(this).data("scrollbar"))
				showScrollbarV($(this))
			else
				$(this).data("scrollbar").data("canDelete", false);
		} else if(self.scroll == "horz")
			showScrollbarH();
	});
	
	this.target.on("mouseleave", function(e) {
		setTimeout(function(target, scrollbar) {
			if(scrollbar.data("canDelete")) {
				target.removeData("scrollbar");
				scrollbar.remove();
			} else
				scrollbar.data("canDelete", true)
		}, 200, $(this), $(this).data("scrollbar"));
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
			var direction;
			if (e.originalEvent.wheelDelta > 0 || e.originalEvent.detail < 0) {
				direction = "left"
			}
			else {
				direction = "right"
			};
			
			var deltaX = e.originalEvent.deltaY;
			// var scroll = (deltaX) + $(this).scrollLeft();

			$(this).velocity("scroll", {duration:50, axis:"x", container:$(this), offset: direction = "left" ? deltaX : -deltaX});
			
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
	
	var showScrollbarV = function(owner) {
		CreateElementEx("div", $("body"), function(container) {		
			owner.data("scrollbar", container);
			container.data("target", owner);
			
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
				
				bar.css({
					top: top,
					height: barHeight
				});
				
				container.on("mouseenter", function(e) {
					$(this).data("canDelete", false);
				}).data("canDelete", true)
				
				container.on("mouseleave", function(e) {
					$(this).data("canDelete", true);
					
					setTimeout(function(target, scrollbar) {
						if(scrollbar.data("canDelete")) {
							target.removeData("scrollbar");
							scrollbar.remove();
						} else
							scrollbar.data("canDelete", true)
					}, 200, $(this).data("target"), $(this));
				}).data("canDelete", true)
				
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
