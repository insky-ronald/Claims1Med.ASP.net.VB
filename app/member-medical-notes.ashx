<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetMemberMedicalNotes"
	End Function
	
	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddMemberMedicalNotes"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			DataParams.Add("claim_id")
			DataValues.Add(Request.Params("member_id"))
			DataValues.Add(Request.Params("claim_id"))
		End if
	End Sub
End Class