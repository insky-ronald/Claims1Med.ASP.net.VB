//==================================================================================================
// File name: jbase-page.js
//==================================================================================================
//  Class.Inherits(JBasePage, JControl);
//==================================================================================================
// *************************************************************************************************
// Last modified on
// 27-SEP-2014 ihms.0.0.0.5
// *************************************************************************************************

//**************************************************************************************************
// JBasePage
//**************************************************************************************************
var __PageID = "@PageID";
__Browser = "@Browser";
__Version = "@Version";

//**************************************************************************************************
// JBasePage
//**************************************************************************************************
Class.Inherits(JBasePage, JControl);
function JBasePage(Params) {
	JBasePage.prototype.parent.call(this, Params);
	this.ActiveHint;
	this.MasksCounter = 0;
};

JBasePage.prototype.classID = "JBasePage";

JBasePage.prototype.ZIndex= function() {
	return ++this.zIndex;
};

JBasePage.prototype.Initialize = function(Params) {
    JBasePage.prototype.parent.prototype.Initialize.call(this, Params);

    this.Header = $("#header-container");
    // this.Header.css("box-sizing", "border-box");
    // this.Header.css("user-select", "none");

    this.DesktopContainer = $("#desktop-container");
    // this.DesktopContainer.css("box-sizing", "border-box");
    // this.DesktopContainer.css("user-select", "none");

    this.Footer = $("#footer-container");
    // this.Footer.css("box-sizing", "border-box");
    // this.Footer.css("user-select", "none");

    this.zIndex = 100000;
	
	// alerts(this.Header)

    $.ajaxSetup({
        global: false,
        cache: false
		//headers: { 'Authorization': "Basic XXXXX" }
    });

    function __closeDialog() {
//    	Only close if this is the top-most
//			alerts("got it");
		var greatest = 0;
		var greatestDiv;

		$('div[control-type=dlg]').each(function(){
		    if($(this).css('z-index') > greatest){
		        greatest = $(this).css('z-index');
		        greatestDiv = $(this);
		    }
		});
		
		if(greatestDiv) {
//			alerts("it works!")
			greatestDiv.trigger("dlgclose");			
		};
    };
    
	$(window).bind('keydown', function(event) {
		if(event.keyCode === 27) {
			__closeDialog();
		}
	});
    
//    $("body").on("keydown", function(e) {
    	
//    	self.Close(e);
//    });
};

JBasePage.prototype.AjaxData = function(action, params, options) {
};

JBasePage.prototype.AjaxError = function(action, result) {
};

JBasePage.prototype.AjaxFail = function(action, result) {
};

JBasePage.prototype.Ajax = function(type, action, events, options) {
    var self = this;
		var params = {};
		
		if(action !== "") {
			params.dataAction = action;
		};
       
    events = events == undefined ? {} : events;
    options = options == undefined ? {} : options;

		// if(events.init == undefined) { // events.init is part of Version 2 call
			// this.AjaxData(action, params, options);    
		// } else {
			// events.init(params, options);
		// };

		this.AjaxData(action, params, options);    
		
		if(events.init != undefined) { // events.init is part of Version 2 call
			events.init(params, options);
		};
    
    if(defaultValue(options.showHint, true)) {
    	this.ShowStatus(options.hint);	
    };
    
    $.ajax({
			url: options.url,
    	type: type,
    	cache: false,
    	data: params,
			beforeSend: function(XHR, settings) {
				if(events.preinit != undefined) { // events.init is part of Version 2 call
					events.preinit(XHR, settings);
				};			
			}
    })
    .done(function(result) {
			// alerts("done");
      self.HideStatus();
			if(events.init == undefined) { // events.init is part of Version 2 call
        if(result.Status == 0) {           
        	if(events.success) {
            	events.success(result);
            };
        } else {
        	if(events.error) {
            	events.error(result);
            } else {
            	self.AjaxError(action, result)
            }
        };
			} else {
				// Version 2 expects events.result
				if(result.Status && result.Result == undefined) {
					if(events.fail == undefined) {
						self.AjaxFail(action, result)
					} else {
						events.fail(result.Message, result.Status);
					};
				} else
					events.result(result);
			};
    }).fail(function(result, x) {
			// alerts("fail");
			self.AjaxFail(action, result)        
      self.HideStatus();
    });                     
    
};

JBasePage.prototype.SetHint = function(Element, Hint, CustomDraw) {
    var self = this;
    Element.data("hint", Hint);
    Element.data("customDraw", CustomDraw);
    Element.on({
        mouseenter: function() {
            self.ShowHint($(this));
        },
        mouseleave: function() {
            self.HideHint($(this));
        }
    });
};

JBasePage.prototype.SetHints = function(p) {
	var self = this;
	$('*').find(p.buttons)
		.each(function(i, o) {   
			if(p.hint) {
					$(o).parent().data("hint", p.hint)
					self.SetHint($(o).parent());		    	
			};
		});     
};

JBasePage.prototype.ShowHint = function(Element, Params) {
    this.ActiveHint = Element;
    var Hint = Element.data("hint");
    if(!Hint) Hint = "Hint not available";
    if(!Params) Params = Element.data("hint-params");

    var self = this;
    var busy = setTimeout(function() {
        Element.data("busy", 0);
        var Container = Element.data("hint-data");
        if(!Container) {
            var P = Element.offset();
			var customDraw = Element.data("customDraw");

            Container = CreateElement("div", $("body")).addClass("hint");
			Element.data("hint-data", Container);

			// Container.css("opacity", 0);
			Container.css("position", "absolute");
			Container.css("white-space", "nowrap");
			Container.css("width", "auto");
			Container.css("height", "auto");
			Container.css("font-family", "Arial");
			Container.css("font-size", "10pt");
			Container.css("font-weight", "bold");
			Container.css("color", self.DefaultHintSettings.foreColor);
			Container.css("z-index", ++self.zIndex+1000000);

			var Header = CreateElement("div", Container);
			Header.css("width", "100%");
			Header.css("height", "auto");

			var Pointer = CreateElement("div", Header);
			Pointer.css("margin", "auto");
			Pointer.css("width", "0");
			Pointer.css("height", "0");
			Pointer.css("border-left", "10px solid transparent");
			Pointer.css("border-right", "10px solid transparent");
			Pointer.css("border-bottom", "10px solid " + self.DefaultHintSettings.backgroundColor);
				
			var Text = CreateElement("div", Container);
			Text.css("width", "auto");
			Text.css("height", "auto");
			Text.css("padding", 4);
			Text.css("padding-left", 10);
			Text.css("padding-right", 10);
			Text.css("background-color", self.DefaultHintSettings.backgroundColor);
			Text.css("box-shadow", "1px 1px 2px rgba(0,0,0,0.5)");
			Text.css("border-radius", "2px");
			Text.append(Hint);

            var W = Element.outerWidth();
            var H = Element.height();
            var X = 0;
            var Y = 0;

            if(Params && Params.Position == "right") {

                X = P.left + W - 10;
                Y = P.top;

				Text.css("padding", 10);
				Text.css("margin-left", "20px");

				var h = 10;
				H = Text.outerHeight();
				Header.css("float", "left");
				Header.css("width", "10px");
				Header.css("height", "100%");
				Header.css("margin-top", (H-h*2)/2 + "px");

				Pointer.css("border-top", h + "px solid transparent");
				Pointer.css("border-bottom", h + "px solid transparent");
				Pointer.css("border-right", h + "px solid " + self.DefaultHintSettings.backgroundColor);

				if(customDraw) {
					var xy = customDraw(Element, X, Y, Pointer, Header, Text);					
					X = xy.X;
					Y = xy.Y;
				};
				
            } else if(Params && Params.Position == "top") {
                X = P.left + (W - Container.width()) / 2 + 1;
                Y = P.top + H + 2;

				// if(!customDraw) {
					if(X < 0) {
						Pointer.css("margin-left", Pointer.offset().left + X - 4);
						X = 4;
					};

					if(X + Container.width() > $("body").width()) {
						var offset = ((X + Container.width()) - $("body").width() + 4);
						Pointer.css("margin-left", Pointer.offset().left + offset);
						X -= offset;
					};

					if(Y + Container.height() > $("body").height()) {
						Y = (Y - Container.height() - Element.outerHeight() - 4);
						Container.append(Header);
						Pointer.css("border-top", "10px solid " + self.DefaultHintSettings.backgroundColor);
						Pointer.css("border-bottom", "");
					};
				// } else {
					// if(X + Container.width() > $("body").width()) {
						// var offset = ((X + Container.width()) - $("body").width() + 4);
						// X -= offset;
					// };

					// if(Y + Container.height() > $("body").height()) {
						// Y = (Y - Container.height() - Element.outerHeight() - 4);
						// Container.append(Header);
					// };
				// }
            } else {
                X = P.left + (W - Container.width()) / 2 + 1;
                Y = P.top + H + 2;

				// if(!customDraw) {
					if(X < 0) {
						Pointer.css("margin-left", Pointer.offset().left + X - 4);
						X = 4;
					};

					if(X + Container.width() > $("body").width()) {
						var offset = ((X + Container.width()) - $("body").width() + 4);
						Pointer.css("margin-left", Pointer.offset().left + offset);
						X -= offset;
					};

					if(Y + Container.height() > $("body").height()) {
						Y = (Y - Container.height() - Element.outerHeight() - 4);
						Container.append(Header);
						Pointer.css("border-top", "10px solid " + self.DefaultHintSettings.backgroundColor);
						Pointer.css("border-bottom", "");
					};
				// };
            }

            Container.css("top", Y);
            Container.css("left", X);
            // Container.stop(100).animate({"opacity": 1});
        };

    }, 250);

    Element.data("busy", busy)
};

JBasePage.prototype.HideHint = function(Element) {
    if(!Element) {
        Element = this.ActiveHint;  
    };

    if(!Element) {
        return;
    };
    
    var busy = Element.data("busy");
    if(busy) {
        clearTimeout(busy);
        return;
    };

    var Container = Element.data("hint-data");
    if(Container) {
        Container.remove();
    //  Container.fadeOut(50,function(){ $(this).remove() });
        Element.removeData("hint-data");    
    }
};

JBasePage.prototype.Lock = function() {
    var Mask = CreateElement("div", $("body"));
    Mask.css("position", "absolute");
    Mask.css("top", 0);
    Mask.css("left", 0);
    Mask.css("width", "100%");
    Mask.css("height", "100%");
    Mask.css("opacity", 0.25);
    Mask.css("background-color", "black");
    Mask.css("z-index", ++this.zIndex);
    Mask.attr("id", "mask" + ++this.MasksCounter);
    return this.zIndex;
};

JBasePage.prototype.UnLock = function() {
	$("#mask" + this.MasksCounter--).remove();
};