// *************************************************************************************************
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//==================================================================================================
// File name: desktop-2.js
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
Desktop.prototype.navigatorTheme = "default";

Desktop.prototype.DefaultPainter = function() {
	return new DesktopPainter(this);
}

Desktop.prototype.Ajax = function(caller, url, params, callback) {
	// $.ajax({
	this.ajax({
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

Desktop.prototype.GetSvg = function(e, svg, size, settings) {
	return this.svg.draw(e, svg, size);
};

Desktop.prototype.RegisterSvg = function(name, size, html, base) {
	this.svg.add(name, size, html);
};

Desktop.prototype.CloneSvg = function(newName, name) {
	this.svg.clone(newName, name);
};

Desktop.prototype.Initialize = function(Params) {
	Desktop.prototype.parent.prototype.Initialize.call(this, Params);
	
	this.Events.OnSideMenuPageControl.add(function(desktop, pg) {
		pg.addTab({caption:"",
			hideCaption: true,
			icon: {
				name: "user"
			},
			OnCreate: function(tab) {
				
			}
		});
	});
	
	this.Events.OnDeveloperMenuPageControl.add(function(desktop, pg) {
		// pg.addTab({caption:"source codes",
			// icon: {
				// name: "settings",
				// color: "slateblue"
			// },
			// OnCreate: function(tab) {
				// tab.container.addClass("session-info");

				// CreateElementEx("div", tab.container, function(container) {
					// container.attr("x-sec", "content");

					// desktop.ajax({
						// url: "/engine/source-codes.aspx",
						// type: "GET",
						// data: {
							// main:"",
							// sub: ""
						// },
						// success: function(response) {
							// container.html(response);
						// }
					// });
				// });
			// }
		// });
		pg.addTab({caption:"app",
			// hideCaption: true,
			icon: {
				name: "application"
			},
			OnCreate: function(tab) {
				tab.container.addClass("session-info");

				CreateElementEx("div", tab.container, function(container) {
					container.attr("x-sec", "content");

					desktop.ajax({
						url: "/engine/tools.aspx",
						type: "GET",
						success: function(response) {
							container.html(response);
						}
					});
				});
				
			}
		});
		pg.addTab({caption:"icons",
			icon: {
				name: "icons",
				color: "#51ABDA"
			},
			OnCreate: function(tab) {
				tab.container.addClass("system-icons");
				CreateElementEx("div", tab.container, function(container) {
					container.attr("x-sec", "icons");
					SystemIcons({container: container});
				});
			}
		});
	});
};

Desktop.prototype.InitializeSession = function(data) {
	Desktop.prototype.parent.prototype.InitializeSession.call(this, data);
	
	this.RegisterSvg("circle", 76, '<path d="M 38,0.791664C 58.5496,0.791664 75.2083,17.4504 75.2083,38C 75.2083,58.5496 58.5496,75.2083 38,75.2083C 17.4504,75.2083 0.791662,58.5496 0.791662,38C 0.791662,17.4504 17.4504,0.791664 38,0.791664 Z M 38,5.54166C 20.0738,5.54166 5.54167,20.0738 5.54167,38C 5.54167,55.9262 20.0738,70.4583 38,70.4583C 55.9262,70.4583 70.4583,55.9262 70.4583,38C 70.4583,20.0738 55.9262,5.54166 38,5.54166 Z "/>');
	// this.RegisterSvg("circle2", 76, '<circle cx="50" cy="50" r="40" stroke="green" stroke-width="4" fill="yellow" />');
	// this.CloneSvg("c", "circle");
	
	this.RegisterSvg("account", 24, '<path d="M12,4A4,4 0 0,1 16,8A4,4 0 0,1 12,12A4,4 0 0,1 8,8A4,4 0 0,1 12,4M12,14C16.42,14 20,15.79 20,18V20H4V18C4,15.79 7.58,14 12,14Z" />');
	this.RegisterSvg("account-check", 24, '<path d="M9,5A3.5,3.5 0 0,1 12.5,8.5A3.5,3.5 0 0,1 9,12A3.5,3.5 0 0,1 5.5,8.5A3.5,3.5 0 0,1 9,5M9,13.75C12.87,13.75 16,15.32 16,17.25V19H2V17.25C2,15.32 5.13,13.75 9,13.75M17,12.66L14.25,9.66L15.41,8.5L17,10.09L20.59,6.5L21.75,7.91L17,12.66Z" />');
	this.RegisterSvg("account-key", 24, '<path d="M11,10V12H10V14H8V12H5.83C5.42,13.17 4.31,14 3,14A3,3 0 0,1 0,11A3,3 0 0,1 3,8C4.31,8 5.42,8.83 5.83,10H11M3,10A1,1 0 0,0 2,11A1,1 0 0,0 3,12A1,1 0 0,0 4,11A1,1 0 0,0 3,10M16,14C18.67,14 24,15.34 24,18V20H8V18C8,15.34 13.33,14 16,14M16,12A4,4 0 0,1 12,8A4,4 0 0,1 16,4A4,4 0 0,1 20,8A4,4 0 0,1 16,12Z" />');
	this.RegisterSvg("account-multiple", 24, '<path d="M16,13C15.71,13 15.38,13 15.03,13.05C16.19,13.89 17,15 17,16.5V19H23V16.5C23,14.17 18.33,13 16,13M8,13C5.67,13 1,14.17 1,16.5V19H15V16.5C15,14.17 10.33,13 8,13M8,11A3,3 0 0,0 11,8A3,3 0 0,0 8,5A3,3 0 0,0 5,8A3,3 0 0,0 8,11M16,11A3,3 0 0,0 19,8A3,3 0 0,0 16,5A3,3 0 0,0 13,8A3,3 0 0,0 16,11Z" />');
	this.RegisterSvg("alert-circle-outline", 24, '<path d="M11,15H13V17H11V15M11,7H13V13H11V7M12,2C6.47,2 2,6.5 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20Z" />');
	this.RegisterSvg("arrow-left-drop-circle-outline", 24, '<path d="M22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12M14,7L9,12L14,17V7Z" />');
	this.RegisterSvg("arrow-right-drop-circle-outline", 24, '<path d="M2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2A10,10 0 0,0 2,12M4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12M10,17L15,12L10,7V17Z" />');
	this.RegisterSvg("autorenew", 24, '<path d="M12,6V9L16,5L12,1V4A8,8 0 0,0 4,12C4,13.57 4.46,15.03 5.24,16.26L6.7,14.8C6.25,13.97 6,13 6,12A6,6 0 0,1 12,6M18.76,7.74L17.3,9.2C17.74,10.04 18,11 18,12A6,6 0 0,1 12,18V15L8,19L12,23V20A8,8 0 0,0 20,12C20,10.43 19.54,8.97 18.76,7.74Z" />');
	this.RegisterSvg("calendar-blank", 24, '<path d="M19,19H5V8H19M16,1V3H8V1H6V3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3H18V1"/>');
	this.RegisterSvg("check-circle-outline", 24, '<path d="M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2M12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4M11,16.5L6.5,12L7.91,10.59L11,13.67L16.59,8.09L18,9.5L11,16.5Z" />');
	this.RegisterSvg("checkbox-blank-outline", 24, '<path d="M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3M19,5V19H5V5H19Z" />');
	this.RegisterSvg("chevron-double-down", 24, '<path d="M16.59,5.59L18,7L12,13L6,7L7.41,5.59L12,10.17L16.59,5.59M16.59,11.59L18,13L12,19L6,13L7.41,11.59L12,16.17L16.59,11.59Z" />');
	this.RegisterSvg("chevron-down", 24, '<path d="M7.41,8.58L12,13.17L16.59,8.58L18,10L12,16L6,10L7.41,8.58Z" />');
	this.RegisterSvg("chevron-right", 24, '<path d="M8.59,16.58L13.17,12L8.59,7.41L10,6L16,12L10,18L8.59,16.58Z" />');
	this.RegisterSvg("chevron-left", 24, '<path d="M15.41,16.58L10.83,12L15.41,7.41L14,6L8,12L14,18L15.41,16.58Z" />');
	this.RegisterSvg("chevron-up", 24, '<path d="M7.41,15.41L12,10.83L16.59,15.41L18,14L12,8L6,14L7.41,15.41Z" />');
	this.RegisterSvg("content-save", 24, '<path d="M15,9H5V5H15M12,19A3,3 0 0,1 9,16A3,3 0 0,1 12,13A3,3 0 0,1 15,16A3,3 0 0,1 12,19M17,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V7L17,3Z" />');
	this.RegisterSvg("database", 24, '<path d="M12,3C7.58,3 4,4.79 4,7C4,9.21 7.58,11 12,11C16.42,11 20,9.21 20,7C20,4.79 16.42,3 12,3M4,9V12C4,14.21 7.58,16 12,16C16.42,16 20,14.21 20,12V9C20,11.21 16.42,13 12,13C7.58,13 4,11.21 4,9M4,14V17C4,19.21 7.58,21 12,21C16.42,21 20,19.21 20,17V14C20,16.21 16.42,18 12,18C7.58,18 4,16.21 4,14Z" />');
	this.RegisterSvg("delete", 24, '<path d="M19,4H15.5L14.5,3H9.5L8.5,4H5V6H19M6,19A2,2 0 0,0 8,21H16A2,2 0 0,0 18,19V7H6V19Z" />');
	this.RegisterSvg("delete-variant", 24, '<path d="M21.03,3L18,20.31C17.83,21.27 17,22 16,22H8C7,22 6.17,21.27 6,20.31L2.97,3H21.03M5.36,5L8,20H16L18.64,5H5.36M9,18V14H13V18H9M13,13.18L9.82,10L13,6.82L16.18,10L13,13.18Z" />');
	this.RegisterSvg("file-outline", 24, '<path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,4H6V20H11L18,20V11H11V4Z" />');
	// this.RegisterSvg("file-outline2", 26, '<path d="M13,9H18.5L13,3.5V9M6,2H14L20,8V20A2,2 0 0,1 18,22H6C4.89,22 4,21.1 4,20V4C4,2.89 4.89,2 6,2M11,4H6V20H11L18,20V11H11V4Z" />');
	this.RegisterSvg("folder-outline", 24, '<path d="M20,18H4V8H20M20,6H12L10,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V8C22,6.89 21.1,6 20,6Z" />');
	this.RegisterSvg("folder-multiple-outline", 24, '<path d="M22,4A2,2 0 0,1 24,6V16A2,2 0 0,1 22,18H6A2,2 0 0,1 4,16V4A2,2 0 0,1 6,2H12L14,4H22M2,6V20H20V22H2A2,2 0 0,1 0,20V11H0V6H2M6,6V16H22V6H6Z" />');
	this.RegisterSvg("hand-pointing-right", 24, '<path d="M21,9A1,1 0 0,1 22,10A1,1 0 0,1 21,11H16.53L16.4,12.21L14.2,17.15C14,17.65 13.47,18 12.86,18H8.5C7.7,18 7,17.27 7,16.5V10C7,9.61 7.16,9.26 7.43,9L11.63,4.1L12.4,4.84C12.6,5.03 12.72,5.29 12.72,5.58L12.69,5.8L11,9H21M2,18V10H5V18H2Z" />');
	this.RegisterSvg("history", 24, '<path d="M11,7V12.11L15.71,14.9L16.5,13.62L12.5,11.25V7M12.5,2C8.97,2 5.91,3.92 4.27,6.77L2,4.5V11H8.5L5.75,8.25C6.96,5.73 9.5,4 12.5,4A7.5,7.5 0 0,1 20,11.5A7.5,7.5 0 0,1 12.5,19C9.23,19 6.47,16.91 5.44,14H3.34C4.44,18.03 8.11,21 12.5,21C17.74,21 22,16.75 22,11.5A9.5,9.5 0 0,0 12.5,2Z" />');
	this.RegisterSvg("home", 24, '<path d="M10,20V14H14V20H19V12H22L12,3L2,12H5V20H10Z"/>');
	this.RegisterSvg("hospital", 24, '<path d="M18,14H14V18H10V14H6V10H10V6H14V10H18M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />');
	this.RegisterSvg("link", 24, '<path d="M16,6H13V7.9H16C18.26,7.9 20.1,9.73 20.1,12A4.1,4.1 0 0,1 16,16.1H13V18H16A6,6 0 0,0 22,12C22,8.68 19.31,6 16,6M3.9,12C3.9,9.73 5.74,7.9 8,7.9H11V6H8A6,6 0 0,0 2,12A6,6 0 0,0 8,18H11V16.1H8C5.74,16.1 3.9,14.26 3.9,12M8,13H16V11H8V13Z" />');
	this.RegisterSvg("logout", 24, '<path d="M17,17.25V14H10V10H17V6.75L22.25,12L17,17.25M13,2A2,2 0 0,1 15,4V8H13V4H4V20H13V16H15V20A2,2 0 0,1 13,22H4A2,2 0 0,1 2,20V4A2,2 0 0,1 4,2H13Z" />');
	this.RegisterSvg("magnify", 24, '<path d="M9.5,3A6.5,6.5 0 0,1 16,9.5C16,11.11 15.41,12.59 14.44,13.73L14.71,14H15.5L20.5,19L19,20.5L14,15.5V14.71L13.73,14.44C12.59,15.41 11.11,16 9.5,16A6.5,6.5 0 0,1 3,9.5A6.5,6.5 0 0,1 9.5,3M9.5,5C7,5 5,7 5,9.5C5,12 7,14 9.5,14C12,14 14,12 14,9.5C14,7 12,5 9.5,5Z" />');
	this.RegisterSvg("menu", 24, '<path d="M3,6H21V8H3V6M3,11H21V13H3V11M3,16H21V18H3V16Z" />');
	this.RegisterSvg("multiplication", 24, '<path d="M11,3H13V10.27L19.29,6.64L20.29,8.37L14,12L20.3,15.64L19.3,17.37L13,13.72V21H11V13.73L4.69,17.36L3.69,15.63L10,12L3.72,8.36L4.72,6.63L11,10.26V3Z" />');
	this.RegisterSvg("new-box", 24, '<path d="M20,4C21.11,4 22,4.89 22,6V18C22,19.11 21.11,20 20,20H4C2.89,20 2,19.11 2,18V6C2,4.89 2.89,4 4,4H20M8.5,15V9H7.25V12.5L4.75,9H3.5V15H4.75V11.5L7.3,15H8.5M13.5,10.26V9H9.5V15H13.5V13.75H11V12.64H13.5V11.38H11V10.26H13.5M20.5,14V9H19.25V13.5H18.13V10H16.88V13.5H15.75V9H14.5V14A1,1 0 0,0 15.5,15H19.5A1,1 0 0,0 20.5,14Z" />');
	this.RegisterSvg("note-outline", 24, '<path d="M14,10H19.5L14,4.5V10M5,3H15L21,9V19A2,2 0 0,1 19,21H5C3.89,21 3,20.1 3,19V5C3,3.89 3.89,3 5,3M5,5V19H19V12H12V5H5Z" />');
	this.RegisterSvg("open-in-new", 24, '<path d="M14,3V5H17.59L7.76,14.83L9.17,16.24L19,6.41V10H21V3M19,19H5V5H12V3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V12H19V19Z" />');
	this.RegisterSvg("pencil", 24, '<path d="M20.71,7.04C21.1,6.65 21.1,6 20.71,5.63L18.37,3.29C18,2.9 17.35,2.9 16.96,3.29L15.12,5.12L18.87,8.87M3,17.25V21H6.75L17.81,9.93L14.06,6.18L3,17.25Z" />');
	this.RegisterSvg("pencil-box-outline", 24, '<path d="M19,19V5H5V19H19M19,3A2,2 0 0,1 21,5V19C21,20.11 20.1,21 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3H19M16.7,9.35L15.7,10.35L13.65,8.3L14.65,7.3C14.86,7.08 15.21,7.08 15.42,7.3L16.7,8.58C16.92,8.79 16.92,9.14 16.7,9.35M7,14.94L13.06,8.88L15.12,10.94L9.06,17H7V14.94Z" />');
	this.RegisterSvg("security", 24, '<path d="M12,12H19C18.47,16.11 15.72,19.78 12,20.92V12H5V6.3L12,3.19M12,1L3,5V11C3,16.55 6.84,21.73 12,23C17.16,21.73 21,16.55 21,11V5L12,1Z" />');
	this.RegisterSvg("settings", 24, '<path d="M12,15.5A3.5,3.5 0 0,1 8.5,12A3.5,3.5 0 0,1 12,8.5A3.5,3.5 0 0,1 15.5,12A3.5,3.5 0 0,1 12,15.5M19.43,12.97C19.47,12.65 19.5,12.33 19.5,12C19.5,11.67 19.47,11.34 19.43,11L21.54,9.37C21.73,9.22 21.78,8.95 21.66,8.73L19.66,5.27C19.54,5.05 19.27,4.96 19.05,5.05L16.56,6.05C16.04,5.66 15.5,5.32 14.87,5.07L14.5,2.42C14.46,2.18 14.25,2 14,2H10C9.75,2 9.54,2.18 9.5,2.42L9.13,5.07C8.5,5.32 7.96,5.66 7.44,6.05L4.95,5.05C4.73,4.96 4.46,5.05 4.34,5.27L2.34,8.73C2.21,8.95 2.27,9.22 2.46,9.37L4.57,11C4.53,11.34 4.5,11.67 4.5,12C4.5,12.33 4.53,12.65 4.57,12.97L2.46,14.63C2.27,14.78 2.21,15.05 2.34,15.27L4.34,18.73C4.46,18.95 4.73,19.03 4.95,18.95L7.44,17.94C7.96,18.34 8.5,18.68 9.13,18.93L9.5,21.58C9.54,21.82 9.75,22 10,22H14C14.25,22 14.46,21.82 14.5,21.58L14.87,18.93C15.5,18.67 16.04,18.34 16.56,17.94L19.05,18.95C19.27,19.03 19.54,18.95 19.66,18.73L21.66,15.27C21.78,15.05 21.73,14.78 21.54,14.63L19.43,12.97Z" />');
	this.RegisterSvg("star", 24, '<path d="M12,17.27L18.18,21L16.54,13.97L22,9.24L14.81,8.62L12,2L9.19,8.62L2,9.24L7.45,13.97L5.82,21L12,17.27Z" />');
	this.RegisterSvg("table-edit", 24, '<path d="M21.7,13.35L20.7,14.35L18.65,12.3L19.65,11.3C19.86,11.08 20.21,11.08 20.42,11.3L21.7,12.58C21.92,12.79 21.92,13.14 21.7,13.35M12,18.94L18.07,12.88L20.12,14.93L14.06,21H12V18.94M4,2H18A2,2 0 0,1 20,4V8.17L16.17,12H12V16.17L10.17,18H4A2,2 0 0,1 2,16V4A2,2 0 0,1 4,2M4,6V10H10V6H4M12,6V10H18V6H12M4,12V16H10V12H4Z" />');
	this.RegisterSvg("table-large", 24, '<path d="M4,3H20A2,2 0 0,1 22,5V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V5A2,2 0 0,1 4,3M4,7V10H8V7H4M10,7V10H14V7H10M20,10V7H16V10H20M4,12V15H8V12H4M4,20H8V17H4V20M10,12V15H14V12H10M10,20H14V17H10V20M20,20V17H16V20H20M20,12H16V15H20V12Z"/>');
	this.RegisterSvg("thumb-down-outline", 24, '<path d="M19,15V3H23V15H19M15,3A2,2 0 0,1 17,5V15C17,15.55 16.78,16.05 16.41,16.41L9.83,23L8.77,21.94C8.5,21.67 8.33,21.3 8.33,20.88L8.36,20.57L9.31,16H3C1.89,16 1,15.1 1,14V13.91L1,12C1,11.74 1.05,11.5 1.14,11.27L4.16,4.22C4.46,3.5 5.17,3 6,3H15M15,5H5.97L3,12V14H11.78L10.65,19.32L15,14.97V5Z" />');
	this.RegisterSvg("thumb-up-outline", 24, '<path d="M5,9V21H1V9H5M9,21A2,2 0 0,1 7,19V9C7,8.45 7.22,7.95 7.59,7.59L14.17,1L15.23,2.06C15.5,2.33 15.67,2.7 15.67,3.11L15.64,3.43L14.69,8H21C22.11,8 23,8.9 23,10V10.09L23,12C23,12.26 22.95,12.5 22.86,12.73L19.84,19.78C19.54,20.5 18.83,21 18,21H9M9,19H18.03L21,12V10H12.21L13.34,4.68L9,9.03V19Z" />');
	this.RegisterSvg("timetable", 24, '<path d="M14,12H15.5V14.82L17.94,16.23L17.19,17.53L14,15.69V12M4,2H18A2,2 0 0,1 20,4V10.1C21.24,11.36 22,13.09 22,15A7,7 0 0,1 15,22C13.09,22 11.36,21.24 10.1,20H4A2,2 0 0,1 2,18V4A2,2 0 0,1 4,2M4,15V18H8.67C8.24,17.09 8,16.07 8,15H4M4,8H10V5H4V8M18,8V5H12V8H18M4,13H8.29C8.63,11.85 9.26,10.82 10.1,10H4V13M15,10.15A4.85,4.85 0 0,0 10.15,15C10.15,17.68 12.32,19.85 15,19.85A4.85,4.85 0 0,0 19.85,15C19.85,12.32 17.68,10.15 15,10.15Z" />');
	this.RegisterSvg("undo", 24, '<path d="M12.5,8C9.85,8 7.45,9 5.6,10.6L2,7V16H11L7.38,12.38C8.77,11.22 10.54,10.5 12.5,10.5C16.04,10.5 19.05,12.81 20.1,16L22.47,15.22C21.08,11.03 17.15,8 12.5,8Z" />');
	this.RegisterSvg("unfold-more", 24, '<path d="M12,18.17L8.83,15L7.42,16.41L12,21L16.59,16.41L15.17,15M12,5.83L15.17,9L16.58,7.59L12,3L7.41,7.59L8.83,9L12,5.83Z" />');
	
	this.RegisterSvg("checkbox-marked", 24, '<path d="M10,17L5,12L6.41,10.58L10,14.17L17.59,6.58L19,8M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />');
	this.RegisterSvg("checkbox-multiple-marked-some", 24, '<path d="M20,16V10H22V16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H16V4H8V16H20M10.91,7.08L14,10.17L20.59,3.58L22,5L14,13L9.5,8.5L10.91,7.08M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z" />');
	this.RegisterSvg("checkbox-multiple-marked-all", 24, '<path d="M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16M13,14L20,7L18.59,5.59L13,11.17L9.91,8.09L8.5,9.5L13,14Z" />');
	this.RegisterSvg("checkbox-multiple-blank", 24, '<path d="M20,16V4H8V16H20M22,16A2,2 0 0,1 20,18H8C6.89,18 6,17.1 6,16V4C6,2.89 6.89,2 8,2H20A2,2 0 0,1 22,4V16M16,20V22H4A2,2 0 0,1 2,20V7H4V20H16Z" />');

	this.RegisterSvg("radiobox-blank", 24, '<path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />');
	this.RegisterSvg("radiobox-marked", 24, '<path d="M12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4A8,8 0 0,1 20,12A8,8 0 0,1 12,20M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,7A5,5 0 0,0 7,12A5,5 0 0,0 12,17A5,5 0 0,0 17,12A5,5 0 0,0 12,7Z" />');
	this.RegisterSvg("table", 24, '<path d="M5,4H19A2,2 0 0,1 21,6V18A2,2 0 0,1 19,20H5A2,2 0 0,1 3,18V6A2,2 0 0,1 5,4M5,8V12H11V8H5M13,8V12H19V8H13M5,14V18H11V14H5M13,14V18H19V14H13Z" />');
	this.RegisterSvg("close-box-outline", 24, '<path d="M19,3H5A2,2 0 0,0 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3M19,19H5V5H19V19M17,8.4L13.4,12L17,15.6L15.6,17L12,13.4L8.4,17L7,15.6L10.6,12L7,8.4L8.4,7L12,10.6L15.6,7L17,8.4Z" />');
	this.RegisterSvg("clock", 24, '<path d="M12,20A8,8 0 0,0 20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20M12,2A10,10 0 0,1 22,12A10,10 0 0,1 12,22C6.47,22 2,17.5 2,12A10,10 0 0,1 12,2M12.5,7V12.25L17,14.92L16.25,16.15L11,13V7H12.5Z" />');
	this.RegisterSvg("bookmark-outline", 24, '<path d="M17,18L12,15.82L7,18V5H17M17,3H7A2,2 0 0,0 5,5V21L12,18L19,21V5C19,3.89 18.1,3 17,3Z" />');
	this.RegisterSvg("home-variant", 24, '<path d="M8,20H5V12H2L12,3L22,12H19V20H12V14H8V20M14,14V17H17V14H14Z" />');
	this.RegisterSvg("view-dashboard", 24, '<path d="M13,3V9H21V3M13,21H21V11H13M3,21H11V15H3M3,13H11V3H3V13Z" />');
	this.RegisterSvg("presentation-play", 24, '<path d="M2,3H10A2,2 0 0,1 12,1A2,2 0 0,1 14,3H22V5H21V16H15.25L17,22H15L13.25,16H10.75L9,22H7L8.75,16H3V5H2V3M5,5V14H19V5H5M11.85,11.85C11.76,11.94 11.64,12 11.5,12A0.5,0.5 0 0,1 11,11.5V7.5A0.5,0.5 0 0,1 11.5,7C11.64,7 11.76,7.06 11.85,7.15L13.25,8.54C13.57,8.86 13.89,9.18 13.89,9.5C13.89,9.82 13.57,10.14 13.25,10.46L11.85,11.85Z" />');
	this.RegisterSvg("stop-circle-outline", 24, '<path d="M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2M12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4M9,9V15H15V9" />');

	this.RegisterSvg("upload", 24, '<path d="M9,16V10H5L12,3L19,10H15V16H9M5,20V18H19V20H5Z" />');
	this.RegisterSvg("arrow-up", 24, '<path d="M13,20H11V8L5.5,13.5L4.08,12.08L12,4.16L19.92,12.08L18.5,13.5L13,8V20Z" />');
	this.RegisterSvg("arrow-down", 24, '<path d="M11,4H13V16L18.5,10.5L19.92,11.92L12,19.84L4.08,11.92L5.5,10.5L11,16V4Z" />');
	this.RegisterSvg("pencil-circle", 24, '<path d="M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M15.1,7.07C15.24,7.07 15.38,7.12 15.5,7.23L16.77,8.5C17,8.72 17,9.07 16.77,9.28L15.77,10.28L13.72,8.23L14.72,7.23C14.82,7.12 14.96,7.07 15.1,7.07M13.13,8.81L15.19,10.87L9.13,16.93H7.07V14.87L13.13,8.81Z" />');
	this.RegisterSvg("delete-circle", 24, '<path d="M12,2C17.53,2 22,6.47 22,12C22,17.53 17.53,22 12,22C6.47,22 2,17.53 2,12C2,6.47 6.47,2 12,2M17,7H14.5L13.5,6H10.5L9.5,7H7V9H17V7M9,18H15A1,1 0 0,0 16,17V10H8V17A1,1 0 0,0 9,18Z" />');
	
	this.RegisterSvg("drag-vertical", 24, '<path d="M9,3H11V5H9V3M13,3H15V5H13V3M9,7H11V9H9V7M13,7H15V9H13V7M9,11H11V13H9V11M13,11H15V13H13V11M9,15H11V17H9V15M13,15H15V17H13V15M9,19H11V21H9V19M13,19H15V21H13V19Z" />');
	this.RegisterSvg("drag-horizontal", 24, '<path d="M3,15V13H5V15H3M3,11V9H5V11H3M7,15V13H9V15H7M7,11V9H9V11H7M11,15V13H13V15H11M11,11V9H13V11H11M15,15V13H17V15H15M15,11V9H17V11H15M19,15V13H21V15H19M19,11V9H21V11H19Z" />');
	this.RegisterSvg("information", 24, '<path d="M13,9H11V7H13M13,17H11V11H13M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />');
	this.RegisterSvg("filter-outline", 24, '<path d="M3,2H21V2H21V4H20.92L15,9.92V22.91L9,16.91V9.91L3.09,4H3V2M11,16.08L13,18.08V9H13.09L18.09,4H5.92L10.92,9H11V16.08Z" />');
	// this.RegisterSvg("filter", 24, '<path d="M3,2H21V2H21V4H20.92L14,10.92V22.91L10,18.91V10.91L3.09,4H3V2Z" />');
	this.RegisterSvg("file-excel", 24, '<path d="M6,2H14L20,8V20A2,2 0 0,1 18,22H6A2,2 0 0,1 4,20V4A2,2 0 0,1 6,2M13,3.5V9H18.5L13,3.5M17,11H13V13H14L12,14.67L10,13H11V11H7V13H8L11,15.5L8,18H7V20H11V18H10L12,16.33L14,18H13V20H17V18H16L13,15.5L16,13H17V11Z" /><');
	this.RegisterSvg("file-export", 24, '<path d="M6,2C4.89,2 4,2.9 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M13,3.5L18.5,9H13M8.93,12.22H16V19.29L13.88,17.17L11.05,20L8.22,17.17L11.05,14.35" />');
	this.RegisterSvg("export", 24, '<path d="M23,12L19,8V11H10V13H19V16M1,18V6C1,4.89 1.9,4 3,4H15A2,2 0 0,1 17,6V9H15V6H3V18H15V15H17V18A2,2 0 0,1 15,20H3A2,2 0 0,1 1,18Z" />');
	this.RegisterSvg("block-helper", 24, '<path d="M12,0A12,12 0 0,1 24,12A12,12 0 0,1 12,24A12,12 0 0,1 0,12A12,12 0 0,1 12,0M12,2A10,10 0 0,0 2,12C2,14.4 2.85,16.6 4.26,18.33L18.33,4.26C16.6,2.85 14.4,2 12,2M12,22A10,10 0 0,0 22,12C22,9.6 21.15,7.4 19.74,5.67L5.67,19.74C7.4,21.15 9.6,22 12,22Z" />');
	this.RegisterSvg("transfer", 24, '<path d="M3,8H5V16H3V8M7,8H9V16H7V8M11,8H13V16H11V8M15,19.25V4.75L22.25,12L15,19.25Z" />');
	this.RegisterSvg("approval", 24, '<path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />');
	this.RegisterSvg("emoticon-happy", 24, '<path d="M20,12A8,8 0 0,0 12,4A8,8 0 0,0 4,12A8,8 0 0,0 12,20A8,8 0 0,0 20,12M22,12A10,10 0 0,1 12,22A10,10 0 0,1 2,12A10,10 0 0,1 12,2A10,10 0 0,1 22,12M10,9.5C10,10.3 9.3,11 8.5,11C7.7,11 7,10.3 7,9.5C7,8.7 7.7,8 8.5,8C9.3,8 10,8.7 10,9.5M17,9.5C17,10.3 16.3,11 15.5,11C14.7,11 14,10.3 14,9.5C14,8.7 14.7,8 15.5,8C16.3,8 17,8.7 17,9.5M12,17.23C10.25,17.23 8.71,16.5 7.81,15.42L9.23,14C9.68,14.72 10.75,15.23 12,15.23C13.25,15.23 14.32,14.72 14.77,14L16.19,15.42C15.29,16.5 13.75,17.23 12,17.23Z" />');
	this.RegisterSvg("application", 24, '<path d="M19,4C20.11,4 21,4.9 21,6V18A2,2 0 0,1 19,20H5C3.89,20 3,19.1 3,18V6A2,2 0 0,1 5,4H19M19,18V8H5V18H19Z" />');
	this.RegisterSvg("phone", 24, '<path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />');
	this.RegisterSvg("printer", 24, '<path d="M18,3H6V7H18M19,12A1,1 0 0,1 18,11A1,1 0 0,1 19,10A1,1 0 0,1 20,11A1,1 0 0,1 19,12M16,19H8V14H16M19,8H5A3,3 0 0,0 2,11V17H6V21H18V17H22V11A3,3 0 0,0 19,8Z" />');
	this.RegisterSvg("file-multiple", 24, '<path d="M15,7H20.5L15,1.5V7M8,0H16L22,6V18A2,2 0 0,1 20,20H8C6.89,20 6,19.1 6,18V2A2,2 0 0,1 8,0M4,4V22H20V24H4A2,2 0 0,1 2,22V4H4Z" />');
	this.RegisterSvg("cloud-download", 24, '<path d="M17,13L12,18L7,13H10V9H14V13M19.35,10.03C18.67,6.59 15.64,4 12,4C9.11,4 6.6,5.64 5.35,8.03C2.34,8.36 0,10.9 0,14A6,6 0 0,0 6,20H19A5,5 0 0,0 24,15C24,12.36 21.95,10.22 19.35,10.03Z" />');
	this.RegisterSvg("share", 24, '<path d="M21,11L14,4V8C7,9 4,14 3,19C5.5,15.5 9,13.9 14,13.9V18L21,11Z" />');
	// this.RegisterSvg("", 24, '');
	
	
	// icons from https://icons8.com/icon/set/report/win10
	this.RegisterSvg("icons8-microsoft-excel", 32, '<path d="M 15.875 4 L 15.78125 4.03125 L 4.78125 6.46875 L 4 6.65625 L 4 25.34375 L 4.78125 25.53125 L 15.78125 27.96875 L 15.875 28 L 18 28 L 18 25 L 28 25 L 28 7 L 18 7 L 18 4 Z M 16 6.03125 L 16 25.96875 L 6 23.78125 L 6 8.21875 Z M 18 9 L 26 9 L 26 23 L 18 23 L 18 21 L 20 21 L 20 19 L 18 19 L 18 18 L 20 18 L 20 16 L 18 16 L 18 15 L 20 15 L 20 13 L 18 13 L 18 12 L 20 12 L 20 10 L 18 10 Z M 21 10 L 21 12 L 25 12 L 25 10 Z M 14.15625 11 L 11.875 11.28125 L 10.625 13.96875 C 10.492188 14.355469 10.394531 14.648438 10.34375 14.84375 L 10.3125 14.84375 C 10.234375 14.519531 10.160156 14.238281 10.0625 14 L 9.4375 11.6875 L 7.3125 11.9375 L 7.21875 12 L 9 16 L 7 20 L 9.15625 20.25 L 10.03125 17.78125 C 10.136719 17.46875 10.222656 17.214844 10.25 17.0625 L 10.28125 17.0625 C 10.339844 17.386719 10.378906 17.628906 10.4375 17.75 L 11.78125 20.6875 L 14.21875 21 L 11.5625 15.96875 Z M 21 13 L 21 15 L 25 15 L 25 13 Z M 21 16 L 21 18 L 25 18 L 25 16 Z M 21 19 L 21 21 L 25 21 L 25 19 Z "/>');
	// this.RegisterSvg("XXX", 24, '');
	
	this.RegisterSvg("a-O", 512, '<path d="M256,0C114.609,0,0,114.609,0,256s114.609,256,256,256s256-114.609,256-256S397.391,0,256,0z M256,472c-119.297,0-216-96.703-216-216S136.703,40,256,40s216,96.703,216,216S375.297,472,256,472z"/>');
	// this.RegisterSvg("", 512, '');

	this.RegisterSvg("appbar.filter", "18 18 39 39", '<path d="M 34.8333,61.75L 34.8333,42.75L 19,20.5833L 57,20.5833L 41.1667,42.75L 41.1667,58.5833L 34.8333,61.75 Z "/>');
	this.CloneSvg("filter", "appbar.filter");
	
	// this.RegisterSvg("", "18 18 39 39", '');	
	// this.RegisterSvg("appbar.resource", "18 18 39 39", '<path d="M 38,23.5C 38.8643,23.5 39.7109,23.5756 40.5337,23.7206L 42.6275,18.5381L 48.1901,20.787L 46.0964,25.9692C 47.6473,27.0149 48.9851,28.3527 50.0308,29.9036L 55.213,27.8099L 57.4619,33.3725L 52.2794,35.4664C 52.4244,36.2891 52.5,37.1357 52.5,38C 52.5,38.8643 52.4244,39.7109 52.2794,40.5337L 57.4619,42.6275L 55.213,48.1901L 50.0308,46.0964C 49.0795,47.5073 47.8865,48.7418 46.5112,49.7405L 48.7844,54.8462L 43.3041,57.2891L 41.0307,52.1828C 40.0533,52.3906 39.0394,52.5 38,52.5C 37.1357,52.5 36.2891,52.4244 35.4664,52.2794L 33.3725,57.462L 27.8099,55.213L 29.9036,50.0309C 28.3527,48.9851 27.0149,47.6473 25.9691,46.0964L 20.787,48.1901L 18.538,42.6275L 23.7206,40.5336C 23.5756,39.7109 23.5,38.8643 23.5,38C 23.5,37.1357 23.5756,36.2891 23.7206,35.4664L 18.538,33.3725L 20.787,27.8099L 25.9691,29.9036C 26.9205,28.4927 28.1135,27.2582 29.4889,26.2594L 27.2157,21.1537L 32.6959,18.7109L 34.9694,23.8172C 35.9468,23.6094 36.9606,23.5 38,23.5 Z M 38,28C 32.4771,28 28,32.4772 28,38C 28,43.5229 32.4771,48 38,48C 43.5228,48 48,43.5229 48,38C 48,32.4772 43.5228,28 38,28 Z "/>');	
	// this.CloneSvg("settings", "appbar.resource");
	
	this.CloneSvg("edit", "pencil-box-outline");
	this.CloneSvg("refresh", "autorenew");
	this.CloneSvg("new", "multiplication");
	this.CloneSvg("test", "hand-pointing-right");
	this.CloneSvg("search", "magnify");
	this.CloneSvg("export-grid", "icons8-microsoft-excel");

	this.CloneSvg("download", "cloud-download");
	this.CloneSvg("under-construction", "alert-circle-outline");
	
	// grid icons
	this.CloneSvg("user", "account");
	this.CloneSvg("users", "account-multiple");
	this.CloneSvg("table", "table-large");
	this.CloneSvg("tree-expand", "chevron-down");
	this.CloneSvg("tree-collapse", "chevron-right"); 
	this.CloneSvg("arrow-left", "arrow-left-drop-circle-outline");
	this.CloneSvg("arrow-right", "arrow-right-drop-circle-outline");
	this.CloneSvg("drop-down", "chevron-double-down");
	// this.CloneSvg("drop-down", "table");
	this.CloneSvg("drop-down-table", "table");
	
	// this.CloneSvg("db-edit", "pencil");
	// this.CloneSvg("db-edit", "pencil-box-outline");
	this.CloneSvg("db-edit", "pencil-circle");
	// this.CloneSvg("db-delete", "delete");
	// this.CloneSvg("db-delete", "delete-variant");
	// this.CloneSvg("db-delete", "close-box-outline");
	this.CloneSvg("db-delete", "delete-circle");
	this.CloneSvg("db-open", "open-in-new");
	this.CloneSvg("db-select", "checkbox-marked");
	this.CloneSvg("db-menu", "menu");
	this.CloneSvg("db-unselect", "checkbox-blank-outline");
	this.CloneSvg("db-selectall", "checkbox-multiple-marked-all");
	this.CloneSvg("db-selectsome", "checkbox-multiple-marked-some");
	this.CloneSvg("db-selectnone", "checkbox-multiple-blank");
	this.CloneSvg("db-prevpage", "arrow-left-drop-circle-outline");
	this.CloneSvg("db-nextpage", "arrow-right-drop-circle-outline");
	this.CloneSvg("db-master-detail", "table");
	
	this.CloneSvg("db-sortup", "chevron-up");
	this.CloneSvg("db-sortdown", "chevron-down");
	this.CloneSvg("db-save", "content-save");
	this.CloneSvg("db-cancel", "undo");
	this.CloneSvg("db-sort", "unfold-more");
	this.CloneSvg("db-required", "alert-circle-outline");
	
	// editor
	this.CloneSvg("radio-off", "radiobox-blank");
	this.CloneSvg("radio-on", "radiobox-marked");
	this.CloneSvg("icons", "emoticon-happy");
};

/************************************************************************************************************************
	LoadModule
	* Loading of CSS and Scripts of sub pages
	* Called from DesktopPainter.prototype.loadSubPage
************************************************************************************************************************/
function LoadModule(menu) {
	this.menu = menu;
	// this.menu.requestParams = GetUrlRequestParamsObject(menu.url)
};

// desktop.loadingModule.load(MasterPolicyEdit);
LoadModule.prototype.load = function(callback) {
	// console.log(this.menu)
	this.menu.page = callback({
		id:this.menu.id, 
		host:desktop, 
		container:this.menu.subContainer, 
		url:this.menu.url,
		requestParams: this.menu.params
	});

	this.menu.loaded = true;
};
