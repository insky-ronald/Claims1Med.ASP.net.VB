<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Test Engine V4"
		Output.AsString("window_title") = "Engine V4"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		REM MenuItems.Params.AsString("idx") = "1"
		
		With MenuItems.Add
			.ID = "calendar-week"
			.Action = "admin"				
			.Title = "Calendar"
			.URL = "app/calendar"
			REM .Params.AsString("namex") = "john"
		End with			
		
		With MenuItems.Add
			.ID = "clients"
			.Action = "admin"				
			.Title = "Clients"
			.URL = "app/clients"
			REM .Params.AsString("namex") = "john"
		End with			
		
		With MenuItems.Add
			.ID = "policies"
			.Action = "insurance"				
			.Title = "Policies"
			.URL = "app/masterpolicies"
		End with			
		
		With MenuItems.Add
			.ID = "brokers"
			.Action = "admin"				
			.Title = "Brokers"
			.URL = "app/brokers"
		End with
		
		With MenuItems.Add
			.ID = "reports"
			.Action = "clmreports"				
			.Title = "Reports"
			.URL = "app/reports"
		End with
	End Sub
End Class
