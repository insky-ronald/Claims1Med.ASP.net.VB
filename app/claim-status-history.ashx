<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetClaimStatusHistory"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddClaimStatusHistory"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		DatabaseUtils.GetActionPermission("claim-status", Crud)
	End Sub
End Class
