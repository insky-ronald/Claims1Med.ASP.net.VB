REM ***************************************************************************************************
REM Last modified on
REM 1-MAR-2015
REM ***************************************************************************************************

REM This is inherited inside master-design-1.master
Public Class BaseMasterPage
    Inherits System.Web.UI.MasterPage

	Public CssName As String = ""
	Public ScriptName As String = ""
	Public jQuery As String = ""
	Public AuthKey As String = "..."
	
	Private Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		' If Session("ConnectionID") Is Nothing
			' Response.Clear
			' Response.Redirect("/login")
			' Response.End
		' End if

		jQuery = "/loadscript/engine/scripts/jquery"
		REM CssName = String.Format("/loadcss/app/css/nav_{0}?pid={0}", Request.Params("pid"))
		REM ScriptName = String.Format("/loadscript/app/scripts/nav_{0}?pid={0}", Request.Params("pid"))
		CssName = String.Format("/loadcss/app/css/main-{0}?pid={0}", Request.Params("pid"))
		ScriptName = String.Format("/loadscript/app/scripts/main-{0}?pid={0}", Request.Params("pid"))
	End Sub
	
End Class
