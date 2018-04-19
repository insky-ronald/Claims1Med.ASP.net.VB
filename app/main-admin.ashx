<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Administration"
		Output.AsString("window_title") = "Administration"
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("client", "Client")
			With Main.SubItems.Add
				.ID = "clients"
				.Action = "admin"				
				.Title = "Client Listing"
				.Icon = "table"
				.URL = "app/clients"
			End with

			With Main.SubItems.Add
				.ID = "policy"
				.Action = "admin"				
				.Title = "Policy Holders"
				.Icon = "table"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Scripts = "*"
				.Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "products"
				.Action = "admin"				
				.Title = "Products & Plans"
				.Icon = "table"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Scripts = "*"
				.Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "accounts"
				.Action = "admin"				
				.Title = "Accounts Masterfile"
				.Icon = "table"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Scripts = "*"
				.Params.AsString("module") = .ID
			End with

			REM Main = MenuItems.AddMain("products", "Claim")
			REM With Main.SubItems.Add
				REM .ID = "claims"
				REM .Action = "admin"				
				REM .Title = "Claims Processing"
				REM .Icon = "table"
				REM .URL = "app/claims-processing"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "payment"
				REM .Action = "admin"				
				REM .Title = "Payment Processing"
				REM .Icon = "table"
				REM .URL = "app/payment-processing"
			REM End with

		REM Main = MenuItems.AddMain("reports", "Reports")
			REM With Main.SubItems.Add
				REM .ID = "reports"
				REM .Action = "admin"				
				REM .Title = "Reports"
				REM .Icon = "table"
				REM .URL = "app/under-construction"
				REM .Params.AsString("module") = .ID
			REM End with

		REM Main = MenuItems.AddMain("other", "Other")

			REM With Main.SubItems.Add
				REM .ID = "clients"
				REM .Action = "admin"				
				REM .Title = "Clients"
				REM .Icon = "table"
				REM .URL = "app/clients"
			REM End with

			REM With Main.SubItems.Add
				REM .ID = "masterpolicies"
				REM .Action = "admin"				
				REM .Title = "Master Policies"
				REM .Icon = "table"
				REM .URL = "app/masterpolicies"
			REM End with

			REM With Main.SubItems.Add
				REM .ID = "banks"
				REM .Action = "admin"				
				REM .Title = "Banks"
				REM .Icon = "table"
				REM .URL = "app/banks"
			REM End with
	End Sub
End Class
