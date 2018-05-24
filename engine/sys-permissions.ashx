<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SubDataHandler
	
	Protected Overrides Function ListDataSource As String
		If Request.Params("lookup") IsNot Nothing
			Return "DBSecure.GetActionRights"
		Else
			Return "DBSecure.GetManagePermissions"
		End if
	End Function 
	
	Protected Overrides Function ReadDataSource As String
		Return "DBSecure.GetPermissions"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBSecure.AddPermission"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
			If Request.Params("lookup") IsNot Nothing
				DataParams.Add("action_id")
				DataValues.Add(Request.Params("action_id"))
			Else
				' DataParams.Add("role_id")
				' DataValues.Add(Request.Params("role_id"))
			End if
		' Else If Cmd = "edit"
			' DataParams.Add("role_id")
			' DataValues.Add(Request.Params("role_id"))
			' DataParams.Add("action_id")
			' DataValues.Add(Request.Params("action_id"))
			' DataParams.Add("visit_id")
			' DataValues.Add(Session("VisitorID"))
		End if
	End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		Else If Cmd = "update-permissions"
			DatabaseUtils.UpdateMultiRecords("DBSecure.AddPermission", "", "", Request.Params("updateData"), "edit", Session("VisitorID"), Output)
		End if
	End Sub
End Class