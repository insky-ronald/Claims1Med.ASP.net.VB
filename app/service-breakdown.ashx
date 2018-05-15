' *****************************************************************************************************
' Last modified on
' 12:20 PM Friday, October 6, 2017
' *****************************************************************************************************
<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetServiceItems"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBMedics.GetServiceItem"
	End Function
	
	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddServiceItem"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
		End if
	End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		' DatabaseUtils.GetActionPermission("invoice", Crud)
		Crud.AsBoolean("add") = False
		Crud.AsBoolean("edit") = True
		Crud.AsBoolean("delete") = True
	End Sub
End Class