<%@ WebHandler Language="VB" Class="DataProvider" %>

REM Last modified on
REM 07-MAR-2017
Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBSecure.GetRights"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBSecure.GetRights"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBSecure.AddRights"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
			DataParams.Add("application_id")
			DataValues.Add(Session("ApplicationID"))
			
			If Request.Params("lookup") IsNot Nothing
				DataParams.Add("mode")
				DataValues.Add(50)
			End if
		Else If Cmd = "edit" or Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
			DataParams.Add("mode")
			DataValues.Add(10)
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("application_id") = Session("ApplicationID")
		Row.Item("status_code_id") = 10
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list" and Request.Params("lookup") IsNot Nothing
			Crud.AsBoolean("vide") = True
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End if
	End Sub
End Class