<%@ WebHandler Language="VB" Class="Api" %>

Public Class Api
	Inherits DataHandler.BaseApi
		
	Protected Overrides Function CheckAuthorization As Boolean
		Return False
	End Function
	
	Protected Overrides Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ReturnOutput(Cmd, Output)
		
		If Cmd = "alive"
			
			Response.Clear
			Response.End
			
		Else If Cmd = "info"
			Output.DataType("Status", "NUMERIC")
			Output.DataType("UserNo", "NUMERIC")
			Output.DataType("UserType", "NUMERIC")
			Output.DataType("OrganisationID", "NUMERIC")
			Output.DataType("ApplicationID", "NUMERIC")
			Output.DataType("VisitorID", "NUMERIC")
			Output.DataType("Locked", "NUMERIC")
			Output.DataType("Roles", "JSON")

			Output.AsString("Status") = 0

			If Session("ConnectionID") IsNot Nothing
				REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
				REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
				Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
				Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
				
				Output.AsString("SessionID") = Session.SessionID.ToUpper
				REM Output.AsString("SessionKey") = Encryption.Encrypt(Session("VisitorID").ToString, passPhrase, saltValue)
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				Output.AsString("UserNo") = Session("UserNo").ToString
				Output.AsString("UserID") = Session("UserID").ToString
				Output.AsString("UserName") = Session("UserName").ToString
				REM Output.AsString("UserType") = Session("UserType").ToString
				Output.AsString("OrganisationID") = Session("OrganisationID").ToString
				REM Output.AsString("Roles") = Session("Roles").ToString
				REM Output.AsString("Locked") = Session("Locked")				
				REM Output.AsString("Home") = Session("Home")				
			Else
				Output.AsString("Status") = -1
				Output.AsString("Message") = "NOT LOGGED IN"
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				If Session("Logout") IsNot Nothing
					Output.AsString("Message") = "LOGGED OUT NORMALY"
				End if
			End if
			
		Else If Cmd = "login"
			REM http://thailand.insky-inc.com/api/session/login?username=super&password=pass1234
			
			If Session("Attempt") Is Nothing
				Session("Attempt") = 1
			Else
				Session("Attempt") = Session("Attempt") + 1
			End if

			Dim UserID As Integer = DatabaseUtils.Login(Request.Params("username"), Request.Params("password"))
			Session("UserID") = Request.Params("username")
					
			If UserID > 0
				Using UserDetails = DatabaseUtils.DefaultConnection().OpenData("GetUserDetails", {"id"}, {UserID})
					Session("ConnectionID") = UserID
					REM Session("ApplicationID") = CType(ConfigurationSettings.AppSettings("ApplicationID"), Integer)
					Session("ApplicationID") = AppUtils.Settings.AsInteger("ApplicationID")
					Session("UserNo") = UserID
					Session("UserID") = Request.Params("username")
					Session("UserName") = UserDetails.Rows(0).Item("full_name")
					Session("OrganisationID") = UserDetails.Rows(0).Item("organisation_id")
					REM If UserDetails.Rows(0).Item("app_user") = 1
						REM Session("AppUser") = 1
					REM End if
					REM Session("Roles") = DatabaseUtils.GetUserRoles()
					Session("Locked") = 0
					Session("Home") = "/"
					
					REM Session("UserType") = UserDetails.Rows(0).Item("user_type_id")
					REM Session("Role") = Request.Params("ac")
					REM Session("Role") = ""
					REM Session("Domain") = Request.ServerVariables("HTTP_HOST").ToLower

					Session.Remove("Attempt")
					Session.Remove("LoginError")
					
					Dim ConnectionNames = AppUtils.Databases.AsString("DatabaseConnections").Split(",")
					For Each ConnectionName In ConnectionNames
						If ConnectionName <> AppUtils.Databases.AsString("DefaultConnection")
							Try
								Using Login2 = DBConnections(ConnectionName).PrepareCommand("System_ManageSession")
									Login2.SetParameter("id", Session("VisitorID"))
									Login2.SetParameter("session_id", Session.SessionID.ToUpper)
									Login2.SetParameter("user_id", UserID)
									Login2.SetParameter("user_name", Request.Params("username"))
									Login2.SetParameter("action", 10)
									Login2.Execute
								End Using
							Catch Err As Exception
								' Do nothing
							End Try
						End if
					Next
					
				End using
			Else
				Session("LoginError") = "Invalid username and password"
			End if
			
			REM Response.Redirect("/")
			If Session("LoginError") IsNot Nothing
				Response.Redirect("/login?error=" & Session("Attempt"))
			Else If Request.Params("redirect") IsNot Nothing
				If Request.Params("redirect") <> String.Empty
					Response.Redirect(Request.Params("redirect"))
				Else
					Response.Redirect(Session("Home"))
				End if
			Else
				Response.Redirect(Session("Home"))
			End if
			
		Else If Cmd = "logoutx"
		
				Output.AsJson("Status") = 0
				Output.AsJson("VisitorID") = Session("VisitorID")
				Output.AsString("Message") = "OK"
				
		Else If Cmd = "logout"
		
			If Session("ConnectionID") IsNot Nothing			
				Output.AsJson("Status") = 0
				Output.AsJson("VisitorID") = Session("VisitorID")
				Output.AsString("Message") = "OK"
				Using Logout = DatabaseUtils.DefaultConnection.PrepareCommand("LogoutEx")
					Logout.SetParameter("visit_id", Session("VisitorID"))
					Logout.Execute
				End Using
				
				Dim ConnectionNames = AppUtils.Databases.AsString("DatabaseConnections").Split(",")
				For Each ConnectionName In ConnectionNames
					If ConnectionName <> AppUtils.Databases.AsString("DefaultConnection")
						Try
							Using Logout2 = DBConnections(ConnectionName).PrepareCommand("System_ManageSession")
								Logout2.SetParameter("id", Session("VisitorID"))
								Logout2.SetParameter("action", 11)
								Logout2.Execute
							End Using
						Catch Err As Exception
							' Do nothing
						End Try
					End if
				Next
				
				Session.Clear
				Session.Abandon
				Session("VisitorID") = DatabaseUtils.NewVisitor()
				Session("ApplicationID") = AppUtils.Settings.AsInteger("ApplicationID")
				Session("Logout") = 1

				Dim Referer As String = "/"
				If Request.UrlReferrer IsNot Nothing
					If Request.UrlReferrer.Segments.Count > 1
						Referer = String.Join("", Request.UrlReferrer.Segments)
						If Request.UrlReferrer.Query.Count > 1
							Referer = String.Concat(Referer, "?", HttpUtility.ParseQueryString(Request.UrlReferrer.Query))
						End if
					End if
				End if
							
				REM Response.Redirect(Referer)
				' Response.Redirect("/")
			Else
				Output.AsString("Status") = -1
				Output.AsString("Message") = "NOT LOGGED IN"
				Output.AsString("VisitorID") = Session("VisitorID")
			End if
			
		Else If Cmd = "test"

				Try
					REM Using Rights = DatabaseUtils.DefaultConnection().OpenData("GetRights", {}, {})
					Using Rights = DatabaseUtils.DefaultConnection().OpenData("GetActions", {}, {})
					REM Using Rights = DatabaseUtils.DefaultConnection().OpenData("GetRoles", {}, {})
						Output.AsJson("data") = DatatableToJson(Rights)
					End using
				Catch Err As Exception
					Output.AsString("RuntimeError") = Err.Message
				End Try
				
			
		Else If Cmd = "test-visit"
			REM Output.AsInteger("VisitorID") = DatabaseUtils.NewVisitor()
			REM Using Command = DefaultConnection().PrepareCommand("AddVisit")
			Using Command = DBConnections("DBSecure").PrepareCommand("AddVisit")
				Dim Referer As String = ""
				
				With HttpContext.Current
					If .Request.UrlReferrer IsNot Nothing
						If .Request.UrlReferrer.Segments.Count > 1
							REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1)
							REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1) & Request.UrlReferrer.Segments(2)
							Referer = String.Join("", .Request.UrlReferrer.Segments)
							If .Request.UrlReferrer.Query.Count > 1
								Referer = String.Concat(Referer, "?", HttpUtility.ParseQueryString(.Request.UrlReferrer.Query))
							End if
						End if
					End if
				End With
				
				With Command
					.SetParameter("application_id", AppUtils.Settings.AsInteger("ApplicationID"))
					.SetParameter("session_id", HttpContext.Current.Session.SessionID.ToUpper)
					.SetParameter("method", HttpContext.Current.Request.ServerVariables("REQUEST_METHOD"))
					.SetParameter("local_ip", HttpContext.Current.Request.ServerVariables("LOCAL_ADDR"))
					.SetParameter("remote_ip", HttpContext.Current.Request.ServerVariables("REMOTE_ADDR"))
					.SetParameter("remote_host", HttpContext.Current.Request.ServerVariables("REMOTE_HOST"))
					.SetParameter("user_agent", HttpContext.Current.Request.ServerVariables("HTTP_USER_AGENT"))
					.SetParameter("request_url", HttpContext.Current.Request.ServerVariables("URL"))
					.SetParameter("referrer_url", Referer)
					REM If HttpContext.Current.Request.ServerVariables("HTTP_REFERER") IsNot Nothing
						REM .SetParameter("referrer_url", "")
					REM Else
						REM .SetParameter("referrer_url", HttpContext.Current.Request.ServerVariables("HTTP_REFERER"))
					REM End if

					.Execute()

					Output.AsString("VisitorID") = HttpContext.Current.Request.ServerVariables("HTTP_REFERER")
					Output.AsString("Referer") = Referer
					Output.AsInteger("VisitorID") = .GetParameter("visit_id").Value
				End with
			End Using
		End if
	End Sub
	
End Class
