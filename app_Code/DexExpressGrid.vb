REM *************************************************************************************************
REM Last modified on
REM 05-FEB-2015 ihms.1.0.0.2 removed the word Sum= in summary footer if ASPxGridView
REM *************************************************************************************************
Imports System.IO                                                        
Imports System.Data
Imports Newtonsoft.Json
Imports DevExpress.Web.ASPxGridView

Public Module NewtonsoftEx
    Public Function JsonToData(ByVal JsonData As String) As DataTable
        Dim Json As Newtonsoft.Json.JsonSerializer = new Newtonsoft.Json.JsonSerializer()
        Json.NullValueHandling = NullValueHandling.Ignore
        Json.ObjectCreationHandling = ObjectCreationHandling.Replace
        Json.MissingMemberHandling = MissingMemberHandling.Ignore
        Json.ReferenceLoopHandling = ReferenceLoopHandling.Ignore

        Json.Converters.Add(new Newtonsoft.Json.Converters.IsoDateTimeConverter())
        Json.Converters.Add(new Newtonsoft.Json.Converters.DataTableConverter())

        Dim SR As StringReader = new StringReader(JsonData)
        Dim Reader As Newtonsoft.Json.JsonTextReader = new JsonTextReader(SR)

        Dim Data As DataTable = Json.Deserialize(Reader, GetType(DataTable))
		Data.AcceptChanges()
      
        Reader.Close()

        Return Data
    End Function
End Module

Namespace DevExpressEx
    ' Namespace Controls
        Namespace Grid
            Public Class DataBand
				Public Column As DevExpress.Web.ASPxGridView.GridViewBandColumn
				
                Sub New(ByVal Caption As String)
						Column = New DevExpress.Web.ASPxGridView.GridViewBandColumn
						Column.HeaderStyle.HorizontalAlign =  HorizontalAlign.Center
						Column.Caption = Caption
				End Sub

                Public Function Add(ByVal Column As DevExpress.Web.ASPxGridView.GridViewColumn) As DevExpress.Web.ASPxGridView.GridViewColumn
					Me.Column.Grid.Columns.Remove(Column)
					Me.Column.Columns.Add(Column)
					
					Return Column
				End Function

                Public Function Add(ByVal Band As DataBand) As DataBand
					Me.Column.Grid.Columns.Remove(Band.Column)
					Me.Column.Columns.Add(Band.Column)
					
					Return Band
				End Function

                Public Sub SetColumnHeaderAlign(ByVal Align As HorizontalAlign)
						For Each Col in Column.Columns
								Col.HeaderStyle.HorizontalAlign = Align
						Next										
				End Sub
			End Class

            Public Class DataGrid
                Inherits DevExpress.Web.ASPxGridView.ASPxGridView

                Protected Const cButtonColumnWidth = 27

                Public Data As DataTable
                Public Name As String
                Protected Params As EasyStringDictionary
                Protected DevStyle As String = "Office2010Silver"
                REM Protected DevStyle As String = "Office2010Blue"
'                Protected DevStyle As String = Connection.Params.AsString("DevStyle")

'                Private EditColumnTemplate As DevExpressEx.Grid.Templates.EditColumn

                Sub New(ByVal Name As String, ByVal Data As DataTable, ByVal Optional ParamStr As String = "")
                    MyBase.New()
                    Me.Data = Data
                    Me.Name = Name
                    Params = New EasyStringDictionary(ParamStr)

                    Me.ID = Name
                    If Params.AsBoolean("AssignID", False)
                        Me.ClientInstanceName = Name
                    End if
                    JSProperties("cpID") = Name

                    If Params.AsInteger("Width", 0) = 0
                        Attributes.Add("Width", "100%")
                    Else
                        Attributes.Add("Width", Params.AsString("Width") + "px")
                    End if

                    AutoGenerateColumns = False

                    Settings.ShowHorizontalScrollBar = False
                    Settings.ShowVerticalScrollBar = True
                    Settings.VerticalScrollableHeight = 25*6+0
            '        Settings.VerticalScrollBarStyle =  GridViewVerticalScrollBarStyle.Virtual
            '        Settings.VerticalScrollBarStyle =  GridViewVerticalScrollBarStyle.Standard
                    Settings.ShowFooter = False
                    Settings.ShowGroupPanel = False
                    Settings.ShowTitlePanel = False
                    Settings.ShowColumnHeaders = False
                    Settings.ShowFilterRow = DevExpress.Utils.DefaultBoolean.Default
            '        Settings.ShowFilterRow = True
            '        Settings.ShowFilterRowMenu = True
            '        Settings.GridLines = System.Web.UI.WebControls.GridLines.None
            '        Settings.GridLines = System.Web.UI.WebControls.GridLines.Horizontal
                    Settings.GridLines = System.Web.UI.WebControls.GridLines.Vertical

                    SettingsBehavior.AllowDragDrop = False
                    SettingsBehavior.AllowSelectByRowClick = False
                    SettingsBehavior.AllowSelectSingleRowOnly = False 'If true shows group button
            '        SettingsBehavior.AllowFocusedRow = True
                    SettingsBehavior.EnableRowHotTrack = True
                    SettingsBehavior.AllowSort = True

                    StylesEditors.ButtonEditCellSpacing = 0
                    StylesEditors.ProgressBar.Height.Pixel(21)

                    SettingsPager.AlwaysShowPager = False
                    SettingsPager.PageSize = 1000
                    SettingsPager.ShowSeparators = True
                    SettingsPager.RenderMode = DevExpress.Web.ASPxClasses.ControlRenderMode.Lightweight

                    CssFilePath = "~/App_Themes/" & DevStyle & "/{0}/styles.css"
                    CssPostfix = DevStyle
                    Images.SpriteCssFilePath = "~/App_Themes/" & DevStyle & "/{0}/sprite.css"
                    Images.LoadingPanelOnStatusBar.Url = "~/App_Themes/" & DevStyle & "/GridView/Loading.gif"
                    Images.LoadingPanel.Url = "~/App_Themes/" & DevStyle & "/GridView/Loading.gif"

                    ImagesFilterControl.LoadingPanel.Url = "~/App_Themes/" & DevStyle & "/GridView/Loading.gif"

                    Styles.RowHotTrack.BackColor = Drawing.Color.FromName("LemonChiffon")
                    Styles.RowHotTrack.BackgroundImage.ImageUrl = "/images/icons/blank.png"
                    Styles.CssFilePath = "~/App_Themes/" & DevStyle & "/{0}/styles.css"
                    Styles.CssPostfix = DevStyle
                    Styles.Header.ImageSpacing.Pixel(5)
                    Styles.LoadingPanel.ImageSpacing.Pixel(5)
                    Styles.AlternatingRow.Enabled = True
                    Styles.AlternatingRow.BackColor = Drawing.Color.FromName(Params.AsString("AlternatingRowColor", "Default"))

            '        DataSource = Data.DataSet
            '        DataMember = Data.TableName
            '        KeyFieldName = Data.KeyFieldName

                    AddHandler Init, AddressOf View_Init
                    AddHandler Load, AddressOf View_Load
'                    AddHandler DataBound, AddressOf View_DataBound
                    AddHandler CustomCallback, AddressOf View_CustomCallback
                    AddHandler RowUpdated, AddressOf View_RowUpdated
                    AddHandler StartRowEditing, AddressOf View_StartRowEditing
                    AddHandler RowInserted, AddressOf View_RowInserted
                    AddHandler HtmlRowCreated, AddressOf View_HtmlRowCreated

'                    If Params.AsBoolean("CanEdit", False)
'                       EditColumnTemplate = New DevExpressEx.Grid.Templates.EditColumn(Data.DataCollection)
'                        AddHandler EditColumnTemplate.OnAllowEditRow, AddressOf AllowEditRow
'                    End if
'
'                    If Params.AsBoolean("InitGrid", True)
'                        ClientSideEvents.Init = "InitGrid"
'                    End if
                End Sub

                Public Event OnBindData(ByVal Grid As DevExpressEx.Grid.DataGrid)

                Public Sub BindData(ByVal Optional Refresh As Boolean = False)
'                    If Refresh
'                        Data.Refresh()
'                    End if
'                    DataSource = Data.DataSet
'                    DataMember = Data.TableName
'                    KeyFieldName = Data.KeyFieldName
'                   DataSource = Data
                    RaiseEvent OnBindData(Me)
'                   If Not Data is Nothing
                        DataBind()
'                   End if
                End Sub

                Protected Overridable Sub AllowEditRow(ByVal TemplateContainer As DevExpress.Web.ASPxGridView.GridViewDataItemTemplateContainer, ByRef Allow As String)
                    Allow = ""
                End Sub

                Protected Overridable Sub InitGrid
                    CreateColumns()
                End Sub

                Private Sub View_Init(ByVal sender As Object, ByVal e As System.EventArgs) 'Handles MainView.Load
                    InitGrid
'                    BindData(False)
                End Sub

'                Private Sub View_DataBound(ByVal sender As Object, ByVal e As System.EventArgs)
'                   BindData(False)
'                End Sub

            '    Public Event OnLoadGrid(ByVal Grid As DataGrid)
                Private Sub View_Load(ByVal sender As Object, ByVal e As System.EventArgs) 'Handles MainView.Load
                    BindData(False)
            ''        RaiseEvent OnLoadGrid(Me)
                End Sub

                Private Sub View_CustomCallback(ByVal sender As Object, ByVal e As DevExpress.Web.ASPxGridView.ASPxGridViewCustomCallbackEventArgs)
                    If e.Parameters.ToUpper = "REFRESH"
                        BindData(True)
                    Else
                        Dim Params As New EasyStringDictionary(e.Parameters)
                        Dim Cmd = Params.AsString("CMD", "")

                        If Cmd = "RESET"
                            Dim Keys() As String = Params.AsString("KEYS", "").Split(",")

                            Sender.Selection.UnselectAll()
                            For Each Key in Keys
                                Sender.Selection.SelectRowByKey(CType(Key, Integer))
                            Next
                        End if
                    End if
                End Sub

                Private Sub View_StartRowEditing(ByVal sender As Object, ByVal e As DevExpress.Web.Data.ASPxStartRowEditingEventArgs)

                End Sub

                Private Sub View_RowUpdated(ByVal sender As Object, ByVal e As DevExpress.Web.Data.ASPxDataUpdatedEventArgs)

                End Sub

                Private Sub View_RowInserted(ByVal sender As Object, ByVal e As DevExpress.Web.Data.ASPxDataInsertedEventArgs)

                End Sub

                Private Sub View_HtmlRowCreated(ByVal sender As Object, ByVal e As DevExpress.Web.ASPxGridView  .ASPxGridViewTableRowEventArgs)
                End Sub

                Private ColumnSizeWidth As Integer = 0

                Public Function CreateBand(ByVal Caption As String) As DataBand
										Dim Band = New DataBand(Caption)
										Columns.Add(Band.Column)
										Return Band
								End Function

                Public Sub MoveColumn(ByVal ColumnName As String, ByVal Band As DevExpress.Web.ASPxGridView.GridViewBandColumn)
										Dim C = Columns(ColumnName)
										Columns.Remove(C)
										Band.Columns.Add(C)										
								End Sub

                Public Sub AllowGrouping(ByVal ColumnNames As String)
										Dim Cols As String() = ColumnNames.Split(",")
										For Each Col in Cols
												CType(Columns(Col), DevExpress.Web.ASPxGridView.GridViewDataColumn).Settings.AllowGroup = True
												CType(Columns(Col), DevExpress.Web.ASPxGridView.GridViewDataColumn).Settings.AllowDragDrop = True
										Next
								End Sub
								
                Public Function CreateColumn(ByVal FieldName As String, ByVal Caption As String, ByVal Width As Integer, Optional ByVal ParamStr As String = "") As DevExpress.Web.ASPxGridView.GridViewDataTextColumn
                    Dim Column As Object
                    Column = New DevExpress.Web.ASPxGridView.GridViewDataTextColumn
                    With Column
                        .FieldName = FieldName
                        .Caption = Caption
                        .Width = Width
                        .EditFormSettings.Visible = False 'DevExpress.Utils.DefaultBoolean.False
                        .CellStyle.HorizontalAlign =  HorizontalAlign.Left
                        Columns.Add(Column)
                    End With

                    ColumnSizeWidth += Width
                    Return Column
                End Function

                Public Function CreateDateColumn(ByVal FieldName As String, ByVal Caption As String, ByVal Width As Integer, Optional ByVal ParamStr As String = "") As DevExpress.Web.ASPxGridView.GridViewDataDateColumn
                    Dim Column As Object
                    Column = New DevExpress.Web.ASPxGridView.GridViewDataDateColumn
                    With Column
                        .FieldName = FieldName
                        .Caption = Caption
                        .Width = Width
                        .EditFormSettings.Visible = False 'DevExpress.Utils.DefaultBoolean.False
                        .CellStyle.HorizontalAlign =  HorizontalAlign.Left
                        Columns.Add(Column)
                    End With

                    ColumnSizeWidth += Width
                    Return Column
                End Function

                Public Function CreateTimeColumn(ByVal FieldName As String, ByVal Caption As String, ByVal Width As Integer, Optional ByVal ParamStr As String = "") As DevExpress.Web.ASPxGridView.GridViewDataTimeEditColumn
                    Dim Column As Object
                    Column = New DevExpress.Web.ASPxGridView.GridViewDataTimeEditColumn
                    With Column
                        .FieldName = FieldName
                        .Caption = Caption
                        .Width = Width
                        .EditFormSettings.Visible = False 'DevExpress.Utils.DefaultBoolean.False
                        .CellStyle.HorizontalAlign =  HorizontalAlign.Left
                        Columns.Add(Column)
                    End With

                    ColumnSizeWidth += Width
                    Return Column
                End Function

                Public Function CreateNumericColumn(ByVal FieldName As String, ByVal Caption As String, ByVal Width As Integer, Optional ByVal ParamStr As String = "") As DevExpress.Web.ASPxGridView.GridViewDataSpinEditColumn
                    Dim Column As Object
                    Column = New DevExpress.Web.ASPxGridView.GridViewDataSpinEditColumn
                    With Column
                        .FieldName = FieldName
                        .Caption = Caption
                        .Width = Width
                        .EditFormSettings.Visible = False 'DevExpress.Utils.DefaultBoolean.False
                        .CellStyle.HorizontalAlign =  HorizontalAlign.Right
                        .PropertiesSpinEdit.DecimalPlaces = 2
                        .PropertiesEdit.DisplayFormatString = "#,##0.00"
                        Columns.Add(Column)
                    End With

                    ColumnSizeWidth += Width
                    Return Column
                End Function

                Public Function CreateNumericSum(ByVal FieldName As String, ByVal Caption As String, ByVal Width As Integer, Optional ByVal ParamStr As String = "") As DevExpress.Web.ASPxGridView.GridViewDataSpinEditColumn
                    Dim Column As Object
                    Column = New DevExpress.Web.ASPxGridView.GridViewDataSpinEditColumn
                    With Column
                        .FieldName = FieldName
                        .Caption = Caption
                        .Width = Width
                        .EditFormSettings.Visible = False 'DevExpress.Utils.DefaultBoolean.False
                        .CellStyle.HorizontalAlign =  HorizontalAlign.Right
                        .PropertiesSpinEdit.DecimalPlaces = 2
                        .PropertiesEdit.DisplayFormatString = "#,##0.00"

                        .PropertiesSpinEdit.DecimalPlaces = 0
                        .PropertiesEdit.DisplayFormatString = "#,##0.00"
                        .CellStyle.HorizontalAlign = HorizontalAlign.Right

                        Dim SumColumn As New DevExpress.Web.ASPxGridView.ASPxSummaryItem
                        SumColumn.FieldName = FieldName
                        SumColumn.ShowInColumn = FieldName
                        SumColumn.SummaryType = DevExpress.Data.SummaryItemType.Sum
                        REM SumColumn.DisplayFormat = "{0}"
                        SumColumn.DisplayFormat = "{0:F2}"
                        Columns.Grid.TotalSummary.Add(SumColumn)

                        SumColumn = New DevExpress.Web.ASPxGridView.ASPxSummaryItem
                        SumColumn.FieldName = FieldName
                        SumColumn.ShowInGroupFooterColumn = FieldName
                        SumColumn.SummaryType = DevExpress.Data.SummaryItemType.Sum
						REM SumColumn.DisplayFormat = "{0}"
						SumColumn.DisplayFormat = "{0:F2}"
                        Columns.Grid.GroupSummary.Add(SumColumn)
                        
                        Columns.Add(Column)
                    End With

                    ColumnSizeWidth += Width
                    Return Column
                End Function

                Public Event OnCreateColumns(ByVal Grid As DevExpressEx.Grid.DataGrid)

                Public Overridable Sub CreateColumns()

                    If Params.AsBoolean("ShowSelection", True)
                        Dim Check As DevExpress.Web.ASPxGridView.GridViewCommandColumn
                        Check = New DevExpress.Web.ASPxGridView.GridViewCommandColumn
                        Check.ShowSelectCheckbox = True
                        Check.Width = cButtonColumnWidth
                        Check.FixedStyle = DevExpress.Web.ASPxGridView.GridViewColumnFixedStyle.Left
                        Columns.Add(Check)
                    End if

'                    If Params.AsBoolean("CanEdit", False)
'                        Dim Edit = New DevExpress.Web.ASPxGridView.GridViewDataTextColumn
'                        Edit.Name = "__Edit"
'            '            Edit.FieldName = "eEdit"
'                        Edit.Width = cButtonColumnWidth'Params.AsInteger("EditColumnWidth", 20)
'                        Edit.FixedStyle = DevExpress.Web.ASPxGridView.GridViewColumnFixedStyle.Left
'                        Edit.PropertiesEdit.EncodeHtml = False
'                        Edit.Settings.AllowAutoFilter = DevExpress.Utils.DefaultBoolean.False
'                        Edit.EditFormSettings.Visible = DevExpress.Utils.DefaultBoolean.False
'                        Columns.Add(Edit)
'
'                        Edit.DataItemTemplate = EditColumnTemplate
'                    End if

                    RaiseEvent OnCreateColumns(Me)
                End Sub

                Public Sub UpdateSelection(ByVal Values As String)
                    Dim List() As String = Values.Split(",")

                    If Values <> ""
                        For Each Value in List
                            Selection.SelectRowByKey(CType(Value, Integer))
                        Next
                    End if
                End Sub

            End Class
        End Namespace

    ' End Namespace

End Namespace

