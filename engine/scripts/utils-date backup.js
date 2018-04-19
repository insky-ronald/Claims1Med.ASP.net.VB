// ****************************************************************************************************
// *Last modified on
// *21-SEP-2014 ihms.0.0.0.4
// ****************************************************************************************************
// var __dateformat = "mm/dd/yy";
// var __dateformat = "dd UUU yy"; // 21-SEP-2014 ihms.0.0.0.4
var __dateformat = "dd/mm/yy"; // 21-SEP-2014 ihms.0.0.0.4
var __monthnames = [
	"January",
	"February",
	"March",
	"April",
	"May",
	"June",
	"July",
	"August",
	"September",
	"October",
	"November",
	"December"
];
var __monthnamesex = [
	"Jan",
	"Feb",
	"Mar",
	"Apr",
	"May",
	"Jun",
	"Jul",
	"Aug",
	"Sep",
	"Oct",
	"Nov",
	"Dec"
];
var __weeknames = [
	"Sunday",
	"Monday",
	"Tuesday",
	"Wednesday",
	"Thursday",
	"Friday",
	"Saturday"
];

var __weeknamesex = [
	"Sun",
	"Mon",
	"Tue",
	"Wed",
	"Thu",
	"Fri",
	"Sat"
];

// $.datepicker.parseDate
// $.datepicker.formatDate
if($.datepicker) {
	$.datepicker.setDefaults({
		autoOpen: false,
		dateFormat: __dateformat
	});	
};

function __parseDate(p1, p2) {
	return $.datepicker.parseDate(p1, p2);
};

function __parseDate2(p1, p2) {
	if(p1 == "yy-mm-dd") p1 = "yyyy-mm-dd";
	// var v = $.datepicker.parseDate(p1, p2);
	var v = Date.parseExact(p2, p1);
	console.log({f:"__parseDate", p1:p1, p2:p2, v:v})
	return v;
	// return $.datepicker.parseDate(p1, p2);
	// return Date.parseExact(p2, p1);
};

function __formatDate(format, date) {
	// console.log({f:"__formatDate", format:format, date:date})
	return $.datepicker.formatDate(format, date);
	// return Date.parseExact(date, format);
};

//this function expects a string date format 2013-07-01T00:00:00
String.prototype.convertDate = function(format) {	
	var dp = [];
	if(this != null) {
		dp = this.split("T");
	};
	
	var value = null
	if(dp.length == 2) {
		var date = __parseDate("yy-mm-dd", dp[0]);
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

// For now this is hard-code to parse yy-mm-dd
String.prototype.parseDate = function(format) {	
	var date = __parseDate(format, this);
	
	return date;
};

Date.prototype.sameDay = function(date) {
    return (this.getDate() == date.getDate() && this.getMonth() == date.getMonth() && this.getFullYear() == date.getFullYear());
};

//function daysInMonth(iMonth, iYear)
//{
//    return 32 - new Date(iYear, iMonth, 32).getDate();
//}

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
    var date = new Date(this);
	if(date == null) return "";
	
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();
    var day = date.getDay();
    var monthname = __monthnames[m];
    var monthnameshort = __monthnamesex[m];
    
    var s = format.replaceAll("yy", y);
		var day = __weeknamesex[day];
    s = s.replaceAll("ddd", "AAA");
    s = s.replaceAll("dd", d.strZero(2));
    s = s.replaceAll("d", d);
    s = s.replaceAll("MMM", "UUU");
    s = s.replaceAll("mmmm", "BBB");
    s = s.replaceAll("mmm", "CCC");
    s = s.replaceAll("mm", (m+1).strZero(2));
		
    s = s.replaceAll("AAA", day);
    s = s.replaceAll("BBB", monthname);
    s = s.replaceAll("CCC", monthnameshort);
    s = s.replaceAll("UUU", monthnameshort.toUpperCase());
    
    return s;
};
