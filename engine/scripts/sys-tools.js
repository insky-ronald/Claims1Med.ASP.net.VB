function Tools(params){
	// console.log("here")
	var sessionContainer = $("#session-info");
	var stayAlive = setInterval(function() {
		getSessionInfo();
	}, 1000*60*10); // 10 minutes
	// }, 5000); // 5 seconds
	
	var getSessionInfo = function() {
		// $.ajax({
		desktop.ajax({
			url: "/engine/get-session-info.aspx",
			type: "GET",
			data: params.requestParams,
			success: function(response) {
				sessionContainer.html(response);
			}
		});
		// sessionContainer.load({
			// url: "/engine/get-session-info.aspx",
			// data: params.requestParams
		// });
	};
};

