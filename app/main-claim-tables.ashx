<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		Output.AsString("page_title") = "Claim Tables"
		Output.AsString("window_title") = "Claim Tables"
		
		' Using DBFlagTypes = DBConnections("DBMedics").OpenData("GetFlagTypes", {"lookup","visit_id"}, {1, Session("VisitorID")}, "")
			' CustomData.AsJson("flagtypes") = DBFlagTypes.AsJson()
		' End Using
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("tables1", "Claim & Service")
			With Main.SubItems.Add
				.ID = "claim-types"
				.Action = "admin"				
				.Title = "Claim Types"
				.Icon = "hospital"
				.URL = "app/claim-types"
			End with
			
			With Main.SubItems.Add
				.ID = "service-types"
				.Action = "admin"				
				.Title = "Service Types"
				.Icon = "pill"
				.URL = "app/service-types"
			End with
			
			Main = MenuItems.AddMain("tables2", "General")
			
			With Main.SubItems.Add
				.ID = "case-fees-types"
				.Action = "admin"				
				.Title = "Case Fees Types"
				.Icon = "currency-usd"
				.URL = "app/case-fees-types"
			End with
			
			With Main.SubItems.Add
				.ID = "customer-service-types"
				.Action = "admin"				
				.Title = "Customer Service Types"
				.Icon = "deskphone"
				.URL = "app/customer-service-types"
			End with
			
			With Main.SubItems.Add
				.ID = "guarantee-payment-types"
				.Action = "admin"				
				.Title = "Guarantee of Payment Types"
				.Icon = "currency-usd"
				.URL = "app/gop-types"
			End with
			
			With Main.SubItems.Add
				.ID = "notification-claim-types"
				.Action = "admin"				
				.Title = "Notification of Claims Types"
				.Icon = "alert-circle-outline"
				.URL = "app/noc-types"
			End with
			
			With Main.SubItems.Add
				.ID = "recovery-types"
				.Action = "admin"				
				.Title = "Recovery Types"
				.Icon = "autorenew"
				.URL = "app/recovery-types"
			End with
			
			With Main.SubItems.Add
				.ID = "cost-containment-types"
				.Action = "admin"				
				.Title = "Cost Containment Types"
				.Icon = "inbox-arrow-down"
				.URL = "app/cost-containment-types"
			End with
			
			Main = MenuItems.AddMain("flags", "Flags")
			
			With Main.SubItems.Add
				.ID = "flag-types"
				.Action = "admin"				
				.Title = "Flag Types"
				.Icon = "flag"
				.URL = "app/flag-types"
			End with
			
			' With Main.SubItems.Add
				' .ID = "flag-sub-types"
				' .Action = "admin"				
				' .Title = "Flag Sub Types"
				' .Icon = "flag-outline"
				' .URL = "app/flag-sub-types"
			' End with
			
			Main = MenuItems.AddMain("codes-notes", "Codes & Notes")
			
			With Main.SubItems.Add
				.ID = "service-status-codes"
				.Action = "admin"				
				.Title = "Service Status Codes"
				.Icon = "checkbox-multiple-marked-some"
				.URL = "app/service-status-codes"
			End with
			
			With Main.SubItems.Add
				.ID = "claim-notes-types"
				.Action = "admin"				
				.Title = "Claim Notes"
				.Icon = "pencil-box-outline"
				.URL = "app/claim-notes-types"
			End with
			 
			With Main.SubItems.Add
				.ID = "action-types"
				.Action = "admin"				
				.Title = "Actions"
				.Icon = "thumb-up-outline"
				.URL = "app/action-types"
			End with
			
			Main = MenuItems.AddMain("log", "Log")
			
			With Main.SubItems.Add
				.ID = "audit-log"
				.Action = "admin"				
				.Title = "Audit Log"
				.Icon = "table-edit"
				.URL = "app/auditlog-types"
			End with
	End Sub
End Class
