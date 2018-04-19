REM ***************************************************************************************************
REM Last modified on
REM 28-FEB-2015
REM ***************************************************************************************************
Imports System.IO

Partial Class Loader
	Inherits System.Web.UI.Page

	Public Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
		Response.Clear()
		If Request.Headers("Accept-Encoding").Contains("gzip")
			Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			Response.Headers.Remove("Content-Encoding")
			Response.AppendHeader("Content-Encoding", "gzip")
		End if

		Dim Css = New Saas.Controls.Css.CssBuilder
		 
		Dim Params As String = Request.Params("css")
		If Params.IndexOf("=") = -1
			Params += "="
		End if
		
		Css.Include(Params)
		
		REM Css.Include(Request.Params("css").Replace(".csst", ""))
		REM Dim Parts As String() = Request.Params("css").Split(".") 'Just in case the format is "engine.toolbar-dbm"
		REM Css.IncludeTemplate(Parts(1), "", Parts(0))
		
		Dim Modified As Integer = 1
		Dim ModifiedSince As DateTime
		REM If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
		If AppUtils.Settings.AsInteger("CacheCssJS") = 1
			If Request.Headers("If-Modified-Since") IsNot Nothing
				If DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
					Modified = DateTime.Compare(Css.ModifiedDate, ModifiedSince)
				End if
			End if
		End if
		
		REM Dim Output As New EasyStringDictionary("")

		REM ProcessOutput(Request.Params("cmd").ToLower, Output)

		REM Response.Write(Output.JsonString(True))

		REM SimpleLoad(Request.Params("css"))

		Response.Clear
		Response.ContentType = "text/css"
		REM Response.Write(Request.Params("css"))
		
		If Modified > 0
			REM If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
			If AppUtils.Settings.AsInteger("CacheCssJS") = 1
				Response.Cache.SetLastModified(Css.ModifiedDate)
			End if
			Response.Write(Css.GetCss(False))
		Else
			Response.StatusCode = 304
			Response.SuppressContent = True
		End if
		
		Response.End()
	End Sub

	REM Private Sub SimpleLoad(ByVal FileName As String)
	REM End Sub
	
	REM Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)

		REM If Cmd = "info"
			REM Output.DataType("Status", "NUMERIC")
			REM Output.DataType("UserNo", "NUMERIC")
			REM Output.DataType("UserType", "NUMERIC")
			REM Output.DataType("OrganisationID", "NUMERIC")
			REM Output.DataType("ApplicationID", "NUMERIC")
			REM Output.DataType("VisitorID", "NUMERIC")
			REM Output.DataType("Locked", "NUMERIC")
			REM Output.DataType("Roles", "JSON")

			REM Output.AsString("Status") = 0

			REM If Session("ConnectionID") IsNot Nothing
				REM Output.AsString("SessionID") = Session.SessionID.ToUpper
				REM Output.AsString("VisitorID") = Session("VisitorID")
				REM Output.AsString("ApplicationID") = Session("ApplicationID")
				REM Output.AsString("UserNo") = Session("UserNo").ToString
				REM Output.AsString("UserID") = Session("UserID").ToString
				REM Output.AsString("UserName") = Session("UserName").ToString
				REM Output.AsString("UserType") = Session("UserType").ToString
				REM Output.AsString("OrganisationID") = Session("OrganisationID").ToString
				REM Output.AsString("Roles") = Session("Roles").ToString
				REM Output.AsString("Role") = Session("Role").ToString
				REM Output.AsString("Locked") = Session("Locked")				
			REM Else
				REM Output.AsString("Status") = -1
				REM Output.AsString("Message") = "NOT LOGGED IN"
				REM Output.AsString("VisitorID") = Session("VisitorID")
				REM Output.AsString("ApplicationID") = Session("ApplicationID")
				REM If Session("Logout") IsNot Nothing 
					REM If Session("Logout") = 1
						REM Output.AsString("Message") = "LOGGED OUT NORMALY"
					REM Else
						REM Output.AsString("Message") = "SESSION TERMINATED"
					REM End if
				REM End if
			REM End if
		REM End if
	REM End Sub
		
End Class

