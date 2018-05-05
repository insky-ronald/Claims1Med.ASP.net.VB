<%@ WebHandler Language="VB" Class="DataProvider" %>

' Public Class DataProvider
	' Inherits DataHandler.DataProvider
	
	' Protected Overrides Function ListDataSource As String
		' Return "DBMedics.GetMembersEnquiry"
	' End Function
	
	' Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		' MyBase.ProcessOutput(Cmd, Output)
		' If Cmd = "list"
			' Crud.AsBoolean("add") = True
			' Crud.AsBoolean("edit") = True
			' Crud.AsBoolean("delete") = False
		' End if
	' End Sub
' End Class

Public Class DataProvider
	Inherits DataHandler.SavedQueryProvider

	Protected Overrides Function ReportTypeID As Integer
		Return 1001
	End Function
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetMembersEnquiry"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "list"
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End If
	End Sub
End Class