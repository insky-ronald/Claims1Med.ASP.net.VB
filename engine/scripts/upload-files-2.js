// ****************************************************************************************************
// File name: upload-files-2.js
// Last modified on
// 7:37 PM Monday, June 4, 2018
// ****************************************************************************************************
//==================================================================================================
// jUploadFiles
//==================================================================================================
function jUploadFiles(params) {
	var self = this;
	this.total = 0;
	this.container = params.container;
	// this.dataset = new Dataset([{}]);
	this.dataset = new Dataset([]);
	this.dataset.Columns
		.setprops("id", {label:"ID", numeric:true, key:true})
		.setprops("name", {label:"File Name"})
		.setprops("type", {label:"Type"})
		.setprops("size", {label:"Size", numeric:true});
	
	this.fileInput = CreateElement("input", this.container)
		.attr("type", "file")
		.attr("name", "files[]")
		.attr("multiple", "").
		.css("display", "none").
		.on("change", function(e) {
			var f = e.target.files[0];
			$(e.target.files).each(function(a, file) {
				// console.log(a)
				// console.log(b)
				var r = new FileReader();
				$(r).data("info", file);
				r.onload = function(e) {
					self.DisplayFile(e.target);
				};
				
				// r.readAsDataURL(f);
				// console.log(file)
				r.readAsDataURL(file);
			});
			
			// if(f) {
				// var r = new FileReader();
				// r.onload = function(e) {
					// self.DisplayFile(e.target);
				// };
				
				// r.readAsDataURL(f);
			// }
		});
		
	this.showGrid();
};

jUploadFiles.prototype.classID = "jUploadFiles";

jUploadFiles.prototype.showGrid = function() {
	var self = this;
	this.grid = new jGrid($.extend({container: this.container}, {
		paintParams: {
			css: "upload-files",
			toolbar: {theme: "svg"}
		},		
		init: function(grid, callback) {			
			grid.Events.OnInit.add(function(grid) {
				// grid.optionsData.url = "app/documents";
				grid.optionsData.local = true;
				grid.optionsData.dataset = self.dataset;
				// grid.crud.edit = false;
				// grid.crud.add = false;
				// grid.crud["delete"] = false;
				
				// grid.optionsData.url = "";
				grid.options.editNewPage = false;
				// grid.options.horzScroll = true;
				grid.options.horzScroll = false;
				grid.options.allowSort = false;
				grid.options.showPager = false;				
				
				grid.options.toolbar.visible = false;								
				grid.search.visible = false;
				
				grid.Events.OnInitDataRequest.add(function(grid, dataParams) {
				});
				
				grid.Events.OnInitData.add(function(grid, data) {
					// data.Columns
						// .setprops("id", {label:"ID", numeric:true, key:true})
						// .setprops("name", {label:"File Name"})
						
				});	
				
				// grid.methods.add("editPageUrl", function(grid, id) {
					// return __plan(id, true)
				// });
				
				// grid.methods.add("editPageUrl", function(grid, id) {
					// return __plan(id, true)
				// });

				grid.Events.OnInitColumns.add(function(grid) {
					grid.NewColumn({fname: "name", width: 250, fixedWidth:true});
					grid.NewColumn({fname: "size", width: 50, fixedWidth:true});
					grid.NewColumn({fname: "type", width: 150, fixedWidth:false});
					// band.NewColumn({fname: "plan_name", width: 400, allowSort: true, fixedWidth:true});
					// band.NewColumn({fname: "currency_code", width: 100, allowSort: true, fixedWidth:true});
				});
				
				// grid.Methods.add("deleteConfirm", function(grid, id) {
					// return {
						// title: "Delete Plan",
						// message: ('Please confirm to delete plan "<b>{0}</b>"').format(grid.dataset.lookup(id, "product_name"))
					// }
				// });
				
				grid.Events.OnInitRow.add(function(grid, row) {	
					// row.attr("x-status", grid.dataset.get("status_id"))
				});
			});
		}
	}));	
};

jUploadFiles.prototype.addFiles = function() {
	this.fileInput.click();
};

jUploadFiles.prototype.DisplayFile = function(file) {
	var record = {};
	var info = $(file).data("info");
	// console.log(info);
	
	record.id = ++this.total;
	record.name = info.name;
	record.size = info.size;
	record.type = info.type;
	this.dataset.data.push(record);
	this.grid.refresh(true);
};

jUploadFiles.prototype.DisplayFile2 = function(file) {
	// console.log(file)
	// console.log($(file).data("info");
	var info = $(file).data("info");
	console.log(file)
	console.log(info)
	
	var row = CreateElement("div", this.container, "", "image-preview");
	if(!this.multipleFiles) {
		row.css("border", 0);
	};
	
	var imgContainer = CreateElement("div", row)
		.attr("x-sec", "img-container")
		
	var name = CreateElement("div", row)
		.html(info.name)
		
	var type = CreateElement("div", row)
		.html(info.type)
	
	var size = info.size;
	
	if(size >= 1024*1024) {
		size = (size / 1024 / 1024).toFixed(2) + " MB"
	} else if(size >= 1024) {
		size = (size / 1024).toFixed(2) + " KB"
	} else
		size = size + " Bytes";
	
	CreateElement("div", row)
		.html(size)
		
	var self = this;
	var naturalWidth = 0;
	var naturalHeight = 0;
	var img = CreateElement("img", imgContainer)
		.attr("src", file.result)
		.load(function() {
			naturalWidth = this.naturalWidth;
			naturalHeight = this.naturalHeight;
	
			CreateElement("div", row)
				.html( naturalWidth +"x"+ naturalHeight);
				
			$(file).data("width", naturalWidth);
			$(file).data("height", naturalHeight);
			
			CreateElement("a", row)
				.attr("x-sec", "upload-button")
				.html("Upload...")
				.click(function() {
					var fileToUpload = $(file).data("info");
					if (fileToUpload.type.match('image.*')) {
						var formData = new FormData();
						formData.append('photos[]', fileToUpload, fileToUpload.name);
						formData.append("size", fileToUpload.size);
						formData.append("image_type", fileToUpload.type);
						formData.append("width", $(file).data("width"));
						formData.append("height", $(file).data("height"));
						
						self.Events.OnSubmit.trigger(formData);
						
						/*
						$.ajax({
							   url: "/api/upload/test",
							   type: "POST",
							   data: formData,
							   processData: false,
							   contentType: false,
							   success: function(response) {
								   // .. do something
							   },
							   error: function(XHR, textStatus, errorMessage) {
								   // console.log(errorMessage); // Optional
							   }
							});				
							*/
							
						var xhr = new XMLHttpRequest();
						xhr.open('POST', self.uploadUrl, true);
						xhr.onload = function () {
							self.Events.OnAfterSubmit.trigger();
							if(xhr.status === 200) {							  
								// File(s) uploaded.
								// uploadButton.innerHTML = 'Upload';
								// console.log("uploaded")
							} else {
								// alert('An error occurred!');
								// console.log("upload error")
							}
						};
						
						var s = $(this);
						s.off("click");
						xhr.upload.onprogress = function(e) {
							var percentComplete = Math.ceil((e.loaded / e.total) * 100);
							s.html(percentComplete+"%");
							// console.log(percentComplete);
						};
						
						xhr.send(formData);
					};
				})
				
		});
};
