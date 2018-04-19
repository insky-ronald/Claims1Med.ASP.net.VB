function jMasterDetailController(params) {
	this.params = $.extend({}, {
	}, params);
	
	this.pg = this.params.pg;
	this.view = this.params.view;
	this.details = [];
};

jMasterDetailController.prototype.add = function(params) {
	var view = new jMasterDetail($.extend(params, {
						master: this
					}));
					
	this.details.push(view);
};

function jMasterDetail(params) {
	this.params = $.extend({}, {
		
	}, params);
	
	this.master = this.params.master;
	this.tab = this.params.tab;
	this.tab.detail = this;
};

jMasterDetail.prototype.update = function() {	
	if(!this.view && this.master.view.dataset) {
		this.view = this.params.createView(this.master.view.dataset.getKey());
		
		var self = this;
		this.master.view.dataset.Events.OnMoveRecord.add(function(dataset) {
			self.sync();
		});
	};
};

jMasterDetail.prototype.initDetail = function(grid) {
	var self = this;
	this.master.dataset.Events.OnMoveRecord.add(function(dataset) {
		self.sync();
	});
},

jMasterDetail.prototype.sync = function() {
	if(this.view && this.tab.active && this.currentKey !== this.master.view.dataset.getKey()) {
		this.tab.params.OnSetKey(this, this.currentKey = this.master.view.dataset.getKey());
		// this.view.refresh();
	};
};
