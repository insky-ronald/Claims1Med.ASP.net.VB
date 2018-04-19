<%@ Page Title="" Language="VB" EnableSessionState="readonly" AutoEventWireup="false" Inherits="Api.BaseApi" %>
<script runat=server>
	REM Friend Styles As New EasyStringDictionary("")
	REM Friend Scripter As New PaxScript.Net.PaxScripter
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "info"
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
				Output.AsString("SessionID") = Session.SessionID.ToUpper
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				Output.AsString("UserNo") = Session("UserNo").ToString
				Output.AsString("UserID") = Session("UserID").ToString
				Output.AsString("UserName") = Session("UserName").ToString
				Output.AsString("UserType") = Session("UserType").ToString
				Output.AsString("OrganisationID") = Session("OrganisationID").ToString
				Output.AsString("Roles") = Session("Roles").ToString
				REM Output.AsString("Role") = Session("Role").ToString
				Output.AsString("Locked") = Session("Locked")				
				Output.AsString("Home") = Session("Home")				
			Else
				Output.AsString("Status") = -1
				Output.AsString("Message") = "NOT LOGGED IN"
				Output.AsString("VisitorID") = Session("VisitorID")
				Output.AsString("ApplicationID") = Session("ApplicationID")
				If Session("Logout") IsNot Nothing
					Output.AsString("Message") = "LOGGED OUT NORMALY"
				End if
			End if
		Else If Cmd = "dbinit"
			Output.Clear
			If Request.Params("name") Is Nothing
				Output.Append(DatabaseUtils.InitializeConnection(Me))
			Else
				Output.Append(DatabaseUtils.InitializeConnection(Request.Params("name").ToString, Me))
			End if
		Else If Cmd = "appinit"
			Output.Clear
			AppUtils.InitializeAppUtils(Me)
			REM Response.Write(AppUtils.Styles.JsonString(True)) 
			Response.End
			Return
			
			Dim Styles As New EasyStringDictionary("")
			
			Dim CodeFile As String = ConfigurationSettings.AppSettings("ApplicationUtils")
			REM Output.Append(CodeFile)
			If System.IO.File.Exists(CodeFile)
				Dim Scripter As New PaxScript.Net.PaxScripter
				
				Scripter.Reset()
				Scripter.RegisterType(GetType(EasyStringDictionary))
				Scripter.RegisterInstance("Styles", AppUtils.Styles)
				
				Scripter.AddModule(0, "VB")
				Scripter.AddCodeFromFile(0, CodeFile)
				REM Scripter.AddCode(0, "Module mainModule")
				REM Scripter.AddCode(0, "Sub Main()")
				REM Scripter.AddCode(0, "End Sub")
				REM Scripter.AddCode(0, "End Module")
				REM Scripter.AddCode(0, "")
				REM Scripter.AddCode(0, ("Styles.AsString('home') = ''").Replace("'", """"))
				
				Scripter.Run(PaxScript.Net.RunMode.Run)
				If Scripter.HasErrors Then
					For e As Integer = 0 To Scripter.Error_List.Count - 1
						Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
						Output.AsString("filename") = CodeFile
						Output.AsString("error") = s
						REM If Page IsNot Nothing
							REM Page.Response.Write(s + Environment.NewLine)
						REM End if
					Next
				End If

				Scripter.Dispose
			Else If Page IsNot Nothing
				Page.Response.Write("Not found: " & CodeFile)
			End if
			
			Output.Append(AppUtils.Styles.Delimeted(";"))
		Else If Cmd = "login"
			If Session("Attempt") Is Nothing
				Session("Attempt") = 1
			Else
				Session("Attempt") = Session("Attempt") + 1
			End if

			Dim UserID As Integer = DatabaseUtils.Login(Request.Params("username"), Request.Params("password"))
			Session("UserID") = Request.Params("username")
					
			If UserID > 0
				REM Using UserDetails = DatabaseUtils.DefaultConnection().OpenData("user_details_by_id", {"id"}, {UserID})
				Using UserDetails = DatabaseUtils.DefaultConnection().OpenData("GetUserDetails", {"id"}, {UserID})
					Session("ApplicationID") = CType(ConfigurationSettings.AppSettings("ApplicationID"), Integer)
					Session("ConnectionID") = UserID
					Session("UserNo") = UserID
					Session("UserID") = Request.Params("username")
					Session("UserName") = UserDetails.Rows(0).Item("full_name")
					Session("UserType") = UserDetails.Rows(0).Item("user_type_id")
					Session("OrganisationID") = UserDetails.Rows(0).Item("organisation_id")
					REM Session("Role") = Request.Params("ac")
					REM Session("Role") = ""
					Session("Roles") = DatabaseUtils.GetUserRoles()
					Session("Locked") = 0
					REM Session("Domain") = Request.ServerVariables("HTTP_HOST").ToLower
					Session("Home") = "/"

					Session.Remove("Attempt")
					Session.Remove("LoginError")
					
				End using
			Else
				Session("LoginError") = "Invalid username and password"
			End if
			
			If Session("LoginError") IsNot Nothing
				Response.Redirect("/login?error=" & Session("Attempt"))
			Else If Request.Params("redirect") IsNot Nothing
				Response.Redirect(Request.Params("redirect"))
			Else
				Response.Redirect(Session("Home"))
			End if
			
		Else If Cmd = "logout"
			Output.DataType("Status", "NUMERIC")
			Output.DataType("VisitorID", "NUMERIC")

			If Session("ConnectionID") IsNot Nothing
				Output.AsString("Status") = 0
				Output.AsString("Message") = "OK"
				Output.AsInteger("VisitorID") = Session("VisitorID")
				Using Logout = DatabaseUtils.DefaultConnection.PrepareCommand("LogoutEx")
					Logout.SetParameter("visit_id", Session("VisitorID"))
					Logout.Execute
				End Using
				
				Session.Clear
				Session.Abandon
				Session("VisitorID") = DatabaseUtils.NewVisitor()
				Session("ApplicationID") = CType(ConfigurationSettings.AppSettings("ApplicationID"), Integer)
				REM Dim ApplicationID As Integer = CType(Session("ApplicationID"), Integer)
				REM Session("ApplicationID") = ApplicationID
				Session("Logout") = 1
			Else
				Output.AsString("Status") = -1
				Output.AsString("Message") = "NOT LOGGED IN"
				Output.AsString("VisitorID") = Session("VisitorID")
			End if
		End if
	End Sub
</script>
