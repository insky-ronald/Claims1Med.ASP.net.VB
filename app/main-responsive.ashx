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
		REM return
		REM MenuItems.Params.AsString("idx") = "1"
		With MenuItems.Add
			.ID = "clients"
			.Action = "admin"				
			REM .Title = "Calendar"
			.Title = ""
			.Description = "Clients"
			.URL = "app/clients"
			REM .URL = "app/masterpolicies"
			.Icon = "/engine/images/calendar-32.png"
			REM .Params.AsString("namex") = "john"
		End with			
		
		With MenuItems.Add
			.ID = "banks"
			.Action = "admin"				
			REM .Title = "Calendar"
			.Title = ""
			.Description = "Banks"
			.URL = "app/banks"
			REM .URL = "app/masterpolicies"
			.Icon = "/engine/images/calendar-32.png"
			REM .Params.AsString("namex") = "john"
		End with			
	End Sub
End Class