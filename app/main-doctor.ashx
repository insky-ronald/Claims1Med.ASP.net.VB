<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private DoctorID As Integer
	Private DBDoctor As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		DoctorID = Request.Params("keyid")
		DBDoctor = DBConnections("DBMedics").OpenData("GetDoctors", {"id","visit_id"}, {DoctorID, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBDoctor.Eval("Doctor: @name")
			Output.AsString("window_title") = DBDoctor.Eval("@name")

			CustomData.AsJson("doctor_id") = DoctorID
			CustomData.AsJson("data") = DBDoctor.AsJson()
			Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				CustomData.AsJson("countries") = DBCountries.AsJson()
			End Using
			Using DBDoctorSpecialisation = DBConnections("DBMedics").OpenData("GetDoctorSpecialisation", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				CustomData.AsJson("specialisation") = DBDoctorSpecialisation.AsJson()
			End Using
		Else If Action = "refresh"
			Output.AsJson("data") = DBDoctor.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBDoctor.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("doctor_id") = DoctorID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("doctor", "Doctor")
		
			With Main.SubItems.Add
				.ID = "doctor-details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/doctor"
			End with
			
			If DoctorID <> 0 
				With Main.SubItems.Add
					.ID = "doctor-address"
					.Title = "Address"
					.Icon = "table"
					.Action = "admin"		
					'.URL = "app/doctor-address" '<<--- adding of new record does not work
					.URL = "app/addresses"
					.Params.AsInteger("name_id") = DoctorID '<<-- add param here
				End with
				
				With Main.SubItems.Add
					.ID = "doctor-contacts"
					.Title = "Contacts"
					.Icon = "contacts"
					.Action = "admin"				
					.URL = "app/contacts"
					.Params.AsInteger("name_id") = DoctorID
				End with
				
			' Main = MenuItems.AddMain("notes", "Notes")
				
				With Main.SubItems.Add
					.ID = "doctor-banks"
					.Title = "Banks"
					.Icon = "bank"
					.Action = "admin"				
					.URL = "app/banks"
					.Params.AsInteger("name_id") = DoctorID
				End with
				
				' With Main.SubItems.Add
					' .ID = "doctor-discount"
					' .Title = "Discount"
					' .Icon = "note-outline"
					' .Action = "admin"				
					' .URL = "app/under-construction"
					' REM .Params.AsString("module") = "clm"
				' End with
			End If
	End Sub
End Class
