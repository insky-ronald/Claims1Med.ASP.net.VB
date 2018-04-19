// *************************************************************************************************
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//==================================================================================================
// File name: desktop.js
//==================================================================================================
//  Class.Inherits(Desktop, DesktopBase);
//	Class.Inherits(JSideMenu, JControl);
//	Class.Inherits(JSideMenuItem, JButton);
//==================================================================================================

//**************************************************************************************************
// Desktop()
//**************************************************************************************************
Class.Inherits(Desktop, DesktopBase);
function Desktop(Params) {
    Desktop.prototype.parent.call(this, Params);
	
};

Desktop.prototype.classID = "Desktop";
// Desktop.prototype.DrawCustomHeader = false;

Desktop.prototype.Ajax = function(caller, url, params, callback) {
	$.ajax({
		type: "post",
		url: url,
		global: false,
		cache: true,
		dataType: "json",
		data: params
	}).done(function(data) {
		if(data.status == -101 || data.status == -102) {
			// desktop.Login(data.status == -101 ? "timeout":"logout", function() {
				// window.location.reload();
			// });
		} else if(callback) {
			data.caller = caller;
			callback(data);
		}
	}).fail(function() {
		// alerts("fail");
	});
};

// Desktop.prototype.UserNameDisplay = function() {
	// return this.UserName;
// };

// Desktop.prototype.Initialize = function(Params) {
	// Desktop.prototype.parent.prototype.Initialize.call(this, Params);
// };

// Desktop.prototype.InitDesktop = function(items) {
	// Desktop.prototype.parent.prototype.InitDesktop.call(this, items);
// };

// Desktop.prototype.InitMenu = function(items) {
    // for (var i = 0; i < items.length; i++) {
        // var Link = items[i];

        // this.Toolbar.NewItem({
            // Page : this,
            // Link : Link,
            // ID : Link.ID,
            // Title : Link.Title,
            // Description : Link.Description,
			// Enabled: Link.Enabled,
            // Align : "top",
            // Painter : {
                // backgroundImage : "url(/images/brush/black-wash-40.png)",
                // iconImage : Link.Icon
            // },
            // OnClick : function(Button) {
				// if(Button.Enabled) {
					// location.hash = Button.Link.ID.toLowerCase();
				// };
            // }
        // });

        // this.Links.push(Link);
    // };
// };

// Desktop.prototype.AfterRenderMainMenu = function(toolbar) {
	// Desktop.prototype.parent.prototype.AfterRenderMainMenu.call(this, toolbar);
// };
