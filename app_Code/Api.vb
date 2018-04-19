REM ***************************************************************************************************
REM Last modified on
REM ***************************************************************************************************

Namespace Api
    Public Class BaseApi
        Inherits System.Web.UI.Page

        Public Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
            Response.Clear()
            Response.ContentType = "application/json; charset=utf-8"

            BeforeProcessOutput()

            Response.End()
		End Sub

        Protected Overridable Sub BeforeProcessOutput()
			Dim Output As New EasyStringDictionary("")

			ProcessOutput(Request.Params("CMD").ToLower, Output)

			Response.Write(Output.JsonString(True))
        End Sub

        Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
            If Cmd = "XXX"

            End if
		End Sub
    End Class
	
    Public Class BaseDataApi
        Inherits System.Web.UI.Page

		Protected Crud As New EasyStringDictionary("")
		Protected Rights As New EasyStringDictionary("")
		Protected QueryData As System.Data.DataTable
		
        Public Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
			If Context.Items("resource") Is Nothing
				Response.Clear()
				Response.ContentType = "application/json; charset=utf-8"
				BeforeProcessOutput()
				Response.End()
			Else
				ReturnResource()
			End if
		End Sub
		
		Protected Sub OpenDataSet(Datasource As String, DataParams As List(Of String), DataValues As List(Of Object), ByVal Output As EasyStringDictionary)
			Dim DataName As String() = SplitParts(Datasource, DatabaseUtils.DefaultConnectionName)
			Dim Data As New InSky.AppServer.DataTable("Data", DataName(0), "", DataName(1), DataParams.ToArray, DataValues.ToArray, "")
			AddHandler Data.AfterOpenOutput, AddressOf AfterOpenOutput

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
				Output.AsJson("data_" & I) = DatatableToJson(DataTable)
				I += 1
			Next
		End Sub

        Protected Sub ReturnResource()
			REM not yet implemented
		End Sub
		
        Protected Sub BeforeProcessOutput()
			Dim Output As New EasyStringDictionary("")

			ProcessOutput(Context.Items("mode").ToLower, Output)
			FinalizeProcessOutput(Context.Items("mode").ToLower, Output)

			Response.Write(Output.JsonString(True))
        End Sub

		Protected Overridable Function ListDataSource As String
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
		End Sub
		
        Protected Overridable Sub FinalizeProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			If Cmd = "info"
				Output.AsJson("rights") = Rights.JsonString()		
			Else If Cmd = "list" 'or Cmd = "edit" or Cmd = "new"
				Output.AsJson("crud") = Crud.JsonString()
			End if
		End Sub
		
        Protected Overridable Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
			
			Output.AsJson("status") = 0

			Crud.AsBoolean("add") = True
			Crud.AsBoolean("edit") = True
			Crud.AsBoolean("delete") = True
			
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
			Else If Cmd = "update"
				Dim UpdateData As New ServerUpdate.UpdateDataRecord(UpdateDataSource(), UpdateEncodedFields(), UpdateResultFields(), Session("VisitorID"))
				AddHandler UpdateData.AfterUpdate, AddressOf AfterUpdate
				
				UpdateData.Update(Request.Params("data"), Request.Params("mode"), Output)			
			Else If Cmd = "list"
				Dim DataParams As New List(Of String)
				Dim DataValues As New List(Of Object)
				REM Dim QueryData As System.Data.DataTable = JsonToDatatable(Request.Params("qry"))				
				
				Using QueryData = JsonToDatatable(Request.Params("qry"))
					InitParams(Cmd, DataParams, DataValues)
					
					REM If IncludeSessionVisit()
						REM DataParams.Add("visit_id")
						REM DataValues.Add(Session("VisitorID"))
					REM End if
					
					For Each Column In QueryData.Columns
						If Not DataParams.Contains(Column.ColumnName)
							DataParams.Add(Column.ColumnName)
							DataValues.Add(QueryData.Rows(0).Item(Column.ColumnName))
						End if
					Next
					
					OpenDataSet(ListDataSource(), DataParams, DataValues, Output)
				End Using
			End if
		End Sub
    End Class
End Namespace

