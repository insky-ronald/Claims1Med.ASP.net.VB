//==================================================================================================
// File name: baseform.js
//**************************************************************************************************
Class.Inherits(JBaseForm, JControl);
function JBaseForm(Params) {
	JBaseForm.prototype.parent.call(this, Params);
};

JBaseForm.prototype.classID = "JBaseForm";

JBaseForm.prototype.DefaultPainter = function() {
	return new BaseFormPainter(this);
}

JBaseForm.prototype.Element = function() {
	return this.container;
};

JBaseForm.prototype.Initialize = function(Params) {
	JBaseForm.prototype.parent.prototype.Initialize.call(this, Params);
	this.url = Params.url;
	this.container = Params.container;
	Params.DelayPainting = true;
};

JBaseForm.prototype.AfterInitialize = function(Params) {
	JBaseForm.prototype.parent.prototype.AfterInitialize.call(this, Params);
	
	// Params.url = "/res/sub/test/17/6047/script?ver=v2";
	// convert into... 
	// /sub/test/17/6067/callback?dataAction=info&ver=v2

	var self = this;
	var url = Params.url.replaceAll("/res", "").replaceAll("/script", "/callback");
	
	$.ajax({
			url: url,
			global: false,
			cache: true,
			dataType: "json",
			data: {
				dataAction:"info"
			}
	}).done(function(data) {
		self.InitializeData(data);
		self.Paint();
		self.AfterPaint();  
			// if(data.Status == 0) {
				// self.InitializeSession(data);
				// self.Paint();
				// self.AfterPaint();
				// self.InitDesktop(data.MenuItems);
			// } else {
				// if(data.Status == -1) {
					// self.Login();
				// }
			// };
	}).fail(function() {

	});
};

JBaseForm.prototype.Paint = function() {
	JBaseForm.prototype.parent.prototype.Paint.call(this);
};

JBaseForm.prototype.InitializeData = function(data) {
};
