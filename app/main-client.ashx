<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ClientID As Integer
	Private DBClient As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		ClientID = Request.Params("keyid")
		DBClient = DBConnections("DBMedics").OpenData("GetClient", {"id","visit_id"}, {ClientID, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBClient.Eval("Client: @full_name")
			Output.AsString("window_title") = DBClient.Eval("@full_name")

			CustomData.AsJson("client_id") = ClientID
			REM CustomData.AsJson("certificate_id") = DBMember.Eval("@certificate_id")
			CustomData.AsJson("data") = DBClient.AsJson()
		Else If Action = "refresh"
			Output.AsJson("data") = DBClient.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBClient.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsJson("client_id") = ClientID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("client", "Client")
		
			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/client"
			End with
		
			With Main.SubItems.Add
				.ID = "address"
				.Title = "Address"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/addresses"
				.Params.AsInteger("name_id") = ClientID
			End with
		
			With Main.SubItems.Add
				.ID = "contacts"
				.Title = "Contacts"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
				.Params.AsInteger("name_id") = ClientID
			End with
			
		Main = MenuItems.AddMain("financial", "Financial")
		
			With Main.SubItems.Add
				.ID = "banks"
				.Title = "Banks"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
				.Params.AsInteger("name_id") = ClientID
			End with
		
			With Main.SubItems.Add
				.ID = "floats"
				.Title = "Floats"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
			End with
		
			With Main.SubItems.Add
				.ID = "case-fees"
				.Title = "Case Fees"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
			End with
			
		Main = MenuItems.AddMain("security", "Security")
		
			With Main.SubItems.Add
				.ID = "authorisation"
				.Title = "Authorisation"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
			End with
		
			With Main.SubItems.Add
				.ID = "providers"
				.Title = "Providers"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
			End with
	End Sub
End Class
