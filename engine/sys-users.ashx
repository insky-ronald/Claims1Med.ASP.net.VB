<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	' Inherits DataHandler.SubDataHandler
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBSecure.GetUsers"
	End Function
	
	' Protected Overrides Function ReadDataSource As String
		' Return "DBSecure.GetUsers"
	' End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBSecure.AddUser"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit" or Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
			DataParams.Add("mode")
			DataValues.Add(10)
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		REM Row.Item("owner_id") = Request.Params("owner_id")
		REM If Request.Params("year") Is Nothing
			REM Row.Item("year") = 2017
		REM Else
			REM Row.Item("year") = Request.Params("year")
		REM End
	End Sub		
	
	' Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		' MyBase.ProcessOutput(Cmd, Output)
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
	' End Sub
End Class