<%@ WebHandler Language="VB" Class="Api" %>

REM usage:
REM http://applications-dev.insky-inc.com/api/data/MyMoney?conn=DBMoney&year=2016

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
		
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		Dim Connection As String = Cmd
		Dim Datasource As String = Request.Params("src").ToString
		Dim Params As New List(Of String)
		Dim Values As New List(Of Object)
			
		For Each S In Request.QueryString
			Params.Add(S)
			Values.Add(Request.Params(S))
		Next

		Dim Data As System.Data.DataTable = Nothing
		
		Try
			If Not Session("ConnectionID") is Nothing
				Data = DatabaseUtils.DBConnections(Connection).OpenData(Datasource, Params.ToArray, Values.ToArray, "")
			Else
				Output.AsString("Error") = "A valid session was not found."
			End if
		Catch Err As Exception
			Output.AsString("Error") = Datasource 'Err.Message
		End Try

		If Not Data is Nothing
			Output.AsJson("data") = DataTableToJson(Data)
		End if                                                                        
		
	End Sub
	
End Class
