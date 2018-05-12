<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetLimits"
	End Function

	REM Protected Overrides Function UpdateDataSource As String
		REM Return "DBClaims.AddMasterPolicy"
	REM End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("schedule_id") = Request.Params("schedule_id")
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		' DatabaseUtils.GetActionPermission("sob", Crud)
		If Cmd = "list"
			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
		End if
	End Sub
End Class