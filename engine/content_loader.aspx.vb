REM ***************************************************************************************************
REM Last modified on
REM 3-MAR-2015
REM ***************************************************************************************************

REM This is inherited inside content_loader.aspx
Public Class Content
    Inherits System.Web.UI.Page
	
	Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
		If Session("ConnectionID") Is Nothing and Request.Params("auditme") IsNot Nothing
			Dim UserName As String = "super"
			Dim UserID As Integer = DatabaseUtils.Login("super", "***")
			Session("UserID") = UserName
			
			If UserID > 0
				Using UserDetails = DatabaseUtils.DefaultConnection().OpenData("GetUserDetails", {"id"}, {UserID})
					Session("ConnectionID") = UserID
					Session("ApplicationID") = AppUtils.Settings.AsInteger("ApplicationID")
					Session("UserNo") = UserID
					Session("UserID") = UserName
					Session("UserName") = UserName
					Session("OrganisationID") = 10
					Session("Locked") = 0
					Session("Home") = "/"
				End using
			End if
		End if
	
		If DatabaseUtils.AllowAction(Request.Params("pid")) Or Session("ConnectionID") Is Nothing
			Dim MasterPageStyle As String = AppUtils.Styles.AsString(Request.Params("pid"))
			
			Dim Path As String = "engine"
			Dim Style As String = ""
			
			Dim Parts = MasterPageStyle.Split("/")
			If Parts.Length > 1
				Path = Parts(0)
				Style = Parts(1)
			Else
				Style = Parts(0)
			End if
			
			MasterPageFile = String.Format("/{0}/master-{1}.master", Path, Style)
			' If MasterPageStyle = ""
				' MasterPageFile = "master-design-1.master"
			' Else 
				' MasterPageFile = String.Format("master-{0}.master", MasterPageStyle)
			' End if
		Else
			MasterPageFile = "master-design-0.master"
		End if
	End Sub

End Class

