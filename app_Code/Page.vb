REM ***************************************************************************************************
REM Last modified on
REM 02-MAR-2015
REM ***************************************************************************************************
Imports System.IO
Imports System.Data
 
Namespace SubPage
	Public Class SecuredPage
		Inherits System.Web.UI.Page
		
		Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
					
			Dim Allow As Boolean = True
			Dim Message As String = ""
			Dim RedirectUrl As String = ""

			If Request.Headers("X-Authorization") IsNot Nothing
				REM Dim passPhrase As String = ConfigurationSettings.AppSettings("EncryptionPassKey")
				REM Dim saltValue As String = ConfigurationSettings.AppSettings("EncryptionSaltValue")
				Dim passPhrase As String = AppUtils.Settings.AsString("EncryptionPassKey")
				Dim saltValue As String = AppUtils.Settings.AsString("EncryptionSaltValue")
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
	End Class

	Public Class BaseSubPage
		Inherits SecuredPage
		
		Protected DataDictionary As EasyStringDictionary
		
		Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
			Response.Clear
			Response.ContentType = "application/json; charset=utf-8"
			
			InitData()
			
			Dim Output As New EasyStringDictionary("")
			Output.AsJson("status") = 0
			Output.AsString("message") = ""
			
			InitCallback(Request.Params("action").ToLower, Output)
			FinalizeCallback(Request.Params("action").ToLower, Output)
			
			Response.Write(Output.JsonString(False))
			Response.End()
		End Sub
		
		Protected Overridable Sub InitData
			DataDictionary = New EasyStringDictionary("")
		End Sub
		
		Protected Overridable Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
			If Action = "navigator"
				Output.AsJson("locked") = Session("Locked")
				Output.AsJson("roles") = Session("Roles")
				Output.AsString("home") = Session("Home")
				Output.AsString("user_name") = Session("UserName")
			End if
		End Sub	
		
		Protected Overridable Sub FinalizeCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
			Output.AsJson("info") = DataDictionary.JsonString(False)
		End Sub
	End Class

	Public Class GridSubPage
		Inherits BaseSubPage
		
		Protected QueryBuilder As Query.QueryBuilder
		Protected SearchDictionary As EasyStringDictionary
		Protected DataParams As New List(Of String)
		Protected DataValues As New List(Of Object)
		
		Protected Overrides Sub InitData
			MyBase.InitData
			
			QueryBuilder = New Query.QueryBuilder
			InitQueryBuilder(QueryBuilder)
			If Request.Params("searchData") Is Nothing
				QueryBuilder.SetData("")
			Else
				QueryBuilder.SetData(Request.Params("searchData"))
			End if
			
			SearchDictionary = New EasyStringDictionary("")
			SearchDictionary.AsString("mode") = "advanced"
			SearchDictionary.AsJson("data") = QueryBuilder.Json()
		End Sub
		
		Protected Overrides Sub InitCallback(Action As String, ByVal Output As EasyStringDictionary)
			If Action = "refresh"
				REM Do not call parent class
				REM InitQueryParams()				
			Else
				MyBase.InitCallback(Action, Output)
				InitQueryParams()
			End if
			
			REM If Action = "info"
				REM Using DBData = GetViewData()
					REM Output.AsJson("search") = SearchDictionary.JsonString(True)
					REM Output.AsJson("Data") = DatatableToJson(DBData)
				REM End Using
			REM End if
		End Sub
		
		Protected Overrides Sub FinalizeCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
			MyBase.FinalizeCallback(Action, Output)
			REM Output.AsJson("search") = SearchDictionary.JsonString(False)
			
			If Action = "info"
				Using DBData = GetViewData()
					Output.AsJson("search") = SearchDictionary.JsonString(True)
					Output.AsJson("data") = DatatableToJson(DBData)
				End Using
			End if
		End Sub
		
		Protected Overridable Function DefaultSort() As String
			Return ""
		End Function
		
		Protected Overridable Function DefaultPageSize() As Integer
			Return 25
		End Function

		Protected Overridable Function GetViewData() As DataTable
			Return Nothing
		End Function

		Protected Overridable Function DataSourceName() As String
			Return ""
		End Function
		
		Protected Overridable Sub InitQueryParams()
		End Sub
		
		Protected Overridable Sub InitQueryBuilder(ByVal QueryBuilder As Query.QueryBuilder)
		End Sub
		
	End Class
End Namespace

Namespace Navigator
	Public Class MenuItems
		Private Items As List(Of MenuItem)
		
		Private _Params As EasyStringDictionary
		Public Readonly Property Params As EasyStringDictionary
			Get
				Return _Params
			End Get
		End Property
		
		Private VisitorID As Integer
		Public DefaultIcon As String = "under-construction"
		
		Public Sub New(VisitorID As Integer)
			MyBase.New()
			Me.VisitorID = VisitorID
			Items = New List(Of MenuItem)
			_Params = New EasyStringDictionary("")
		End Sub

		Public Function Add(Optional ByVal ID As String = "", Optional ByVal Title As String = "", Optional IsMain As Boolean = False) As MenuItem
			DIm Item As New MenuItem(ID, Title, False)
			Items.Add(Item)
			Return Item
		End function

		Public Function AllowItem(ByVal Action As String) As Boolean
			REM Dim Allow As Boolean = True
			REM Return Allow
			Return DatabaseUtils.AllowAction(Action)
		End function

		Public Function AddMain(Optional ByVal ID As String = "", Optional ByVal Title As String = "", Optional IsMain As Boolean = False) As MenuItem
			DIm Item As New MenuItem(ID, Title, True)
			Items.Add(Item)
			Return Item
		End function

		Public Sub ItemToJson(Item As MenuItem, S As EasyStringDictionary)
			REM If Item.Description = String.Empty
				REM S.AsString("description") = Item.Title
			REM Else
				REM S.AsString("description") = Item.Description
			REM End if
					
			S.AsString("description") = iif(Item.Description = String.Empty, Item.Title, Item.Description)
			' S.AsString("description") = Item.Description
			S.AsString("icon") = iif(Item.Icon = String.Empty, DefaultIcon, Item.Icon)
			S.AsString("url") = Item.URL
			If Item.URL = "" and Item.Run = ""
				S.AsString("url") = "engine/sys-under-construction"
				S.AsString("content") = "engine/under-construction.aspx"
				S.AsString("css") = Item.Css
				S.AsString("scripts") = "*"
				S.AsString("run") = ""
			Else
				S.AsString("content") = Item.Content
				S.AsString("css") = Item.Css
				S.AsString("scripts") = Item.Scripts	
				S.AsString("run") = Item.Run
			End if
			
			' _Icon = "under-construction"
			' _Content = ""
			' _URL = "e"
			' _Scripts = "*"
			
			REM If Item.Icon = String.Empty
				REM S.AsString("icon") = DefaultIcon
			REM Else
				REM S.AsString("icon") = Item.Icon
			REM End if
			
			S.AsJson("enabled") = iif(Item.Enabled, "true", "false")
			S.AsJson("frame") = iif(Item.UseFrame, "true", "false")
			
			Item.Params.Append(Params)
			REM Dim SubParams As String = Item.Params.Delimeted("&")
			S.AsJson("params") = Item.Params.JsonString()
		End Sub
		
		Public Function Json As String
			Dim JsonList As New List(Of String)
			For Each Item in Items
				Dim Allow As Boolean = True
				
				If Not Item.IsMain
					Allow = AllowItem(Item.Action)
				End if
				
				If Allow
					Dim S As New EasyStringDictionary("")
					S.AsString("id") = Item.ID						
					S.AsString("title") = Item.Title
					
					If Item.IsMain
						Item.SubItems.Params.Append(Params)
						S.AsJson("subItems") = Item.SubItems.Json
					Else
						ItemToJson(Item, S)
					End if
					
					JsonList.Add(S.JsonString(True))
				End if
			Next
			
			Dim Values As String = String.Join(",", JsonList.ToArray)
			If Values = "{}"
				Return "[]"
			Else
				Return "[" & Values & "]"
			End if
		End function
		
		Public Function Json2 As String
			Dim JsonList As New List(Of String)
			REM Using DBActions = DatabaseUtils.DefaultConnection.OpenData("GetActions", {}, {}, "")
				REM DBActions.PrimaryKey = {DBActions.Columns("code")}
				REM Using DBRights = DatabaseUtils.DefaultConnection.OpenData("GetUserActions", {"role_id","visit_id"}, {0, VisitorID}, "")					
					Dim Counter As Integer = 0
					
					For Each Item in Items
						Counter += 1
						If Item.ID = "-"
							Dim S As New EasyStringDictionary("")
							S.AsString("ID") = "_g_" & Counter
							S.AsString("Title") = "-"
							S.AsString("URL") = ""
							S.AsString("Icon") = ""
							JsonList.Add(S.JsonString())
						Else
							REM If Item.Action = String.Empty
								REM Item.Action = Item.ID
							REM End if
							
							REM Dim Action = DBActions.Rows.Find(Item.Action)
							REM If Action IsNot Nothing
								REM Dim Rows = DBRights.Select(String.Format("code = '{0}'", Item.Action))
								REM If Rows.Count > 0
									Dim S As New EasyStringDictionary("")
									S.AsString("ID") = Item.ID
									
									REM If Item.Title = String.Empty
										REM S.AsString("Title") = Action.Item("action")
									REM Else
										S.AsString("Title") = Item.Title
									REM End if
									
									Dim SubParams As String = Item.Params.Delimeted("&")
									
									REM If Item.URL = String.Empty
										REM Item.URL = Action.Item("form")
									REM End if
									
									If SubParams = String.Empty
										S.AsString("URL") = Item.URL
									Else
										S.AsString("URL") = Item.URL & "?" & SubParams
									End if
									
									S.AsString("Icon") = Item.Icon
									
									JsonList.Add(S.JsonString())
								REM End if
							REM End if
						End if
					Next
					
					Dim Values As String = String.Join(",", JsonList.ToArray)
					If Values = "{}"
						Return "[]"
					Else
						Return "[" & Values & "]"
					End if
				REM End Using
			REM End Using
		End function
	End Class
	
	Public Class MenuItem
		
		Private _ID As String = ""
		Public Property ID As String
			Get
				Return _ID
			End Get
			Set(ByVal Value As String)
				_ID = Value
			End Set
		End Property

		Private _Action As String = ""
		Public Property Action As String
			Get
				Return _Action
			End Get
			Set(ByVal Value As String)
				_Action = Value
			End Set
		End Property
		
		Private _Title As String = ""
		Public Property Title As String
			Get
				Return _Title
			End Get
			Set(ByVal Value As String)
				_Title = Value
			End Set
		End Property
		
		Private _Description As String = ""
		Public Property Description As String
			Get
				Return _Description
			End Get
			Set(ByVal Value As String)
				_Description = Value
			End Set
		End Property
		
		Private _Css As String = ""
		Public Property Css As String
			Get
				Return _Css
			End Get
			Set(ByVal Value As String)
				_Css = Value
			End Set
		End Property
		
		Private _Scripts As String = ""
		Public Property Scripts As String
			Get
				Return _Scripts
			End Get
			Set(ByVal Value As String)
				_Scripts = Value
			End Set
		End Property
		
		Private _Run As String = ""
		Public Property Run As String
			Get
				Return _Run
			End Get
			Set(ByVal Value As String)
				_Run = Value
			End Set
		End Property
		
		Private _URL As String = ""
		Public Property URL As String
			Get
				Return _URL
			End Get
			Set(ByVal Value As String)
				_URL = Value
			End Set
		End Property
		
		Private _Icon As String = ""
		Public Property Icon As String
			Get
				Return _Icon
			End Get
			Set(ByVal Value As String)
				_Icon = Value
			End Set
		End Property
		
		Private _UseFrame As Boolean = False
		Public Property UseFrame As Boolean
			Get
				Return _UseFrame
			End Get
			Set(ByVal Value As Boolean)
				_UseFrame = Value
			End Set
		End Property
		
		Private _Content As String = ""
		Public Property Content As String
			Get
				Return _Content
			End Get
			Set(ByVal Value As String)
				_Content = Value
			End Set
		End Property
		
		Private _Enabled As Boolean = True
		Public Property Enabled As Boolean
			Get
				Return _Enabled
			End Get
			Set(ByVal Value As Boolean)
				_Enabled = Value
			End Set
		End Property
		
		Private _IsMain As Boolean = False
		Public ReadOnly Property IsMain As Boolean
			Get
				Return _IsMain
			End Get
		End Property
		
		Private _SubItems As MenuItems
		Public ReadOnly Property SubItems As MenuItems
			Get
				Return _SubItems
			End Get
		End Property
		
		Private _Params As EasyStringDictionary
		Public Readonly Property Params As EasyStringDictionary
			Get
				Return _Params
			End Get
		End Property
		
		Public Sub New(ByVal ID As String, Optional ByVal Title As String = "", Optional IsMain As Boolean = False)
			MyBase.New()
			_ID = ID
			_Title = Title
			_IsMain = IsMain
			_Params = New EasyStringDictionary("")
			
			' _Icon = "under-construction"
			' _Content = "engine/under-construction.aspx"
			' _URL = "engine/sys-under-construction"
			' _Scripts = "*"
			' _Css = "*"
			
			_SubItems = New MenuItems(0)
			
		End Sub
		
		REM Public Sub New(ByVal ID As String, VisitorID As Integer, Optional ByVal Title As String = "")
			REM MyBase.New()
			REM _ID = ID
			REM _Title = Title
			REM _Params = New EasyStringDictionary("")
		REM End Sub
		
	End Class

	Public Class BaseNavigator
		Inherits SubPage.SecuredPage
		REM Inherits System.Web.UI.Page
		
		Protected MenuItems As Navigator.MenuItems
		
		Private Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
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