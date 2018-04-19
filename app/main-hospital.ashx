<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private HospitalID As Integer
	Private DBHospital As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		HospitalID = Request.Params("keyid")
		DBHospital = DBConnections("DBMedics").OpenData("GetHospitals", {"id","visit_id"}, {HospitalID, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBHospital.Eval("Hospital: @name")
			Output.AsString("window_title") = DBHospital.Eval("@name")

			CustomData.AsJson("hospital_id") = HospitalID
			CustomData.AsJson("data") = DBHospital.AsJson()
			Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				CustomData.AsJson("countries") = DBCountries.AsJson()
			End Using
			' Using DBDoctorSpecialisation = DBConnections("DBMedics").OpenData("GetDoctorSpecialisation", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				' CustomData.AsJson("specialisation") = DBDoctorSpecialisation.AsJson()
			' End Using
		Else If Action = "refresh"
			Output.AsJson("data") = DBHospital.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBHospital.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("hospital_id") = HospitalID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("hospital", "Hospital")
		
			With Main.SubItems.Add
				.ID = "hospital-details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/hospital"
			End with
			
			If HospitalID <> 0
				With Main.SubItems.Add
					.ID = "hospital-address"
					.Title = "Address"
					.Icon = "table"
					.Action = "admin"		
					'.URL = "app/doctor-address" '<<--- adding of new record does not work
					.URL = "app/addresses"
					.Params.AsInteger("name_id") = HospitalID '<<-- add param here
				End with
				
				With Main.SubItems.Add
					.ID = "hospital-contacts"
					.Title = "Contacts"
					.Icon = "contacts"
					.Action = "admin"				
					.URL = "app/contacts"
					.Params.AsInteger("name_id") = HospitalID
				End with
				
			' Main = MenuItems.AddMain("notes", "Notes")
				
				With Main.SubItems.Add
					.ID = "hospital-banks"
					.Title = "Banks"
					.Icon = "bank"
					.Action = "admin"				
					.URL = "app/banks"
					.Params.AsInteger("name_id") = HospitalID
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
