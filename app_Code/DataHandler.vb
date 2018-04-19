Imports System.IO
Imports System.Data

Namespace DataHandler
	Public Class BaseHandler : Implements IHttpHandler, IReadOnlySessionState		
		Public Context As System.Web.HttpContext
		Public Request As System.Web.HttpRequest
		Public Response As System.Web.HttpResponse
		Public Session As  System.Web.SessionState.HttpSessionState
		Public VisitorID As Integer
		
		Public ReadOnly Property IsReusable() As Boolean Implements IHttpHandler.IsReusable
			Get
				REM Return True
				Return False
			End Get
		End Property

		Public Sub ProcessRequest(ByVal Context As HttpContext) Implements IHttpHandler.ProcessRequest
			Me.Context = Context
			Request = Context.Request
			Response = Context.Response
			Session = Context.Session
			VisitorID = Context.Session("VisitorID")
			
			InitHandler(Context)
			UnloadHandler(Context)
		End Sub
		
		Protected Overridable Function CheckAuthorization As Boolean
			Return True
		End Function

		Protected Overridable Sub InitHandler(ByVal Context As HttpContext)		
			Dim Allow As Boolean = True
			Dim Message As String = ""
			Dim RedirectUrl As String = ""

			If CheckAuthorization 
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

		Protected Overridable Sub UnloadHandler(ByVal Context As HttpContext)
		End Sub
	End Class
	
	Public Class SubHandler
		Inherits BaseHandler
			
		Protected Overrides Function CheckAuthorization As Boolean
			Return False
		End Function
		
		Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
			MyBase.InitHandler(Context)
			Response.Clear()
			Response.ContentType = "application/json; charset=utf-8"
			If Request.Headers("Accept-Encoding").Contains("gzip")
				Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
				Response.Headers.Remove("Content-Encoding")
				Response.AppendHeader("Content-Encoding", "gzip")
			End if
			
			BeforeProcessOutput() 
			
			Response.End()
		End Sub
		
		Protected Sub BeforeProcessOutput()
			Dim Output As New EasyStringDictionary("")
			Dim Mode As String = Request.Params("cmd").ToLower
			
			ProcessOutput(Mode, Output)
			FinalizeProcessOutput(Mode, Output)

			Response.Write(Output.JsonString(True))
		End Sub
		
		Protected Overridable Sub FinalizeProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			REM If Cmd = "info"
				REM Output.AsJson("rights") = Rights.JsonString()		
			REM Else If Cmd = "list" or Cmd = "lookup" or Cmd = "edit" or Cmd = "new"
				REM Output.AsJson("crud") = Crud.JsonString()
			REM End if
		End Sub
		
		Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			REM If Cmd = "info"
			REM End if
		End Sub
	End Class
	
	Public Class SubDataHandler
		Inherits BaseHandler
		
		Protected Crud As New EasyStringDictionary("")
		Protected Rights As New EasyStringDictionary("")
		Protected QueryData As System.Data.DataTable
			
		Protected Overrides Function CheckAuthorization As Boolean
			Return False
		End Function
		
		Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
			MyBase.InitHandler(Context)
			Response.Clear()
			Response.ContentType = "application/json; charset=utf-8"
			If Request.Headers("Accept-Encoding").Contains("gzip")
				Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
				Response.Headers.Remove("Content-Encoding")
				Response.AppendHeader("Content-Encoding", "gzip")
			End if
			
			BeforeProcessOutput() 
			
			Response.End()
		End Sub
		
		Protected Sub OpenDataSet(Datasource As String, DataParams As List(Of String), DataValues As List(Of Object), ByVal Output As EasyStringDictionary)
			Dim DataName As String() = SplitParts(Datasource, DatabaseUtils.DefaultConnectionName)
			Dim Data As New InSky.AppServer.DataTable("Data", DataName(0), "", DataName(1), DataParams.ToArray, DataValues.ToArray, "")
			AddHandler Data.AfterOpenOutput, AddressOf AfterOpenOutput

			REM Data.OpenData(Output)
			Data.OpenData(Output)
		End Sub

		Protected Sub AfterOpenOutput(ByVal Data As InSky.AppServer.DataTable, ByVal DataSet As System.Data.DataSet, ByVal Command As System.Data.SqlClient.SqlCommand, ByVal Output As EasyStringDictionary)
			REM Dim PageNo As Integer = Command.Parameters.Item("@page").Value
			Dim PageNo As Integer = 1
			If Command.Parameters.Contains("@page")
				PageNo = Command.Parameters.Item("@page").Value
				If PageNo > Command.Parameters.Item("@page_count").Value
					PageNo = 1
				End if
			End if
			
			Output.AsJson("page") = PageNo
			If Command.Parameters.Contains("@row_count")
				Output.AsJson("row_count") = Command.Parameters.Item("@row_count").Value
			Else
				Output.AsJson("row_count") = -1
			End if
			
			If Command.Parameters.Contains("@page_count")
				Output.AsJson("page_count") = Command.Parameters.Item("@page_count").Value
			Else
				Output.AsJson("page_count") = -1 
			End if
			
			Output.AsJson("table_count") = DataSet.Tables.Count

			Dim I As Integer = 0
			For Each DataTable In DataSet.Tables
				Output.AsJson("data_" & I) = DatatableToJson(DataTable, AppUtils.Settings.AsString("FormatJsonData") = "1")
				I += 1
			Next
		End Sub
		
		Protected Sub BeforeProcessOutput()
			Dim Output As New EasyStringDictionary("")
			Dim Mode As String
			REM If Context IsNot Nothing
				REM If Context.Items("mode") IsNot Nothing
					REM Mode = Context.Items("mode").ToLower
				REM End if
			REM Else
				Mode = Request.Params("cmd").ToLower
			REM End if
			
			ProcessOutput(Mode, Output)
			FinalizeProcessOutput(Mode, Output)

			Response.Write(Output.JsonString(True))
		End Sub

		Protected Overridable Function ListDataSource As String
			Return ""
		End Function

		Protected Overridable Function LookupDataSource As String
			Return ""
		End Function

		Protected Overridable Function ReadDataSource As String
			Return ""
		End Function

		Protected Overridable Function UpdateDataSource As String
			Return ""
		End Function

		Protected Overridable Function UpdateEncodedFields As String
			Return ""
		End Function

		Protected Overridable Function UpdateResultFields As String
			Return ""
		End Function	
		
		Protected Overridable Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		End Sub

		Private Sub NewRowRecord(ByVal sender As Object, ByVal e As System.Data.DataTableNewRowEventArgs)
			If UpdateDataSource() <> String.Empty
				Dim DataName As String() = SplitParts(UpdateDataSource(), DatabaseUtils.DefaultConnectionName)
				Dim Def = DBConnections(DataName(0)).Commands(DataName(1))
				For Each Param in Def.Parameters.Values
					If sender.Columns.Contains(Param.Name)
						Try
							e.Row.Item(Param.Name) = Param.Value
						Catch
						End Try
					End if
				Next

				NewRecord(e.Row)
			End if
		End Sub
		
		Protected Overridable Sub NewRecord(Row As System.Data.DataRow)
		End Sub		
			
		Protected Overridable Sub AfterUpdate(Record As System.Data.DataTable, Mode As String, Output As EasyStringDictionary, Result As EasyStringDictionary)
			If Output.AsInteger("status") >= 0
				If Mode = "edit" or Mode = "new"
					Dim DataParams As New List(Of String)
					Dim DataValues As New List(Of Object)	
					
					Using DBUpdate = JsonToDatatable(Request.Params("data"))
						FetchUpdatedData(DBUpdate.Rows(0), Result, DataParams, DataValues)
					End Using
					
					Dim DataName As String() = SplitParts(ListDataSource, DatabaseUtils.DefaultConnectionName)
					
					Using DBData = DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray, DataValues.ToArray, "")
						Output.AsJson("update") = DatatableToJson(DBData)
					End Using
				Else If Mode = "delete"
					Using DBUpdate = JsonToDatatable(Request.Params("data"))
						Output.AsJson("deleted") = DatatableToJson(DBUpdate)
					End Using
				End if
			End if
		End Sub
		
		Protected Overridable Sub FetchUpdatedData(ByVal Row As System.Data.DataRow, Result As EasyStringDictionary, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
			DataParams.Add("action")
			DataValues.Add(50)
		End Sub
		
		Protected Overridable Sub FinalizeProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			If Cmd = "info"
				Output.AsJson("rights") = Rights.JsonString()		
			Else If Cmd = "list" or Cmd = "lookup" or Cmd = "edit" or Cmd = "new"
				Output.AsJson("crud") = Crud.JsonString()
			End if
		End Sub
		
		Protected Overridable Sub BeforeExecuteQuery(ByVal QueryData As System.Data.DataTable)
		End Sub
		
		Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			
			Output.AsJson("status") = 0

			DatabaseUtils.GetActionPermission(Request.Params("pid"), Crud)
			REM Crud.AsBoolean("add") = True
			REM Crud.AsBoolean("edit") = True
			REM Crud.AsBoolean("delete") = True
			
			If Cmd = "info"
				REM Dim Action As String = Request.Params("_a_")
				
				REM This is just temporary. We will get the rights of action from the database later...
				Rights.AsBoolean("allow") = True
				Rights.AsBoolean("add") = True
				Rights.AsBoolean("edit") = True
				Rights.AsBoolean("delete") = True
				
				REM Output.AsJson("rights") = Rights.JsonString()				
			Else If Cmd = "edit"
				Dim DataParams As New List(Of String)
				Dim DataValues As New List(Of Object)
				
				InitParams(Cmd, DataParams, DataValues)
				
				Dim DataName As String() = SplitParts(ReadDataSource(), DatabaseUtils.DefaultConnectionName)
				Using Data As System.Data.DataTable = DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray, DataValues.ToArray, "")
					If Data.Rows.Count > 0
						Output.AsJson("edit") = DataTableToJson(Data)
						Output.AsString("mode") = "edit"
					Else
						DataParams.Clear
						DataValues.Clear
						
						InitParams("new", DataParams, DataValues)
						
						DataName = SplitParts(ReadDataSource(), DatabaseUtils.DefaultConnectionName)
						Using DBData As System.Data.DataTable = DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray, DataValues.ToArray, "")
							If DBData.Rows.Count = 0 
								AddHandler DBData.TableNewRow, AddressOf NewRowRecord
								DBData.Rows.Add(DBData.NewRow())								
							End if
							
							Output.AsJson("edit") = DataTableToJson(DBData)
							Output.AsString("mode") = "new"
						End Using
					End if
				End Using
			Else If Cmd = "new"
				Dim DataParams As New List(Of String)
				Dim DataValues As New List(Of Object)
				
				InitParams(Cmd, DataParams, DataValues)
				
				Dim DataName As String() = SplitParts(ReadDataSource(), DatabaseUtils.DefaultConnectionName)
				Using DBData As System.Data.DataTable = DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray, DataValues.ToArray, "")
					If DBData.Rows.Count = 0 
						AddHandler DBData.TableNewRow, AddressOf NewRowRecord
						DBData.Rows.Add(DBData.NewRow())								
					End if
					
					Output.AsJson("edit") = DataTableToJson(DBData)
					Output.AsString("mode") = "new"
				End Using
			Else If Cmd = "update" or Cmd = "delete"
			
				' UpdateData(Cmd, Output)
				
				Dim UpdateData As New ServerUpdate.UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), Session("VisitorID"))
				AddHandler UpdateData.AfterUpdate, AddressOf AfterUpdate
				
				UpdateData.Update(Request.Params("data"), Request.Params("mode"), Output)			
				
			Else If Cmd = "list" or Cmd = "lookup"
				Dim DataParams As New List(Of String)
				Dim DataValues As New List(Of Object)
				
				InitParams(Cmd, DataParams, DataValues)
				
				Using QueryData = JsonToDatatable(Request.Params("qry"))					
					For Each Column In QueryData.Columns
						If Not DataParams.Contains(Column.ColumnName)
							DataParams.Add(Column.ColumnName)
							DataValues.Add(QueryData.Rows(0).Item(Column.ColumnName))
						End if
					Next
					
					BeforeExecuteQuery(QueryData)
					
					If Cmd = "list"
						OpenDataSet(ListDataSource(), DataParams, DataValues, Output)
					Else
						OpenDataSet(LookupDataSource(), DataParams, DataValues, Output)
					End if
				End Using
			End if
		End Sub
	End Class
	

	Public Class DataProvider
		Inherits SubDataHandler
	
		Protected Overrides Function ReadDataSource As String
			Return ListDataSource
		End Function
		
		' Protected Overrides Sub UpdateData(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			' MyBase.UpdateData(Cmd, Output)
			
			' If Output.AsInteger("status") = 0

				' If Cmd = "update"
					' Dim DataParams As New List(Of String)
					' Dim DataValues As New List(Of Object)	
					
					' Using DBUpdate = JsonToDatatable(Request.Params("data"))
						' AfterUpdateData(DBUpdate.Rows(0), DataParams, DataValues)
					' End Using
					
					' Dim DataName As String() = SplitParts(ListDataSource, DatabaseUtils.DefaultConnectionName)
					
					' Using DBData = DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray, DataValues.ToArray, "")
						' Output.AsJson("update") = DatatableToJson(DBData)
					' End Using
				' Else If Cmd = "delete"
					' Using DBUpdate = JsonToDatatable(Request.Params("data"))
						' Output.AsJson("deleted") = DatatableToJson(DBUpdate)
					' End Using
				' End if
			' End if
		' End Sub
			
		' Protected Overridable Sub AfterUpdateData(ByVal Row As System.Data.DataRow, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
		' Protected Overridable Sub FetchUpdatedData(ByVal Row As System.Data.DataRow, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
			' DataParams.Add("action")
			' DataValues.Add(50)
		' End Sub
			
		Protected Overrides Sub InitParams(ByVal Cmd As String, ByVal DataParams As List(Of String), ByVal DataValues As List(Of Object))
			MyBase.InitParams(Cmd, DataParams, DataValues)
			If Cmd = "list"
				DataParams.Add("visit_id")
					DataValues.Add(Session("VisitorID"))
				DataParams.Add("action")
					DataValues.Add(0)
			Else If Cmd = "edit"
				DataParams.Add("visit_id")
					DataValues.Add(Session("VisitorID"))
				DataParams.Add("action")
					DataValues.Add(10)
			Else If Cmd = "new"
				DataParams.Add("visit_id")
					DataValues.Add(Session("VisitorID"))
				DataParams.Add("action")
					DataValues.Add(20)
			End if
		End Sub
	End Class
	
	Public Class SavedQueryProvider
		Inherits DataProvider
		
		Protected ReportName As String = "Normal"

		Protected Overridable Function ReportTypeID As Integer
			Return 0
		End Function
			
		Protected Overrides Sub BeforeExecuteQuery(ByVal QueryData As System.Data.DataTable)
			MyBase.BeforeExecuteQuery(QueryData)
			
			Dim SavedReport As Integer		
			
			Using Command = DBConnections("DBReporting").PrepareCommand("FindSavedReport")
				With Command
					.SetParameter("id", 0)
					.SetParameter("report_type_id", ReportTypeID)
					.SetParameter("user_id", Session("UserNo"))
					.SetParameter("name", ReportName)
					.Execute
					
					SavedReport = .GetParameter("id").Value
				End With
			End Using
			
			If QueryData.Rows(0).Item("loaded") = 1 or SavedReport = 0
				If SavedReport = 0				
					Using Command = DBConnections("DBReporting").PrepareCommand("AddSavedReportQuery")
						With Command
							.SetParameter("id", 0)
							.SetParameter("report_type_id", ReportTypeID)
							.SetParameter("name", ReportName)
							.SetParameter("query", "")
							.SetParameter("action", 20)
							.SetParameter("visit_id", Session("VisitorID"))
							.Execute
							
							SavedReport = .GetParameter("id").Value
						End With
						
						Using NewQuery = JsonToDatatable(Request.Params("qry"))
							NewQuery.Columns.Add("id", GetType(Integer))
							NewQuery.Rows(0).Item("id") = SavedReport
							
							With Command
								.SetParameter("id", SavedReport)
								.SetParameter("query", DatatableToJson(NewQuery))
								.SetParameter("action", 11)
								.SetParameter("visit_id", Session("VisitorID"))
								.Execute
							End With
						End Using
					End Using
				Else
					SavedReport = QueryData.Rows(0).Item("id")
					Using Command = DBConnections("DBReporting").PrepareCommand("AddSavedReportQuery")
						With Command
							.SetParameter("id", SavedReport)
							.SetParameter("query", Request.Params("qry"))
							.SetParameter("action", 11)
							.SetParameter("visit_id", Session("VisitorID"))
							.Execute
						End With
					End Using
				End if
				
				' Dim Exclusions As String = "id,page,pagesize,sort,order"
				Dim Exclusions As String = ""
				Using Command = DBConnections("DBReporting").PrepareCommand("AddSavedReportQueryItem")
					With Command
						.SetParameter("id", SavedReport)
						.SetParameter("visit_id", Session("VisitorID"))

						For Each Column In QueryData.Columns
							If Not Exclusions.Contains(Column.ColumnName)
								.SetParameter("name", Column.ColumnName)
								If IsDBNull(QueryData.Rows(0).Item(Column.ColumnName))
									.SetParameter("value", "")
								Else
									.SetParameter("value", QueryData.Rows(0).Item(Column.ColumnName))
								End if
								.Execute
							End if
						Next
					End With
				End Using
			End if
		End Sub
		
		Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			MyBase.ProcessOutput(Cmd, Output)
			Dim SavedReport As Integer
			
			Using Command = DBConnections("DBReporting").PrepareCommand("FindSavedReport")
				With Command
					.SetParameter("id", 0)
					.SetParameter("report_type_id", ReportTypeID)
					.SetParameter("user_id", Session("UserNo"))
					.SetParameter("name", ReportName)
					.Execute
					
					SavedReport = .GetParameter("id").Value
				End With
			End Using
			
			Using DBReport = DBConnections("DBReporting").OpenData("GetReport", {"id","visit_id"}, {SavedReport,Session("VisitorID")}, "")
				Using QueryData = JsonToDatatable(DBReport.Eval("@query"))
					QueryData.Rows(0).Item("loaded") = 1
					Output.AsJson("data_1") = "[]"
					Output.AsJson("data_2") = DataTableToJson(QueryData)
				End Using
				
				Output.AsInteger("table_count") = Output.AsInteger("table_count") + 2
			End Using
		End Sub
	End Class
	
	Public Class BaseNavigator
		Inherits DataHandler.BaseHandler
		REM Inherits System.Web.UI.Page
		
		Protected MenuItems As Navigator.MenuItems
		Protected CustomData As EasyStringDictionary
		
		Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
			MyBase.InitHandler(Context)
			Response.Clear
			Response.ContentType = "application/json; charset=utf-8"
			If Request.Headers("Accept-Encoding").Contains("gzip")
				Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
				Response.Headers.Remove("Content-Encoding")
				Response.AppendHeader("Content-Encoding", "gzip")
			End if
			
			Dim Output As New EasyStringDictionary("")
			Output.AsJson("status") = 0
			Output.AsString("message") = ""
			
			REM MenuItems = New Navigator.MenuItems(VisitorID)
			CustomData = New EasyStringDictionary("")
			
			Dim Action As String = Request.Params("action").ToLower
			InitCallback(Action, Output)
			
			If Action = "navigator"
				MenuItems = New Navigator.MenuItems(0)
				InitMenuItems(MenuItems)

				REM InitCallback(Request.Params("action").ToLower, Output)
				
				Output.AsJson("menu_items") = MenuItems.Json()
				Output.AsJson("link_items") = AppUtils.MenuItems.Json()
				Output.AsJson("custom_data") = CustomData.JsonString()
			End if
			
			REM Output.Remove("status")
			REM Output.Remove("message")
			REM Response.Write(Output.JsonString(False))
			Response.Write(Output.JsonString())
			Response.End()
		End Sub
		
		Protected Overridable Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		End Sub
		
		Protected Overridable Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
			Output.AsString("pid") = Request.Params("pid")
		End Sub
	End Class
	
	Public Class BaseApi
		Inherits DataHandler.BaseHandler
		
		Protected Overrides Sub InitHandler(ByVal Context As HttpContext)
			MyBase.InitHandler(Context)
			Response.Clear
			Response.ContentType = "application/json; charset=utf-8"
			If Request.Headers("Accept-Encoding").Contains("gzip")
				Response.Filter = new System.IO.Compression.GZipStream(Response.Filter, System.IO.Compression.CompressionMode.Compress)
				Response.Headers.Remove("Content-Encoding")
				Response.AppendHeader("Content-Encoding", "gzip")
			End if
			
			Dim Output As New EasyStringDictionary("")

			REM ReturnOutput(Request.Params("cmd").ToLower, Output)
			ReturnOutput(Request.Params("cmd"), Output)
			
			Response.Write(Output.JsonString(True))
			Response.End()
		End Sub
		
		Protected Overridable Sub ReturnOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		End Sub
	End Class
	
End Namespace
