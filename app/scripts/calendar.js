// ****************************************************************************************************
// Last modified on
// 11-MAR-2015
// ****************************************************************************************************
//==================================================================================================
// File name: clients.js
//==================================================================================================
function CreateSubPage(params){
	return new Clients(params)
};

Class.Inherits(Clients, SubPageTable);
function Clients(Params) {
	Clients.prototype.parent.call(this, Params);
};

Clients.prototype.classID = "Clients";
Clients.prototype.dataSource = "calendar";
Clients.prototype.showToolbar = true;
Clients.prototype.horzScroll = false;
Clients.prototype.showPager = false;
Clients.prototype.showSummary = false;

Clients.prototype.Initialize = function(Params) {
	Clients.prototype.parent.prototype.Initialize.call(this, Params);
	this.timeScale = 60;
	this.startTime = 7;
	this.columnCount = 7;
	// this.columnCount = 2; 
	// this.columnCount = 1;
	this.date = new Date(2014, 10, 10);	
	this.appointmentContainers = new JList();
	this.timeOffset = 8;
};

Clients.prototype.Test = function() {
	// alerts("here");
};

Clients.prototype.InitializeToolbar = function(toolbar) {
	Clients.prototype.parent.prototype.InitializeToolbar.call(this, toolbar);
	var self = this;
	// toolbar.NewItem({
		// id: "test",
		// icon: "/engine/images/notebook-new-24.png",
		// hint: "Test create appointments...",
		// click: function(item) {
			// self.Test();
		// }
	// });
	toolbar.NewItem({
		id: "day",
		icon: "/engine/images/calendar-day-24.png",
		hint: "View daily appointments",
		click: function(item) {
			// self.Test();
		}
	});
	toolbar.NewItem({
		id: "week",
		icon: "/engine/images/calendar-blue-24.png",
		hint: "View weekly appointments",
		click: function(item) {
			// self.Test();
		}
	});
	toolbar.NewItem({
		id: "month",
		icon: "/engine/images/calendar-month-24.png",
		hint: "View monthly appointments",
		click: function(item) {
			// self.Test();
		}
	});
	toolbar.NewItem({
		id: "previous",
		icon: "/engine/images/arrow-left-24.png",
		hint: "Previous",
		click: function(item) {
			// self.Test();
		}
	});
	toolbar.NewItem({
		id: "next",
		icon: "/engine/images/arrow-right-24.png",
		hint: "Next",
		click: function(item) {
			// self.Test();
		}
	});
};

Clients.prototype.AddAppointment = function(id) {
	if(this.grid.appointments.gotoKey(id)) {
		var date = this.grid.appointments.columnByName("Start").asDate();
		var dateID = date.format("dd-mmm-yy");
		var appointments = this.appointmentContainers.get(dateID);
		if(appointments) {
			appointments.AddAppointment({
				id: id,
				start: this.grid.appointments.columnByName("Start").asTime(),
				finish:	this.grid.appointments.columnByName("Finish").asTime(),
				color:	this.grid.appointments.get("LabelColor")
			})
		}'
	}
}

Clients.prototype.PaintAppointments = function(grid) {
	var self = this;
	this.appointmentContainers.clear();
	grid.Painter.content.find("table[grid-sec='content'] tbody tr:first").each(function(i, tr) {
		var date = new Date(self.date);
		$(tr).find("td").each(function(j, td) {
			if($(td).attr("cal-sec") == "hour") {
				self.appointmentContainers.add(
					date.format("dd-mmm-yy"), 
					new JAppointments({
						container: $(td),
						scale: self.timeScale,
						startTime: self.startTime,					
						date: date
					})
				);
				
				date.addDays(1);
			};
		});
	});
	
	this.grid.appointments.each(function(row, i) {
		self.AddAppointment(row.ID);
	})
	
	this.appointmentContainers.each(function(i, appointment) {
		appointment.PaintAppointments();
	});
};

Clients.prototype.InitializeGrid = function(grid) {
	Clients.prototype.parent.prototype.InitializeGrid.call(this, grid);
	
	// grid.options.allowSort = true;
	grid.options.allowSort = false;
	// grid.options.showSelection = true;
	grid.options.showSelection = false;
	// grid.options.showBand = true;
	// grid.options.simpleSearch = true;
	// grid.options.simpleSearchField = "Name";
	grid.optionsData.editCallback = function(grid, id) {
		// __client(id);
	};
	
	grid.Events.OnInitRow.add(function(grid, row) {
		// if(grid.dataset.get("pa_id") != 0) {
			// row.attr("x-pa", "true")
		// };
	});
	
	grid.Methods.add("initListData", function(grid, data) {
		return new Dataset(grid.Methods.call("resetListData", data), "Data");
	});
	
	grid.Methods.add("resetListData", function(grid, data) {
		var rawData = [];
		var add = function(id, time) {
			var row = {id:id, time:id.strZero(2)+":00"};
			for(var i = 1; i <= grid.owner.columnCount; i++) {
				row["day_"+i] = "";
			};
			rawData.push(row)
		};

		for(var i = grid.owner.startTime; i <= 23; i++) {
			add(i);
		};
		
		return rawData;
	});
	
	grid.Events.OnInitSubData.add(function(grid, data) {
		if(data.index == 0) {
			if(grid.appointments) {
				grid.appointments.resetData(data.rawData)
			} else {
				grid.appointments = new Dataset(data.rawData, "Appointments")
				grid.appointments.Columns
					.setprops("ID", {label:"ID", numeric:true, key: true})
					.setprops("DoctorID", {numeric:true})
					.setprops("NameID", {numeric:true})
					.setprops("Name", {label:"Name"})
					.setprops("DoctorName", {label:"Doctor"})
					.setprops("Start", {label:"Start", type:"date"})
					.setprops("Finish", {label:"Finish", type:"date"})
					.setprops("LabelColor")
					.setprops("Message")
					.setprops("State", {numeric:true})
			}
		}
	});
	
	grid.Events.AfterRepainContent.add(function(grid) {
		// alerts("OK");
		grid.owner.PaintAppointments(grid);
	});	
}

Clients.prototype.InitializeQuery = function(data) {
	Clients.prototype.parent.prototype.InitializeQuery.call(this, data);
	data.addColumn("date", this.date.format("dd-mmm-yy"));
	data.addColumn("date_count", this.columnCount, {numeric:true});
	data.addColumn("time_offset", 0, {numeric:true});
	// data.addColumn("time_offset", -8, {numeric:true});
};

Clients.prototype.InitializeTableData = function(data) {
	Clients.prototype.parent.prototype.InitializeTableData.call(this, data);
	var dateName = new Date(this.date);
	var dateFormat = "ddd, mmmm d";
	data.Columns.setprops("id", {label:"ID", numeric:true, key: true})
	data.Columns.setprops("time", {label:"Time"});
	data.Columns.setprops("day_1", {label:dateName.format(dateFormat)})
	for(var i = 2; i <= this.columnCount; i++) {
		data.Columns.setprops("day_"+i, {label:dateName.addDays(1).format(dateFormat)})
	};
};

Clients.prototype.InitializeColumns = function(grid) {
	Clients.prototype.parent.prototype.InitializeColumns.call(this, grid);

	var self = this;
	var counter = 0;
	
	desktop.zIndex += 100;
	// var date = new Date(this.date);
	var drawContent = function(cell, column) {
		cell.attr("cal-sec", "hour");
		cell.css("z-index", desktop.zIndex--);
		// if(counter++ < grid.owner.columnCount) {
			// self.appointmentContainers.add(
				// date.format("dd-mmm-yy"), 
				// new JAppointments({
					// container: cell,
					// scale: self.timeScale,
					// startTime: self.startTime,					
					// date: date
				// })
			// );
			
			// date.addDays(1);
		// }
	};
	
	var drawHeader = function(cell, column) {
		// cell.html(".");
	};
	
	grid.InitBands("Appointments", function(band) {
		var date = self.date;
		// alerts(date.format("dd-mmm-yy"));
		band.NewColumn({fname: "time", width: 47, fixedWidth:true, 
			drawContent: function(cell) {
				cell.attr("cal-sec", "time");
			},
			drawHeader: function(cell) {
				cell.html("");
			}
		});
		
		for(var i = 1; i <= grid.owner.columnCount; i++) {
			band.NewColumn({fname: "day_"+i, width: 100, drawHeader:drawHeader, drawContent:drawContent});
		};
		
		// band.NewColumn({fname: "day_1", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_2", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_3", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_4", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_5", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_6", width: 100, drawHeader:drawHeader, drawContent:drawContent});
		// band.NewColumn({fname: "day_7", width: 100, drawHeader:drawHeader, drawContent:drawContent});
	});
};
