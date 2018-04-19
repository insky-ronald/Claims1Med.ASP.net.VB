REM ***************************************************************************************************
REM Last modified on
REM 14-SEP-2014 ihms.0.0.0.1
REM 08-NOV-2014 ihms.0.0.1.6
REM 07-FEB-2015 ihms.1.0.0.3
REM ***************************************************************************************************
Imports System.IO                                                        
Imports System.Data

Public Enum LinkLocation
    LINKTOP
    LINKBOTTOM
    EMBEDTOP
    EMBEDBOTTOM
End Enum 

Public Interface IDisposableObject
End Interface

Namespace Saas
    Namespace Controls
		Public Class PreProcessor
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
			
			Public Overridable Sub IncludeFile(ByVal ScriptName As String)
			End Sub
			
			Public Overridable Function GetContent() As String
				Return ""
			End Function

			Public Function SourceFileName(ByVal Resource As String, ByVal Name As String, Optional Path As String = "") As String
				Dim Ext As String
				
				If Resource = "script" 
					Resource = "scripts"
				End if
				
				If Path = ""
					Path = "\app\" + Resource
				Else
					Path = "\" + Path + "\" + Resource
				End if
				
				If Resource = "css"
					Ext = ".csst"
				Else
					Ext = ".jst"
				End if
				
				 Return System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Name & Ext)
			End Function
			
			REM Protected Function ExistsFile(ByVal Resource As String, ByVal Name As String, Optional Path As String = "")
				REM Dim Ext As String
				
				REM If Path = ""
					REM Path = "\app\" + Resource
				REM Else
					REM Path = "\" + Path + "\" + Resource
				REM End if
				
				REM If Resource = "css"
					REM Ext = ".csst"
				REM Else
					REM Ext = ".jst"
				REM End if
				
				 REM Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Name & Ext))
			REM End Function
			
			REM Public Function FileExists(ByVal Filename As String, Optional Path As String = "") As Boolean
				REM If Path = ""
					REM Path = "\app\css"
				REM Else
					REM Path = "\" + Path + "\css"
				REM End if

				REM Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Filename))
			REM End Function
			
		End Class
		
        Namespace Scripts
            Public Class ScriptBuilder
                Inherits PreProcessor

                Public Scripts As Script

                Public Sub New()
                    MyBase.New()'Of String, Script)
                    Scripts = New Script
                End Sub
				
                Public Overrides Sub Include(ByVal File As String, Optional Params As String = "")
					Dim aParts As String() = File.Split(".")
					
					IF aParts.Length > 1
						OpenScriptLoader(aParts(1), aParts(0))
					Else
						OpenScriptLoader(aParts(0), "app")
					End if
				End Sub

				Public Overrides Function GetContent() As String
					Return Scripts.PopulateVariables()
				End Function
				
                Protected Sub OpenScriptLoader(ByVal ScriptName As String, Optional Path As String = "")
                    If Path = ""
                        Path = "\app\scripts"
                    Else
                        Path = "\" + Path + "\scripts"
                    End if

					Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".jst")

					If Not System.IO.File.Exists(Filename)
						Return
					End if

					Dim S As String
					Using oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
						Do While oRead.Peek() >= 0
							S = oRead.ReadLine().Trim
							If S.Contains("##includetemplate")
								If S.Length > 2 and S.Substring(0,2) <> "--"
									Dim TemplateName As String = S.Split("=")(1)
									Dim Parts As String() = TemplateName.Split("\")
									If Parts.Length > 1
										OpenScriptLoader(Parts(1), Parts(0))
									Else
										OpenScriptLoader(Parts(0))
									End if
								End if
							Else If S.Contains("##include")
								If S.Length > 2 and S.Substring(0,2) <> "--"
									Dim Parts As String() = S.Split("=")
									IncludeFile(Parts(1))
								End if
							End if
						Loop
						
						oRead.Close
					End Using					
				End Sub

                Public Overrides Sub IncludeFile(ByVal ScriptName As String)
					Dim Parts As String() = ScriptName.Split("\")
					Dim Path As String
					
					If Parts.Length > 1
                        Path = Parts(0)
						ScriptName = Parts(1)
                    Else
                        Path = "app"
                    End if

					Scripts.IncludeFile(ScriptName, Path)
					REM Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".js")
				End Sub
				
            End Class

            Public Class Script
                REM Public ScriptName As String
                REM Public Position As LinkLocation
                REM Public Minimize As Boolean
                REM Public URL As String
                Private S As StringBuilder
                Public Params As EasyStringDictionary
								
                Public ReadOnly Property GetScript() As String
                    Get
                        Return PopulateVariables()
'                       Return S.ToString
                    End Get
                End Property

                Sub New
                    MyBase.New
                    REM Me.ScriptName = ScriptName
                    REM Me.Position = Position
                    REM Me.Minimize = Minimize
                    REM Me.URL = URL
                    S = New StringBuilder("")
                    Params = New EasyStringDictionary("")
                End Sub

                Public Sub Append(Code As String)
                    S.AppendLine(Code)
                End Sub

                Public Sub FromScript(Code As Script)
                    S.AppendLine(Code.ToString)
                End Sub

				Public ModifiedDate As DateTime							
                Public Sub UpdateModifiedDate(Filename As String)
					Dim TimeStamp As DateTime = System.IO.File.GetLastWriteTime(Filename)
					TimeStamp = TimeStamp.AddTicks(-(TimeStamp.Ticks mod TimeSpan.TicksPerSecond))
					If DateTime.Compare(TimeStamp, ModifiedDate) > 0
						ModifiedDate = TimeStamp
					End if
				End Sub

                Public Sub IncludeFileMin(ScriptName As String, Optional Path As String = "")
                    If Path = ""
                        Path = "\app\scripts"
                    Else
                        Path = "\" + Path + "\scripts"
                    End if
										
                    Dim SB As New StringBuilder("")
					Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), ScriptName & ".js")
					If System.IO.File.Exists(FileName) Then
						UpdateModifiedDate(Filename)
						Using sr As New System.IO.StreamReader(Filename)
							SB.Append(sr.ReadToEnd())
							sr.Close()
						End Using

						Dim Minify As New Microsoft.Ajax.Utilities.Minifier()
						REM S.Append("//"+Filename)
						REM S.Append(Environment.NewLine)
						
						S.Append(Minify.MinifyJavaScript(SB.ToString))
						S.Append(Environment.NewLine)
					Else
						S.Append("//NOT FOUND: "+Filename)
						S.Append(Environment.NewLine)
					End if
                End Sub
                
                Public Sub IncludeFile(ScriptName As String, Optional Path As String = "", Optional Minimize As Boolean = False)
					IncludeFileMin(ScriptName, Path)
				End Sub

                Public Function PopulateVariables(Params As EasyStringDictionary) As String
                    Dim Result As String = S.ToString

                    For Each Var in Params.Dict
                        Result = Result.Replace("@" & Var.Key, Var.Value.ToString)
                    Next

                    Return Result
                End Function

                Public Function PopulateVariables() As String
                    Dim Result As String = S.ToString

                    For Each Var in Params.Dict
                        Result = Result.Replace("@" & Var.Key, Var.Value.ToString)
                    Next

                    Return Result
                End Function
            End Class
        End Namespace

        Namespace Css
            Public Class CssBuilder
				Inherits PreProcessor
				
                Public Params As EasyStringDictionary
                Public IncludedCss As StringBuilder

                Public Sub New
                    MyBase.New
                    Params = New EasyStringDictionary("")
                    IncludedCss = New StringBuilder("")
                End Sub
								
                Public Overrides Sub Include(ByVal File As String, Optional Params As String = "")
					Dim aParts As String() = File.Split("=") 'Just in case the format is "engine.toolbar-dbm=toolbar-crm"
					
					Dim aFile As String()
					
					If aParts.Length > 1
						aFile = aParts(0).Split(".")
						
						IF aFile.Length > 1
							IncludeTemplate(aFile(1), aParts(1), aFile(0), Params)
						Else
							IncludeTemplate(aFile(0), aParts(1), "app", Params)
						End if
					Else
						aFile = File.Split(".")
						IF aFile.Length > 1
							IncludeFile(aFile(1), aFile(0))
						Else
							IncludeFile(aFile(0), "app")
						End if
					End if
				End Sub
				
                Public Sub IncludeFile(ByVal CssName As String, Optional Path As String = "")
                    IncludedCss.AppendLine("/* Start of module [" & CssName & "], [" & BrowserName & BrowserVer & "] */")

                    If Path = ""
                        Path = "\app\css"
                    Else
                        Path = "\" + Path + "\css"
                    End if

                    Dim S As String
					Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".css")
					UpdateModifiedDate(Filename)
					
					If Not System.IO.File.Exists(Filename)
						IncludedCss.AppendLine(String.Format("/*not found: {0}*/", FileName))
						Return
					End if
					
					Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
                    Do While oRead.Peek() >= 0
                        S = oRead.ReadLine().Trim
                        If S.Length <> 0
                            If S.Length > 2
                                If S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
                                    If S = "##const"
                                        S = oRead.ReadLine().Trim
                                        Do While S <> "##endconst"
                                            Dim Values() = S.Split("=")
                                            Params.AsString(Values(0).Trim) = Values(1).Trim
                                            S = oRead.ReadLine().Trim
                                        Loop
                                        
                                        If S <> "##endconst" 
                                            IncludedCss.AppendLine(S)
                                        End if                                        
                                    Else If S = "##mobile"
										REM If S.Substring(0, 8) = "##mobile"
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"      
												If IsMobile()
													IncludedCss.AppendLine(S & Environment.NewLine)
												End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
													If Not IsMobile()
														IncludedCss.AppendLine(S & Environment.NewLine)
													End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
											
											If S <> "##endif"
												IncludedCss.AppendLine(S)
											End if                                        
										REM End if
                                    Else If S.Length >= 9
                                        If S.Substring(0, 9) = "##version"
                                            Dim Values = S.Split("=")(1).Trim
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"      
                                                If Values.Contains(BrowserName()&BrowserVer)                                 
                                                    IncludedCss.AppendLine(S & Environment.NewLine)
                                                End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
                                                    If Not Values.Contains(BrowserName()&BrowserVer)                                 
                                                        IncludedCss.AppendLine(S & Environment.NewLine)
                                                    End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
                                        Else If S.Substring(0, 9) = "##browser"
                                            Dim Values = S.Split("=")(1).Trim
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"       
                                                If Values.Contains(BrowserName())                                 
                                                    IncludedCss.AppendLine(S & Environment.NewLine)
                                                End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
                                                    If Not Values.Contains(BrowserName())                                 
                                                        IncludedCss.AppendLine(S & Environment.NewLine)
                                                    End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
                                        End if
                                        
                                        If S <> "##endif"
                                            IncludedCss.AppendLine(S)
                                        End if                                        
                                    Else
                                        IncludedCss.AppendLine(S)    
                                    End if 'If S.Length >= 12
                                End if                        
                            Else
                                IncludedCss.AppendLine(S)
                            End if
                        End if
                    Loop

                    IncludedCss.AppendLine("/* End of module " & "*/")

                    oRead.Close()
                    oRead.Dispose()
                End Sub

                Public Sub IncludeFileParams(ByVal CssName As String, Optional Path As String = "", Optional ParamStr As String = "")
                    Dim Css As New StringBuilder("")
                    Dim Params As New EasyStringDictionary(ParamStr)
 
                    Css.AppendLine("/* Start of module [" & CssName & "], [" & BrowserName & BrowserVer & "] */")

                    If Path = ""
                        Path = "\app\css"
                    Else
                        Path = "\" + Path + "\css"
                    End if

                    Dim S As String
					Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".css")
					UpdateModifiedDate(Filename)

					If Not System.IO.File.Exists(Filename)
						Css.AppendLine(String.Format("/*not found: {0}*/", FileName))
						Return
					End if

                    Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
                    Do While oRead.Peek() >= 0
                        S = oRead.ReadLine().Trim
                        If S.Length <> 0
                            If S.Length > 2
                                If S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
                                    If S = "##const"
                                        S = oRead.ReadLine().Trim
                                        Do While S <> "##endconst"
                                            Dim Values() = S.Split("=")
											If Values.Length = 2
												If Not Params.Exists(Values(0).Trim)
													Params.AsString(Values(0).Trim) = Values(1).Trim
												End if
											End if
                                            S = oRead.ReadLine().Trim
                                        Loop
                                        
                                        If S <> "##endconst" 
                                            Css.AppendLine(S)
                                        End if                                        
                                    Else If S = "##mobile"
										REM If S.Substring(0, 8) = "##mobile"
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"      
												If IsMobile()
													Css.AppendLine(S & Environment.NewLine)
												End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
													If Not IsMobile()
														Css.AppendLine(S & Environment.NewLine)
													End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
											
											If S <> "##endif"
												Css.AppendLine(S)
											End if                                        
										REM End if
										
                                    Else If S.Length >= 9
                                        If S.Substring(0, 9) = "##version"
                                            Dim Values = S.Split("=")(1).Trim
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"      
                                                If Values.Contains(BrowserName()&BrowserVer)                                 
                                                    Css.AppendLine(S & Environment.NewLine)
                                                End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
                                                    If Not Values.Contains(BrowserName()&BrowserVer)                                 
                                                        Css.AppendLine(S & Environment.NewLine)
                                                    End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
                                        Else If S.Substring(0, 9) = "##browser"
                                            Dim Values = S.Split("=")(1).Trim
                                            S = oRead.ReadLine().Trim
                                            Do While S <> "##endif" and S <> "##else"       
                                                If Values.Contains(BrowserName())                                 
                                                    Css.AppendLine(S & Environment.NewLine)
                                                End if
                                                S = oRead.ReadLine().Trim
                                            Loop
                                            
                                            If S = "##else" 
                                                S = oRead.ReadLine().Trim
                                                Do While S <> "##endif"
                                                    If Not Values.Contains(BrowserName())                                 
                                                        Css.AppendLine(S & Environment.NewLine)
                                                    End if
                                                    S = oRead.ReadLine().Trim
                                                Loop
                                            End if
                                        End if
                                        
                                        If S <> "##endif"
                                            Css.AppendLine(S)
                                        End if                                        
                                    Else
                                        Css.AppendLine(S)    
                                    End if 'If S.Length >= 12
                                End if                        
                            Else
                                Css.AppendLine(S)
                            End if
                        End if
                    Loop

                    Css.AppendLine("/* End of module " & "*/")                    
                    IncludedCss.AppendLine(Params.PopulateVariables(Css).ToString)

                    oRead.Close()
                    oRead.Dispose()
                End Sub

                Public Function FileExists(ByVal Filename As String, Optional Path As String = "") As Boolean
                    If Path = ""
                        Path = "\app\css"
                    Else
                        Path = "\" + Path + "\css"
                    End if

					Return System.IO.File.Exists(System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), Filename))
				End Function
								
				Private oReadTemplate As System.IO.StreamReader
                Public Sub GatherVariables(ByVal oRead As System.IO.StreamReader, ByVal Params As EasyStringDictionary, ByVal EndString As String)
					Dim S As String = "##template"
					Dim Allow As Boolean = True
					Dim Variable As String()
					
					REM Return
					REM S = oReadTemplate.ReadLine().Trim
					Do
						Allow = S.Length > 2
						If Allow
							Allow = S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
						End if
						
						If Allow
							If S.Length >= 9
								If S.Substring(0, 9) = "##version"
									Dim Values = S.Split("=")(1).Trim
									S = oReadTemplate.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName()&BrowserVer)                                 
											Variable = S.Split("=")
											If Variable.Length = 2
												Params.AsString(Variable(0)) = Variable(1)
											End if
										End if
										S = oReadTemplate.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oReadTemplate.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName()&BrowserVer)                                 
												Variable = S.Split("=")
												If Variable.Length = 2
													Params.AsString(Variable(0)) = Variable(1)
												End if
											End if
											S = oReadTemplate.ReadLine().Trim
										Loop
									End if
								Else If S.Substring(0, 9) = "##browser"
									Dim Values = S.Split("=")(1).Trim
									S = oReadTemplate.ReadLine().Trim
									Do While S <> "##endif" and S <> "##else"      
										If Values.Contains(BrowserName())                                 
											Variable = S.Split("=")
											If Variable.Length = 2
												Params.AsString(Variable(0)) = Variable(1)
											End if
										End if
										S = oReadTemplate.ReadLine().Trim
									Loop
									
									If S = "##else" 
										S = oReadTemplate.ReadLine().Trim
										Do While S <> "##endif"
											If Not Values.Contains(BrowserName())                                 
												Variable = S.Split("=")
												If Variable.Length = 2
													Params.AsString(Variable(0)) = Variable(1)
												End if
											End if
											S = oReadTemplate.ReadLine().Trim
									Loop
									End if
								End if																						
							End if																						
							
							If S <> "##endif"
								Variable = S.Split("=")
								If Variable.Length = 2
									Params.AsString(Variable(0)) = Variable(1)
								End if
							End if
						End if
						
						IncludedCss.AppendLine(String.Format("/* XXX: {0}*/", S))
						S = oReadTemplate.ReadLine().Trim
					Loop Until S.Contains(EndString)
				End Sub
				
                Public Sub IncludeTemplate(ByVal CssName As String, ByVal PropertyName As String, Optional Path As String = "", Optional Options As String = "")
                    Dim Css As New StringBuilder("")
                    Dim Params As New EasyStringDictionary("")
                    Dim S As String
                    Dim Valid As Boolean = False
					Dim Variable As String()
                    Params.AsString("@name") = PropertyName

                    If Path = ""
                        Path = "\app\css"
                    Else
                        Path = "\" + Path + "\css"
                    End if

					Dim Filename As String = System.IO.Path.Combine(HttpContext.Current.Server.MapPath(Path), CssName & ".csst")
					UpdateModifiedDate(Filename)

					If Not System.IO.File.Exists(Filename)
						Css.AppendLine(String.Format("/* File not found: {0} */", FileName))
						Return
					End if

                    Dim oRead As System.IO.StreamReader = System.IO.File.OpenText(Filename)
                    REM oReadTemplate = System.IO.File.OpenText(Filename)
					
                    Try
                        Do While oRead.Peek() >= 0
                            S = oRead.ReadLine().Trim
							
							If S = "##const"
								S = oRead.ReadLine().Trim
								Do While S <> "##endconst"
									Dim Values() = S.Split("=")
									Params.AsString(Values(0).Trim) = Values(1).Trim
									S = oRead.ReadLine().Trim
								Loop
								
								If S <> "##endconst" 
									IncludedCss.AppendLine(S)
								End if                                        
							Else If S = "##template"
								REM GatherVariables(oRead, Params, "##endtemplate")
                                Do
                                    Valid = S.Length > 2
                                    If Valid
                                        Valid = S.Substring(0, 2) <> "/*" and S.Substring(S.Length-2, 2) <> "*/"
                                    End if

                                    If Valid
										If S.Contains("##version")
											Dim Values = S.Split("=")(1).Trim
											S = oRead.ReadLine().Trim
											Do While S <> "##endif" and S <> "##else"      
												If Values.Contains(BrowserName()&BrowserVer)                                 
													Variable = S.Split("=")
													If Variable.Length = 2
														Params.AsString(Variable(0)) = Variable(1)
													End if
												End if
												S = oRead.ReadLine().Trim
											Loop
											
											If S = "##else" 
												S = oRead.ReadLine().Trim
												Do While S <> "##endif"
													If Not Values.Contains(BrowserName()&BrowserVer)                                 
														Variable = S.Split("=")
														If Variable.Length = 2
															Params.AsString(Variable(0)) = Variable(1)
														End if
													End if
													S = oRead.ReadLine().Trim
												Loop
											End if
										Else If S.Contains("##browser")
											Dim Values = S.Split("=")(1).Trim
											S = oRead.ReadLine().Trim
											Do While S <> "##endif" and S <> "##else"      
												If Values.Contains(BrowserName())                                 
													Variable = S.Split("=")
													If Variable.Length = 2
														Params.AsString(Variable(0)) = Variable(1)
													End if
												End if
												S = oRead.ReadLine().Trim
											Loop
											
											If S = "##else" 
												S = oRead.ReadLine().Trim
												Do While S <> "##endif"
													If Not Values.Contains(BrowserName())                                 
														Variable = S.Split("=")
														If Variable.Length = 2
															Params.AsString(Variable(0)) = Variable(1)
														End if
													End if
													S = oRead.ReadLine().Trim
												Loop
											End if
										Else If S.Contains("##include")
										End if																						
										
										If S <> "##endif"
											Variable = S.Split("=")
											If Variable.Length = 2
												Params.AsString(Variable(0)) = Variable(1)
											End if
										End if
                                    End if
                                    
                                    S = oRead.ReadLine().Trim
                                Loop Until S.Contains("##endtemplate")

                                Dim Template As String = S.Split("=")(1)

								Params.Append(Options)
                                Dim Templates As String() = Template.Split(",")
                                For Each CssTemplate In Templates
									Dim CssParts As String() = CssTemplate.Split("\")
									If CssParts.Count > 1
										IncludeFileParams(CssParts(1), CssParts(0), Params.Delimeted(";"))
									Else
										IncludeFileParams(CssTemplate, "", Params.Delimeted(";"))
									End if
                                Next
							Else If S.Contains("##includetemplate")
								Dim IncludeParams As New EasyStringDictionary("")
								S = oRead.ReadLine().Trim
								Do While Not S.Contains("##endinclude")
									If S.Length > 2 and S.Substring(0,2) <> "--"
										Dim Values() = S.Split("=")
										If Values.Length = 2
											IncludeParams.AsString(Values(0).Trim) = Values(1).Trim
										End if
									End if
									S = oRead.ReadLine().Trim
								Loop
								
								Dim IncludeParts As String() = S.Split("=")(1).Split("\")
								Include(String.Concat(IncludeParts(0), ".", IncludeParts(1), "="), IncludeParams.Delimeted(";"))
							Else If S.Contains("##include")
								Dim IncludeParts As String() = S.Split("=")(1).Split("\")
								If IncludeParts.Length > 1
									Include(String.Concat(IncludeParts(0), ".", IncludeParts(1)))
								Else
									REM Include(String.Concat("app", ".", IncludeParts(0)))
									Include(String.Concat("app", ".", "clients"))
								End if
							Else If S.Contains("##merge")
								Do
									S = oRead.ReadLine().Trim
									If Not S.Contains("##endmerge")
										IncludedCss.AppendLine(S)
									End if
								Loop Until S.Contains("##endmerge")
							End if
                        Loop
                    Catch Err As Exception
						IncludedCss.AppendLine(String.Format("/* HERE: {0}*/", S))
						IncludedCss.AppendLine(String.Format("/* ERRORX: {0}*/", Err.Message))
                    End Try
                    
                    oRead.Close()
                    oRead.Dispose()
                End Sub

                Public Function GetCss(Params As EasyStringDictionary, Optional AutoDot As Boolean = True)
                    Dim S As New StringBuilder("")

                    S.AppendLine(IncludedCss.ToString)

                    REM For Each Section in Values
                        REM Section.AppendTo(S, "", AutoDot)
                    REM Next

                    If Not Params Is Nothing
                        Return Params.PopulateVariables(S)
                    Else
                        Return S.ToString
                    End if
                End Function

                Public Function GetCss(Optional AutoDot As Boolean = True)
                    Dim S As New StringBuilder("")

                    S.AppendLine(IncludedCss.ToString)

                    REM For Each Section in Values
                        REM Section.AppendTo(S, "", AutoDot)
                    REM Next

                    If Not Params Is Nothing
                        Return Params.PopulateVariables(S)
                    Else
                        Return S.ToString
                    End if
                End Function

				Public Overrides Function GetContent() As String
                    Dim S As New StringBuilder("")

                    S.AppendLine(IncludedCss.ToString)

                    If Not Params Is Nothing
                        Return Params.PopulateVariables(S)
                    Else
                        Return S.ToString
                    End if
				End Function

            End Class

        End Namespace

    End Namespace

End Namespace

Namespace InSky
	Public Class BaseDisposableObject
		Implements IDisposable
		Implements IDisposableObject

		Protected Overridable Sub DoCleanup()
		End Sub

		Protected IsDisposed As Boolean = False
		Protected Overridable Overloads Sub Dispose(ByVal Disposing As Boolean)
			If Not Me.IsDisposed Then
				If Disposing Then
					DoCleanup()
				End If
			End If
			Me.IsDisposed = True
		End Sub

		' Do not change or add Overridable to these methods.
		' Put cleanup code in Dispose(ByVal Disposing As Boolean).
		Public Overloads Sub Dispose() Implements IDisposable.Dispose
			Dispose(True)
			GC.SuppressFinalize(Me)
		End Sub
																											
		Protected Overrides Sub Finalize()
			Dispose(False)
			MyBase.Finalize()
		End Sub
	End Class                                                    

	Namespace AppServer
		Public Class DataTable
			Inherits InSky.BaseDisposableObject                                  
																																						 
			Public Name As String                                           
			Public ApplicationName As String
			Public ServiceName As String
			Public TableName As String
			Public ParamName() As String                                  
			Public ParamValue() As Object
			Public Filter As String
			Public Data As System.Data.DataTable
			Public Connection As DataDictionary.DatabaseConnection = Nothing

			Public ReadOnly Property Rows As System.Data.DataRowCollection
				Get
					If Data is Nothing
						Return Nothing
					Else
						Return Data.Rows
					End if
				End Get
			End Property

			Public Sub New(ByVal Name As String, ByVal ApplicationName As String, ByVal ServiceName As String, ByVal TableName As String, ByVal ParamName() As String, ByVal ParamValue() As Object, ByVal Filter As String)
				Me.Name = Name
				Me.ApplicationName = ApplicationName
				Me.ServiceName = ServiceName
				Me.TableName = TableName
				Me.ParamName = ParamName
				Me.ParamValue = ParamValue
				Me.Filter = Filter
				Me.Data = Nothing

				If Me.ApplicationName <> String.Empty
					Connection = DatabaseUtils.DBConnections(Me.ApplicationName)
				Else
					Connection = DatabaseUtils.DefaultConnection()
				End if
			End Sub

			Protected Overrides Sub DoCleanup()
				If Not Data is Nothing
					Data.Dispose
					If Command IsNot Nothing
						Command.Dispose
						Command = Nothing
					End if
				End if
			End Sub

			Public Event BeforeOpen(ByVal Data As InSky.AppServer.DataTable)
			Public Event AfterOpen(ByVal Data As InSky.AppServer.DataTable, ByVal DataSet As System.Data.DataSet, ByVal Command As System.Data.SqlClient.SqlCommand)
			Public Event AfterOpenOutput(ByVal Data As InSky.AppServer.DataTable, ByVal DataSet As System.Data.DataSet, ByVal Command As System.Data.SqlClient.SqlCommand, ByVal Output As EasyStringDictionary)

			Public Function Open(Optional Reload As Boolean = False) As System.Data.DataTable
				If Reload or Data is Nothing
					RaiseEvent BeforeOpen(Me)
					OpenData()
				End if

				Return Data
			End Function

			Private Command As System.Data.SqlClient.SqlCommand
			Public Function GetParamValue(ByVal ParamName As String) As Object
				Return Command.Parameters.Item("@" & ParamName).Value
			End Function
			
			Public Sub OpenData(Optional ByVal Output As EasyStringDictionary = Nothing)
				Dim Def As DataDictionary.CommandDefinition = Connection.Commands(TableName)
				Dim SQL As String = Def.CommandText
				If Def.CommandType = CommandType.Text and Filter <> ""
					If SQL.ToLower.Contains("where")
						SQL = SQL.Replace("where", String.Format("where ({0}) and", Filter))
					Else
						SQL += " where " & Filter
					End if
				End if

				Using DBConnection As System.Data.SqlClient.SqlConnection = Connection.OpenConnection()
					Using Command = New System.Data.SqlClient.SqlCommand(SQL, DBConnection)
						Command.CommandType = Def.CommandType
						For Each Param in Def.Parameters.Values
							Dim Value As Object
							If Param.Value Is Nothing
								Value = DBNull.Value
							Else
								Value = Param.Value
							End if

							Command.Parameters.Add(CreateSqlParameter("@" & Param.Name, Param.DataType, Param.Size, Param.Direction,  Value))
						Next

						Dim I As Integer
						For I = 0 to ParamName.Length - 1
							If Command.Parameters.Contains("@" & ParamName(I))
								Dim Param As DataDictionary.DataParameter = Def.GetParameter(ParamName(I))           
								Command.Parameters.Item("@" & Param.Name).Value = ParamValue(I)
							End if
						Next

						Using DS As DataSet = New DataSet()                                             
							Using DA = New System.Data.SqlClient.SqlDataAdapter(Command)
								DA.Fill(DS, Name)
								Data = DS.Tables(Name)                                                   
							End Using
							
							If Output Is Nothing
								RaiseEvent AfterOpen(Me, DS, Command)
							Else
								RaiseEvent AfterOpenOutput(Me, DS, Command, Output)
							End if
						End Using						
					End Using
				End Using
			End Sub
			
			Public Function OpenDataSet() As System.Data.DataSet
				Dim Def As DataDictionary.CommandDefinition = Connection.Commands(TableName)
				Dim SQL As String = Def.CommandText
				If Def.CommandType = CommandType.Text and Filter <> ""
					If SQL.ToLower.Contains("where")
						SQL = SQL.Replace("where", String.Format("where ({0}) and", Filter))
					Else
						SQL += " where " & Filter
					End if
				End if

				Dim DS As DataSet
				
				Using DBConnection As System.Data.SqlClient.SqlConnection = Connection.OpenConnection()
					Using Command = New System.Data.SqlClient.SqlCommand(SQL, DBConnection)
						Command.CommandType = Def.CommandType
						For Each Param in Def.Parameters.Values
							Dim Value As Object
							If Param.Value Is Nothing
								Value = DBNull.Value
							Else
								Value = Param.Value
							End if

							Command.Parameters.Add(CreateSqlParameter("@" & Param.Name, Param.DataType, Param.Size, Param.Direction,  Value))
						Next

						Dim I As Integer
						For I = 0 to ParamName.Length - 1
							If Command.Parameters.Contains("@" & ParamName(I))
								Dim Param As DataDictionary.DataParameter = Def.GetParameter(ParamName(I))           
								Command.Parameters.Item("@" & Param.Name).Value = ParamValue(I)
							End if
						Next

						DS = New DataSet()                                             
						Using DA = New System.Data.SqlClient.SqlDataAdapter(Command)
							DA.Fill(DS, Name)
							Data = DS.Tables(Name)                                                   
						End Using
						
					End Using
				End Using
				
				Return DS
			End Function

			Public Sub Reset()
				If Data IsNot Nothing
					Data.Dispose
					Data = Nothing
				End if

				If Command IsNot Nothing
					Command.Dispose
					Command = Nothing
				End if
			End Sub

			Public Function BasicUpdate(OPtional UpdateData As System.Data.DataTable = Nothing) As String
				Dim Message As String = String.Empty
				Return Message
			End function

		End Class
		
		Public Class PageDataTable
			Inherits InSky.BaseDisposableObject                                  

			Public ResultData As System.Data.DataTable
			Private Datax As InSky.AppServer.DataTable
			
			Public PageNo As Integer
			Public RowCount As Integer
			Public PageCount As Integer
			
			Protected Overrides Sub DoCleanup()
				If Not Datax is Nothing
					Datax.Dispose
				End if
				If Not ResultData is Nothing
					ResultData.Dispose
				End if
			End Sub
			
			Public Sub New(ByVal DatasourceName As String, ByVal DataParams() As String, ByVal DataValues() As Object, ByVal Filter As String)
				Dim DataName As String() = SplitParts(DataSourceName, DatabaseUtils.DefaultConnectionName)
				
				Datax = New InSky.AppServer.DataTable("DBTemp", DataName(0), "", DataName(1), DataParams, DataValues, "")
				AddHandler Datax.AfterOpen, AddressOf AfterOpenViewData
				
				ResultData = Datax.Open(True)
			End Sub
					
			Private Sub AfterOpenViewData(ByVal Datax As InSky.AppServer.DataTable, ByVal DataSet As System.Data.DataSet, ByVal Command As System.Data.SqlClient.SqlCommand)
				PageNo = Command.Parameters.Item("@page").Value
				RowCount = Command.Parameters.Item("@row_count").Value
				PageCount = Command.Parameters.Item("@page_count").Value
			End Sub		
			
		End Class

	End Namespace

End Namespace

Public Class EasyStringDictionary
    Public Dict As New Dictionary(Of String, Object)
    Public DataTypes As New Dictionary(Of String, String)

    Public Readonly Property Count As Integer
        Get
            Return Dict.Count
        End Get
	End Property
	
    Public Property AsString(ByVal KeyName As String, ByVal Optional DefaultValue As String = "") As String
        Get
            Return _AsString(KeyName, DefaultValue)
        End Get
        Set(ByVal Value As String)
            SetValue(KeyName, Value)
        End Set
    End Property

    Public Property AsJson(ByVal KeyName As String, ByVal Optional DefaultValue As String = "") As String
        Get
            Return _AsString(KeyName, DefaultValue)
        End Get
        Set(ByVal Value As String)
			Remove(KeyName)
            DataType(KeyName, "JSON")
            SetValue(KeyName, Value)
        End Set
    End Property

    Public Property AsInteger(ByVal KeyName As String, ByVal Optional DefaultValue As Integer = -1) As Integer
        Get
            Return _AsInteger(KeyName, DefaultValue)
        End Get
        Set(ByVal Value As Integer)
			Remove(KeyName)
            DataType(KeyName, "NUMERIC")
            SetValue(KeyName, Value)
        End Set
    End Property

    Public Property AsBoolean(ByVal KeyName As String, ByVal Optional DefaultValue As Boolean = False) As Boolean
        Get
            Return _AsBoolean(KeyName, DefaultValue)
        End Get
        Set(ByVal Value As Boolean)
			Remove(KeyName)
            DataType(KeyName, "BOOLEAN")
            SetValue(KeyName, iif(Value, 1, 0))
        End Set
    End Property

    Public Sub New(ByVal DictString As String)
        MyBase.New()

        Dim Params() As String = DictString.Split(";")
        Dim PairValue() As String

        if DictString <> String.Empty
            For Each ItemPair In Params
                if ItemPair.IndexOf("=") = -1
                    Dict.Add(ItemPair, "1")
                else
                    PairValue = ItemPair.Split("=")
                    If Dict.ContainsKey(PairValue(0))
                        Dict.Item(PairValue(0)) = PairValue(1)
                    Else
                        Dict.Add(PairValue(0), PairValue(1))
                    End if
'                    Dict.Add(PairValue(0), PairValue(1))
                end if
            Next
        end if
    End Sub

    Public Function Delimeted(ByVal Optional Delimeter As String = ";", ByVal Optional Separator As String = "=") As String
        Dim S As String = ""

        For Each I in Dict
            if S = ""
                S = String.Concat(I.Key, Separator, I.Value)
            else
                S = String.Concat(S, Delimeter, I.Key, Separator, I.Value)
            end if
        Next

        Return S
    End Function

    Public Function PopulateVariables(ByVal S As StringBuilder) As String
        Dim Result As String = S.ToString

        For Each Var in Dict
            Result = Result.Replace("[" & Var.Key & "]", Var.Value.ToString)
        Next

        Return Result
    End Function

    Public Function JsonString(Optional Clean As Boolean = False, Optional Closure As Boolean = True) As String
        Dim S As String = ""

'        For Each I in Dict
'            if S = ""
'                S = String.Concat(I.Key, ":""", I.Value, """")
'            else
'                S = String.Concat(S, ",", I.Key, ":""", I.Value, """")
'            end if
'        Next

        For Each I in Dict
            if S = ""
                S = String.Concat("""", I.Key, """:", JsonString(I.Key, Clean))
'                   If Clean
'                       S += Environment.NewLine
'                   End if
            else
                    If Clean
                    S = String.Concat(S, ",", Environment.NewLine, """", I.Key, """:", JsonString(I.Key, Clean))
               Else
                    S = String.Concat(S, ",", """", I.Key, """:", JsonString(I.Key, Clean))
                    End if
            end if

'            if S = ""
'                S = String.Concat("""", I.Key, """:""", I.Value, """")
'            else
'                S = String.Concat(S, ",", """", I.Key, """:""", I.Value, """")
'            end if
        Next

		If Closure
			If Clean
				Return String.Concat("{", Environment.NewLine, S, Environment.NewLine, "}")
			Else
				Return String.Concat("{", S, "}")
			End if
		Else
			If Clean
				Return String.Concat(Environment.NewLine, S, Environment.NewLine)
			Else
				Return S
			End if
		End if
    End Function

    Public Function JsonString(Name As String, Optional Clean As Boolean = False) As String
        Dim Type = ""
        If DataTypes.ContainsKey(Name)
            Type = DataTypes.Item(Name).ToUpper
        End if

        If Type = "JSON"
            Return AsString(Name)
        Else If Type = "BOOLEAN"
            If AsBoolean(Name)
                Return "true"
            Else
                Return "false"
            End if
        Else If Type = "NUMERIC"
            Return AsString(Name)
        Else
            Return """" & AsString(Name) & """"
        End if
    End Function

    Public Function Format(S As String) As String
        For Each I in Dict
            S = S.Replace("{" & I.Key & "}", I.Value)
        Next

        Return S
    End Function

    Public Sub DataType(Name As String, Type As String)
        DataTypes.Add(Name, Type)
    End Sub

    Public Function GetKeyArray(ByVal Optional Filter As String = "", ByVal Optional RetreiveAll As Boolean = False) As String()
        Dim KeyArray As String() = {}
        Dim Index As Integer = 0
        If Filter <> ""
            Dim FilterArray() = Filter.Split(",")
            Array.Resize(KeyArray, FilterArray.Count)
            For Index = 0 to FilterArray.Count-1
                KeyArray(Index) = FilterArray(Index)
            Next
        Else if RetreiveAll
            Array.Resize(KeyArray, Dict.Count)
            For Each I in Dict
                KeyArray(Index) = I.Key
                Index += 1
            Next
        End if

        Return KeyArray
    End Function

    Public Function GetValueArray(ByVal Optional Filter As String = "", ByVal Optional RetreiveAll As Boolean = False) As String()
        Dim ValueArray As String() = {}
        Dim Index As Integer = 0
        If Filter <> ""
            Dim FilterArray() = Filter.Split(",")
            Array.Resize(ValueArray, FilterArray.Count)
            For Index = 0 to FilterArray.Count-1
                ValueArray(Index) = Item(FilterArray(Index), FilterArray(Index)).ToString
            Next
        Else if RetreiveAll
            Array.Resize(ValueArray, Dict.Count)
            For Each I in Dict
                ValueArray(Index) = I.Value
                Index += 1
            Next
        End if

        Return ValueArray
    End Function

    Public Function ContainsKey(ByVal KeyName As String) As Boolean
        Return Dict.ContainsKey(KeyName)
    End Function

    Public Function Exists(ByVal KeyName As String) As Boolean
        Return Dict.ContainsKey(KeyName)
    End Function

    Public Function Item(ByVal KeyName As String, ByVal Optional DefaultValue As Object = Nothing) As Object
        if Dict.ContainsKey(KeyName)
            Return Dict.Item(KeyName)
        else
            Return DefaultValue
        end if
    End Function

    Public Function SetValue(ByVal KeyName As String, ByVal Value As Object)
        if Dict.ContainsKey(KeyName)
            Dict.Item(KeyName) = Value
        else
            Dict.Add(KeyName, Value)
        end if
    End Function

    Public Function KeyValue(ByVal KeyName As String, ByVal Optional DefaultValue As String = "", ByVal Optional Delimeted As Boolean = True) As String
        Return KeyName &"="& AsString(KeyName, DefaultValue) & iif(Delimeted, ";", "")
    End Function

    Public Function KeyValueEx(ByVal KeyName As String, ByVal NewKeyName As String, ByVal Optional DefaultValue As String = "", ByVal Optional Delimeted As Boolean = True) As String
        Return NewKeyName &"="& AsString(KeyName, DefaultValue) & iif(Delimeted, ";", "")
    End Function

    Private Function _AsString(ByVal KeyName As String, ByVal Optional DefaultValue As String = "") As String
        Return Item(KeyName, DefaultValue).ToString
    End Function

    Private Function _AsInteger(ByVal KeyName As String, ByVal Optional DefaultValue As Integer = -1) As Integer
        Return CType(Item(KeyName, DefaultValue), Integer)
    End Function

    Private Function _AsBoolean(ByVal KeyName As String, ByVal Optional DefaultValue As Boolean = False) As Boolean
        if Exists(KeyName)
            Return Item(KeyName, "0") = "1"
        else
            Return DefaultValue
        end if
    End Function                                                                                                                                                

    Public Function AsBooleanDevX(ByVal KeyName As String, ByVal Optional DefaultValue As Integer = False) As Integer
        if Exists(KeyName)
            Return iif(Item(KeyName, "1") = "1", 0, 1)
        else
            Return DefaultValue
        end if                                                     
    End Function

    Public Sub Clear
        Dict.Clear
        DataTypes.Clear
    End Sub

    Public Sub Remove(ByVal KeyName As String)
        Dict.Remove(KeyName)
        DataTypes.Remove(KeyName)
    End Sub
    
    Public Sub Append(ByVal DictString As String, ByVal Optional Clear As Boolean = False)
        Dim Params() As String = DictString.Split(";")
        Dim PairValue() As String

        If Clear
            Dict.Clear
        End if

        if DictString <> String.Empty
            For Each ItemPair In Params
                if ItemPair.IndexOf("=") = -1
                    Dict.Add(ItemPair, "1")
                else
                    PairValue = ItemPair.Split("=")
                    if Dict.ContainsKey(PairValue(0))
                        Dict.Item(PairValue(0)) = PairValue(1)
                    Else
                        Dict.Add(PairValue(0), PairValue(1))
                    End if
                end if
            Next
        end if
    End Sub

    Public Sub Append(ByVal DictString As EasyStringDictionary)
		Append(DictString.Delimeted(";"))
        REM Dim Params() As String = DictString.Delimeted(";").Split(";")
        REM Dim PairValue() As String

        REM For Each ItemPair In Params
            REM PairValue = ItemPair.Split("=")
            REM if Dict.ContainsKey(PairValue(0))
                REM Dict.Item(PairValue(0)) = PairValue(1)
            REM Else
                REM Dict.Add(PairValue(0), PairValue(1))
            REM End if
        REM Next
    End Sub

    Public Sub Assign(ByVal DictString As EasyStringDictionary)
        Dim Params() As String = DictString.Delimeted(";").Split(";")
        Dim PairValue() As String

        Dict.Clear

        For Each ItemPair In Params
            if ItemPair.IndexOf("=") = -1
                Dict.Add(ItemPair, "1")
            else
                PairValue = ItemPair.Split("=")
                if Dict.ContainsKey(PairValue(0))
                    Dict.Item(PairValue(0)) = PairValue(1)
                Else
                    Dict.Add(PairValue(0), PairValue(1))
                End if
            end if
        Next
    End Sub

'    Public Function AsBooleanDevX(ByVal KeyName As String, ByVal Optional DefaultValue As Boolean = False) As Integer
'        if Exists(KeyName)
'            Return iif(Item(KeyName, "1") = "1", 0, 1)
'        else
'            if DefaultValue
'                Return 0
'            else
'                Return 1
'            end if
'        end if
'    End Function

End Class

Public Class EasyTable
    Inherits Table

    Private _Container As Control
    Public Property Container As Control
        Get
            Return _Container
        End Get
        Set(ByVal Value As Control)
            _Container = Value
            _Container.Controls.Add(Me)
        End Set
    End Property

'    Private _DefaultCellStyle As String = ""
'    Public Property DefaultCellStyle As String
'        Get
'            Return _DefaultCellStyle
'        End Get
'        Set(ByVal Value As String)
'            _DefaultCellStyle = Value
'        End Set
'    End Property

    Private _ColumnCount As Integer
    Public ReadOnly Property ColumnCount As Integer
        Get
            Return _ColumnCount
        End Get
    End Property

    Private _ColumnSizes As String()
    Public ReadOnly Property ColumnSizes As String()
        Get
            Return _ColumnSizes
        End Get
    End Property

    Public Sub New(ByVal Optional ColumnCount As Integer = 1, ByVal Optional Style As String = "width:100%;")
        MyBase.New()
        if ColumnCount > 0
            _ColumnCount = ColumnCount
'            Redim _ColumnSizes(ColumnCount)
'            for I = 0 to ColumnCount - 1
''              _ColumnSizes(I) = ""
'               _ColumnSizes(I) = "25px"
'            next
            _ColumnSizes = {"100%"}
        end if

        if Style <> String.Empty
            Me.Attributes.Add("style", Style)
        end if

        CellSpacing = 0
        CellPadding = 0
    End Sub

    Public Sub New(ByVal ColumnCount As Integer, ByVal ColumnSize As Integer, ByVal Optional Style As String = "width:100%;")
        MyBase.New()

        _ColumnCount = ColumnCount
        Redim _ColumnSizes(ColumnCount)
        for I = 0 to ColumnCount - 1
            _ColumnSizes(I) = ColumnSize.ToString & "px"        
        next

        if Style <> String.Empty
            Me.Attributes.Add("style", Style)
        end if

        CellSpacing = 0
        CellPadding = 0
    End Sub

    Sub New(ByVal ParentContainer As Control, ByVal Style As String, ByVal Optional IsClass As Boolean = False)
        MyBase.New()
        _ColumnCount = 1
        _ColumnSizes = {"100%"}
        if Style <> String.Empty
            if IsClass
                Me.Attributes.Add("class", Style)
            else
                Me.Attributes.Add("style", Style)
            end if
        end if

        CellSpacing = 0
        CellPadding = 0

        if not ParentContainer is Nothing
            ParentContainer.Controls.Add(Me)
        end if
    End Sub

    Public Sub New(ByVal Style As String, ByVal Optional IsClass As Boolean = False)
        MyBase.New()
        _ColumnCount = 1
        _ColumnSizes = {"100%"}
        if Style <> String.Empty
            if IsClass
                Me.Attributes.Add("class", Style)
            else
                Me.Attributes.Add("style", Style)
            end if
        end if

        CellSpacing = 0
        CellPadding = 0
    End Sub

    Public Sub New(ByVal ColumnCount As Integer, ByVal ColumnSizes() As String, ByVal Optional Style As String = "", ByVal Optional IsClass As Boolean = False)'width:100%;
        MyBase.New()
        _ColumnCount = ColumnCount
        _ColumnSizes = ColumnSizes
        if Style <> String.Empty
            if IsClass
                Me.Attributes.Add("class", Style)
            else
                Me.Attributes.Add("style", Style)
            end if
        end if

        CellSpacing = 0
        CellPadding = 0
'        Me.Attributes.Add("style", Style)
    End Sub

    Public Function NewRow(ByVal Optional Style As String = "", ByVal Optional IsClass As Boolean = False) As EasyTableRow
'    Public Function NewRow(ByVal Optional ClassStyle As String = "", ByVal Optional IsClass As Boolean = False) As EasyTableRow
        Dim TR As New EasyTableRow(Style, IsClass)
        TR.Table = Me
'        TR.Width = Unit.Percentage(100)
'        if Style <> String.Empty
'            TR.Attributes.Add("style", Style)
'        end if

        Return TR
    End Function

    Public Function NewRowEx(ByVal Optional ClassStyle As String = "", ByVal Optional IsClass As Boolean = False) As EasyTableRow
        Dim TR As New EasyTableRow(ClassStyle, IsClass)
        TR.Table = Me
'        TR.Width = Unit.Percentage(100)
'        if ClassStyle <> String.Empty
'            if IsClass
'                TR.Attributes.Add("class", ClassStyle)
'            else
'                TR.Attributes.Add("style", ClassStyle)
'            end if
'        end if

        Dim I As Integer
        For I = 0 to ColumnCount-1
            if ColumnSizes(I).ToString <> String.Empty
                TR.NewCell("width:" + ColumnSizes(I).ToString)
            else
                TR.NewCell()
            end if
'            TR.NewCell()
'            if ColumnSizes(I).ToString <> String.Empty
'                TR.Cells(I).Style.Add("width", ColumnSizes(I))
'            end if
        Next

        Return TR
    End Function

    Public Function NewRowEx(ByVal ColumnCount As Integer, ByVal ColumnSizes() As String, ByVal Optional ClassStyle As String = "", ByVal Optional IsClass As Boolean = False) As EasyTableRow
        Dim TR As New EasyTableRow(ClassStyle, IsClass)
        TR.Table = Me

        Dim I As Integer
        For I = 0 to ColumnCount-1
            if ColumnSizes(I).ToString <> String.Empty
                TR.NewCell("width:" + ColumnSizes(I).ToString)
            else
                TR.NewCell()
            end if
        Next

        Return TR
    End Function

    Public Sub AppendText(ByVal Text As String, ByVal Optional CellStyle As String = "", ByVal Optional RowStyle As String = "")
        if Text = String.Empty and CellStyle = String.Empty
            Return
        end if

        Dim TR As EasyTableRow = NewRow(RowStyle)
        Dim TC As TableCell = TR.NewCell(CellStyle)
        TC.Text = Text
    End Sub

    Public Sub AppendPagraph(ByVal Text As String, ByVal Optional FontStyle As String = "", ByVal Optional MarginBefore As Integer = 0, ByVal Optional MarginAfter As Integer = 0)
        if MarginBefore > 0
            AppendText("", String.Format("height:{0}px", MarginBefore))
        end if

        AppendText(Text, FontStyle)

        if MarginAfter > 0
            AppendText("", String.Format("height:{0}px", MarginAfter))
        end if
    End Sub

    Public Sub AppendPagraphEx(ByVal Text As String, ByVal Optional CellStyle As String = "", ByVal Optional RowStyle As String = "", ByVal Optional MarginBefore As Integer = 0, ByVal Optional MarginAfter As Integer = 0)
        if MarginBefore > 0
            AppendText("", "", String.Format("height:{0}px", MarginBefore))
        end if

        AppendText(Text, CellStyle, RowStyle)

        if MarginAfter > 0
            AppendText("", String.Format("height:{0}px", MarginAfter))
        end if
    End Sub

    Public Sub AppendCaptionValue(ByVal Caption As String, ByVal Value As String, ByVal Optional CaptionColor As String = "black", ByVal Optional ValueColor As String = "black", ByVal Optional CaptionAttrib As String = "{0}", ByVal Optional ValueAttrib As String = "{0}")
        Dim ValueHTML As String
        Dim CaptionHTML As String

        ValueColor = iif(ValueColor = "", "black", ValueColor)
        ValueAttrib = iif(ValueAttrib = "", "{0}", ValueAttrib)

        CaptionColor = iif(CaptionColor = "", "black", CaptionColor)
        CaptionAttrib = iif(CaptionAttrib = "", "{0}", CaptionAttrib)

        ValueHTML = String.Format("<font color={0}>{1}</font>", ValueColor, Value)
        ValueHTML = String.Format(ValueAttrib, ValueHTML)

        CaptionHTML = String.Format("<font color={0}>{1}</font>", CaptionColor, Caption)
        CaptionHTML = String.Format(CaptionAttrib, CaptionHTML)
'        ETB1.AppendCaptionValue("YOUR INDIVIDUAL ENDORSEMENT NUMBER IS:", DBMainData.GetValue("EndorsementNo").ToString, HiliteColor, "black", "{0}", "<b>{0}</b>")

        AppendText(CaptionHTML & " " & ValueHTML)
    End Sub

    Public Sub DisplayRow_CaptionValue(ByVal Caption As String, ByVal Value As String, ByVal Optional RowStyle As String = "", ByVal Optional CaptionStyle As String = "", ByVal Optional ValueStyle As String = "", ByVal Optional ShowColon As Boolean = True)
        Dim TR As EasyTableRow = NewRowEx(RowStyle)
        Dim Colon As String
        if ShowColon
            Colon = ": "
        else
            Colon = ""
        end if

        if CaptionStyle <> ""
            Dim S = TR.Cells(0).Attributes("style")
            TR.Cells(0).Attributes.Add("style", CaptionStyle &";"& S)
        end if

        if ValueStyle <> ""
            Dim S = TR.Cells(1).Attributes("style")
            TR.Cells(1).Attributes.Add("style", ValueStyle &";"& S)
        end if

        TR.Cells(0).Text = Caption
        TR.Cells(1).Text = Colon & Value
    End Sub

    Public Sub DisplayRowData_Pair(ByVal Caption As String, ByVal Value As String, ByVal Optional BoldValue As Boolean = True, ByVal Optional RowStyle As String = "", ByVal Optional ShowColon As Boolean = True)
        Dim TR As EasyTableRow = NewRowEx(RowStyle)
        Dim Colon As String
        if ShowColon
            Colon = ": "
        else
            Colon = ""
        end if

        TR.Cells(0).Text = "<b>" & Caption & "</b>"
        if BoldValue
            TR.Cells(1).Text = Colon & "<b>" & Value & "</b>"
        else
            TR.Cells(1).Text = Colon & Value
        end if
    End Sub

    Public Sub DisplayRowData_PairEx(ByVal Caption As String, ByVal Value As String, ByVal Optional BoldCaption As Boolean = True, ByVal Optional BoldValue As Boolean = True, ByVal Optional RowStyle As String = "")
        Dim TR As EasyTableRow = NewRowEx(RowStyle)
        if BoldCaption
            TR.Cells(0).Text = "<b>" & Caption & "</b>"
        else
            TR.Cells(0).Text = Caption
        end if

        if BoldValue
            TR.Cells(1).Text = ": <b>" & Value & "</b>"
        else
            TR.Cells(1).Text = ": " & Value
        end if
    End Sub

End Class

Public Class EasyTableRow
    Inherits TableRow

    Private _Table As EasyTable
    Public Property Table As EasyTable
        Get
            Return _Table
        End Get
        Set(ByVal Value As EasyTable)
            _Table = Value
            _Table.Rows.Add(Me)
        End Set
    End Property

    Public Sub New(ByVal Optional ClassStyle As String = "", ByVal Optional IsClass As Boolean = False)
        MyBase.New()

        if ClassStyle <> String.Empty
            if IsClass
                Me.Attributes.Add("class", ClassStyle)
            else
                Me.Attributes.Add("style", ClassStyle)
            end if
        end if

'        if Style <> String.Empty and Not IsClass
'            Me.Attributes.Add("style", Style)
'        end if
    End Sub

'    Public Function NewCell(ByVal Optional Style As String = "") As TableCell
'        Dim TC As New TableCell
'
'        Me.Cells.Add(TC)
'        if Style <> String.Empty
'            TC.Attributes.Add("style", Style)
'        end if
'
'        Return TC
'    End Function

    Public Function NewCell(ByVal Optional ClassStyle As String = "", ByVal Optional IsClass As Boolean = False) As TableCell
        Dim TC As New TableCell

        Me.Cells.Add(TC)
        if ClassStyle <> String.Empty
            if IsClass
                TC.Attributes.Add("class", ClassStyle)
            else
                TC.Attributes.Add("style", ClassStyle)
            end if
        end if

        Return TC
    End Function

    Public Function NewCell(ByVal CssClass As String, ByVal CssStyle As String) As TableCell
        Dim TC As New TableCell

        Me.Cells.Add(TC)
        TC.Attributes.Add("class", CssClass)
        TC.Attributes.Add("style", CssStyle)

        Return TC
    End Function

End Class

Public Class EasyDivControl
    Inherits HtmlGenericControl

    Public Sub New(ByVal CssClass As String, ByVal Style As String)
        MyBase.New("DIV")
        if CssClass <> ""
            Me.Attributes.Add("class", CssClass)
        end if

        if Style <> ""
            Me.Attributes.Add("style", Style)
        end if
    End Sub

    Public Sub New(ByVal ParentContainer As Control, Optional ByVal CssClass As String = "", Optional ByVal Style As String = "")
        MyBase.New("DIV")

        if CssClass <> ""
            Me.Attributes.Add("class", CssClass)
        end if

        if Style <> ""
            Me.Attributes.Add("style", Style)
        end if

        if not ParentContainer is Nothing
            ParentContainer.Controls.Add(Me)
        end if
    End Sub

End Class

Public Class EasyGenericControl
    Inherits HtmlGenericControl

    Public Sub New(ByVal ControlType As String, ByVal CssClass As String, ByVal Style As String)
        MyBase.New(ControlType)
        if CssClass <> ""
            Me.Attributes.Add("class", CssClass)
        end if

        if Style <> ""
            Me.Attributes.Add("style", Style)
        end if
    End Sub

    Public Sub New(ByVal ControlType As String, Optional ByVal ParentContainer As Control = Nothing, Optional ByVal CssClass As String = "", Optional ByVal Style As String = "")
        MyBase.New(ControlType)

        if CssClass <> ""
            Me.Attributes.Add("class", CssClass)
        end if

        if Style <> ""
            Me.Attributes.Add("style", Style)
        end if

        if not ParentContainer is Nothing
            ParentContainer.Controls.Add(Me)
        end if
    End Sub

End Class
