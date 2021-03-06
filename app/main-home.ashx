﻿<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private DBData As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		
		DBData = DBConnections("DBMedics").OpenData("GetCustomerServiceData", {"visit_id"}, {Session("VisitorID")}, "")
		
		If Action = "navigator"
			Output.AsString("page_title") = "Claims1Med"
			Output.AsString("window_title") = "Claims1Med"
			
			CustomData.AsJson("data") = DBData.AsJson()
		Else If Action = "refresh"
			 Output.AsJson("data") = DBData.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBData.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		' Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Claims Processing")
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("main", "Main")
		
			' With Main.SubItems.Add
				' .ID = "dashboard"
				' .Action = "admin"				
				' .Title = "Dashboard"
				' .Icon = "home"
				' .URL = "app/dashboard"
			' End with

			' With Main.SubItems.Add
				' .ID = "calls"
				' .Action = "admin"				
				' .Title = "Call Log"
				' .Icon = "phone"
				' .Icon = "timetable"
				' .URL = "app/task-manager"
			' End with

			With Main.SubItems.Add
				.ID = "claims-processing"
				.Action = "member"
				.Title = "Claims Processing"
				.Description = "Members Search"
				.Icon = "users"
				.URL = "app/claims-entry"
			End with

			' With Main.SubItems.Add
				' .ID = "claims"
				' .Action = "admin"				
				' .Title = "Claims"
				' .Icon = "timetable"
				' .URL = "app/task-manager"
			' End with

			' With Main.SubItems.Add
				' .ID = "customer-service"
				' .Action = "admin"				
				' .Title = "Customer Service"
				' .Icon = "user"
				' .URL = "app/customer-service"
			' End with
			
			With Main.SubItems.Add
				.ID = "payment-processing"
				.Action = "payment"				
				.Title = "Payment Processing"
				.Icon = "table"
				.URL = "app/payment-processing"
				REM .Css = "claims-processing"
				REM .Params.AsString("module") = .ID
			End with

			With Main.SubItems.Add
				.ID = "task-manager"
				.Action = "task"				
				.Title = "Task Manager"
				.Icon = "timetable"
				.URL = "app/task-manager"
			End with
		
			' With Main.SubItems.Add
				' .ID = "enquiries"
				' .Action = "admin"	
				' .Title = "Enquiries"
				' .Icon = "search"
				' .URL = "engine/under-construction"
				' .Params.AsString("module") = .ID
			' End with
		
			With Main.SubItems.Add
				.ID = "reports"
				.Action = "report"				
				.Title = "Reports"
				.Icon = "table"
				.URL = "engine/sys-reports"
				' .Params.AsString("module") = .ID
			End with

		' Main = MenuItems.AddMain("claims", "Claims Processing")
		
			' With Main.SubItems.Add
				' .ID = "claims"
				' .Action = "admin"				
				' .Title = "Claims Processing"
				' .Icon = "table"
				' .URL = "app/claims-processing"
			' End with
		
		' Main = MenuItems.AddMain("clients", "Clients")

		Main = MenuItems.AddMain("system", "System")
			
			With Main.SubItems.Add
				.ID = "clients"
				.Action = "client"				
				.Title = "Clients"
				.Icon = "users"
				.URL = "app/clients"
			End with

			With Main.SubItems.Add
				.ID = "medical"
				.Action = "provider"				
				.Title = "Medical Providers"
				.Icon = "hospital"
				.URL = "app/medical-providers"
			End with

			' With Main.SubItems.Add
				' .ID = "travel"
				' .Action = "admin"				
				' .Title = "Travel"
				' .Icon = "airplane"
				' .URL = "app/travel-providers"
			' End with

			' With Main.SubItems.Add
				' .ID = "policies"
				' .Action = "admin"				
				' .Title = "Policies"
				' .Icon = "table"
			' End with
		
		If DatabaseUtils.AllowAction("security")
			Main = MenuItems.AddMain("security", "Security")
		
			With Main.SubItems.Add
				.ID = "users"
				.Action = "sys-users"				
				.Title = "Users"
				.Icon = "user"
				.URL = "engine/sys-users"
			End with
			
			With Main.SubItems.Add
				.ID = "roles"
				.Action = "sys-roles"				
				.Title = "Roles"
				.Icon = "users"
				.URL = "engine/sys-roles"
			End with
			
			With Main.SubItems.Add
				.ID = "actions"
				.Action = "sys-actions"				
				.Title = "Actions"
				.Icon = "star"
				.URL = "engine/sys-actions"
				.Params.AsInteger("app_only") = 1
			End with
			
			With Main.SubItems.Add
				.ID = "rights"
				.Action = "sys-rights"				
				.Title = "Rights"
				.Icon = "settings"
				.URL = "engine/sys-rights"
				.Params.AsInteger("app_only") = 1
			End with
			
			' With Main.SubItems.Add
				' .ID = "permissions"
				' .Action = "sys-permissions"
				' .Title = "Set Permissions"
				' .Icon = "security"
				' .URL = "engine/sys-roles"
			' End with
		End if
			
	End Sub
End Class
