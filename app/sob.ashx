<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetScheduleOfBenefits"
	End Function

	REM Protected Overrides Function UpdateDataSource As String
		REM Return "DBClaims.AddMasterPolicy"
	REM End Function
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		REM Row.Item("id") = 1
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