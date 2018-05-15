<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ClientID As Integer
	Private DBClient As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		ClientID = Request.Params("keyid")
		DBClient = DBConnections("DBMedics").OpenData("GetClients", {"id","action","visit_id"}, {ClientID, 10, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBClient.Eval("Client: @name")
			Output.AsString("window_title") = DBClient.Eval("@name")

			CustomData.AsJson("client_id") = ClientID
			CustomData.AsJson("data") = DBClient.AsJson()
		' Else If Action = "refresh"
			' Output.AsJson("data") = DBClient.AsJson()
		End if
		
		Using DBCurrencies = DBConnections("DBMedics").OpenData("GetCurrencies", {"action","visit_id"}, {1, Session("VisitorID")}, "")
			DBCurrencies.Columns.Remove("row_no")
			CustomData.AsJson("currencies") = DBCurrencies.AsJson()
		End Using
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
				.Css = "*"
				.Run = "ClientDetailsView"
			End with
		
			' With Main.SubItems.Add
				' .ID = "address"
				' .Title = "Address"
				' .Icon = "addresses"
				' .Action = "admin"
				' .URL = "app/addresses"
				' .Params.AsInteger("name_id") = ClientID
			' End with
		
			' With Main.SubItems.Add
				' .ID = "contacts"
				' .Title = "Contacts"
				' .Icon = "contacts"
				' .Action = "admin"
				' .URL = "app/contacts"
				' .Params.AsInteger("name_id") = ClientID
			' End with
		
		' Main = MenuItems.AddMain("products", "Products")
			
			With Main.SubItems.Add
				.ID = "products"
				.Title = "Products & Plans"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/client-products"
				.Params.AsInteger("name_id") = ClientID
			End with
			
		' Main = MenuItems.AddMain("financial", "Financial")
		
			' With Main.SubItems.Add
				' .ID = "banks"
				' .Title = "Banks"
				' .Icon = "bank"
				' .Action = "admin"
				' .URL = "app/banks"
				' .Params.AsInteger("name_id") = ClientID
			' End with
		
			' With Main.SubItems.Add
				' .ID = "floats"
				' .Title = "Floats"
				' .Icon = "table-edit"
				' .Action = "admin"
				' .URL = "app/floats"
				' .Params.AsInteger("name_id") = ClientID
			' End with
		
			' With Main.SubItems.Add
				' .ID = "client-case-fees"
				' .Title = "Case Fees"
				' .Icon = "table-edit"
				' .Action = "admin"
				' .URL = "app/client-case-fees"
				' .Params.AsInteger("name_id") = ClientID
			' End with
			
		' Main = MenuItems.AddMain("security", "Security")
		
			' With Main.SubItems.Add
				' .ID = "authorisation"
				' .Title = "Authorisation"
				' .Icon = "table-edit"
				' .Action = "admin"
				' .URL = "engine/under-construction"
			' End with
		
			With Main.SubItems.Add
				.ID = "providers"
				.Title = "Providers"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "engine/under-construction"
			End with
	End Sub
End Class
