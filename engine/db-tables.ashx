﻿<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.Sys_GetTables"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMedics.GetUser"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddUser"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit"
			DataParams.Add("id")
			DataParams.Add("visit_id")
			DataValues.Add(Request.Params("id"))
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "new"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	REM Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		REM MyBase.NewRecord(Row)
		REM Row.Item("user_name") = ""
		REM Row.Item("name") = ""
		REM Row.Item("designation") = ""
		REM Row.Item("phone_no") = ""
		REM Row.Item("is_active") = 0
		REM Row.Item("is_supervisor") = 0
	REM End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "info"
			REM Rights.AsBoolean("add") = False
			REM Rights.AsBoolean("edit") = False
			REM Rights.AsBoolean("delete") = False
			
			REM Output.AsJson("rights") = Rights.JsonString()
		Else If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		Else If Cmd = "update"
			REM Output.AsJson("status") = 100
			REM Output.AsString("message") = "Test error"
		Else If Cmd = "delete"
			REM UpdateData = New UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), VisitorID)
			REM Dim UpdateData As New ServerUpdate.UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), Session("VisitorID"))
			REM AddHandler UpdateData.AfterUpdate, AddressOf AfterUpdate
			
			REM UpdateData.Update(Request.Params("data"), Request.Params("mode"), Output)			
		End if
	End Sub
	
End Class
