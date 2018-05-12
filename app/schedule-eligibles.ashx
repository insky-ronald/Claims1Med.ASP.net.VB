<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetScheduleEligibles"
	End Function

	REM Protected Overrides Function UpdateDataSource As String
		REM Return "DBClaims.AddMasterPolicy"
	REM End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		' DatabaseUtils.GetActionPermission("sob", Crud)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End if
	End Sub
End Class