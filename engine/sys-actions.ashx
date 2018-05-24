<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		Return "DBSecure.GetActions"
	End Function 
	
	Protected Overrides Function ReadDataSource As String
		Return "DBSecure.GetActions"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBSecure.AddAction"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
			DataParams.Add("application_id")
			DataValues.Add(Session("ApplicationID"))
		Else If Cmd = "edit" 'or Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
			DataParams.Add("mode")
			DataValues.Add(10)
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(0)
			DataParams.Add("mode")
			DataValues.Add(10)
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		Row.Item("application_id") = Session("ApplicationID")
		Row.Item("position") = 1
		Row.Item("action_type_id") = 10
		Row.Item("status_code_id") = 10
	End Sub		
	
	REM Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		REM MyBase.ProcessOutput(Cmd, Output)
		REM If Cmd = "edit"
			REM Crud.AsBoolean("add") = True
			REM Crud.AsBoolean("edit") = True
			REM Crud.AsBoolean("delete") = True
		REM Else If Cmd = "list"
			REM If Request.Params("lookup") Is Nothing
				REM Crud.AsBoolean("add") = True
				REM Crud.AsBoolean("edit") = True
				REM Crud.AsBoolean("delete") = True
			REM Else
				REM Crud.AsBoolean("add") = False
				REM Crud.AsBoolean("edit") = False
				REM Crud.AsBoolean("delete") = False
			REM End if
		REM End if
	REM End Sub
End Class