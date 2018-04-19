Imports System.IO
Imports System.Data

Namespace DataHandler
	Public Class BaseHandler : Implements IHttpHandler, IReadOnlySessionState		
		Protected Request As System.Web.HttpRequest
		Protected Response As System.Web.HttpResponse
		Protected Session As  System.Web.SessionState.HttpSessionState
		Protected VisitorID As Integer
		
		Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
			Get
				REM Return True
				Return False
			End Get
		End Property

		Public Sub ProcessRequest(ByVal Context As HttpContext) Implements IHttpHandler.ProcessRequest
			Request = Context.Request
			Response = Context.Response
			Session = Context.Session
			VisitorID = Context.Session("VisitorID")
			Connected = Context.Session("ConnectionID") IsNot Nothing
			
			InitHandler(Context)
			UnloadHandler(Context)
		End Sub

		Protected Overridable Sub InitHandler(ByVal Context As HttpContext)		
			Dim Allow As Boolean = True
			Dim Message As String = ""
			Dim RedirectUrl As String = ""

			If Request.Headers("X-Authorization") IsNot Nothing
				Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
				Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
				Dim Token = Encryption.Decrypt(Request.Headers("X-Authorization").ToString, passPhrase, saltValue)
				If Session("ConnectionID") Is Nothing
					Message = ("{'Status':-101, 'Message':'Invalid request'}").Replace("'", """")
					Allow = False
				Else If Token <> Session("VisitorID").ToString
					If Request.Headers("X-Requested-With") IsNot Nothing and Request.Headers("X-Requested-With") = "XMLHttpRequest" 'if AJAX call
						If Session("Logout") Is Nothing
							Message = ("{'Status':-101, 'Message':'Invalid request'}").Replace("'", """")
						Else
							Message = ("{'Status':-102, 'Message':'Invalid request'}").Replace("'", """")
						End if
					Else
						RedirectUrl = "/noaccess"
					End if
					
					Allow = False
				End if
			Else
				RedirectUrl = "/noaccess"
				Allow = False
			End if
			
			If Not Allow
				Response.Clear
				If RedirectUrl = String.Empty
					Response.ContentType = "application/json; charset=utf-8"
					Response.Write(Message)
				Else
					Response.Redirect(RedirectUrl)
				End if
				
				Response.End
			End if  
		End Sub

		Protected Overridable Sub UnloadHandler(ByVal Context As HttpContext)
		End Sub
	End Class
	
	Public Class BaseNavigator
		Inherits DataHandler.BaseHandler
		REM Inherits System.Web.UI.Page
		
		Protected MenuItems As Navigator.MenuItems
		
		Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
			MyBase.InitHandler(Context)
			Response.Clear
			Response.ContentType = "application/json; charset=utf-8"
			
			Dim Output As New EasyStringDictionary("")
			Output.AsJson("status") = 0
			Output.AsString("message") = ""
			
			REM MenuItems = New Navigator.MenuItems(VisitorID)
			MenuItems = New Navigator.MenuItems(0)
			InitMenuItems(MenuItems)

			InitCallback(Request.Params("action").ToLower, Output)
			
			Output.AsJson("menu_items") = MenuItems.Json()
			
			Response.Write(Output.JsonString(False))
			Response.End()
		End Sub
		
		Protected Overridable Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		End Sub
		
		Protected Overridable Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
			Output.AsString("pid") = Request.Params("pid")
		End Sub
		
	End Class
End Namespace
