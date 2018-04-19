REM ***************************************************************************************************
REM Last modified on
REM 06-SEP-2017
REM ***************************************************************************************************
Imports System.Data
Imports System.IO 

Public Class ExportToExcel
	Inherits System.Web.UI.Page

	Protected GridView As DevExpressEx.Grid.DataGrid
	
	Protected Function OpenData() As System.Data.DataTable
		Dim DataName As String() = SplitParts(Request.Params("source"), DatabaseUtils.DefaultConnectionName)
		Dim DataParams As New List(Of String)
		Dim DataValues As New List(Of Object)
		
		Using DBRecord As System.Data.DataTable = NewtonsoftEx.JsonToData(Request.Params("searchData"))
			For Each Column In DBRecord.Columns
				If Not DataParams.Contains(Column.ColumnName)
					If Column.ColumnName <> "page" and Column.ColumnName <> "pagesize"
						DataParams.Add(Column.ColumnName)
						DataValues.Add(DBRecord.Rows(0).Item(Column.ColumnName))
					End if
				End if
			Next
			
			DataParams.Add("page")
			DataValues.Add(1)
			
			DataParams.Add("pagesize")
			DataValues.Add(1000000)
			
			DataParams.Add("visit_id")
			DataValues.Add(Session("VisitorID"))
			
			Return DBConnections(DataName(0)).OpenData(DataName(1), DataParams.ToArray(), DataValues.ToArray())
		End Using
	End function

	Protected Sub InitGrid(ByVal Grid As DevExpressEx.Grid.DataGrid)
	End Sub

	Protected Sub InitColumns(ByVal Grid As DevExpressEx.Grid.DataGrid)
		If Request.Params("columnsData") IsNot Nothing
			Using DBColumns As System.Data.DataTable = NewtonsoftEx.JsonToData(Request.Params("columnsData"))
				Dim Band As DevExpressEx.Grid.DataBand = Nothing
				For Each Row In DBColumns.Rows
					If Row.Item("type") = "band"
						Band = Grid.CreateBand(Row.Item("label"))
						Band.SetColumnHeaderAlign(HorizontalAlign.Center)
						
						Continue For
					End if
					
					Dim Column As Object
					
					If Row.Item("type") = "date"
						Column = Grid.CreateDateColumn(Row.Item("name"), Row.Item("label"), Row.Item("width"))
					Else If Row.Item("type") = "money"
						Column = Grid.CreateNumericSum(Row.Item("name"), Row.Item("label"), Row.Item("width"))
					Else
						Column = Grid.CreateColumn(Row.Item("name"), Row.Item("label"), Row.Item("width"))
					End if
					
					If Band IsNot Nothing
						Band.Add(Column)
					End if
				Next
			End Using
		End if
	End Sub
	
	Protected Sub ExportGrid(ByVal GridView As DevExpressEx.Grid.DataGrid, ByVal ExportFileName As String, ByVal Extension As String)
		DoExportGrid(GridView, Extension)
	End Sub
	
	Protected Function DoExportGrid(ByVal GridView As DevExpressEx.Grid.DataGrid, ByVal Extension As String)	As String
		Using Exporter As New DevExpress.Web.ASPxGridView.Export.ASPxGridViewExporter
			Exporter.GridViewID = GridView.ID
			Exporter.Styles.Default.Font.Name = "Arial"
			Exporter.Styles.Header.Font.Bold = True
			Exporter.Styles.Header.ForeColor = Drawing.Color.Black
			Exporter.Styles.Header.BackColor = Drawing.Color.Silver
			REM Exporter.Styles.HyperLink.CopyFontFrom(Exporter.Styles.Cell)
			Exporter.Styles.HyperLink.ForeColor = Drawing.Color.Black
			Exporter.Styles.HyperLink.BackColor = Drawing.Color.White
			Exporter.Styles.HyperLink.Font.Underline = False

			Dim Col As Object
			
			' CType(Master, Object).MainContainer.Controls.Add(Exporter)
			CType(Master, Object).ContentPlaceHolder.Controls.Add(Exporter)
			
			Dim DocumentPath As String = AppUtils.Paths.AsString("UploadPath")
			Dim FileName As String = System.Guid.NewGuid.ToString()
			' If Request.Params("PageID") Is Nothing
				' FileName = String.Format("{0:0000000}-{1}", Session("VisitorID"), Request.Params("exportName"))
			' Else
				' FileName = String.Format("{0:0000000}-{1}", Session("VisitorID"), Request.Params("PageID"))
			' End if
			
			Dim FilePath As String = String.Format("{0}\{1}.{2}", DocumentPath, FileName, Extension)
			
			Using wFile As New System.IO.FileStream(FilePath, System.IO.FileMode.Create)
				If Extension = "xls"
					Exporter.WriteXls(wFile) 
				Else If Extension = "csv"
					Exporter.WriteCsv(wFile) 
				End if
				wFile.Close()
			End Using
			
			Return FileName
		End Using
	End Function

	Protected Sub InitPage()
		GridView = New DevExpressEx.Grid.DataGrid("GridView", Nothing, "AssignID=1;ShowSelection=0")
		AddHandler GridView.OnBindData, AddressOf InitGrid
		AddHandler GridView.OnCreateColumns, AddressOf InitColumns

		With GridView
			.Border.BorderColor = Drawing.Color.FromName("rgba(0,0,0,1.2)")
			.SettingsLoadingPanel.Mode = DevExpress.Web.ASPxGridView.GridViewLoadingPanelMode.Disabled
			.Settings.ShowHorizontalScrollBar = True
			.Settings.ShowHorizontalScrollBar = True
			.Settings.ShowVerticalScrollBar = True
			REM .Settings.ShowFooter = False
			REM .Settings.ShowGroupPanel = False
			.Settings.ShowTitlePanel = False
			.Settings.ShowColumnHeaders = True
			.Settings.ShowFilterRow = False
			.Settings.ShowFilterRowMenu = False
			.Settings.ShowGroupPanel = True
			.Settings.ShowGroupFooter = True
			.Settings.ShowFooter = True
			.Settings.GridLines = System.Web.UI.WebControls.GridLines.Vertical
		End with

		' CType(Master, Object).MainContainer.Controls.Add(GridView)
		CType(Master, Object).ContentPlaceHolder.Controls.Add(GridView)
	End Sub
	
	Protected Sub Page_PreInit(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.PreInit
		Me.MasterPageFile = "/engine/exportxls.master"
	End Sub

	Protected Sub Page_Load(ByVal sender As Object, ByVal e As System.EventArgs) Handles Me.Load
		InitPage()
		
		GridView.Datasource = OpenData()
		GridView.DataBind()
		
		Dim Extension As String = Request.Params("ext")
		Dim ExportFileName As String = Request.Params("filename")
		
		Dim TempFileName = DoExportGrid(GridView, Extension)
		
		Dim Output As New EasyStringDictionary("")
		Output.AsString("src") = TempFileName
		Output.AsString("ext") = Extension
		
		Response.ContentType = "application/json; charset=utf-8"
		Response.Write(Output.JsonString(True))			
		Response.End
	End Sub
End Class
