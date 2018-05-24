<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetClaimNotes"
	End Function
	
	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddClaimNote"
	End Function
	
	Protected Overrides Function UpdateResultFields As String
		Return "id"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Request.Params("action") Is Nothing
			DatabaseUtils.GetActionPermission("claim-note", Crud)
		Else
			DatabaseUtils.GetActionPermission(Request.Params("action"), Crud)
		End if
	End Sub
End Class