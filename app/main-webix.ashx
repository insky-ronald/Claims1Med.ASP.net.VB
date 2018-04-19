<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		REM Output.AsString("page_title") = "Test Engine V4"
		REM Output.AsString("window_title") = "Engine V4"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Main")
		With Main.SubItems.Add
			.ID = "dashboard"
			.Action = "admin"				
			.Title = "Dashboard"
			REM .Icon = "c+home"
			.Icon = "home"
			.URL = "app/dashboard"
		End with
		
		Main = MenuItems.AddMain("datatables", "Datatables")

		With Main.SubItems.Add
			.ID = "clients"
			.Action = "admin"				
			.Title = "Clients"
			REM .Icon = "c+users"
			.Icon = "table-edit"
			.URL = "app/clients"
		End with

		With Main.SubItems.Add
			.ID = "policies"
			.Action = "insurance"				
			.Title = "Policies"
			REM .Icon = "c+book.hardcover"
			.Icon = "table-edit"
			.URL = "app/masterpolicies"
		End with

		With Main.SubItems.Add
			.ID = "brokers"
			.Action = "admin"				
			.Title = "Brokers"
			REM .Icon = "c+people"
			.Icon = "table-edit"
			.URL = "app/brokers"
		End with
		
		Main = MenuItems.AddMain("calendar", "Calendar")

		With Main.SubItems.Add
			.ID = "calendar-week"
			.Action = "admin"				
			.Title = "Weekly"
			REM .Icon = "c+calendar"
			.Icon = "calendar-blank"
			.URL = "app/calendar"
		End with
		
		Return
		With MenuItems.AddMain
			.ID = "components"
			REM .Action = "admin"				
			.Title = "Components"
			REM .URL = "app/clients"
		End with			
		With MenuItems.AddMain
			.ID = "samples"
			.Action = "admin"				
			.Title = "UI Examples"
			REM .URL = "app/clients"
		End with			
	End Sub
End Class
