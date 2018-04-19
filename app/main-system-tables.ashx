<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "System Tables"
		Output.AsString("window_title") = "System Tables"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("tables", "Tables")
			With Main.SubItems.Add
				.ID = "clients-masterfile"
				.Action = "admin"				
				.Title = "Clients"
				.Icon = "account-multiple"
				.URL = "app/clients-masterfile"
			End with
			
			With Main.SubItems.Add
				.ID = "products"
				.Action = "admin"				
				.Title = "Products"
				.Icon = "folder-multiple-outline"
				.URL = "app/products"
			End with
			
			With Main.SubItems.Add
				.ID = "policies"
				.Action = "admin"				
				.Title = "Policies"
				.Icon = "note-multiple-outline"
				.URL = "app/policies"
			End with
			
			Main = MenuItems.AddMain("others", "Others")
			
			With Main.SubItems.Add
				.ID = "address-types"
				.Action = "admin"				
				.Title = "Address Types"
				.Icon = "checkbox-multiple-marked-some"
				.URL = "app/address-types" 
			End with
			
			With Main.SubItems.Add
				.ID = "countries"
				.Action = "admin"				
				.Title = "Country Table"
				.Icon = "earth"
				.URL = "app/countries"
			End with
			
			With Main.SubItems.Add
				.ID = "currencies"
				.Action = "admin"				
				.Title = "Currency Table"
				.Icon = "currency-usd"
				.URL = "app/currencies"
			End with
			
			With Main.SubItems.Add
				.ID = "nationalities"
				.Action = "admin"				
				.Title = "Nationalities"
				.Icon = "flag"
				.URL = "app/nationalities"
			End with
	End Sub
End Class
