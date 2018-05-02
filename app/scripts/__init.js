//==================================================================================================
// File name: ihms.insky-inc.com.js
//==================================================================================================
// *************************************************************************************************
// Last modified on
// 02-MAR-2015
// *************************************************************************************************
//==================================================================================================
// Miscellansous functions
//==================================================================================================
function __open(url, get) {
	if(get) {
		return url
	} else {
		window.open(url, "");
	}
};

function __client(id, get) {
	return __open(("/app/client/{0}").format(id), get);
};

function __masterpolicy(id, get) {
	return __open(("/app/masterpolicy/{0}").format(id), get);
};

function __claim(id, get) {
	return __open(("/app/claim/{0}").format(id), get);
};

function __newclaim(member_id, get) {
	return __open(("/app/claim/0/{0}").format(member_id), get);
};

function __member(id, get) {
	return __open(("/app/member/{0}").format(id), get);
};

function __service(id, module, get) {
	// return __open(("/app/service/{1}?type={0}").format(module.toLowerCase(), id), get);
	// return __open(("/app/service/{1}/{0}").format(module.toLowerCase(), id), get);
	// return __open(("/app/service/{0}/{1}").format(module.toLowerCase(), id), get);
	// return __open(("/app/service/{0}/{1}").format(module, id), get);
	return __open(("/app/service/{0}/{1}").format(module.toLowerCase(), id), get);
};

function __newservice(id, module, type, get) {
	// return __open(("/app/service/new/{0}/{1}/{2}").format(module.toLowerCase(), type.trim().toLowerCase(), id), get);
	// return __open(("/app/service/new/{0}/{1}/{2}").format(module, type.trim(), id), get);
	return __open(("/app/{0}/new/{1}/{2}").format(module.toLowerCase(), type.trim(), id), get);
};

function __invoice(id, get) {
	return __service(id, "inv", get);
};

// function __invoice(id, get) {
	// return __open(("/app/invoice/{0}").format(id), get);
// };

function __batch(id, get) {
	return __open(("/app/batch/{0}").format(id), get);
};

function __product(id, get) {
	return __open(("/app/product/{0}").format(id.toLowerCase()), get);
};

function __plan(id, get) {
	return __open(("/app/plan/{0}").format(id), get);
};

function __doctor(id, get) {
	return __open(("/app/doctor/{0}").format(id), get);
};

function __hospital(id, get) {
	return __open(("/app/hospital/{0}").format(id), get);
};

function __clinic(id, get) {
	return __open(("/app/clinic/{0}").format(id), get);
};

function __report(id, get) {
	return __open(("/sys/report/{0}").format(id), get);
};
//==================================================================================================
// Claim MainPage
//==================================================================================================
Class.Inherits(MainPage, Desktop);
function MainPage(Params) {
	MainPage.prototype.parent.call(this, Params);
};

MainPage.prototype.classID = "MainPage";
// MainPage.prototype.navigatorTheme = "light";
MainPage.prototype.navigatorTheme = "dark";
MainPage.prototype.themes = {
	gridEditor: "default",
	formEditor: "main",
	formEditorPC: "main"
};

MainPage.prototype.DefaultPainter = function() {
	return new DesktopPainter5(this)
};

MainPage.prototype.InitializeSession = function(data) {
	MainPage.prototype.parent.prototype.InitializeSession.call(this, data);

	this.Events.OnHeaderToolbar.add(function(desktop, list) {
		if(list.classID === "JToolbar") {
			list.NewItem({
				id: "call-log",
				icon: "phone",
				// iconColor: "#8DCF6E",
				// iconColor: "dodgerblue",
				iconColor: "slategray",
				align: "right",
				hint: "Create a new call log",
				click: function(item) {
					// desktop.Ajax(self, "/api/session/logout", undefined, function(data) {
						// if (data.Status == 0) {
							// window.location.href = ""
						// }
					// })
				}
			});
		} else {
			CreateElementEx("li", list, function(home) {
				home.attr("control-type", "tool-btn")
					.css("float", "right");

				desktop.GetSvg(home, "phone", 32, {noTopMargin: true})
					// .css("fill", "firebrick");
					.css("fill", "white");

				// desktop.GetSvg(home, "new", 16, {noTopMargin: true})
					// .css("fill", "firebrick");
					// .css("fill", "red");

				desktop.SetHint(home, function(dialog, container) {
					container.html("New Call Log");
				}, "bottom");
			}).click(function() {
				// window.location = "/"
			});
		};
	});

	this.Events.OnSideMenuPageControl.add(function(desktop, pg) {
		pg.addTab({caption:"Call Logs",
			icon: {
				name: "phone"
			},
			OnCreate: function(tab) {

			}
		});
		pg.addTab({caption:"Tasks",
			icon: {
				name: "timetable"
			},
			OnCreate: function(tab) {

			}
		});
	});

	this.RegisterSvg("ungroup", 24, '<path d="M2,2H6V3H13V2H17V6H16V9H18V8H22V12H21V18H22V22H18V21H12V22H8V18H9V16H6V17H2V13H3V6H2V2M18,12V11H16V13H17V17H13V16H11V18H12V19H18V18H19V12H18M13,6V5H6V6H5V13H6V14H9V12H8V8H12V9H14V6H13M12,12H11V14H13V13H14V11H12V12Z" />');
	this.RegisterSvg("checkbox-marked-circle-outline", 24, '<path d="M20,12A8,8 0 0,1 12,20A8,8 0 0,1 4,12A8,8 0 0,1 12,4C12.76,4 13.5,4.11 14.2,4.31L15.77,2.74C14.61,2.26 13.34,2 12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12M7.91,10.08L6.5,11.5L11,16L21,6L19.59,4.58L11,13.17L7.91,10.08Z" />');
	this.RegisterSvg("pinterest-box", 24, '<path d="M13,16.2C12.2,16.2 11.43,15.86 10.88,15.28L9.93,18.5L9.86,18.69L9.83,18.67C9.64,19 9.29,19.2 8.9,19.2C8.29,19.2 7.8,18.71 7.8,18.1C7.8,18.05 7.81,18 7.81,17.95H7.8L7.85,17.77L9.7,12.21C9.7,12.21 9.5,11.59 9.5,10.73C9.5,9 10.42,8.5 11.16,8.5C11.91,8.5 12.58,8.76 12.58,9.81C12.58,11.15 11.69,11.84 11.69,12.81C11.69,13.55 12.29,14.16 13.03,14.16C15.37,14.16 16.2,12.4 16.2,10.75C16.2,8.57 14.32,6.8 12,6.8C9.68,6.8 7.8,8.57 7.8,10.75C7.8,11.42 8,12.09 8.34,12.68C8.43,12.84 8.5,13 8.5,13.2A1,1 0 0,1 7.5,14.2C7.13,14.2 6.79,14 6.62,13.7C6.08,12.81 5.8,11.79 5.8,10.75C5.8,7.47 8.58,4.8 12,4.8C15.42,4.8 18.2,7.47 18.2,10.75C18.2,13.37 16.57,16.2 13,16.2M20,2H4C2.89,2 2,2.89 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z" />');
	this.RegisterSvg("facebook-box", 24, '<path d="M19,4V7H17A1,1 0 0,0 16,8V10H19V13H16V20H13V13H11V10H13V7.5C13,5.56 14.57,4 16.5,4M20,2H4A2,2 0 0,0 2,4V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V4C22,2.89 21.1,2 20,2Z" />');
	this.RegisterSvg("google-plus-box", 24, '<path d="M20,2A2,2 0 0,1 22,4V20A2,2 0 0,1 20,22H4A2,2 0 0,1 2,20V4C2,2.89 2.9,2 4,2H20M20,12H18V10H17V12H15V13H17V15H18V13H20V12M9,11.29V13H11.86C11.71,13.71 11,15.14 9,15.14C7.29,15.14 5.93,13.71 5.93,12C5.93,10.29 7.29,8.86 9,8.86C10,8.86 10.64,9.29 11,9.64L12.36,8.36C11.5,7.5 10.36,7 9,7C6.21,7 4,9.21 4,12C4,14.79 6.21,17 9,17C11.86,17 13.79,15 13.79,12.14C13.79,11.79 13.79,11.57 13.71,11.29H9Z" />');
	this.RegisterSvg("youtube-play", 24, '<path d="M10,16.5V7.5L16,12M20,4.4C19.4,4.2 15.7,4 12,4C8.3,4 4.6,4.19 4,4.38C2.44,4.9 2,8.4 2,12C2,15.59 2.44,19.1 4,19.61C4.6,19.81 8.3,20 12,20C15.7,20 19.4,19.81 20,19.61C21.56,19.1 22,15.59 22,12C22,8.4 21.56,4.91 20,4.4Z" />');
	this.RegisterSvg("earth", 24, '<path d="M17.9,17.39C17.64,16.59 16.89,16 16,16H15V13A1,1 0 0,0 14,12H8V10H10A1,1 0 0,0 11,9V7H13A2,2 0 0,0 15,5V4.59C17.93,5.77 20,8.64 20,12C20,14.08 19.2,15.97 17.9,17.39M11,19.93C7.05,19.44 4,16.08 4,12C4,11.38 4.08,10.78 4.21,10.21L9,15V16A2,2 0 0,0 11,18M12,2A10,10 0 0,0 2,12A10,10 0 0,0 12,22A10,10 0 0,0 22,12A10,10 0 0,0 12,2Z" />');
	this.RegisterSvg("currency-usd", 24, '<path d="M11.8,10.9C9.53,10.31 8.8,9.7 8.8,8.75C8.8,7.66 9.81,6.9 11.5,6.9C13.28,6.9 13.94,7.75 14,9H16.21C16.14,7.28 15.09,5.7 13,5.19V3H10V5.16C8.06,5.58 6.5,6.84 6.5,8.77C6.5,11.08 8.41,12.23 11.2,12.9C13.7,13.5 14.2,14.38 14.2,15.31C14.2,16 13.71,17.1 11.5,17.1C9.44,17.1 8.63,16.18 8.5,15H6.32C6.44,17.19 8.08,18.42 10,18.83V21H13V18.85C14.95,18.5 16.5,17.35 16.5,15.3C16.5,12.46 14.07,11.5 11.8,10.9Z" />');
	this.RegisterSvg("flag", 24, '<path d="M14.4,6L14,4H5V21H7V14H12.6L13,16H20V6H14.4Z" />');
	this.RegisterSvg("flag-outline", 24, ' <path d="M14.5,6H20V16H13L12.5,14H7V21H5V4H14L14.5,6M7,6V12H13L13.5,14H18V8H14L13.5,6H7Z" />');
	// this.RegisterSvg("contacts", 24, '<path d="M20,0H4V2H20V0M4,24H20V22H4V24M20,4H4A2,2 0 0,0 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6A2,2 0 0,0 20,4M12,6.75A2.25,2.25 0 0,1 14.25,9A2.25,2.25 0 0,1 12,11.25A2.25,2.25 0 0,1 9.75,9A2.25,2.25 0 0,1 12,6.75M17,17H7V15.5C7,13.83 10.33,13 12,13C13.67,13 17,13.83 17,15.5V17Z" />');
	this.RegisterSvg("doctor", 24, '<path d="M10.171,0.242 C11.104,0.231 12.083,0.270 12.629,0.668 C12.846,1.002 13.063,1.336 13.281,1.670 C13.553,1.883 13.976,1.921 14.183,2.196 C14.855,3.086 14.810,4.932 14.509,6.181 C15.270,6.317 15.041,7.352 14.710,7.785 C14.392,8.002 14.075,8.220 13.757,8.437 C12.729,9.775 12.503,11.488 10.522,11.895 C8.855,12.237 7.526,10.504 6.986,9.564 C6.827,9.180 6.668,8.796 6.510,8.412 C6.327,8.159 5.773,8.117 5.532,7.785 C5.102,7.194 5.040,6.530 5.682,6.131 C5.649,5.354 5.615,4.577 5.582,3.800 C5.868,2.267 6.921,1.272 8.190,0.718 C8.733,0.480 9.650,0.547 10.171,0.242 ZM19.600,24.000 C13.281,24.000 6.960,24.000 0.642,24.000 C0.614,22.203 0.954,20.761 1.243,19.213 C1.540,17.624 1.594,15.844 2.422,14.777 C3.055,13.962 4.416,13.754 5.456,13.349 C5.326,14.198 4.818,15.750 4.955,16.632 C5.147,17.872 5.453,18.838 5.707,19.915 C5.878,20.639 4.971,21.083 5.858,21.744 C6.009,21.858 6.242,22.035 6.535,21.995 C7.114,21.917 7.815,21.420 7.588,20.642 C7.413,20.043 6.649,20.127 6.359,19.664 C5.688,18.592 5.515,14.147 6.384,13.198 C6.566,13.000 7.012,12.888 7.362,12.873 C7.488,13.795 8.681,16.465 9.243,16.882 C9.243,16.866 9.243,16.849 9.243,16.832 C9.343,16.340 9.444,15.847 9.544,15.354 C9.529,15.034 9.266,14.699 9.394,14.351 C9.497,14.071 9.876,13.872 10.121,13.725 C10.363,13.950 10.606,14.176 10.848,14.401 C10.575,15.102 10.823,16.226 11.024,16.832 C11.132,16.732 11.241,16.632 11.350,16.532 C11.475,16.340 11.600,16.147 11.726,15.955 C11.951,15.404 12.177,14.852 12.403,14.301 C12.587,13.817 12.771,13.332 12.955,12.848 C13.318,12.959 13.840,12.980 14.108,13.198 C14.586,13.587 14.331,15.009 14.133,15.504 C12.343,15.496 12.076,16.873 11.575,18.161 C11.350,18.762 11.124,19.364 10.898,19.965 C10.671,20.903 11.160,21.906 12.077,21.719 C12.160,21.644 12.244,21.569 12.328,21.494 C12.336,21.419 12.344,21.343 12.353,21.268 C12.133,21.099 11.673,20.841 11.600,20.541 C11.452,19.927 11.919,19.418 12.077,19.038 C12.515,17.985 12.672,15.754 14.409,16.306 C15.640,16.697 15.472,18.471 15.237,19.815 C15.151,20.305 15.296,20.910 15.086,21.268 C14.819,21.724 14.065,21.377 13.933,22.020 C14.182,22.193 14.612,22.519 15.061,22.321 C15.829,21.983 16.531,18.881 16.290,17.534 C16.105,16.504 15.466,16.312 14.961,15.654 C15.019,14.928 15.078,14.201 15.136,13.474 C16.169,13.868 17.419,14.126 18.020,14.953 C18.530,15.654 18.526,16.727 18.747,17.735 C19.173,19.668 19.598,21.628 19.600,24.000 Z" />');
	this.RegisterSvg("airplane", 24, '<path d="M21,16V14L13,9V3.5A1.5,1.5 0 0,0 11.5,2A1.5,1.5 0 0,0 10,3.5V9L2,14V16L10,13.5V19L8,20.5V22L11.5,21L15,22V20.5L13,19V13.5L21,16Z" />');
	this.RegisterSvg("credit-card", 24, '<path d="M20,8H4V6H20M20,18H4V12H20M20,4H4C2.89,4 2,4.89 2,6V18A2,2 0 0,0 4,20H20A2,2 0 0,0 22,18V6C22,4.89 21.1,4 20,4Z" />');
	this.RegisterSvg("pill", 24, '<path d="M4.22,11.29L11.29,4.22C13.64,1.88 17.43,1.88 19.78,4.22C22.12,6.56 22.12,10.36 19.78,12.71L12.71,19.78C10.36,22.12 6.56,22.12 4.22,19.78C1.88,17.43 1.88,13.64 4.22,11.29M5.64,12.71C4.59,13.75 4.24,15.24 4.6,16.57L10.59,10.59L14.83,14.83L18.36,11.29C19.93,9.73 19.93,7.2 18.36,5.64C16.8,4.07 14.27,4.07 12.71,5.64L5.64,12.71Z" />');
	this.RegisterSvg("bank", 24, '<path d="M11.5,1L2,6V8H21V6M16,10V17H19V10M2,22H21V19H2M10,10V17H13V10M4,10V17H7V10H4Z" />');
	this.RegisterSvg("prescription", 24, ' <path d="M4,4V10L4,14H6V10H8L13.41,15.41L9.83,19L11.24,20.41L14.83,16.83L18.41,20.41L19.82,19L16.24,15.41L19.82,11.83L18.41,10.41L14.83,14L10.83,10H11A3,3 0 0,0 14,7A3,3 0 0,0 11,4H4M6,6H11A1,1 0 0,1 12,7A1,1 0 0,1 11,8H6V6Z" />');
	this.RegisterSvg("note-multiple-outline", 24, '<path d="M3,6V22H21V24H3A2,2 0 0,1 1,22V6H3M16,9H21.5L16,3.5V9M7,2H17L23,8V18A2,2 0 0,1 21,20H7C5.89,20 5,19.1 5,18V4A2,2 0 0,1 7,2M7,4V18H21V11H14V4H7Z" />');
	this.RegisterSvg("deskphone", 24, '<path d="M5,3H19A2,2 0 0,1 21,5V19A2,2 0 0,1 19,21H5A2,2 0 0,1 3,19V5A2,2 0 0,1 5,3M15,5V19H19V5H15M5,5V9H13V5H5M5,11V13H7V11H5M8,11V13H10V11H8M11,11V13H13V11H11M5,14V16H7V14H5M8,14V16H10V14H8M11,14V16H13V14H11M11,17V19H13V17H11M8,17V19H10V17H8M5,17V19H7V17H5Z" />');
	this.RegisterSvg("inbox-arrow-down", 24, '<path d="M16,10H14V7H10V10H8L12,14M19,15H15A3,3 0 0,1 12,18A3,3 0 0,1 9,15H5V5H19M19,3H5C3.89,3 3,3.9 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5A2,2 0 0,0 19,3Z" />');
	this.RegisterSvg("close", 24, '<path d="M19,6.41L17.59,5L12,10.59L6.41,5L5,6.41L10.59,12L5,17.59L6.41,19L12,13.41L17.59,19L19,17.59L13.41,12L19,6.41Z" />');
	this.RegisterSvg("phone-classic", 24, '<path d="M12,3C7.46,3 3.34,4.78 0.29,7.67C0.11,7.85 0,8.1 0,8.38C0,8.66 0.11,8.91 0.29,9.09L2.77,11.57C2.95,11.75 3.2,11.86 3.5,11.86C3.75,11.86 4,11.75 4.18,11.58C4.97,10.84 5.87,10.22 6.84,9.73C7.17,9.57 7.4,9.23 7.4,8.83V5.73C8.85,5.25 10.39,5 12,5C13.59,5 15.14,5.25 16.59,5.72V8.82C16.59,9.21 16.82,9.56 17.15,9.72C18.13,10.21 19,10.84 19.82,11.57C20,11.75 20.25,11.85 20.5,11.85C20.8,11.85 21.05,11.74 21.23,11.56L23.71,9.08C23.89,8.9 24,8.65 24,8.37C24,8.09 23.88,7.85 23.7,7.67C20.65,4.78 16.53,3 12,3M9,7V10C9,10 3,15 3,18V22H21V18C21,15 15,10 15,10V7H13V9H11V7H9M12,12A4,4 0 0,1 16,16A4,4 0 0,1 12,20A4,4 0 0,1 8,16A4,4 0 0,1 12,12M12,13.5A2.5,2.5 0 0,0 9.5,16A2.5,2.5 0 0,0 12,18.5A2.5,2.5 0 0,0 14.5,16A2.5,2.5 0 0,0 12,13.5Z" />');
	this.RegisterSvg("phone", 24, '<path d="M6.62,10.79C8.06,13.62 10.38,15.94 13.21,17.38L15.41,15.18C15.69,14.9 16.08,14.82 16.43,14.93C17.55,15.3 18.75,15.5 20,15.5A1,1 0 0,1 21,16.5V20A1,1 0 0,1 20,21A17,17 0 0,1 3,4A1,1 0 0,1 4,3H7.5A1,1 0 0,1 8.5,4C8.5,5.25 8.7,6.45 9.07,7.57C9.18,7.92 9.1,8.31 8.82,8.59L6.62,10.79Z" />');
	this.RegisterSvg("view-list", 24, '<path d="M9,5V9H21V5M9,19H21V15H9M9,14H21V10H9M4,9H8V5H4M4,19H8V15H4M4,14H8V10H4V14Z" />');
	this.RegisterSvg("percent", 24, '<path d="M7,4A3,3 0 0,1 10,7A3,3 0 0,1 7,10A3,3 0 0,1 4,7A3,3 0 0,1 7,4M17,14A3,3 0 0,1 20,17A3,3 0 0,1 17,20A3,3 0 0,1 14,17A3,3 0 0,1 17,14M20,5.41L5.41,20L4,18.59L18.59,4L20,5.41Z" />');
	this.RegisterSvg("hospital-building", 24, '<path d="M2,22V7A1,1 0 0,1 3,6H7V2H17V6H21A1,1 0 0,1 22,7V22H14V17H10V22H2M9,4V10H11V8H13V10H15V4H13V6H11V4H9M4,20H8V17H4V20M4,15H8V12H4V15M16,20H20V17H16V20M16,15H20V12H16V15M10,15H14V12H10V15Z" />');
	this.RegisterSvg("approval", 24, '<path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M10,17L6,13L7.41,11.59L10,14.17L16.59,7.58L18,9L10,17Z" />');
	this.RegisterSvg("alert-decagram", 24, '<path d="M23,12L20.56,9.22L20.9,5.54L17.29,4.72L15.4,1.54L12,3L8.6,1.54L6.71,4.72L3.1,5.53L3.44,9.21L1,12L3.44,14.78L3.1,18.47L6.71,19.29L8.6,22.47L12,21L15.4,22.46L17.29,19.28L20.9,18.46L20.56,14.78L23,12M13,17H11V15H13V17M13,13H11V7H13V13Z" />');
	this.RegisterSvg("attachment", 24, '<path d="M7.5,18A5.5,5.5 0 0,1 2,12.5A5.5,5.5 0 0,1 7.5,7H18A4,4 0 0,1 22,11A4,4 0 0,1 18,15H9.5A2.5,2.5 0 0,1 7,12.5A2.5,2.5 0 0,1 9.5,10H17V11.5H9.5A1,1 0 0,0 8.5,12.5A1,1 0 0,0 9.5,13.5H18A2.5,2.5 0 0,0 20.5,11A2.5,2.5 0 0,0 18,8.5H7.5A4,4 0 0,0 3.5,12.5A4,4 0 0,0 7.5,16.5H17V18H7.5Z" />');
	this.RegisterSvg("hospital", 24, '<path d="M18,14H14V18H10V14H6V10H10V6H14V10H18M19,3H5C3.89,3 3,3.89 3,5V19A2,2 0 0,0 5,21H19A2,2 0 0,0 21,19V5C21,3.89 20.1,3 19,3Z" />');
	this.RegisterSvg("plane-shield", 24, '<path d="M12,1L3,5V11C3,16.55 6.84,21.74 12,23C17.16,21.74 21,16.55 21,11V5L12,1M12,5.68C12.5,5.68 12.95,6.11 12.95,6.63V10.11L18,13.26V14.53L12.95,12.95V16.42L14.21,17.37V18.32L12,17.68L9.79,18.32V17.37L11.05,16.42V12.95L6,14.53V13.26L11.05,10.11V6.63C11.05,6.11 11.5,5.68 12,5.68Z" />');
	this.RegisterSvg("mailbox", 26, '<path d="M20,6H10V12H8V4H14V0H6V6H4A2,2 0 0,0 2,8V20A2,2 0 0,0 4,22H20A2,2 0 0,0 22,20V8A2,2 0 0,0 20,6Z" />');
	this.RegisterSvg("account-card-details", 25, '<path d="M2,3H22C23.05,3 24,3.95 24,5V19C24,20.05 23.05,21 22,21H2C0.95,21 0,20.05 0,19V5C0,3.95 0.95,3 2,3M14,6V7H22V6H14M14,8V9H21.5L22,9V8H14M14,10V11H21V10H14M8,13.91C6,13.91 2,15 2,17V18H14V17C14,15 10,13.91 8,13.91M8,6A3,3 0 0,0 5,9A3,3 0 0,0 8,12A3,3 0 0,0 11,9A3,3 0 0,0 8,6Z" />');
	this.RegisterSvg("information-variant", 24, '<path d="M13.5,4A1.5,1.5 0 0,0 12,5.5A1.5,1.5 0 0,0 13.5,7A1.5,1.5 0 0,0 15,5.5A1.5,1.5 0 0,0 13.5,4M13.14,8.77C11.95,8.87 8.7,11.46 8.7,11.46C8.5,11.61 8.56,11.6 8.72,11.88C8.88,12.15 8.86,12.17 9.05,12.04C9.25,11.91 9.58,11.7 10.13,11.36C12.25,10 10.47,13.14 9.56,18.43C9.2,21.05 11.56,19.7 12.17,19.3C12.77,18.91 14.38,17.8 14.54,17.69C14.76,17.54 14.6,17.42 14.43,17.17C14.31,17 14.19,17.12 14.19,17.12C13.54,17.55 12.35,18.45 12.19,17.88C12,17.31 13.22,13.4 13.89,10.71C14,10.07 14.3,8.67 13.14,8.77Z" />');
	this.RegisterSvg("close-circle-outline", 25, '<path d="M12,20C7.59,20 4,16.41 4,12C4,7.59 7.59,4 12,4C16.41,4 20,7.59 20,12C20,16.41 16.41,20 12,20M12,2C6.47,2 2,6.47 2,12C2,17.53 6.47,22 12,22C17.53,22 22,17.53 22,12C22,6.47 17.53,2 12,2M14.59,8L12,10.59L9.41,8L8,9.41L10.59,12L8,14.59L9.41,16L12,13.41L14.59,16L16,14.59L13.41,12L16,9.41L14.59,8Z" />');
	// this.RegisterSvg("", 24, '');

	this.CloneSvg("info", "information-variant");
	this.CloneSvg("addresses", "mailbox");
	this.CloneSvg("contacts", "account-card-details");
	
	this.CloneSvg("set-default", "check-circle-outline");
	this.CloneSvg("claim-status", "history");
	this.CloneSvg("service-status", "history");
	this.CloneSvg("new-action", "account-check");
	this.CloneSvg("notes", "note-outline");
	this.CloneSvg("validate", "checkbox-marked-circle-outline");
	this.CloneSvg("calculation-report", "file-outline");
	this.CloneSvg("customer-service", "phone");
	this.CloneSvg("claims", "table");
	this.CloneSvg("discount", "percent");

	this.CloneSvg("call-log", "phone-classic");
	this.CloneSvg("eligible", "approval");
	this.CloneSvg("exclusion", "alert-decagram");
	this.CloneSvg("documents", "folder-multiple-outline");
	this.CloneSvg("inbox", "attachment");
	this.CloneSvg("outbox", "file-outline");

	this.CloneSvg("authorisation", "approval");
	this.CloneSvg("authorise", "thumb-up-outline");
	this.CloneSvg("un-authorise", "thumb-down-outline");
	this.CloneSvg("override", "approval");
	
	this.CloneSvg("providers", "account-multiple");
	this.CloneSvg("providers-medical", "hospital");
	this.CloneSvg("providers-travel", "plane-shield");
	this.CloneSvg("hospitals", "hospital-building");
	this.CloneSvg("clients", "earth");
	this.CloneSvg("clients-policies", "earth");
	this.CloneSvg("products", "earth");
	
	// CLAIM STATUS
	this.CloneSvg("claim-close", "alert-circle-outline");
	this.CloneSvg("claim-decline", "close-circle-outline");
	this.CloneSvg("claim-open", "check-circle-outline");
	
	this.CloneSvg("banks", "bank");
	this.CloneSvg("floats", "table-edit");
	this.CloneSvg("case-fees", "table-edit");
	
	// REPORT
	this.CloneSvg("run-report", "approval");
};
