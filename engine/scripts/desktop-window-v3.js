// *************************************************************************************************
// Last modified on
// 29-SEP-2014 ihms.0.0.0.7
// 11-FEB-2015 ihms.1.0.0.5
// 14-FEB-2015 ihms.1.0.0.6
// *************************************************************************************************
//==================================================================================================
// File name: desktop-window-v3.js
//==================================================================================================
//  Class.Inherits(DesktopWindowBase, JControl);
//      Painter: DesktopWindowPainter
//==================================================================================================

//**************************************************************************************************
// DesktopWindowBase
//**************************************************************************************************
Class.Inherits(DesktopWindowBase, JControl);
function DesktopWindowBase(Params) {
    DesktopWindowBase.prototype.parent.call(this, Params);
};

DesktopWindowBase.prototype.classID = "DesktopWindowBase";

DesktopWindowBase.prototype.Initialize = function(Params) {
    DesktopWindowBase.prototype.parent.prototype.Initialize.call(this, Params);
    this.CallerID = this.ID;
    this.ID = "Win_" + this.ID;
    this.KeyID = Params.KeyID;
    this.Title = Params.Title;
    this.Desktop = Params.Desktop;
    this.Modal = Params.Modal;
    this.Maximized = false;
    this.Minimized = false;
    this.NoResize = Params.NoResize;
    this.OnOpen = Params.OnOpen;
    
};

DesktopWindowBase.prototype.DefaultPainter = function() {
    return new DesktopWindowPainter(this);
};

DesktopWindowBase.prototype.Ready = function() {
		if(this.OnOpen) this.OnOpen(this);
};

DesktopWindowBase.prototype.DisplayMainTitle = function(SubTitle) {
};

DesktopWindowBase.prototype.ShowBusy = function(msg) {
	msg = defaultValue(msg, "Please wait");
    this.DisplayMainTitle(msg + "... <img src='/images/icons/gif-03.gif'>");
};

DesktopWindowBase.prototype.SetTitle = function(Title) {
    if(!Title) Title = this.Title;
    this.DisplayMainTitle(Title);
};

DesktopWindowBase.prototype.Paint = function() {
    this.Painter.Paint();
};

DesktopWindowBase.prototype.AfterPaint = function() {
};

DesktopWindowBase.prototype.Activate = function() {
};

DesktopWindowBase.prototype.UpdateTitles = function(PageTitle, WindowTitle) {
	desktop.PageTitle = PageTitle;
	document.title = WindowTitle;
	window.title = WindowTitle;
};

DesktopWindowBase.prototype.InActivate = function() {
    this.Element().toggle(false);
};

DesktopWindowBase.prototype.OpenFrame = function(Params) {
    this.ShowBusy();
// alerts("OK");
    var self = this;
    var frame = CreateElement("IFRAME", this.Element().data("frame-container"));
    frame.data("window", this);
    frame.attr("src", Params.url);
    frame.width(Params.width);
    frame.height(Params.height);
    frame.toggle(false);

    // frame.ready(function() {
			// alerts("1");
		// });
		
    frame.load(function() {
    // frame.ready(function() {
			// alerts("2");
        self.SetTitle(); // If removed causes "Please wait...." to stay in Mayfair policy admin. Particularly when previewing "Mayfair Card"
        if($(this)[0].contentWindow.loaded) {
            $(this)[0].contentWindow.loaded(self, $(this), Params.onOpen);

						$(this).fadeIn("slow");
            $($(this)[0].contentWindow).focus(function() {
                frame.data("window").Activate();
            });
        } else {
        	$(this).fadeIn("slow");
            Params.onOpen();
        };
    });

    return (this.Frame = frame);
};

DesktopWindowBase.prototype.OpenNonFrame = function(Params) {
    this.ShowBusy();
    var self = this;
    var frame = CreateElement("div", this.Element().data("frame-container"))
			.css("width", "100%")
			.css("height", "100%")
			.css("background", "white")
			.css("background-image", "url(/engine/images/351.gif)")
			.css("background-position", "center")
			.css("background-repeat", "no-repeat")
			.data("window", this);
			
	// Load css
	var path, css, scriptUrl;
	if(Params.path == "load") {
		path = "sub";
		css = ("/{0}/{1}").format(path, Params.url.replaceAll("/script", "/css"));
		scriptUrl = ("/{0}/{1}").format(path, Params.url);
	} else {
		path = Params.path;
		css = ("/res/{0}/{1}").format(path, Params.url.replaceAll("/script", "/css"));
		scriptUrl = ("/res/{0}/{1}").format(path, Params.url);
	};

	$("head").append($("<link type='text/css' rel='stylesheet' href='" + css + "'>"));

    $.getScript(scriptUrl, function(script, textStatus) {	
		self.Page = CreateForm(self, frame, scriptUrl);
		self.SetTitle();
    });
			
	// self.SetTitle();
	
    return (this.Frame = frame);
};

//==================================================================================================
// File name: desktop-window.js
//==================================================================================================
//  Class.Inherits(DesktopWindow, JControl);
//==================================================================================================

//**************************************************************************************************
// DesktopWindow
//**************************************************************************************************
Class.Inherits(DesktopWindow, DesktopWindowBase);
function DesktopWindow(Params) {
    DesktopWindow.prototype.parent.call(this, Params);
};

DesktopWindow.prototype.classID = "DesktopWindow";

DesktopWindow.prototype.Initialize = function(Params) {
    DesktopWindow.prototype.parent.prototype.Initialize.call(this, Params);   
};

DesktopWindow.prototype.DefaultPainter = function() {
    return new DesktopWindowPainter(this);
};

DesktopWindow.prototype.Paint = function() {
    CreateElement("div", this.Desktop.DesktopContainer, this.ID).data("window", this);		
    DesktopWindow.prototype.parent.prototype.Paint.call(this);
};

DesktopWindow.prototype.Ready = function() {
    this.Activate();
	this.Painter.AdjustSize();
    
	DesktopWindow.prototype.parent.prototype.Ready.call(this);
};

DesktopWindow.prototype.DisplayMainTitle = function(SubTitle) {
		this.Painter.SetTitle(SubTitle);
		// alerts(SubTitle);
};

DesktopWindow.prototype.Activate = function() {
	DesktopWindow.prototype.parent.prototype.Activate.call(this);

	// alerts(this.CallerID);
	// alerts("DesktopWindow.prototype.Activate");
    this.Desktop.HistoryAdd(this);
	this.SetTitle();
    this.Element().toggle(true);
    this.Element().css("z-index", this.Desktop.zIndex++);
    $("#frame-container-toolbar").css("z-index", this.Desktop.zIndex++);
};
