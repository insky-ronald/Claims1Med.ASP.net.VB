<%@ Application Language="VB" %>

<script runat="server">
Sub Session_Start(ByVal sender As Object, ByVal e As EventArgs)
	If AppUtils.Styles Is Nothing
		AppUtils.InitializeAppUtils()
	End if

	If DatabaseUtils.DBConnections Is Nothing
		DatabaseUtils.InitializeConnection()
	End if

	If Session("VisitorID") Is Nothing
		Session("VisitorID") = DatabaseUtils.NewVisitor()
		Session("ApplicationID") = CType(ConfigurationSettings.AppSettings("ApplicationID"), Integer)
	End if
End Sub

Sub Session_End(ByVal sender As Object, ByVal e As EventArgs)
	Application.Lock()
	Using Logout = DatabaseUtils.DefaultConnection.PrepareCommand("LogoutEx")
		Logout.SetParameter("visit_id", Session("VisitorID"))
		Logout.Execute

		Session("Logout") = -1
	End Using
	Application.UnLock()
End Sub

</script>
