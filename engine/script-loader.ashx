﻿REM ***************************************************************************************************
REM Last modified on
REM 28-FEB-2015
REM ***************************************************************************************************
<%@ WebHandler Language="VB" Class="Loader" %>

Imports System.IO

Namespace PreProcessor
	Public Class Parser
		Private S As String
		Private Filename As String
		Public ExtraParams As String
		Public Variables As EasyStringDictionary
		Public Parent As Parser
		Private oRead As System.IO.StreamReader
		Public Level As Integer = 0
		Public Minify As Microsoft.Ajax.Utilities.Minifier
		
		Public Source As StringBuilder

		Public Event Log(ByVal Parser As Parser, ByVal Log As String)
		REM Public Event Compare(ByVal Parser As Parser, ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
		REM Public Event AddVariable(ByVal Parser As Parser, ByVal Variables As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
		Public Event IncludeFile(ByVal Parser As Parser, ByVal SourceName As String, ByVal Params As String)
		
		Public Sub New(ByVal Filename As String, ByVal ExtraParams As String, ByVal Optional Parent As Parser = Nothing)
			MyBase.New
			Minify = New Microsoft.Ajax.Utilities.Minifier()
			
			Me.Parent = Parent
			Me.Filename = Filename
			Me.ExtraParams = ExtraParams
			Source = New StringBuilder("")
			
			If Parent Is Nothing
				Level = 1
			Else
				Level = Parent.Level + 1
			End if
			
			Variables = New EasyStringDictionary(ExtraParams)
			Variables.AsString("@version") = BrowserName & BrowserVer
			Variables.AsString("@ver") = BrowserVer
			Variables.AsString("@browser") = BrowserName
			Variables.Remove("script")
		End Sub
		
		Public Function Eof As Boolean
			Return oRead.Peek() >= 0
		End Function
		
		Private Function IsComment() As Boolean
			Return S.Substring(0, 2) = "--" or S.Substring(0, 2) = "//"
		End Function
		
		Public Function HasToken(ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
			If Full
				Return S = Token
			Else If S.Length >= Token.Length 
				Return S.Substring(0, Token.Length) = Token
			Else
				Return False
			End if
		End Function
			
		Private Sub AddVariable(ByVal UseParams As EasyStringDictionary)
			Dim ValuePair As String() = S.Split("=")
			If ValuePair.Length = 2
				REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
				If UseParams Is Nothing
					Variables.AsString(ValuePair(0).Trim) = ValuePair(1).Trim
				Else
					UseParams.AsString(ValuePair(0).Trim) = ValuePair(1).Trim
				End if
			End if
		End Sub
			
		Private Sub AddVariable(ByVal UseParams As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
			If UseParams Is Nothing
				Variables.AsString(Name) = Value
			Else
				UseParams.AsString(Name) = Value
			End if
		End Sub
		
		Public Sub Compare(ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
			If Not Negate
				Allow = Variables.AsString(Name) = Value
			Else
				Allow = Variables.AsString(Name) <> Value
			End if
		End Sub
			
		Public Sub Append
			Source.AppendLine(S)
		End Sub
			
		Public Sub Append(ByVal SS As String)
			Source.Append(SS)
		End Sub
		
		Private Function ReadLine As String
			Return oRead.ReadLine().Trim
		End Function
		
		Public Sub Parse_IF(ByVal Optional UseParams As EasyStringDictionary = Nothing)
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim Expr As String() = S.Substring(I, J).Split("=")
			Dim Allow As Boolean = False
			
			REM Append(Expr(0) &",")
			REM Append(Expr(1) &",")
			REM Append(Variables.AsString("@browser"))
			
			REM Read(False, UseParams)
			' S = oRead.ReadLine().Trim
			S = ReadLine()
			Do While Not HasToken("##endif") and Not HasToken("##else") and Not HasToken("##elseif", False)
				Compare(Expr(0), Expr(1), False, Allow)
				If Allow 
					If UseParams Is Nothing
						If HasToken("##includetemplate", False)
							Parse_TEMPLATE
						Else If HasToken("##include", False)
							Parse_INCLUDE
						End if
					Else
						AddVariable(UseParams)
					End if
				End if
				REM Read(False, UseParams)
				' S = oRead.ReadLine().Trim
				S = ReadLine()
			Loop
			
			If HasToken("##elseif", False)
				Parse_IF
			End if
			
			If HasToken("##else")
				REM Read(False, UseParams)
				' S = oRead.ReadLine().Trim
				S = ReadLine()
				Do While Not HasToken("##endif", False)
					Compare(Expr(0), Expr(1), True, Allow)
					If Allow 
						If UseParams Is Nothing
							If HasToken("##includetemplate", False)
								Parse_TEMPLATE
							Else If HasToken("##include", False)
								Parse_INCLUDE
							End if
						Else
							AddVariable(UseParams)
						End if
					End if
					REM Read(False, UseParams)
					' S = oRead.ReadLine().Trim
					S = ReadLine()
				Loop
			End if
			
		End Sub
		
		Public Sub Parse_SCRIPT(ByVal Optional UseParams As EasyStringDictionary = Nothing)
			' S = oRead.ReadLine().Trim
			S = ReadLine()
			Do While Not HasToken("##endscript")
				Append
				' S = oRead.ReadLine().Trim
				S = ReadLine()
			Loop
		End Sub
		
		Public Sub Include(ByVal Filename As String)
			If System.IO.File.Exists(FileName) Then
				' Method #1
				' Dim S As New StringBuilder("")
				' Using sr As New System.IO.StreamReader(Filename)
					' S.Append(sr.ReadToEnd())
					' sr.Close()
				' End Using

				' Append("//" & System.IO.Path.GetFilename(Filename) & Environment.NewLine)
				' Append(Minify.MinifyJavaScript(S.ToString))
				
				' Method #2
				' Append("//" & System.IO.Path.GetFilename(Filename) & Environment.NewLine)
				' Using sr As New System.IO.StreamReader(Filename)
					' Append(Minify.MinifyJavaScript(sr.ReadToEnd()))
					' sr.Close()
				' End Using

				' Method #3
				Append("//" & System.IO.Path.GetFilename(Filename) & Environment.NewLine)
				Append(Minify.MinifyJavaScript(File.ReadAllText(FileName)))
			Else
				Append("// not found: " + Filename)
			End if
		End Sub
		
		Public Sub Parse_INCLUDE
			Dim UseFilename As String = S.Split("=")(1)
			Dim ValuePair As String() = UseFilename.Split("\")

			If ValuePair.Length = 2
				REM If ValuePair(0).Contains("sub-")
					REM UseFilename = String.Format("/app/{0}/{1}.js", ValuePair(0), ValuePair(1))
				REM Else
					UseFilename = String.Format("{0}/scripts/{1}.js", ValuePair(0), ValuePair(1))
				REM End if
			Else
				UseFilename = String.Format("/scripts/{0}", UseFilename)
			End if
			
			RaiseEvent IncludeFile(Me, UseFilename, Variables.Delimeted(";"))
		End Sub
		
		Public Sub Parse_RUN
			Dim ValuePair As String() = S.Split("=")
			If ValuePair.Length = 2
				Append(String.Format("desktop.subModule.load({0})", ValuePair(1)))
			End if
		End Sub
		
		Public Sub Parse_TEMPLATE
			Dim UseFilename As String = S.Split("=")(1)
			Dim ValuePair As String() = UseFilename.Split("\")
			UseFilename = String.Format("{0}/scripts/{1}.jst", ValuePair(0), ValuePair(1))
			
			REM If ValuePair.Length = 2
				REM If ValuePair(0).Contains("sub-")
					REM UseFilename = String.Format("/app/{0}/{1}.js", ValuePair(0), ValuePair(1))
				REM Else
					REM UseFilename = String.Format("{0}/scripts/{1}.jst", ValuePair(0), ValuePair(1))
				REM End if
			REM Else
				REM UseFilename = String.Format("{0}/scripts/{1}.jst", ValuePair(0), ValuePair(1))
			REM End if
			
			RaiseEvent IncludeFile(Me, UseFilename, Variables.Delimeted(";"))
		End Sub
		
		Public Sub Read(ByVal Optional Root As Boolean = True, ByVal Optional UseParams As EasyStringDictionary = Nothing)
			' S = oRead.ReadLine().Trim
			S = ReadLine()
			
			If S.Length > 0
				If Not IsComment()
					If HasToken("##includetemplate", False)
						Parse_TEMPLATE
					Else If HasToken("##include", False)
						Parse_INCLUDE
					Else If HasToken("##if", False)
						Parse_IF(UseParams)
					Else If HasToken("##script", False)
						Parse_SCRIPT
					Else If HasToken("##run", False)
						Parse_RUN
					End if
				End if
			End if
		End Sub
		
		Public Sub Parse
			oRead = System.IO.File.OpenText(Filename)
			
			Do While oRead.Peek() >= 0
				Read
			Loop
			
			oRead.Close()
			oRead.Dispose()
		End Sub
		
		Public Function PopulateVariables As String
			Return Variables.PopulateVariables(Source)
			REM Return Source.ToString
		End Function
	End Class
	
	Public Class ScriptPreProcesser
		' Inherits BasePreProcessor
		
		Public IncludedCss As StringBuilder
		Public Variables As New EasyStringDictionary("")

		Public Sub New
			MyBase.New
			IncludedCss = New StringBuilder("")
		End Sub
						
		Public Sub Log(ByVal Parser As Parser, ByVal Log As String)
			IncludedCss.AppendLine(Parser.Level &"."& ("").PadRight((Parser.Level-1)*3, " ") & Log)
		End Sub
		
		Public Sub Include(ByVal CssName As String, Optional ExtraParams As String = "", Optional Parent As Parser = Nothing)
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & CssName), "")
			Dim Ext As String = System.IO.Path.GetExtension(Filename).ToLower
			
			Dim Parser As New Parser(Filename, ExtraParams, Parent)
			Parser.Variables.AsString("@pid") = Variables.AsString("@pid")
			Parser.Variables.AsString("@keyid") = Variables.AsString("@keyid")
			' Parser.Variables.AsString("@keyid") = "inv"
			REM Parser.Append("//" & Parser.Variables.Delimeted(";") & Environment.NewLine)

			AddHandler Parser.Log, AddressOf Log
			AddHandler Parser.IncludeFile, AddressOf IncludeFile
			
			' UpdateModifiedDate(Filename)

			If Ext = ".jst"
				Parser.Parse
			Else
				Parser.Include(Filename)
			End if
			' Parser.Include(Filename)

			IncludedCss.AppendLine(Parser.PopulateVariables)
		End Sub
		
		Public Sub IncludeFile(ByVal Parser As Parser, ByVal CssName As String, Optional ExtraParams As String = "")
			Include(CssName, ExtraParams, Parser)
		End Sub

		' Public Overrides Function GetContent() As String
		Public Function GetContent() As String
			Return IncludedCss.ToString
		End Function

	End Class	
	
	Public Class FilesModifiedState
		
		Public Property ModifiedDate As DateTime
		
		Public Function HasToken(ByVAl S As String, ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
			If Full
				Return S = Token
			Else If S.Length >= Token.Length 
				Return S.Substring(0, Token.Length) = Token
			Else
				Return False
			End if
		End Function
		
		Public Sub UpdateModifiedDate(ByVal FileName As String)
			If System.IO.File.Exists(FileName) Then
				Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(FileName)
				TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
				If DateTime.Compare(TimeStamp, ModifiedDate) > 0
				' If DateTime.Compare(ModifiedDate, TimeStamp) > 0
					ModifiedDate = TimeStamp
				End if
			End if
		End Sub
		
		Public Function ParseFiles(TargetFileName) As Boolean
			UpdateModifiedDate(TargetFileName)
			Using oRead As System.IO.StreamReader = System.IO.File.OpenText(TargetFileName)
				Do While oRead.Peek() >= 0
					Dim S As String = oRead.ReadLine().Trim
					If S <> String.Empty
						If S.Substring(0, 2) <> "//"
							If HasToken(S, "##includetemplate", False)
								' ##includetemplate=engine\common-controls
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".jst"
								Else
									Name = "\scripts\" & Parts(1) & ".jst"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								ParseFiles(FileName)
								
							Else If HasToken(S, "##include", False)
								' ##include=jquery-2.1.4.min.js
								' ##include=engine\utils
								' ##include=app\utils
								
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".js"
								Else
									Name = "\scripts\" & Parts(1) & ".js"
								End if
								
								Dim FileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								
								UpdateModifiedDate(FileName)
							End if
						End if
					End if
				Loop
				
				oRead.Close()
			End Using
		End Function

	End Class	
	
	Public Class BundledFiles
		
		Public Property Files As List(Of String)
		Public Property ModifiedDate As DateTime
		Public Property FileName As String
		
		Private Property Content As StringBuilder

		Public Sub New(ByVal TargetFileName As String)
			MyBase.New
			
			Content = New StringBuilder("")
			FileName = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & TargetFileName), "")
			Files = New List(Of String)
			GatherFiles()
		End Sub
		
		Public Function GetContent As String
			Return Content.ToString
		End Function
		
		Public Function HasToken(ByVAl S As String, ByVal Token As String, ByVal Optional Full As Boolean = True) As Boolean
			If Full
				Return S = Token
			Else If S.Length >= Token.Length 
				Return S.Substring(0, Token.Length) = Token
			Else
				Return False
			End if
		End Function
		
		Public Sub BundleFiles()
			Dim Minify As Microsoft.Ajax.Utilities.Minifier = New Microsoft.Ajax.Utilities.Minifier()
			
			For Each SourceFileName in Files
				If System.IO.File.Exists(SourceFileName) Then
					Dim SourceContent As String = File.ReadAllText(SourceFileName)
					Content.Append("//" & System.IO.Path.GetFilename(SourceFileName) & Environment.NewLine)
					Content.Append(Minify.MinifyJavaScript(SourceContent))
					Content.Append(Environment.NewLine)
				Else
					Content.Append("// Not found: " & SourceFileName & Environment.NewLine)
				End if
			Next
		End Sub
		
		Public Sub GatherFiles(ByVal Optional TargetFileName As String = "")
			If TargetFileName = ""
				TargetFileName = FileName
			End if
			
			Using oRead As System.IO.StreamReader = System.IO.File.OpenText(TargetFileName)
				Do While oRead.Peek() >= 0
					Dim S As String = oRead.ReadLine().Trim
					If S <> String.Empty
						If S.Substring(0, 2) <> "//"
							If HasToken(S, "##includetemplate", False)
								' ##includetemplate=engine\common-controls
								Dim Name As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".jst"
								Else
									Name = "\scripts\" & Parts(1) & ".jst"
								End if
								
								GatherFiles(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name)))
								
							Else If HasToken(S, "##include", False)
								' ##include=jquery-2.1.4.min.js
								' ##include=engine\utils
								' ##include=app\utils
								
								Dim Name As String = ""
								Dim FileName As String = ""
								Dim Parts As String() = S.Split("=")
								Dim NameParts As String() = Parts(1).Split("\")
								
								If NameParts(0) = "engine" or NameParts(0) = "app"
									Name = NameParts(0) &"\scripts\" & NameParts(1) & ".js"
									FileName = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								Else
									' Name = "\scripts\" & Parts(1) & ".js"
									Name = Parts(1)
									' FileName = System.IO.Path.Combine("scripts", HttpContext.Current.Server.MapPath("/" & Name))
									FileName = HttpContext.Current.Server.MapPath("~/scripts/" & Name)
								End if
								
								' FileName = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Name))
								Files.Add(FileName)
								If System.IO.File.Exists(FileName) Then
									' Files.Add(FileName)
									Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
									TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
									If DateTime.Compare(TimeStamp, ModifiedDate) > 0
									' If DateTime.Compare(ModifiedDate, TimeStamp) > 0
										ModifiedDate = TimeStamp
									End if
								End if
							End if
						End if
					End if
				Loop
				
				oRead.Close()
			End Using
		End Sub

	End Class	
	
End Namespace

Public Class Loader: Implements IHttpHandler REM, IReadOnlySessionState
	Protected Request As System.Web.HttpRequest
	Protected Response As System.Web.HttpResponse
	REM Protected Session As  System.Web.SessionState.HttpSessionState
		
	Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
		Get
			REM Return True
			Return False
		End Get
	End Property

	Public Sub ProcessRequest(ByVal Context As HttpContext) Implements IHttpHandler.ProcessRequest
		Request = Context.Request
		Response = Context.Response
		
		Response.Clear()
		Response.ContentType = "application/x-javascript"
		
		If Request.Headers("Accept-Encoding").Contains("gzip")
			Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			Response.Headers.Remove("Content-Encoding")
			Response.AppendHeader("Content-Encoding", "gzip")
		End if
		
		Dim CompileFileName As String
		If AppUtils.Settings.AsInteger("Development") = 0
			CompileFileName = System.IO.Path.Combine(AppUtils.Paths.AsString("ScriptsCompilePath"), Request.Params("script").Replace("/", "~"))
			If System.IO.File.Exists(CompileFileName)
				Response.Write("// compiled scripts")
				Response.Write(Environment.NewLine)
				Response.WriteFile(CompileFileName)
				Response.End()
				Return
			End if
		End if
		
		Dim Script = New PreProcessor.ScriptPreProcesser
		If Request.Params("pid") IsNot Nothing
			Script.Variables.AsString("@pid") = Request.Params("pid")
		Else
			Script.Variables.AsString("@pid") = ""
		End if
		If Request.Params("keyid") IsNot Nothing
			Script.Variables.AsString("@keyid") = Request.Params("keyid")
		Else
			Script.Variables.AsString("@keyid") = ""
		End if
		
		Dim Filename As String = Request.Params("script")
		
		Dim Ext As String = System.IO.Path.GetExtension(Filename)
		If Ext = ""
			Filename = Filename & ".jst"
		Else
			Filename = Filename.Replace(Ext, ".jst")
		End if
		
		If Not System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
			Filename = Filename.Replace(".jst", ".js")
		End if

		Dim SourceFileName As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")
		
		' Dim BundledFiles = New PreProcessor.BundledFiles(Filename)
		
		Dim StatusCheck = New PreProcessor.FilesModifiedState
		StatusCheck.ParseFiles(SourceFileName)

		Dim Modified As Integer = 1
		Dim ModifiedSince As DateTime
		
		If Request.Headers("If-Modified-Since") IsNot Nothing
			DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
			Modified = DateTime.Compare(StatusCheck.ModifiedDate, ModifiedSince)
		Else
			Modified = 1
			' ModifiedSince = Date.Today()
			ModifiedSince = Date.Now()
		End if
		
		Response.AppendHeader("Max-Age", 1)
		If Modified > 0
			Response.Cache.SetLastModified(StatusCheck.ModifiedDate)
			Script.Include(Filename, Request.Url.Query.Replace("?", "").Replace("&", ";"))
			Response.Write(Script.GetContent())
			' BundledFiles.BundleFiles()
			' Response.Write(BundledFiles.GetContent())
			
			If AppUtils.Settings.AsInteger("Development") = 0
				File.WriteAllText(CompileFileName, Script.GetContent())
			End if
		Else
			Response.StatusCode = 304
			Response.SuppressContent = True
		End if
		
		Response.End()
	End Sub
End Class

