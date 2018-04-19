Class.Inherits(MainPage, Desktop);
function MainPage(Params) {
	MainPage.prototype.parent.call(this, Params);
};

MainPage.prototype.classID = "MainPage";

MainPage.prototype.InitializeSession = function(data) {
	MainPage.prototype.parent.prototype.InitializeSession.call(this, data);
	alerts("here")
};
