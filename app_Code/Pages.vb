REM http://tnp.insky-inc.com/theme2.aspx?location=pattaya&id=1

Public Interface IControlData
	Event InitParams(ByVal ParamNames As List(Of String), ByVal ParamValues As List(Of Object))
End Interface

Public Interface IDisplayData
	Event InitParams(ByVal sender As Object, ByVal e As CustomEventArgs.DataParamsEventArgs)
	Event GetListRowInfo(ByVal sender As Object, ByVal e As CustomEventArgs.ListRowInfoEventArgs)
End Interface

Public Interface ISetLogo
	Sub SetLogo(ByVal Sender As Object)
End Interface

Public Interface ISetMenuTheme
	Sub SetTheme(ByVal Sender As Object)
End Interface

Public Interface IUserControl
	Event InitViewerControl As EventHandler
End Interface                                                 

Public Interface IMap
End Interface                                                 

Public Interface IScroll
End Interface                                                 

Public Interface ICssParams
	Readonly Property GetParams As String
	Property Params As EasyStringDictionary
End Interface

Public Interface IScriptParams
	Readonly Property GetParams As String
	Property Params As EasyStringDictionary
End Interface

Public Interface IInitScriptParams
	Readonly Property GetParams As String
	Property Params As EasyStringDictionary
End Interface

Public Interface ILocation
	Property DBLocation As System.Data.DataTable
	Property Location As String
	Property LocationID As Integer
	Property LocationCode As String
End Interface                                                 

Public Interface IProject
End Interface

Public Interface IFindProject
End Interface

Public Interface IPageSettings
	Readonly Property ShowFooter As Boolean
End Interface

Public Interface IDeveloper
	Property DeveloperID As Integer
	REM ReadOnly Property Latitude As Double
	REM ReadOnly Property Longtitude As Double
End Interface

Public Interface IGraph
	Sub AddMetaTag(ByVal Name As String, ByVal Value As String)
End Interface

Namespace CustomEventArgs
	Public Class ListRowInfoEventArgs
		Inherits System.EventArgs
		
		Public Property Row As System.Data.DataRow
		Public Property IsSelected As Integer
		Public Property RowID As Object 'Could be numeric or string
		Public Property DisplayLabel As String
	End Class
	
	Public Class DataParamsEventArgs
		Inherits System.EventArgs
		
		Public Property Names As List(Of String)
		Public Property Values As List(Of Object)
		
		Public Sub AddParam(ByVal Name As String, ByVal Value As Object)
			Names.Add(Name)
			Values.Add(Value)
		End Sub
	End Class
End Namespace

Namespace CustomPages
	
	Public Class BaseLocationPage
		Inherits System.Web.UI.Page
		
		Public Location As String = "..."
		Public LocationID As integer = 0
		Public LocationCode As String = "..."
		
		Protected Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
			Location = CType(Master, Object).Location
			LocationID = CType(Master, Object).LocationID
			LocationCode = CType(Master, Object).LocationCode
			
			REM CType(LocationFeaturesList, Object).Location = CType(Master, Object).Location
			REM CType(LocationFeaturesList, Object).LocationID = CType(Master, Object).LocationID
			REM CType(LocationFeaturesList, Object).LocationCode = CType(Master, Object).LocationCode
		End Sub
	End Class

	Public Class BaseMaster0
		Inherits System.Web.UI.MasterPage
		Implements ICssParams
		Implements IScriptParams
		Implements IInitScriptParams
		
		Public Property CssParams As EasyStringDictionary Implements ICssParams.Params
		Public Readonly Property GetCssParams As String Implements ICssParams.GetParams
			Get
				Return CssParams.JsonString(False)
			End Get
		End Property
		
		Public Property ScriptParams As EasyStringDictionary Implements IScriptParams.Params
		Public Readonly Property GetScriptParams As String Implements IScriptParams.GetParams
			Get
				Return ScriptParams.JsonString(False)
			End Get
		End Property
		
		Public Property InitScriptParams As EasyStringDictionary Implements IInitScriptParams.Params
		Public Readonly Property GetInitScriptParams As String Implements IInitScriptParams.GetParams
			Get
				Return InitScriptParams.JsonString(False)
			End Get
		End Property
		
		Public Property AllowEdit As Boolean
			Get
				Return InitScriptParams.AsBoolean("allowEdit")
			End Get
			
			Set(Value As Boolean)
				InitScriptParams.AsBoolean("allowEdit") = Value
			End Set
		End Property
		 
		REM Public AllowEdit As Boolean = False
		
		Public Property PageID As String = ""
		Public Property PageUrl As String = ""
		Public PageName As String = ""
		Public LogoName As String = "tnp-logo-500-white.png"
		Public Property CssName As String = ""
		Public Property ScriptName As String = ""
		REM Public ActiveMenu As String = ""
		REM Public MobileDevice As String = ""
		REM Public DebugText As String = "test debug"
		
		REM Public ShowCookieNotification As Boolean = True
		Public Property ShowCookieNotification As Boolean = False
		
		REM Public Location  As String
		REM Public LocationID  As Integer
		REM Public LocationCode  As String
		REM Public DBLocation as System.Data.DataTable
		
		REM Public LocationsDropDownMenu1 As Object
	
		Public Sub New()
			MyBase.New()
			CssParams = New EasyStringDictionary("")
			ScriptParams = New EasyStringDictionary("")
			InitScriptParams = New EasyStringDictionary("")
			InitScriptParams.AsBoolean("allowEdit") = AppUtils.Settings.AsBoolean("TestAllowEdit")
			If IsMobile
				InitScriptParams.AsBoolean("isMobile") = True
			Else
				InitScriptParams.AsBoolean("isMobile") = False
			End if
		End Sub
		
		Public Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
			REM AllowEdit = AppUtils.Settings.AsBoolean("TestAllowEdit")
			
			PageUrl = Request.ServerVariables("URL").Replace("/", "")
			PageID = PageUrl.Replace(".aspx", "")
			
			If CssParams.Count > 0
				CssName = String.Format("/loadcss/css/{0}?{1}", PageID, CssParams.Delimeted("&"))
			Else
				CssName = String.Format("/loadcss/css/{0}", PageID)
			End if
			
			If ScriptParams.Count > 0
				ScriptName = String.Format("/loadscript/js/{0}?{1}", PageID, ScriptParams.Delimeted("&"))
			Else
				ScriptName = String.Format("/loadscript/js/{0}", PageID)
			End if

			REM DebugText = String.Format("{0}", IsMobile)
			REM If IsMobile
				REM MobileDevice = "1"
			REM Else
				REM MobileDevice = "0"
			REM End if
			
		End Sub
	End Class

	
	Public Class BaseMaster1
		Inherits System.Web.UI.MasterPage
		Implements ICssParams
		Implements IScriptParams
		Implements IInitScriptParams
		
		Public Property CssParams As EasyStringDictionary Implements ICssParams.Params
		Public Readonly Property GetCssParams As String Implements ICssParams.GetParams
			Get
				Return CssParams.JsonString(False)
			End Get
		End Property
		
		Public Property ScriptParams As EasyStringDictionary Implements IScriptParams.Params
		Public Readonly Property GetScriptParams As String Implements IScriptParams.GetParams
			Get
				Return ScriptParams.JsonString(False)
			End Get
		End Property
		
		Public Property InitScriptParams As EasyStringDictionary Implements IInitScriptParams.Params
		Public Readonly Property GetInitScriptParams As String Implements IInitScriptParams.GetParams
			Get
				Return InitScriptParams.JsonString(False)
			End Get
		End Property
		
		Public Property AllowEdit As Boolean
			Get
				Return InitScriptParams.AsBoolean("allowEdit")
			End Get
			
			Set(Value As Boolean)
				InitScriptParams.AsBoolean("allowEdit") = Value
			End Set
		End Property
	
		Public Sub New()
			MyBase.New()
			CssParams = New EasyStringDictionary("")
			ScriptParams = New EasyStringDictionary("")
			InitScriptParams = New EasyStringDictionary("")
			InitScriptParams.AsBoolean("allowEdit") = AppUtils.Settings.AsBoolean("TestAllowEdit")
			If IsMobile
				InitScriptParams.AsBoolean("isMobile") = True
			Else
				InitScriptParams.AsBoolean("isMobile") = False
			End if
		End Sub
		
		Public Property PageID As String = ""
		Public Property PageUrl As String = ""
		Public Property CssName As String = ""
		Public Property ScriptName As String = ""
		Public Property ShowCookieNotification As Boolean = False
		
		REM Public Location  As String
		REM Public LocationID  As Integer
		REM Public LocationCode  As String
		REM Public DBLocation as System.Data.DataTable
		
		Public Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
			PageUrl = Request.ServerVariables("URL").Replace("/", "")
			PageID = PageUrl.Replace(".aspx", "")

			REM If TypeOf Page Is ILocation 
				REM DBLocation = CType(Page, ILocation).DBLocation
				REM Location = CType(Page, ILocation).Location
				REM LocationID = CType(Page, ILocation).LocationID
				REM LocationCode = CType(Page, ILocation).LocationCode
			REM End if
		End Sub
		
		Public Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
			If CssParams.Count > 0
				CssName = String.Format("/loadcss/css/{0}?{1}", PageID, CssParams.Delimeted("&"))
			Else
				CssName = String.Format("/loadcss/css/{0}", PageID)
			End if
			
			If ScriptParams.Count > 0
				ScriptName = String.Format("/loadscript/js/{0}?{1}", PageID, ScriptParams.Delimeted("&"))
			Else
				ScriptName = String.Format("/loadscript/js/{0}", PageID)
			End if
		End Sub
	End Class
	
	Public Class BaseMaster3
		Inherits System.Web.UI.MasterPage
		
		Public AllowEdit As Boolean = False
		REM Public AllowEdit As Boolean = True
		
		Public PageID As String = ""
		Public PageUrl As String = ""
		Public PageName As String = ""
		Public LogoName As String = "tnp-logo-500-white.png"
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
		
		Public Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
			AllowEdit = AppUtils.Settings.AsBoolean("TestAllowEdit")
			REM LocationsDropDownMenu = LocationsDropDownMenu1
			
			REM Dim PageName As String = ""
			PageUrl = Request.ServerVariables("URL").Replace("/", "")
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

			Dim IsLocationSpecific As Boolean = True
			
			If TypeOf Page Is ILocation 
				DBLocation = CType(Page, ILocation).DBLocation
				Location = CType(Page, ILocation).Location
				LocationID = CType(Page, ILocation).LocationID
				LocationCode = CType(Page, ILocation).LocationCode
			Else If Request.Params("location") IsNot Nothing
				LocationCode = Request.Params("location")
				DBLocation = DBConnections("DBAnp").OpenData("GetMainLocationEx", {"code","visit_id"}, {LocationCode, Session("VisitorID")}, "")
				Location = DBLocation.Rows(0).Item("main_location").ToString
				LocationID = DBLocation.Rows(0).Item("id")
			Else
				IsLocationSpecific = False
			End if
			
			If IsLocationSpecific
				If PageID = "about-location"
					PageName = "About " & Location
				Else If PageID = "about-location2"
					PageName = "About " & Location
				Else 'If PageID = "home-location"
					PageName = Location
				End if
				
				REM CssName = String.Format("'/loadcss/css/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
				CssName = String.Format("/loadcss/css/{0}?location={1}&img={2}", PageID, LocationCode, DBLocation.Rows(0).Item("large_image_id")).Replace("'", """")
				ScriptName = String.Format("'/loadscript/js/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
			Else
				CssName = String.Format("'/loadcss/css/{0}'", PageID).Replace("'", """")
				ScriptName = String.Format("'/loadscript/js/{0}'", PageID).Replace("'", """")
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
			
		End Sub
		
		Public Sub Page_Unload(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Unload
			If Not TypeOf Page Is ILocation
				DBLocation.Dispose
			End if
		End Sub
		
		REM Public Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
			REM PageLoad
			REM AfterLoad
		REM End Sub

		REM Overridable Protected Sub PageLoad
			
		REM End Sub
		
		REM Overridable Protected Sub AfterLoad
		REM End Sub
	End Class
	
	Public Class BaseMaster2
		Inherits System.Web.UI.MasterPage
		
		Public AllowEdit As Boolean = False
		REM Public AllowEdit As Boolean = True
		
		Public PageID As String = ""
		Public PageUrl As String = ""
		Public PageName As String = ""
		Public LogoName As String = "tnp-logo-500-white.png"
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
		
		Public Sub Page_Init(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Init
		End Sub
		
		Public Sub Page_Unload(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Unload
		End Sub
		
		Public Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
			AllowEdit = AppUtils.Settings.AsBoolean("TestAllowEdit")
			REM LocationsDropDownMenu = LocationsDropDownMenu1
			
			REM Dim PageName As String = ""
			PageUrl = Request.ServerVariables("URL").Replace("/", "")
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
			PageLoad
			AfterLoad
		End Sub

		Overridable Protected Sub PageLoad
			
			If Request.Params("location") IsNot Nothing
				LocationCode = Request.Params("location")
				DBLocation = DBConnections("DBAnp").OpenData("GetMainLocationEx", {"code","visit_id"}, {LocationCode, Session("VisitorID")}, "")
				Location = DBLocation.Rows(0).Item("main_location").ToString
				LocationID = DBLocation.Rows(0).Item("id")
				
				If PageID = "about-location"
					PageName = "About " & Location
				Else If PageID = "about-location2"
					PageName = "About " & Location
				Else If PageID = "home-location"
					PageName = Location
				End if
				
				REM CssName = String.Format("'/loadcss/css/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
				CssName = String.Format("/loadcss/css/{0}?location={1}", PageID, LocationCode).Replace("'", """")
				ScriptName = String.Format("'/loadscript/js/{0}?location={1}'", PageID, LocationCode).Replace("'", """")
			Else
				CssName = String.Format("'/loadcss/css/{0}'", PageID).Replace("'", """")
				ScriptName = String.Format("'/loadscript/js/{0}'", PageID).Replace("'", """")
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
		End Sub
		
		Overridable Protected Sub AfterLoad
		End Sub
	End Class
End Namespace
