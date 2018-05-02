<%@ WebHandler Language="VB" Class="Api" %>

Imports System.IO
' http://dev3.claim1med.com/app/api/command/test

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
		
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)

		If Cmd = "authorise-invoice"
			Using Command = DBConnections("DBMedics").PrepareCommand("AuthorizeInvoice")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("authorise", Request.Params("authorise"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if

		If Cmd = "authorise-batch-invoice"
			Using Command = DBConnections("DBMedics").PrepareCommand("AuthorizeBatchInvoice")
				Command.SetParameter("id", Request.Params("id"))
				Command.SetParameter("authorise", Request.Params("authorise"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if

		If Cmd = "set-default-address"
			Using Command = DBConnections("DBMedics").PrepareCommand("SetDefaultAddress")
				Command.SetParameter("name_id", Request.Params("name_id"))
				Command.SetParameter("address_id", Request.Params("address_id"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if

		If Cmd = "set-default-contact"
			Using Command = DBConnections("DBMedics").PrepareCommand("SetDefaultContact")
				Command.SetParameter("name_id", Request.Params("name_id"))
				Command.SetParameter("contact_id", Request.Params("contact_id"))
				Command.SetParameter("visit_id", VisitorID)
				Command.Execute
				
				Output.AsJson("status") = Command.GetParameter("action_status_id").Value
				Output.AsString("message") = Command.GetParameter("action_msg").Value
			End Using
		End if
		
		' Response.Clear()
		' Response.ContentType = "application/x-javascript"
		
		' Try
			' Response.Write(Environment.Version.ToString())
			' Dim Bundler = New ScriptBundle("~/app/scripts")
			' Bundler.Include("~/app/scripts/__init.js")
			
			' Dim Collection As BundleCollection  = New BundleCollection()
			' Collection.Add(Bundler)
			
			' Dim Resolver As BundleResolver = New BundleResolver(Collection)
			
			' Dim Files = Bundler.GenerateBundleResponse(Response)
			' Response.Write(Resolver.GetBundleContents("~/app/scripts").ToString)
			' Response.Write(Bundler.ToString)
			' Response.Write(Bundler.Builder.BuildBundleContent())
		' Catch Err As Exception
			' Response.Write(Err.Message)
		' End Try
		
		' Dim Name As String = "Datejs-master/build/date.js"
		' Response.Write(HttpContext.Current.Server.MapPath("~/scripts/" & Name))
		' Response.End
	End Sub
	
End Class
