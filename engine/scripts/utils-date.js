// ****************************************************************************************************
// *Last modified on
// *21-SEP-2014 ihms.0.0.0.4
// ****************************************************************************************************
// var __dateformat = "dd/MM/yyyy"; // 21-SEP-2014 ihms.0.0.0.4
var __dateformat = "MM/dd/yyyy"; // 21-SEP-2014 ihms.0.0.0.4
// var __dateformat = "yyyy/MM/dd"; // 21-SEP-2014 ihms.0.0.0.4
var __timeformat = "hh:mm:ss tt"; // 21-SEP-2014 ihms.0.0.0.4
var __datetimeformat = "MM/dd/yyyy hh:mm:ss tt"; // 21-SEP-2014 ihms.0.0.0.4

function __parseDate(p1, p2) {
	return Date.parseExact(p2, p1);
};

function __formatDate(format, date) {
	return date.toString(format);
};

//this function expects a string date format 2013-07-01T00:00:00
String.prototype.convertDate = function(format) {	
	var dp = [];
	if(this != null) {
		dp = this.split("T");
	};
	
	var value = null
	if(dp.length == 2) {
		var date = __parseDate("yyyy-MM-dd", dp[0]);
		if(format) {
			value = __formatDate(format, date)
		} else {
			value = date;
		}		
	} else if(format) {
		value = "";
	}
	
	return value;
};

//this function expects a string date format 2013-07-01T00:00:00
String.prototype.convertDate2 = function(format) {	
	return Date.parse(this.substring(0, 19)).toString(format);
};

String.prototype.parseDate = function(format) {	
	return __parseDate(format, this);
};

Date.prototype.sameDay = function(date) {
    return (this.getDate() == date.getDate() && this.getMonth() == date.getMonth() && this.getFullYear() == date.getFullYear());
};

Date.prototype.daysInMonth = function() {
    var date = new Date(this);
    var m = date.getMonth();
    var y = date.getFullYear();
    var days = 32 - new Date(y, m, 32).getDate();
    
    return days;
};

Date.prototype.addDays = function(days) {
    this.setDate(this.getDate()+days);
    return this;
};

Date.prototype.addMonths = function(months) {
	var d = this.getDate();
	this.setDate(1);
    this.setMonth(this.getMonth()+months);
	var days = this.daysInMonth();
	if(d > days) {
		d = days;
	};

	this.setDate(d);
    return this;
};

Date.prototype.addYears = function(years) {
    this.setFullYear(this.getFullYear()+years);
    return this;
};

Date.prototype.addHours = function(hours) {
    this.setHours(this.getHours()+hours);
    return this;
};

Date.prototype.addMinutes = function(minutes) {
    this.setMinutes(this.getMinutes()+minutes);
    return this;
};

Date.prototype.offsetTimeZone = function() {
    var d = new Date(this);
    var offset = d.getTimezoneOffset();
    d.setMinutes(d.getMinutes()+offset);
    return d;
};

Date.prototype.format = function(format) {
	return this.toString(format);
};
