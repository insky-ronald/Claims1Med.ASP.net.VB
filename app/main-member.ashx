<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private MemberID As Integer
	Private DBMember As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		MemberID = Request.Params("keyid")
		DBMember = DBConnections("DBMedics").OpenData("GetMember", {"id","visit_id"}, {MemberID, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBMember.Eval("Member: @full_name")
			Output.AsString("window_title") = DBMember.Eval("@full_name")

			CustomData.AsJson("member_id") = MemberID
			CustomData.AsJson("certificate_id") = DBMember.Eval("@certificate_id")
			REM CustomData.AsJson("data") = DatatableToJson(DBMember)
			CustomData.AsJson("data") = DBMember.AsJson()
			Using DBCountries = DBConnections("DBMedics").OpenData("GetCountries", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
				CustomData.AsJson("countries") = DBCountries.AsJson()
			End Using
			REM CustomData.AsString("claim_type") = DBMember.Eval("@claim_type")
		Else If Action = "refresh"
			Output.AsJson("data") = DBMember.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBMember.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsInteger("member_id") = MemberID
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("member", "Member")
		
			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/member"
				.Params.AsString("certificate_id") = DBMember.Eval("@certificate_id")
			End with
			
			With Main.SubItems.Add
				.ID = "claims"
				.Title = "Claims"
				.Icon = "table"
				.Action = "admin"				
				.URL = "app/under-construction"
				REM .Params.AsString("module") = "clm"
			End with
			
			With Main.SubItems.Add
				.ID = "banks"
				.Title = "Bank Accounts"
				.Icon = "bank"
				.Action = "admin"				
				.URL = "app/banks"
				.Params.AsInteger("name_id") = MemberID
			End with
			
		Main = MenuItems.AddMain("notes", "Notes")
			
			With Main.SubItems.Add
				.ID = "pmr"
				.Title = "PMR"
				.Icon = "note-outline"
				.Action = "admin"				
				.URL = "app/under-construction"
				REM .Params.AsString("module") = "clm"
			End with
			
			With Main.SubItems.Add
				.ID = "medical"
				.Title = "Medical Notes"
				.Icon = "note-outline"
				.Action = "admin"				
				.URL = "app/under-construction"
				REM .Params.AsString("module") = "clm"
			End with
			
			With Main.SubItems.Add
				.ID = "underwriting"
				.Title = "Underwriting Notes"
				.Icon = "note-outline"
				.Action = "admin"				
				.URL = "app/under-construction"
				REM .Params.AsString("module") = "clm"
			End with
		
			REM With Main.SubItems.Add
				REM .ID = "notes"
				REM .Title = "Notes"
				REM .Icon = "pencil-box-outline"
				REM .Action = "admin"				
				REM .URL = "app/notes"
				REM .Params.AsString("module") = "clm"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "reserve"
				REM .Title = "Reserve"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/under-construction"
				REM .Params.AsString("module") = .ID
			REM End with
		
			REM With Main.SubItems.Add
				REM .ID = "log"
				REM .Title = "Log"
				REM .Icon = "timetable"
				REM .Action = "admin"				
				REM .URL = "app/under-construction"
				REM .Params.AsString("module") = .ID
			REM End with
		
		
			REM With Main.SubItems.Add
				REM .ID = "invoices"
				REM .Title = "Invoices"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "inv"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "gop"
				REM .Title = "Guarantee of Payments"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "gop"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "noc"
				REM .Title = "Notification of Claims"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "noc"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "casefee"
				REM .Title = "Case Fees"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "cas"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "recovery"
				REM .Title = "Recovery of Claims"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "rec"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "costcont"
				REM .Title = "Cost Containment"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "cos"
			REM End with
			
			REM With Main.SubItems.Add
				REM .ID = "flag"
				REM .Title = "Flags"
				REM .Icon = "table"
				REM .Action = "admin"				
				REM .URL = "app/claim-invoices"
				REM .Params.AsString("module") = "flg"
			REM End with
		
		REM Main = MenuItems.AddMain("other", "Other")
		
		REM Return
		REM Main = MenuItems.AddMain("datatables", "Datatables")

		REM With Main.SubItems.Add
			REM .ID = "clients"
			REM .Action = "admin"				
			REM .Title = "Clients"
			REM .Icon = "table-edit"
			REM .URL = "app/clients"
		REM End with

		REM With Main.SubItems.Add
			REM .ID = "policies"
			REM .Action = "insurance"				
			REM .Title = "Policies"
			REM .Icon = "table-edit"
			REM .URL = "app/masterpolicies"
		REM End with

		REM With Main.SubItems.Add
			REM .ID = "brokers"
			REM .Action = "admin"				
			REM .Title = "Brokers"
			REM .Icon = "table-edit"
			REM .URL = "app/brokers"
		REM End with
		
		REM Main = MenuItems.AddMain("calendar", "Calendar")

		REM With Main.SubItems.Add
			REM .ID = "calendar-week"
			REM .Action = "admin"				
			REM .Title = "Weekly"
			REM .Icon = "calendar-blank"
			REM .URL = "app/calendar"
		REM End with
	End Sub
End Class
