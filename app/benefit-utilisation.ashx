<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.MemberBenefitUtilisation"
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		Crud.AsBoolean("add") = False
		Crud.AsBoolean("edit") = False
		Crud.AsBoolean("delete") = False
	End Sub
End Class