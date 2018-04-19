Namespace CustomPages
	Public Class BaseMaster
		Inherits System.Web.UI.MasterPage
		
		Public AllowEdit As Boolean = False
		REM Public AllowEdit As Boolean = True
		
		Public PageID As String = ""
		Public PageUrl As String = ""
		Public PageName As String = ""
		Public CssName As String = ""
		Public ScriptName As String = ""
		Public ActiveMenu As String = ""
		Public MobileDevice As String = ""
		Public DebugText As String = "test debug"
		
		REM Public ShowCookieNotification As Boolean = True
		Public ShowCookieNotification As Boolean = False
		
		Public Location  As String
		Public LocationID  As Integer
		Public LocationCode  As String
		Public DBLocation as System.Data.DataTable
		
		REM Public LocationsDropDownMenu1 As Object
		
		Public Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
			AllowEdit = AppUtils.Settings.AsBoolean("TestAllowEdit")
			REM LocationsDropDownMenu = LocationsDropDownMenu1
			
			REM Dim PageName As String = ""
			PageUrl = Request.ServerVariables("URL").Replace("/public", "").Replace("/", "")
			REM PageID = PageUrl.Replace(".aspx", "")
			PageID = PageUrl.Replace(".aspx", "")
			
			REM Dim Url As String = Request.ServerVariables("URL").Replace("/", "").Replace(".aspx", "")
			
			If PageID = "about-us"
				PageName = "About Us"
			Else If PageID = "travel-guides"
				PageName = "Travel Guides"
			Else If PageID = "partners"
				PageName = "Partners"
			Else If PageID = "health-wellness"
				PageName = "Health & Wellness"
			Else If PageID = "family-wellbeing"
				PageName = "Family Wellbeing"
			Else If PageID = "personal-health"
				PageName = "Personal Health"
			Else If PageID = "fitness"
				PageName = "Fitness"
			Else If PageID = "contact"
				PageName = "Contact Us" 
			Else If PageID = "index"
				PageName = "Home"
			Else
				PageName = ""
			End if
			
			If Request.Params("location") IsNot Nothing
				LocationCode = Request.Params("location")
				DBLocation = DBConnections("DBTnp").OpenData("GetMainLocationEx", {"code","visit_id"}, {LocationCode, Session("VisitorID")}, "")
				Location = DBLocation.Rows(0).Item("main_location").ToString
				LocationID = DBLocation.Rows(0).Item("id")
				
				If PageID = "about-location"
					PageName = "About " & Location
				Else If PageID = "about-location2"
					PageName = "About " & Location
				Else If PageID = "home-location"
					PageName = Location
				End if
				
				CssName = String.Format("'/loadcss/public/css/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
				ScriptName = String.Format("'/loadscript/public/scripts/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
			Else
				CssName = String.Format("'/loadcss/public/css/{0}'", PageID).Replace("'", """")
				ScriptName = String.Format("'/loadscript/public/scripts/{0}'", PageID).Replace("'", """")
			End if
			
			
			REM CType(LocationsDropDownMenu1, Object).CurrentLocationCode = LocationCode
			REM DebugText = String.Format("{0},{1}", BrowserName, BrowserVer)
			REM DebugText = String.Format("{0}", HttpContext.Current.Request.ServerVariables("HTTP_USER_AGENT"))
			DebugText = String.Format("{0}", IsMobile)
			If IsMobile
				MobileDevice = "1"
			Else
				MobileDevice = "0"
			End if
			
			REM If PageName <> ""
				REM Me.Title = PageName + " - Mayfair We Care"
			REM End if
			
			REM CType(Master, Object).PageName = PageName
			REM Page.Header.Controls.Add(New LiteralControl("<script src='http://app.cookieassistant.com/widget.js?token=IHwEpwb7RdFgdaVE5cmGVg' type='text/javascript'></script>" + Environment.NewLine))
			REM Page.Header.Controls.Add(New LiteralControl("<div id='cookie_assistant_container'></div>" + Environment.NewLine))
			
			PageLoad
		End Sub

		Overridable Protected Sub PageLoad
		End Sub
	End Class
End Namespace
