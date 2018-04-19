REM ***************************************************************************************************
REM Last modified on 
REM 14-SEP-2014
REM ***************************************************************************************************
Imports System
Imports System.IO
Imports PaxScript.Net

Public Module AppUtils
	Public Paths As EasyStringDictionary = Nothing
	Public Databases As EasyStringDictionary = Nothing
	Public Settings As EasyStringDictionary = Nothing
	Public Styles As EasyStringDictionary = Nothing
	Public ScriptLibraries As EasyStringDictionary = Nothing
	Public MenuItems As Navigator.MenuItems = Nothing
	
	Private Sub RunIntFileScript(InitFile As String, Handler As DataHandler.BaseHandler)
		If System.IO.File.Exists(InitFile)
			Dim Scripter As New PaxScript.Net.PaxScripter
			
			Scripter.Reset()
			Scripter.RegisterType(GetType(Navigator.MenuItems))
			Scripter.RegisterType(GetType(EasyStringDictionary))
			Scripter.RegisterInstance("Paths", AppUtils.Paths)
			Scripter.RegisterInstance("Styles", AppUtils.Styles)
			Scripter.RegisterInstance("ScriptLibraries", AppUtils.ScriptLibraries)
			Scripter.RegisterInstance("Settings", AppUtils.Settings)
			Scripter.RegisterInstance("Databases", AppUtils.Databases)
			Scripter.RegisterInstance("MenuItems", AppUtils.MenuItems)

			REM Scripter.RegisterType(GetType(DataDictionary.DatabaseConnections))
			REM Scripter.RegisterType(GetType(DataDictionary.DatabaseConnection))
			REM Scripter.RegisterInstance("DBConnections", DBConnections)
			
			Scripter.AddModule(0, "VB")
			Scripter.AddCodeFromFile(0, InitFile)
			' Scripter.AddCodeFromFile(0, ConfigurationSettings.AppSettings("EngineInitFile"))
			' Scripter.AddCodeFromFile(0, ConfigurationSettings.AppSettings("ApplicationUtils"))
			
			Scripter.Run(RunMode.Run)
			If Scripter.HasErrors Then
				For e As Integer = 0 To Scripter.Error_List.Count - 1
					Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
					If Handler IsNot Nothing
						Handler.Response.Write(s + Environment.NewLine)
					End if
				Next
			' Else
				' If Handler IsNot Nothing
					' Handler.Response.Write(AppUtils.Styles.JsonString(True))
					' Handler.Response.Write(AppUtils.ScriptLibraries.JsonString(True))
				' End if
			End If

			Scripter.Dispose
		End if
	End Sub
	
	Public Sub InitializeAppUtils(Optional Handler As DataHandler.BaseHandler = Nothing)
		Paths = New EasyStringDictionary("")
		Styles = New EasyStringDictionary("")
		ScriptLibraries = New EasyStringDictionary("")
		Databases = New EasyStringDictionary("")
		Settings = New EasyStringDictionary("")
		MenuItems = New Navigator.MenuItems(0)
		
		Dim EngineInitFile As String = ConfigurationSettings.AppSettings("EngineInitFile")
		Dim AppInitFile As String = ConfigurationSettings.AppSettings("ApplicationUtils")

		' RunIntFileScript(EngineInitFile, Handler)
		' RunIntFileScript(AppInitFile, Handler)
		
		Dim Scripter As New PaxScript.Net.PaxScripter
		
		Scripter.Reset()
		Scripter.RegisterType(GetType(Navigator.MenuItems))
		Scripter.RegisterType(GetType(EasyStringDictionary))
		Scripter.RegisterInstance("Paths", Paths)
		Scripter.RegisterInstance("Styles", Styles)
		Scripter.RegisterInstance("ScriptLibraries", ScriptLibraries)
		Scripter.RegisterInstance("Settings", Settings)
		Scripter.RegisterInstance("Databases", Databases)
		Scripter.RegisterInstance("MenuItems", MenuItems)
	
		Scripter.AddModule(0, "VB")
		' Scripter.AddCodeFromFile(0, EngineInitFile)
		' Scripter.AddCodeFromFile(0, AppInitFile)
		Scripter.AddCode(0, System.IO.File.ReadAllText(EngineInitFile))
		Scripter.AddCode(0, System.IO.File.ReadAllText(AppInitFile))
		
		Scripter.Run(RunMode.Run)
		
		If Scripter.HasErrors Then
			For e As Integer = 0 To Scripter.Error_List.Count - 1
				Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
				If Handler IsNot Nothing
					Handler.Response.Write(s + Environment.NewLine)
				End if
			Next
		End If

		Scripter.Dispose
		
		Dim ConnectionNames = AppUtils.Databases.AsString("DatabaseConnections").Split(",")
		Dim DatabaseMenu As Navigator.MenuItem = MenuItems.AddMain("database", "Database", True)
		For Each ConnectionName In ConnectionNames
			With DatabaseMenu.SubItems.Add
				.ID = ConnectionName
				.Action = "database"				
				.Title = ConnectionName
				.Icon = "database"
				.URL = "sys/database?database=" & ConnectionName
			End with
		Next
		
		REM If System.IO.File.Exists(AppInitFile)
			REM Dim Scripter As New PaxScript.Net.PaxScripter
			
			REM Scripter.Reset()
			REM Scripter.RegisterType(GetType(Navigator.MenuItems))
			REM Scripter.RegisterType(GetType(EasyStringDictionary))
			REM Scripter.RegisterInstance("Paths", AppUtils.Paths)
			REM Scripter.RegisterInstance("Styles", AppUtils.Styles)
			REM Scripter.RegisterInstance("ScriptLibraries", AppUtils.ScriptLibraries)
			REM Scripter.RegisterInstance("Settings", AppUtils.Settings)
			REM Scripter.RegisterInstance("Databases", AppUtils.Databases)
			REM Scripter.RegisterInstance("MenuItems", AppUtils.MenuItems)
			
			REM Scripter.AddModule(0, "VB")
			REM Scripter.AddCodeFromFile(0, AppInitFile)
			
			REM Scripter.Run(RunMode.Run)
			REM If Scripter.HasErrors Then
				REM For e As Integer = 0 To Scripter.Error_List.Count - 1
					REM Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
					REM If Handler IsNot Nothing
						REM Handler.Response.Write(s + Environment.NewLine)
					REM End if
				REM Next
			REM Else
				REM If Handler IsNot Nothing
					REM Handler.Response.Write(AppUtils.Styles.JsonString(True))
					REM Handler.Response.Write(AppUtils.ScriptLibraries.JsonString(True))
				REM End if
			REM End If

			REM Scripter.Dispose
		REM End if
	End Sub
	
	Public Function GetStyle(ByVal StyleName As String) As String
		Return Styles.AsString(StyleName)
	End Function
End Module
