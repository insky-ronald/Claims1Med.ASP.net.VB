<%@ WebHandler Language="VB" Class="DataProvider" %>
	
Public Class DataProvider
	Inherits DataHandler.BaseReport
	' Inherits BaseReport

	Protected Overrides Function ReportTypeID As Integer
		Return 1503
	End Function
	
	Protected Overrides Function ListDataSource As String
		Return "DBReporting.RunReport"
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
