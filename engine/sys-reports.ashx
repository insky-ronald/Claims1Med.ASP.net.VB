<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBReporting.GetReportTypes"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBReporting.AddReportType"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("status_code_id") = 10
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		DatabaseUtils.GetActionPermission("report", Crud)
	End Sub
End Class