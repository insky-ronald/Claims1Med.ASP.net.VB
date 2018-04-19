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
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		' DatabaseUtils.GetActionPermission("invoice", Crud)
		Crud.AsBoolean("add") = False
		Crud.AsBoolean("edit") = True
		Crud.AsBoolean("delete") = True
	End Sub
End Class