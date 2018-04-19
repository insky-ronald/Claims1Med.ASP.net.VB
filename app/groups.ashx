<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetGroups"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMedics.GetGroup"
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
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		REM Row.Item("user_name") = ""
		Row.Item("id") = ""
		REM Row.Item("designation") = ""
		REM Row.Item("phone_no") = ""
		REM Row.Item("is_active") = 0
		REM Row.Item("is_supervisor") = 0
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		End if
	End Sub
	
End Class
