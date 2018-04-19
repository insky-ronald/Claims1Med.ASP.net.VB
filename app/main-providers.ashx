<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Providers"
		Output.AsString("window_title") = "Providers"
		
		Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"action","visit_id"}, {1, Session("VisitorID")}, "")
			CustomData.AsJson("countries") = DBCountries.AsJson()
		End Using
		
		Using DBDoctorSpecialisation = DBConnections("DBMedics").OpenData("GetDoctorSpecialisation", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
			CustomData.AsJson("specialisation") = DBDoctorSpecialisation.AsJson()
		End Using
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("medical", "Medical")
			With Main.SubItems.Add
				.ID = "doctors"
				.Action = "admin"				
				.Title = "Doctors"
				.Icon = "doctor"
				.URL = "app/providers"
				.Run = "ProviderMasterDetailView"
				.Css = "*"
				.Params.AsString("provider_type") = "D"
			End with

			With Main.SubItems.Add
				.ID = "hospitals"
				.Action = "admin"				
				.Title = "Hospitals"
				.Icon = "hospital"
				' .URL = "app/hospitals"
				.URL = "app/providers"
				.Run = "ProviderMasterDetailView"
				.Css = "*"
				.Params.AsString("provider_type") = "H"
			End with

			With Main.SubItems.Add
				.ID = "clinics"
				.Action = "admin"				
				.Title = "Clinics"
				.Icon = "table"
				.URL = "app/clinics"
			End with

			With Main.SubItems.Add
				.ID = "pharmacies"
				.Action = "admin"				
				.Title = "Pharmacies"
				.Icon = "pill"
				.URL = "app/pharmacies"
			End with

			Main = MenuItems.AddMain("travel", "Travel")
			
			With Main.SubItems.Add
				.ID = "airlines"
				.Action = "admin"				
				.Title = "Air Lines"
				.Icon = "airplane"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Params.AsString("module") = .ID
			End with
			
			With Main.SubItems.Add
				.ID = "credit-cards"
				.Action = "admin"				
				.Title = "Credit Cards"
				.Icon = "credit-card"
				.Content = "engine/under-construction.aspx"
				.URL = "engine/sys-under-construction"
				.Params.AsString("module") = .ID
			End with

	End Sub
End Class
