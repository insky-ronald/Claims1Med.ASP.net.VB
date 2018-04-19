REM ***************************************************************************************************
REM Last modified on
REM 3-MAR-2015
REM ***************************************************************************************************

REM This is inherited inside content_loader.aspx
Public Class Content
    Inherits System.Web.UI.Page
	
	Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
	
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

