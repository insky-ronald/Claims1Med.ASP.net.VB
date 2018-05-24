REM ***************************************************************************************************
REM Last modified on
REM 14-SEP-2014 ihms.0.0.0.1
REM 05-OCT-2014 ihms.0.0.0.9
REM 10-OCT-2014 ihms.0.0.1.0
REM 05-JAN-2014 ihms.0.0.1.8
REM ***************************************************************************************************
Imports Microsoft.VisualBasic
Imports System
Imports System.IO
Imports Newtonsoft.Json
Imports System.IO.Compression

Imports System.Data
Imports System.Data.SqlClient
Imports System.Data.SqlTypes
Imports System.Collections
                                                  
Imports System.Collections.Specialized                  
Imports Microsoft.SqlServer.Management.Smo
Imports Microsoft.SqlServer.Management.Sdk.Sfc
Imports Microsoft.SqlServer.Management.Common

Imports PaxScript.Net

REM 05-OCT-2014 ihms.0.0.0.9: Datatable extensions
Public Module DataTableExtensions
    <System.Diagnostics.DebuggerStepThrough()> _
    <System.Runtime.CompilerServices.Extension()> _
	Public Function Eval(DBData As DataTable, Expression As String) As String
		Dim Columns As New List(Of String)
		For Each Column in DBData.Columns
			Columns.Add(Column.ColumnName)
		Next

		Columns.Sort(Function(x, y) String.Compare(y, x))
		For Each ColumnName in Columns
			Expression = Expression.Replace("@" & ColumnName, DBData.Rows(0).Item(ColumnName).ToString)
		Next

		Return Expression
	End Function

    <System.Diagnostics.DebuggerStepThrough()> _
    <System.Runtime.CompilerServices.Extension()> _
	Public Function AsJson(DBData As DataTable) As String
		Return DatatableToJson(DBData)
	End Function
    REM Public Function LastValue(Of T)(ByVal dt As System.Data.DataTable, ByVal ColumnName As String) As T
        REM Return dt.Rows.Item(dt.RowCount).Field(Of T)(dt.Columns(ColumnName))
    REM End Function
    REM <System.Diagnostics.DebuggerStepThrough()> _
    REM <System.Runtime.CompilerServices.Extension()> _
    REM Public Function LastValue(Of T)(ByVal dt As DataTable, ByVal ColumnIndex As Integer) As T
        REM Return dt.Rows.Item(dt.RowCount).Field(Of T)(dt.Columns(ColumnIndex))
    REM End Function
    REM <System.Diagnostics.DebuggerStepThrough()> _
    REM <System.Runtime.CompilerServices.Extension()> _
    REM Public Function RowCount(ByVal dt As DataTable) As Integer
        REM Return dt.Rows.Count - 1
    REM End Function
End Module

Public Module DatabaseUtils

	Public DBScript As PaxScript.Net.PaxScripter = Nothing
	Public DBConnections As DataDictionary.DatabaseConnections = Nothing
	Public DBConnection As DataDictionary.DatabaseConnection = Nothing
 
	Public Function Domain As String
		Return HttpContext.Current.Request.ServerVariables("HTTP_HOST").ToLower
	End Function
	
	Public Function DefaultConnection As DataDictionary.DatabaseConnection
		Return DBConnections(DefaultConnectionName())
	End Function

	Private _DefaultConnectionName As String = String.Empty
	Public Function DefaultConnectionName As String
		If _DefaultConnectionName = String.Empty
			_DefaultConnectionName = AppUtils.Databases.AsString("DefaultConnection")
		End if
		
		Return _DefaultConnectionName
		REM Return ConfigurationSettings.AppSettings("default-connection:" & Domain)
		REM Return ConfigurationSettings.AppSettings("DefaultConnection")
	End Function

	Public Sub LoadSourceCode(ByVal Scripter As PaxScript.Net.PaxScripter, ByVal Index As Integer, ByVal ConnectionName As String)
		Dim CodeFile As String = AppUtils.Databases.AsString(ConnectionName + "CodeFile")
		Scripter.AddCodeFromFile(Index, AppUtils.Databases.AsString(CodeFile))
		If AppUtils.Databases.Exists(CodeFile & "2")
			Dim DataSourcesFolder As String = AppUtils.Databases.AsString(CodeFile & "2")
			If Directory.Exists(DataSourcesFolder)
				Dim TargetFolderInfo As DirectoryInfo = New DirectoryInfo(DataSourcesFolder)
				For Each DataSourceFile In TargetFolderInfo.GetFiles("*.db.vb") 
					Scripter.AddCodeFromFile(Index, DataSourceFile.FullName)
				Next DataSourceFile
			End if
		End if
	End Sub
	
	Public Sub LoadSourceCode2(Scripter As PaxScript.Net.PaxScripter, ByVal Index As Integer, ByVal ConnectionName As String)
		Dim SourceCode As New StringBuilder("")
		
		Dim CodeFile As String = AppUtils.Databases.AsString(ConnectionName + "CodeFile")
		Using SourceCodeStream As New System.IO.StreamReader(AppUtils.Databases.AsString(CodeFile))
			SourceCode.Append(SourceCodeStream.ReadToEnd())
			SourceCodeStream.Close()
		End Using
		
		If AppUtils.Databases.Exists(CodeFile & "2")
			Dim DataSourcesFolder As String = AppUtils.Databases.AsString(CodeFile & "2")
			If Directory.Exists(DataSourcesFolder)
				Dim TargetFolderInfo As DirectoryInfo = New DirectoryInfo(DataSourcesFolder)
				For Each DataSourceFile In TargetFolderInfo.GetFiles("*.db.vb")
					Using SourceCodeStream As New System.IO.StreamReader(DataSourceFile.FullName)
						SourceCode.Append(SourceCodeStream.ReadToEnd())
						SourceCode.AppendLine
						SourceCodeStream.Close()
					End Using
				Next DataSourceFile
			End if
		End if
		
		Scripter.AddModule(Index, "VB")
		Scripter.AddCode(Index, SourceCode.ToString)		
	End Sub
	
	Public Function InitializeConnection(ByVal ConnectionName As String, Optional Page As System.Web.UI.Page = Nothing) As String
		Dim Output As New EasyStringDictionary("")
		Output.AsString("message") = ""
		
		Dim Connection As DataDictionary.DatabaseConnection = DBConnections(ConnectionName)
		If Connection IsNot Nothing
			Connection.Clear

			Dim Scripter As New PaxScript.Net.PaxScripter

			Scripter.Reset()
			Scripter.RegisterType(GetType(DataDictionary.DatabaseConnections))
			Scripter.RegisterType(GetType(DataDictionary.DatabaseConnection))
			Scripter.RegisterInstance("DBConnections", DBConnections)
			Scripter.RegisterInstance("DBConnection", Connection)

			LoadSourceCode2(Scripter, 0, Connection.Name)
			
			Dim CodeFile As String = AppUtils.Databases.AsString(Connection.Name + "CodeFile")
			Output.AsString("connection_name") = Connection.Name
			Output.AsString("code_file") = AppUtils.Databases.AsString(CodeFile)

			Scripter.Run(RunMode.Run)
			
			If Scripter.HasErrors Then
				For e As Integer = 0 To Scripter.Error_List.Count - 1
					Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
					Output.AsString("error_line_" & (e+1)) = s
					REM If Page IsNot Nothing
						REM Page.Response.Write(s + Environment.NewLine)
					REM End if
				Next
			End If

			Scripter.Dispose
		End if
		
		Return Output.Delimeted(";")
	End Function

	Public Function InitializeConnection(Optional Page As System.Web.UI.Page = Nothing) As String
		Dim ConnectionNames = AppUtils.Databases.AsString("DatabaseConnections").Split(",")
		Dim Output As New EasyStringDictionary("")
		Output.AsString("message") = ""
		Output.AsString("connection_names") = ""
		Output.AsString("code_files") = ""

		If DBConnections is Nothing
			DBConnections = New DataDictionary.DatabaseConnections
			For Each ConnectionName In ConnectionNames
				Dim ConnectionStringName = AppUtils.Databases.AsString(ConnectionName)
				Dim ConnectionString = AppUtils.Databases.AsString(ConnectionStringName)

				DBConnections.NewConnection(ConnectionName, ConnectionString)
			Next 
		Else
				DBConnections.Clear
		End if
	
		Dim Index As Integer = 1
		For Each C in DBConnections.Values
			Dim CodeFile As String = AppUtils.Databases.AsString(C.Name + "CodeFile")
			Dim Scripter As New PaxScript.Net.PaxScripter

			Scripter.Reset()
			Scripter.RegisterType(GetType(DataDictionary.DatabaseConnections))
			Scripter.RegisterType(GetType(DataDictionary.DatabaseConnection))
			Scripter.RegisterInstance("DBConnections", DBConnections)
			Scripter.RegisterInstance("DBConnection", C)

			LoadSourceCode2(Scripter, Index, C.Name)
			' Scripter.AddModule(Index, "VB")			
			' LoadSourceCode(Scripter, Index, C.Name)
			
			If Index = 1
				Output.AsString("connection_names") = C.Name
				Output.AsString("code_files") = CodeFile
			Else
				Output.AsString("connection_names") = Output.AsString("connection_names") &","& C.Name
				Output.AsString("code_files") = Output.AsString("code_files") &","& CodeFile
			End if
			
			Scripter.Run(RunMode.Run)
			REM If Scripter.HasErrors Then
			REM For e As Integer = 0 To Scripter.Error_List.Count - 1
				REM Dim s As String = Scripter.Error_List(e).Message & " - " & Scripter.Error_List(e).LineNumber()
				REM If Page IsNot Nothing
					REM Page.Response.Write(s + Environment.NewLine)
				REM End if
			REM Next 
			REM End If 
  
			Index += 1
			Scripter.Dispose 
		Next  
		
		Return Output.Delimeted(";")
	End Function

	Public Function CreateSqlParameter(parameterName As String, DbType As SqlDbType, Optional Size As Integer = 0, Optional Direction As ParameterDirection = ParameterDirection.Input, Optional Value As Object = Nothing) As SqlParameter
		Dim Parameter As New SqlParameter()
		Parameter.ParameterName = parameterName
		Parameter.SqlDbType = DbType
		Parameter.Direction = Direction
		Parameter.Size = Size
		If Value Is Nothing
			Parameter.Value = DBNull.Value
		Else
			Parameter.Value = Value     
		End if

		Return Parameter
	End Function

	Public Function NewVisitor() As Integer
		Dim VisitorID As Integer
		Using Command = DefaultConnection().PrepareCommand("AddVisit")
			Dim Referer As String = ""
			
			With HttpContext.Current
				If .Request.UrlReferrer IsNot Nothing
					If .Request.UrlReferrer.Segments.Count > 1
						REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1)
						REM Referer = Request.UrlReferrer.Segments(0) & Request.UrlReferrer.Segments(1) & Request.UrlReferrer.Segments(2)
						Referer = String.Join("", .Request.UrlReferrer.Segments)
						If .Request.UrlReferrer.Query.Count > 1
							Referer = String.Concat(Referer, "?", HttpUtility.ParseQueryString(.Request.UrlReferrer.Query))
						End if
					End if
				End if
			End With
			
			With Command
				.SetParameter("application_id", AppUtils.Settings.AsInteger("ApplicationID"))
				.SetParameter("session_id", HttpContext.Current.Session.SessionID.ToUpper)
				.SetParameter("method", HttpContext.Current.Request.ServerVariables("REQUEST_METHOD"))
				.SetParameter("local_ip", HttpContext.Current.Request.ServerVariables("LOCAL_ADDR"))
				.SetParameter("remote_ip", HttpContext.Current.Request.ServerVariables("REMOTE_ADDR"))
				.SetParameter("remote_host", HttpContext.Current.Request.ServerVariables("REMOTE_HOST"))
				.SetParameter("user_agent", HttpContext.Current.Request.ServerVariables("HTTP_USER_AGENT"))
				.SetParameter("request_url", HttpContext.Current.Request.ServerVariables("URL"))
				.SetParameter("referrer_url", Referer)
				REM If HttpContext.Current.Request.ServerVariables("HTTP_REFERER") IsNot Nothing
					REM .SetParameter("referrer_url", "")
				REM Else
					REM .SetParameter("referrer_url", HttpContext.Current.Request.ServerVariables("HTTP_REFERER"))
				REM End if

				.Execute()

				VisitorID = .GetParameter("visit_id").Value
				REM If VisitorID > 0
					REM HttpContext.Current.Session("VisitorID") = VisitorID
					REM HttpContext.Current.Session("ApplicationID") = AppUtils.Settings.AsInteger("ApplicationID")
				REM End if
			End with
		End Using

		Return VisitorID
	End Function

	Public Function Login(Username As String, Password As String) As Integer
		Dim UserID As Integer
		Using Command = DefaultConnection().PrepareCommand("Login")
			With Command
				.SetParameter("visit_id", HttpContext.Current.Session("VisitorID"))
				.SetParameter("application_id", AppUtils.Settings.AsInteger("ApplicationID"))
				.SetParameter("user_name", Username)
				.SetParameter("password", Password)

				.Execute()

				UserID = .GetParameter("user_id").Value
			End With
		End Using

		Return UserID
	End Function

	Public Sub GetActionPermission(ActionCode As String, Permission As EasyStringDictionary)
		Using Command = DefaultConnection().PrepareCommand("GetMyPermission")
			With Command
				.SetParameter("action_code", ActionCode)
				.SetParameter("visit_id", HttpContext.Current.Session("VisitorID"))

				Using Data As DataTable = .OpenData()
					If Data.Rows.Count > 0 
						Permission.AsString("action") = ActionCode
						For Each Row in Data.Rows
							Permission.AsBoolean(Row.Item("code")) = Row.Item("value")
						Next
					End if
				End Using
			End With
		End Using
	End Sub

	Public Function GetActionPermission(ActionCode As String) As EasyStringDictionary
		Dim Permission As New EasyStringDictionary("")
		
		Using Command = DefaultConnection().PrepareCommand("GetMyPermission")
			With Command
				.SetParameter("action_code", ActionCode)
				.SetParameter("visit_id", HttpContext.Current.Session("VisitorID"))

				Using Data As DataTable = .OpenData()
					If Data.Rows.Count > 0 
						For Each Row in Data.Rows
							Permission.AsBoolean(Row.Item("code")) = Row.Item("value")
						Next
					End if
				End Using
			End With
		End Using
		
		Return Permission
	End Function
	
	Public Function AllowAction(Action As String) As Boolean
		Using Command = DefaultConnection().PrepareCommand("GetAllowAction")
			With Command
				.SetParameter("action_code", Action)
				.SetParameter("visit_id", HttpContext.Current.Session("VisitorID"))
				.Execute
				
				Return .GetParameter("allow").Value
			End With
		End Using
	End Function
	
	Public Function GetRoles() As String
		Dim Roles As String = ""
		Using Command = DefaultConnection().PrepareCommand("GetRoles")
			With Command
				.SetParameter("visit_id", HttpContext.Current.Session("VisitorID"))
				.SetParameter("error_log_id", 0)
				.SetParameter("verbose", 1)

				Using Data As DataTable = .OpenData()
					If Data.Rows.Count > 0 
						If Not Data.Columns.Contains("error")
							For Each Row in Data.Rows
								If Roles = ""
									Roles = Row.Item("id")
								Else
									Roles += "," & Row.Item("id")
								End if
							Next
						End if
					End if
				End Using
			End With
		End Using
																																									
		Return Roles
	End Function

	Public Function GetUserRoles() As String
		Dim Roles As String = ""
		Using Command = DefaultConnection().PrepareCommand("GetUserRoles")
			With Command
				.SetParameter("user_id", HttpContext.Current.Session("UserNo"))
				.SetParameter("error_log_id", 0)
				.SetParameter("verbose", 1)

				Using Data As DataTable = .OpenData()
					If Data.Rows.Count > 0
						If Not Data.Columns.Contains("error")
							For Each Row in Data.Rows
								If Roles = ""
									Roles = Row.Item("id")
								Else
									Roles += "," & Row.Item("id")
								End if
							Next
						End if
					End if
				End Using
			End With
		End Using
																																									
		Return Roles
	End Function

	Public Function GetError(ErrorID As Integer, Optional ConnectionName As String = "") As String
		REM Using DBError = DefaultConnection().OpenData("GetErrorLog", {"error_log_id"}, {ErrorID})
		Using DBError = DBConnections(ConnectionName).OpenData("GetErrorLog", {"error_log_id"}, {ErrorID})
			If DBError.Rows.Count > 0
				If DBError.Rows(0).Item("error").ToString = String.Empty
					Return String.Format("Unknown error {0}", DBError.Rows(0).Item("error_id"))
				Else
					Return DBError.Rows(0).Item("error")
				End if
			Else
					Return String.Format("Unknown error {0}", ErrorID)
			End if
		End Using
	End Function

	Public Sub Logout()
		HttpContext.Current.Session.Abandon
	End Sub

	Public Function GetData(Source As String, Optional Params As String = "", Optional Values As String = "", Optional Filter As String = "") As System.Data.DataTable
		Dim DataName As String() = SplitParts(Source, DefaultConnectionName)
		Dim DataParams As String() = {}
		Dim ParamValues As String() = {}
		
		If Params <> ""
			DataParams = Params.Split(",")
		End if
		
		If Values <> ""
			ParamValues = Values.Split(",")
		End if
				
		Try
			Return DBConnections(DataName(0)).OpenData(DataName(1), DataParams, ParamValues, "")
		Catch Err As Exception
			Return Nothing
		End Try
	End Function

	Public Function GetJsonData(Source As String, Optional Params As String = "", Optional Values As String = "", Optional Filter As String = "") As String 'Returns Json data
		Return DataTableToJson(GetData(Source, Params, Values, Filter))
	End Function
		
	Public Sub UpdateMultiRecords(ByVal UpdateDataSourceName As String, ByVal UpdateEncodedFields As String, ByVal UpdateResultFields As String, ByVal UpdateData As String, ByVal EditMode As String, ByVal VisitorID As Integer, ByVal Output As EasyStringDictionary)
		Using DBRecord As DataTable = JsonToDatatable(UpdateData)
			Dim DataName As String() = SplitParts(UpdateDataSourceName, DatabaseUtils.DefaultConnectionName)
			Using Command = DBConnections(DataName(0)).PrepareCommand(DataName(1))
				Dim RecNo As Integer = 0
				
				For Each Row In DBRecord.Rows
					With Command
						If .HasParameter("visit_id")
							.SetParameter("visit_id", VisitorID)
						End if
						
						If .HasParameter("action")
							If EditMode = "delete"
								.SetParameter("action", 0) 'delete
							Else If EditMode = "edit"
								.SetParameter("action", 10) 'update
							Else If EditMode = "new"
								.SetParameter("action", 20) 'insert
							End if
						End if
						
						.SetParameters(DBRecord, RecNo)
						If UpdateEncodedFields <> String.Empty
							Dim EncodedFields As String() = UpdateEncodedFields.Split(",")
							For Each Field in EncodedFields
								Dim BaseEncoded As String = DBRecord.Rows(RecNo).Item(Field)
								Dim Encoded As String = BaseEncoded.Replace("%7B", "%7B%7B").Replace("%7D", "%7D%7D")
								Dim Decoded As String = HttpUtility.UrlDecode(Encoded)
								
								.SetParameter(Field, Decoded)
							Next
						End if
						
						Output.AsString("Message") = .Execute()
						
						If Output.AsString("Message") = String.Empty
							Dim Result As New EasyStringDictionary("")
							If .HasParameter("action_status_id")
								Output.AsInteger("Status") = .GetParameter("action_status_id").Value
							Else
								Output.AsInteger("Status") = 0
							End if
							
							If .HasParameter("action_msg")
								Output.AsString("Message") = .GetParameter("action_msg").Value
							End if
							
							If UpdateResultFields <> String.Empty
								Dim ResultFields As String() = UpdateResultFields.Replace(Chr(10),",").Split(",")
								For Each Field in ResultFields
									If Field.Contains("=")
										Dim Fields As String() = Field.Split("=")
										Result.DataType(Fields(0), Fields(1).ToUpper)
										Result.AsString(Fields(0)) = .GetParameter(Fields(0)).Value
									Else
										Result.AsString(Field) = .GetParameter(Field).Value
									End if
								Next
							End if
							
							Output.AsJson("Result") = Result.JsonString()
						Else
							Output.AsString("Status") = -3
						End if
						
					End with
					
					RecNo = RecNo + 1
				Next
			End Using
		End Using
	End Sub

End Module

Namespace ServerUpdate
	Public Class UpdateDataRecord	
		Private DataSourceName As String		
		Private EncodedFields As String		
		Private ResultFields As String		
		Private VisitorID As String		
		
		Public Event AfterUpdate(DBRecord As DataTable, Mode As String, Output As EasyStringDictionary, Result As EasyStringDictionary)
		
		Sub New(ByVal DataSourceName As String, ByVal EncodedFields As String, ByVal ResultFields As String, ByVal VisitorID As Integer)
			MyBase.New()
			Me.DataSourceName = DataSourceName
			Me.EncodedFields = EncodedFields
			Me.ResultFields = ResultFields
			Me.VisitorID = VisitorID
		End Sub
		
		Sub Update(ByVal UpdateData As String, ByVal EditMode As String, ByVal Output As EasyStringDictionary)
			Using DBRecord As DataTable = JsonToDatatable(UpdateData)
				Dim DataName As String() = SplitParts(DataSourceName, DatabaseUtils.DefaultConnectionName)
				Using Command = DBConnections(DataName(0)).PrepareCommand(DataName(1))
					
					With Command
						If .HasParameter("visit_id")
							.SetParameter("visit_id", VisitorID)
						End if
						
						If .HasParameter("action")
							If EditMode = "delete"
								.SetParameter("action", 0) 'delete
							Else If EditMode = "edit"
								.SetParameter("action", 10) 'update
							Else If EditMode = "new"
								.SetParameter("action", 20) 'insert
							End if
						End if
						
						.SetParameters(DBRecord)
						If EncodedFields <> String.Empty
							Dim EncodedFieldsArray As String() = EncodedFields.Split(",")
							For Each Field in EncodedFieldsArray
								Dim BaseEncoded As String = DBRecord.Rows(0).Item(Field)
								Dim Encoded As String = BaseEncoded.Replace("%7B", "%7B%7B").Replace("%7D", "%7D%7D")
								Dim Decoded As String = HttpUtility.UrlDecode(Encoded)
								
								.SetParameter(Field, Decoded)
							Next
						End if
						
						Output.AsString("message") = .Execute()
						Output.AsString("mode") = EditMode
						
						If Output.AsString("message") = String.Empty
							Dim Result As New EasyStringDictionary("")
							If .HasParameter("action_status_id")
								Output.AsInteger("status") = .GetParameter("action_status_id").Value
							Else
								Output.AsInteger("status") = 0
							End if
							
							If .HasParameter("action_msg")
								Output.AsString("message") = .GetParameter("action_msg").Value
							End if
							
							If ResultFields <> String.Empty
								Dim ResultFieldsArray As String() = ResultFields.Replace(Chr(10),",").Split(",")
								For Each Field in ResultFieldsArray
									If Field.Contains("=")
										Dim Fields As String() = Field.Split("=")
										Result.DataType(Fields(0), Fields(1).ToUpper)
										Result.AsString(Fields(0)) = .GetParameter(Fields(0)).Value
										' If DBRecord.Columns.Contains(Fields(0))
											' DBRecord.Rows(0).Item(Fields(0)) = .GetParameter(Fields(0)).Value
										' End if
									Else
										Result.AsString(Field) = .GetParameter(Field).Value
										If DBRecord.Columns.Contains(Field)
											DBRecord.Rows(0).Item(Field) = .GetParameter(Field).Value
										End if
									End if
									
								Next
							End if
							
							Output.AsJson("result") = Result.JsonString()
							
							RaiseEvent AfterUpdate(DBRecord, EditMode, Output, Result)
						Else
							Output.AsString("status") = -3
							
							RaiseEvent AfterUpdate(DBRecord, EditMode, Output, Nothing)
						End if
					End with
				End Using
			End Using
		End Sub
	End Class
End Namespace

Namespace DataDictionary
	Public Class DataParameter
		Public Name As String
		Public DataType As SqlDbType
		Public Direction As ParameterDirection
		Public Size As Integer
		Public Value As Object

		Public Sub New(Name As String, DataType As SqlDbType, Direction As ParameterDirection, Size As Integer, Value As Object)
			Me.Name = Name
			Me.DataType = DataType
			Me.Direction = Direction
			Me.Size = Size
			Me.Value = Value
		End Sub
	End Class

	Public Class DatabaseConnections
		Inherits Dictionary(Of String, DatabaseConnection)

		Public ReadOnly Default Property Connections(ByVal Name As String) As DatabaseConnection
			Get
				If ContainsKey(Name)
					Return Item(Name)
				Else
					Return Nothing
				End if
			End Get
		End Property

		Public Function NewConnection(ByVal Name As String, ConnectionString As String) As DatabaseConnection
			Dim Connection As New DatabaseConnection(Name, ConnectionString)
			Add(Name, Connection)
			Return Connection
		End Function

		Public Sub Clear()
			For Each C in Values
				C.Clear
			Next
		End Sub

	End Class

	Public Class DatabaseConnection
		Inherits InSky.BaseDisposableObject

		Protected Overrides Sub DoCleanup()
				Clear()
		End Sub

		Public Name As String
		Private ConnectionString As String
		Private CommandCollection As New Dictionary(Of String, CommandDefinition)
		Public ReadOnly Property Commands(ByVal Name As String) As CommandDefinition
			Get
				If CommandCollection.ContainsKey(Name)
					Return CommandCollection.Item(Name)
				Else
					Return Nothing
				End if
			End Get
		End Property

		Public Sub New(Name As String, ConnectionString As String)
			Me.Name = Name
			Me.ConnectionString = ConnectionString
		End Sub

		Public Sub Clear()
			For Each C in CommandCollection.Values
				C.Dispose
			Next

			CommandCollection.Clear
		End Sub

		Public Function OpenConnection() As SqlConnection
			Dim Connection As New SqlConnection(ConnectionString)
			REM Connection.ConnectionTimeout = 120
			Connection.Open()
			Return Connection
		End Function

		Public Function NewCommand(Name As String, CommandText As String, Optional CommandType As System.Data.CommandType = System.Data.CommandType.Text) As CommandDefinition
			Dim Command As New CommandDefinition(Name, CommandType, Me)
			Command.CommandText = CommandText
			CommandCollection.Add(Name, Command)

			Return Command
		End Function
																																			
		Public Function RegisterCommand(Name As String, CommandText As String, Optional CommandType As System.Data.CommandType = System.Data.CommandType.Text) As CommandDefinition
			Dim Command As CommandDefinition                                  
			If Not CommandCollection.ContainsKey(Name)
				Command = New CommandDefinition(Name, CommandType, Me)        
				Command.CommandText = CommandText
				CommandCollection.Add(Name, Command)                                
			End if

			Return Command
		End Function

		Public Function CommandExists(Name As String) As Boolean
			Return CommandCollection.ContainsKey(Name)
		End Function

		Public Sub RemoveCommand(Name As String)
			CommandCollection.Remove(Name)
			REM Return CommandCollection.ContainsKey(Name)
		End Sub

		Public Function OpenData(ByVal Name As String, ByVal ParamName() As String, ByVal ParamValue() As Object, Optional ByVal Filter As String = "") As DataTable
			Dim Data As DataTable
			Using Connection As SqlConnection = OpenConnection()
				Dim Def As CommandDefinition = Commands(Name)
				Dim SQL As String = Def.CommandText
				If Def.CommandType = CommandType.Text and Filter <> ""
					If SQL.ToLower.Contains("where")
						SQL = SQL.Replace("where", String.Format("where ({0}) and", Filter))
					Else
						SQL += " where " & Filter
					End if
				End if

				Using Command As SqlCommand = New SqlCommand(SQL, Connection)
					Command.CommandTimeout = 120
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
							Dim Param As DataParameter = Def.GetParameter(ParamName(I))    
							Command.Parameters.Item("@" & Param.Name).Value = ParamValue(I)
						End if
					Next

					REM Try
						REM Command.ExecuteNonQuery()
					REM Catch Ex As Exception
						REM Result = Ex.Message.Replace("""", "'")
					REM End Try
					Using DS As DataSet = New DataSet()                                             
						Try
							Using DA As SqlDataAdapter = New SqlDataAdapter(Command)
								DA.SelectCommand.CommandTimeout = 120
								DA.Fill(DS, Name)
								Data = DS.Tables(Name)                                                   
							End Using
						Catch Ex As Exception
							Data = JsonToDatatable("[]")
						End Try
					End Using
				End Using
			End Using

			Return Data
		End Function                                                                                               

		Public Function OpenDataSet(ByVal Name As String, ByVal ParamName() As String, ByVal ParamValue() As Object, Optional ByVal Filter As String = "") As DataSet
			Dim DS As DataSet 
			Using Connection As SqlConnection = OpenConnection()
				Dim Def As CommandDefinition = Commands(Name)
				Dim SQL As String = Def.CommandText
				If Def.CommandType = CommandType.Text and Filter <> ""
					If SQL.ToLower.Contains("where")
						SQL = SQL.Replace("where", String.Format("where ({0}) and", Filter))
					Else
						SQL += " where " & Filter
					End if
				End if

				Using Command As SqlCommand = New SqlCommand(SQL, Connection)
					Command.CommandTimeout = 120
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
							Dim Param As DataParameter = Def.GetParameter(ParamName(I))     						
							Command.Parameters.Item("@" & Param.Name).Value = ParamValue(I)
						End if
					Next

					DS = New DataSet()                                             
					Using DA As SqlDataAdapter = New SqlDataAdapter(Command)
						DA.SelectCommand.CommandTimeout = 120
						DA.Fill(DS, Name)
					End Using
				End Using
			End Using

			Return DS
		End Function                                                                                               

		Public Function OpenData(ByVal Name As String, Optional ByVal Filter As String = "") As DataTable
			Return OpenData(Name, {}, {}, Filter)
		End Function

		Public Function OpenJsonData(ByVal Name As String, ByVal ParamName() As String, ByVal ParamValue() As Object, Optional ByVal Filter As String = "") As String
			Using Data As DataTable = OpenData(Name, ParamName, ParamValue, Filter)
				Return DatatableToJson(Data)
			End Using
		End Function

		Public Function OpenJsonData(ByVal Name As String, Optional ByVal Filter As String = "") As String
			Using Data As DataTable = OpenData(Name, {}, {}, Filter)
				Return DatatableToJson(Data)
			End Using
		End Function

		Public function PrepareCommand(ByVal Name As String) As CommandDefinition
			Dim Def As CommandDefinition = Commands(Name)
			Dim RetDef As New CommandDefinition(Name, Def.CommandType, Def.Connection)
			RetDef.CommandText = Def.CommandText
			For Each Param in Def.Parameters.Values
				Dim Value As Object
				RetDef.AddParameter(Param.Name, Param.DataType, Param.Direction, Param.Size, Param.Value)
			Next

			Return RetDef
		End Function

		Public Function UpdateCommand(ByVal VisitorID As Integer, CommandName As String, UpdateData As DataTable, KeyValue As Object,  Output As EasyStringDictionary, Optional Action As String = "update", Optional KeyID As String = "id")
			Using UpdateData
				Using Command = PrepareCommand(CommandName)
					With Command
						If .HasParameter("visit_id")
							.SetParameter("visit_id", VisitorID)
						End if

						If .HasParameter(KeyID)
							.SetParameter(KeyID, KeyValue)
						End if

						If .HasParameter("action")
							If Action = "delete"
								.SetParameter("action", 0)
							Else
								.SetParameter("action", 10)
							End if
						End if
						.SetParameters(UpdateData)

						Output.AsString("Message") = .Execute()
						If Output.AsString("Message") = String.Empty
							If .HasParameter(KeyID)
								Output.AsString(KeyID) = .GetParameter(KeyID).Value
							End if

							If .HasParameter("error_log_id")
								Output.AsInteger("Status") = .GetParameter("error_log_id").Value
							Else
								Output.AsInteger("Status") = 0
							End if
							Output.AsString("Action") = Action                           
							Output.AsString("Message") = DatabaseUtils.GetError(Output.AsInteger("Status"))
						Else
							Output.AsString("Status") = -3
						End if
					End with
				End Using
			End Using
		End Function

		Public Function UpdateCommand(CommandName As String, UpdateData As DataTable, KeyValue As Object,  Output As EasyStringDictionary, Optional Action As String = "update", Optional KeyID As String = "id")
				Return UpdateCommand(HttpContext.Current.Session("VisitorID"), CommandName, UpdateData, KeyValue, Output, Action, KeyID)
		End Function

	End Class

	Public Class CommandDefinition
		Inherits InSky.BaseDisposableObject

		Protected Overrides Sub DoCleanup()
			_ParameterCollection.Clear
		End Sub

		Public Name As String
		Public Connection As DatabaseConnection

		Private _ParameterCollection As New Dictionary(Of String, DataParameter)
		Public ReadOnly Property Parameters As Dictionary(Of String, DataParameter)
			Get
				Return _ParameterCollection
			End Get
		End Property

		Public ReadOnly Property GetParameter(ByVal Name As String) As DataParameter
			Get
				If _ParameterCollection.ContainsKey(Name)
					Return _ParameterCollection.Item(Name)
				Else
					Return Nothing
				End if
			End Get
		End Property

		Public ReadOnly Property HasParameter(ByVal Name As String) As Boolean
			Get
				Return _ParameterCollection.ContainsKey(Name)
			End Get
		End Property

		Private _CommandText As String
		Public Property CommandText As String
			Get
				Return _CommandText
			End Get

			Set(Value As String)                                          
				_CommandText = Value
			End Set
		End Property

		Private _CommandType As System.Data.CommandType
		Public Property CommandType As System.Data.CommandType
			Get
				Return _CommandType
			End Get

			Set(Value As System.Data.CommandType)
				_CommandType = Value
			End Set
		End Property

		Public Sub New(Name As String, Optional CommandType As System.Data.CommandType = System.Data.CommandType.Text, Optional Connection As DatabaseConnection = Nothing)
			Me.Name = Name
			Me.CommandType = CommandType
			Me.Connection = Connection
		End Sub

		REM SqlDbType refer to: http://msdn.microsoft.com/en-us/library/system.data.sqldbtype%28v=vs.100%29.aspx
		Public Sub AddParameter(ParamName As String, DataType As SqlDbType, Optional Direction As ParameterDirection = ParameterDirection.Input, Optional Size As Integer = 0, Optional Value As Object = Nothing)
			Parameters.Add(ParamName, New DataParameter(ParamName, DataType, Direction, Size, Value))
		End Sub

		Public Sub SetParameter(ParamName As String, Value As Object)
			Dim Param = GetParameter(ParamName)
			If Param IsNot Nothing
				Param.Value = Value
			End if
		End Sub

		Public Sub SetParameters(Data As System.Data.DataTable, Optional RowNo As Integer = 0)
			For Each C in Data.Columns
				SetParameter(C.ColumnName, Data.Rows(RowNo).Item(C.ColumnName))
			Next
		End Sub                                                                                     

		Public Sub SetParameters(Data As System.Data.DataTable, Row As System.Data.DataRow)
			For Each C in Data.Columns
				SetParameter(C.ColumnName, Row.Item(C.ColumnName))
			Next
		End Sub

		Public Function Execute() As String
			Dim Result As String = ""
			Using Connection As SqlConnection = Me.Connection.OpenConnection()
				Using Command As SqlCommand = New SqlCommand(CommandText, Connection)
					Command.CommandTimeout = 120
					Command.CommandType = CommandType

					For Each Param in Parameters.Values
						Dim Value As Object
						If Param.Value Is Nothing
							Value = DBNull.Value
						Else
							Value = Param.Value
						End if

						Command.Parameters.Add(CreateSqlParameter("@" & Param.Name, Param.DataType, Param.Size, Param.Direction,  Value))
					Next

					Try
						Command.ExecuteNonQuery()
					Catch Ex As Exception
						Result = Ex.Message.Replace("""", "'")
					End Try

					If Result = ""
						For Each Param in Command.Parameters
							If Param.Direction = ParameterDirection.InputOutput
								Dim P = GetParameter(Param.ParameterName.Replace("@", ""))
								If P IsNot Nothing
									P.Value = Param.Value
								End if
							End if
						Next
					End if
				End Using
			End Using

			Return Result
		End Function


		Public Function OpenData() As DataTable
			Dim Data As DataTable
			Using Connection As SqlConnection = Me.Connection.OpenConnection()
				Using Command As SqlCommand = New SqlCommand(CommandText, Connection)
					Command.CommandTimeout = 120
					Command.CommandType = CommandType
					For Each Param in Parameters.Values
						Dim Value As Object
						If Param.Value Is Nothing
							Value = DBNull.Value
						Else
							Value = Param.Value
						End if

						Command.Parameters.Add(CreateSqlParameter("@" & Param.Name, Param.DataType, Param.Size, Param.Direction,  Value))
					Next

					Using DS As DataSet = New DataSet()
						Using DA As SqlDataAdapter = New SqlDataAdapter(Command)
							DA.SelectCommand.CommandTimeout = 120
							DA.Fill(DS, Name)
							Data = DS.Tables(Name)
						End Using
					End Using
				End Using
			End Using

			Return Data
		End Function
	End Class
End Namespace
