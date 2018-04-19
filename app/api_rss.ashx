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
		Output.AsInteger("status") = 0
		REM Dim Connection As String = Cmd
		REM Dim Datasource As String = Request.Params("src").ToString
		REM Dim Params As New List(Of String)
		REM Dim Values As New List(Of Object)
			
		REM For Each S In Request.QueryString
			REM Params.Add(S)
			REM Values.Add(Request.Params(S))
		REM Next

		REM Dim Data As System.Data.DataTable = Nothing
		
		REM Try
			REM If Not Session("ConnectionID") is Nothing
				REM Data = DatabaseUtils.DBConnections(Connection).OpenData(Datasource, Params.ToArray, Values.ToArray, "")
			REM Else
				REM Output.AsString("Error") = "A valid session was not found."
			REM End if
		REM Catch Err As Exception
			REM Output.AsString("Error") = Datasource 'Err.Message
		REM End Try

		REM If Not Data is Nothing
			REM Output.AsJson("data") = DataTableToJson(Data)
		REM End if                                                                        
		
	End Sub
	
End Class
