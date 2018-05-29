<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		Return "DBMedics.GetServiceActions"
	End Function
	
	Protected Overrides Function UpdateDataSource As String
		Return "DBMedics.AddServiceAction"
	End Function
	
	Protected Overrides Function UpdateResultFields As String
		Return "id"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "edit" 'or Cmd = "new"
			DataParams.Add("id")
			DataValues.Add(Request.Params("id"))
		End if
	End Sub
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
	End Sub
End Class