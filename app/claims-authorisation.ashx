<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.SavedQueryProvider

	Protected Overrides Function ReportTypeID As Integer
		Return 1002
	End Function
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetClaimsAuthorisation"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
			Crud.AsBoolean("authorise") = True
			' Crud.AsBoolean("authorise") = False
		End If
	End Sub
End Class
