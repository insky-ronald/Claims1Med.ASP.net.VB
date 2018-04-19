<%@ Page Title="" Language="VB" EnableSessionState="readonly" AutoEventWireup="false" Inherits="Api.BaseDataApi" %>
<%@ Import Namespace="System.Data" %>
<script runat=server>
	REM this is called from api_getdata.aspx
	REM find Api.BaseDataApi in Api.vb
	
	Protected Overrides Function ListDataSource As String
		REM Return "DBClaims.GetClients"
		Return "DBClaims.GetBrokers"
	End Function
	
	Protected Overrides Function ReadDataSource As String
		Return "DBClaims.GetClient"
	End Function

	Protected Overrides Function UpdateDataSource As String
		Return "DBClaims.AddClient"
	End Function
		
	Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		MyBase.InitParams(Cmd, DataParams, DataValues)
		If Cmd = "list"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "edit"
			DataParams.Add("id")
			DataParams.Add("visit_id")
			DataValues.Add(Request.Params("id"))
			DataValues.Add(Session("VisitorID"))
		Else If Cmd = "new"
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
		End if
	End Sub
		
	Protected Overrides Sub NewRecord(Row As System.Data.DataRow)
		MyBase.NewRecord(Row)
		REM Row.Item("pa_id") = 0
		REM Row.Item("country") = ""
		REM Row.Item("currency") = ""
	End Sub		
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "info"
			Rights.AsBoolean("add") = False
			Rights.AsBoolean("edit") = False
			Rights.AsBoolean("delete") = False
			
			REM Output.AsJson("rights") = Rights.JsonString()
		Else If Cmd = "update"
			REM Output.AsJson("status") = 100
			REM Output.AsString("message") = "Test error"
		Else If Cmd = "delete"
			REM UpdateData = New UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), VisitorID)
			REM Dim UpdateData As New ServerUpdate.UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), Session("VisitorID"))
			REM AddHandler UpdateData.AfterUpdate, AddressOf AfterUpdate
			
			REM UpdateData.Update(Request.Params("data"), Request.Params("mode"), Output)			
		End if
	End Sub
</script>
