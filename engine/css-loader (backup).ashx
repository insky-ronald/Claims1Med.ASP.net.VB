REM ***************************************************************************************************
REM Last modified on
REM 28-FEB-2015
REM ***************************************************************************************************
<%@ WebHandler Language="VB" Class="Loader" %>

Imports System.IO

Namespace PreProcessor
	Public Class BasePreProcessor
		Public ModifiedDate As DateTime
		Public Sub UpdateModifiedDate(Filename As String)
			Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
			TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
			If DateTime.Compare(TimeStamp, ModifiedDate) > 0
				ModifiedDate = TimeStamp
			End if
		End Sub
		
		Public Overridable Sub Include(ByVal File As String, Optional Params As String = "")
		End Sub
		
		Public Overridable Function GetContent() As String
			Return ""
		End Function
	End Class

	Public Class Parser
		Private S As String
		Private Filename As String
		Public ExtraParams As String
		Public Variables As EasyStringDictionary
		Public Parent As Parser
		Private oRead As System.IO.StreamReader
		Public Level As Integer = 0
		
		Public Source As StringBuilder

		Public Event Log(ByVal Parser As Parser, ByVal Log As String)
		REM Public Event Compare(ByVal Parser As Parser, ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
		REM Public Event AddVariable(ByVal Parser As Parser, ByVal Variables As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
		Public Event IncludeFile(ByVal Parser As Parser, ByVal SourceName As String, ByVal Params As String)
		
		Public Sub New(ByVal Filename As String, ByVal ExtraParams As String, ByVal Optional Parent As Parser = Nothing)
			MyBase.New
			
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
			Variables.Remove("css")
		End Sub
		
		Public Function Eof As Boolean
			Return oRead.Peek() >= 0
		End Function
		
		Private Function IsComment() As Boolean
			Return S.Substring(0, 2) = "/*" and S.Substring(S.Length-2, 2) = "*/"
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
			Source.AppendLine(SS)
		End Sub
		
		Public Sub Parse_IF(ByVal Optional UseParams As EasyStringDictionary = Nothing)
			Dim I As Integer = S.IndexOf("(")+1
			Dim J As Integer = S.IndexOf(")")-I
			Dim Expr As String() = S.Substring(I, J).Split("=")
			Dim Allow As Boolean = False
			
			Read(False, UseParams)
			Do While Not HasToken("##endif") and Not HasToken("##else") and Not HasToken("##elseif", False)
				REM RaiseEvent Compare(Me, Expr(0), Expr(1), False, Allow)
				Compare(Expr(0), Expr(1), False, Allow)
				If Allow 
					If UseParams Is Nothing
						Append
					Else
						AddVariable(UseParams)
						REM Dim ValuePair As String() = S.Split("=")
						REM If ValuePair.Length = 2
							REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
						REM End if
					End if
				End if
				Read(False, UseParams)
			Loop
			
			If HasToken("##elseif", False)
				Parse_IF
			End if
			
			If HasToken("##else")
				Read(False, UseParams)
				Do While Not HasToken("##endif", False)
					REM RaiseEvent Compare(Me, Expr(0), Expr(1), True, Allow)
					Compare(Expr(0), Expr(1), True, Allow)
					If Allow 
						If UseParams Is Nothing
							Append
						Else
							AddVariable(UseParams)
							REM Dim ValuePair As String() = S.Split("=")
							REM If ValuePair.Length = 2
								REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
							REM End if
						End if
					End if
					Read(False, UseParams)
				Loop
			End if
			
		End Sub
		
		Public Sub Parse_USEFILE
			Dim UseFilename As String = S.Split("=")(1)
			Dim UseParams As New EasyStringDictionary(Variables.Delimeted(";"))
			UseParams.Append(Variables)
			REM Variables.Append(UseParams)
			
			Do
				If HasToken("##if")
					Parse_IF(UseParams)
				End if																						

				Read(False, UseParams)
			Loop Until HasToken("##enduse")
			
			REM UseParams.Append(Variables)
			REM Variables.Append(UseParams)
			RaiseEvent IncludeFile(Me, UseFilename, UseParams.Delimeted(";"))
		End Sub
		
		Public Sub Parse_TEMPLATE(ByVal EndToken As String, ByVal Ext As String)
			Dim UseParams As New EasyStringDictionary(Variables.Delimeted(";"))
			REM RaiseEvent Log(Me, "Parse_TEMPLATE Variables=" & Variables.Delimeted(";"))
			UseParams.Append(Variables)
			
			Do
				If HasToken("##if")
					Parse_IF(UseParams)
				End if																						

				Read(False, UseParams)
				
			Loop Until HasToken(EndToken, False)
			
			Dim UseFilename As String = S.Split("=")(1)
			Dim ValuePair As String() = UseFilename.Split("\")
			
			REM RaiseEvent Log(Me, "Parse_TEMPLATE UseParams=" & UseParams.Delimeted(";"))
			UseFilename = String.Format("{0}/css/{1}.{2}", ValuePair(0), ValuePair(1), Ext)
			REM If Parent IsNot Nothing
				REM RaiseEvent Log(Me, "Parse_TEMPLATE Parent=" & Parent.Variables.Delimeted(";"))
			REM End if
			
			REM UseParams.Append(Variables)
			REM Variables.Append(UseParams)
			
			REM RaiseEvent Log(Me, "Parse_TEMPLATE Variables=" & Variables.Delimeted(";"))
			
			RaiseEvent IncludeFile(Me, UseFilename, UseParams.Delimeted(";"))
		End Sub
		
		Public Sub Parse_CONST
			Dim UseParams As New EasyStringDictionary(Variables.Delimeted(";"))
			REM UseParams.Append(Variables)
			REM RaiseEvent Log(Me, "Parse_CONST Variables=" & Variables.Delimeted(";"))
			
			Read(False, UseParams)
			Do While Not HasToken("##endconst")
				AddVariable(UseParams)
				REM Dim Values() = S.Split("=")
				REM If Values.Length = 2
					REM AddVariable(UseParams, Values(0).Trim, Values(1).Trim)
				REM End if
				
				Read(False, UseParams)
			Loop
			
			UseParams.Append(Variables)
			Variables.Append(UseParams)
			
			REM RaiseEvent Log(Me, "Parse_CONST UseParams=" & UseParams.Delimeted(";"))
			REM RaiseEvent Log(Me, "Parse_CONST Variables=" & Variables.Delimeted(";"))
			If Not HasToken("##endconst")
				Append
			End if                                        
		End Sub
		
		Public Sub Read(ByVal Optional Root As Boolean = True, ByVal Optional UseParams As EasyStringDictionary = Nothing)
			S = oRead.ReadLine().Trim
			
			If S.Length > 2
				If Not IsComment()
					If HasToken("##const")
						Parse_CONST
					Else If HasToken("##usefile", False)
						Parse_USEFILE
					Else If HasToken("##template") rem for backward compatibility, replaced by ##usefile
						Parse_TEMPLATE("##endtemplate", "css")
					Else If HasToken("##includetemplate") rem for backward compatibility, replaced by ##usefile
						Parse_TEMPLATE("##endinclude", "csst")
					Else If HasToken("##if", False)
						Parse_IF(UseParams)
					Else If HasToken("##version", False) or HasToken("##browser", False) rem for backward compatibility, replaced by ##usefile
						Dim ValuePair As String() = S.Split("=")
						S = String.Format("##if({0}={1})", ValuePair(0).Replace("##","@"), ValuePair(1))
						Parse_IF(UseParams)
					REM Else If S = "##mobile"
						REM ProcessDirective_mobile(Css, oRead)
					Else If Root
						Append
					Else
						If Not HasToken("##endtemplate", False) and Not HasToken("##endinclude", False)
							AddVariable(UseParams)
							REM Dim ValuePair As String() = S.Split("=")
							REM If ValuePair.Length = 2
								REM AddVariable(UseParams, ValuePair(0).Trim, ValuePair(1).Trim)
							REM End if
						End if
					End if
				End if
			Else If S.Length <> 0
				Append
			End if
		End Sub
		
		Public Sub Parse
			REM RaiseEvent Log(Me, Filename)
			REM RaiseEvent Log(Me, "Begin Parse Variables=" & Variables.Delimeted(";"))

			oRead = System.IO.File.OpenText(Filename)
			Do While oRead.Peek() >= 0
				Read
			Loop
			
			REM RaiseEvent Log(Me, "After Parse Variables=" & Variables.Delimeted(";"))
			oRead.Close()
			oRead.Dispose()
		End Sub
		
		Public Function PopulateVariables As String
			Return Variables.PopulateVariables(Source)
			REM Return Source.ToString
		End Function
	End Class
	
	Public Class CssPreProcesser
		Inherits BasePreProcessor
		
		REM Public Variables As EasyStringDictionary
		Public IncludedCss As StringBuilder

		Public Sub New
			MyBase.New
			REM Variables = New EasyStringDictionary("")
			IncludedCss = New StringBuilder("")
			
			REM Variables.AsString("@version") = BrowserName & BrowserVer
			REM Variables.AsString("@ver") = BrowserVer
			REM Variables.AsString("@browser") = BrowserName
		End Sub
						
		Public Sub Log(ByVal Parser As Parser, ByVal Log As String)
			IncludedCss.AppendLine(Parser.Level &"."& ("").PadRight((Parser.Level-1)*3, " ") & Log)
		End Sub
		
		Public Sub Include(ByVal CssName As String, Optional ExtraParams As String = "", Optional Parent As Parser = Nothing)
			
			Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & CssName), "")
			Dim Ext As String = System.IO.Path.GetExtension(CssName).ToLower
			
			UpdateModifiedDate(Filename)

			Dim Parser As New Parser(Filename, ExtraParams, Parent)
			If Ext = ".css"
				Parser.Append("/* start " & CssName & " */")
				REM Parser.Append("/* start " & Filename & " */")
			End if
			
			AddHandler Parser.Log, AddressOf Log
			REM AddHandler Parser.Compare, AddressOf Compare
			REM AddHandler Parser.AddVariable, AddressOf AddVariable
			AddHandler Parser.IncludeFile, AddressOf IncludeFile
			
			Parser.Parse
			
			If Ext = ".css"
				Parser.Append("/* end " & CssName & " */")
			End if
			
			IncludedCss.AppendLine(Parser.PopulateVariables)
			REM If ExtraParams = ""
				REM IncludedCss.AppendLine(Parser.Source.ToString)
			REM Else
				REM IncludedCss.AppendLine(Parser.PopulateVariables)
			REM End if
		End Sub
		
		REM Public Sub AddVariablex(ByVal Parser As Parser, ByVal UseParams As EasyStringDictionary, ByVal Name As String, ByVal Value As String)
			REM If UseParams Is Nothing
				REM Parser.Variables.AsString(Name) = Value
			REM Else
				REM UseParams.AsString(Name) = Value
			REM End if
		REM End Sub
		
		REM Public Sub Compare(ByVal Parser As Parser, ByVal Name As String, ByVal Value As String, ByVal Negate As Boolean, ByRef Allow As Boolean)
			REM If Not Negate
				REM Allow = Parser.Variables.AsString(Name) = Value
			REM Else
				REM Allow = Parser.Variables.AsString(Name) <> Value
			REM End if
		REM End Sub
		
		Public Sub IncludeFile(ByVal Parser As Parser, ByVal CssName As String, Optional ExtraParams As String = "")
			Include(CssName, ExtraParams, Parser)
		End Sub

		Public Overrides Function GetContent() As String
			Return IncludedCss.ToString
		End Function

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
		REM Session = Context.Session
		
		Response.Clear()
		If Request.Headers("Accept-Encoding").Contains("gzip")
			Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
			Response.Headers.Remove("Content-Encoding")
			Response.AppendHeader("Content-Encoding", "gzip")
		End if

		Dim Css = New PreProcessor.CssPreProcesser
		Dim Filename As String = Request.Params("css")
		
		Response.Clear
		Response.ContentType = "text/css"
		
		Dim Ext As String = System.IO.Path.GetExtension(Filename)
		REM Response.Write("1 Filename=" & Filename & Environment.NewLine)
		REM Response.Write("2 Ext=" & Ext & Environment.NewLine)
		
		If Ext = ""
			Filename = Filename & ".csst"
		Else
			Filename = Filename.Replace(Ext, ".csst")
		End if
		REM Response.Write("3 Filename=" & Filename & Environment.NewLine)
		REM Response.Write("3 Exists=" & System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "") & Environment.NewLine)
		
		If Not System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath("/" & Filename), "")) Then
			Filename = Filename.Replace(".csst", ".css")
			REM Response.Write("4 Filename=" & Filename & Environment.NewLine)
		End if
		
		Css.Include(Filename, Request.Url.Query.Replace("?", "").Replace("&", ";"))
		
		Dim Modified As Integer = 1
		Dim ModifiedSince As DateTime
		If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
			If Request.Headers("If-Modified-Since") IsNot Nothing
				If DateTime.TryParse(Request.Headers("If-Modified-Since"), ModifiedSince)
					Modified = DateTime.Compare(Css.ModifiedDate, ModifiedSince)
				End if
			End if
		End if
		
		If Modified > 0
			If ConfigurationSettings.AppSettings("CacheCssJS").ToString = "1"
				Response.Cache.SetLastModified(Css.ModifiedDate)
			End if
			Response.Write(Css.GetContent())
		Else
			Response.StatusCode = 304
			Response.SuppressContent = True
		End if
		
		Response.End()
	End Sub
End Class

