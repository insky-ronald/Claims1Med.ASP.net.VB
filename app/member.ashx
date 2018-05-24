<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	' Protected Overrides Function ReadDataSource As String
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetMember"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddMember"
	End Function

	Protected Overrides Function UpdateResultFields As String
		Return "id"
	End Function	
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			' DataParams.Add("visit_id")
			DataValues.Add(Request.Params("id"))
			' DataValues.Add(Session("VisitorID"))
		' Else If Cmd = "new"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	' Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		' MyBase.NewRecord(Row)
		' REM Row.Item("id") = 1
	' End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		DatabaseUtils.GetActionPermission("member", Crud)
	End Sub
End Class