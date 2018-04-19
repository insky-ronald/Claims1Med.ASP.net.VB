REM ***************************************************************************************************
REM Last modified on
REM 14-SEP-2014 ihms.0.0.0.1
REM 08-NOV-2014 ihms.0.0.1.6
REM 07-FEB-2015 ihms.1.0.0.3
REM ***************************************************************************************************
Imports System.Data

Namespace Query
	Public Class QueryItem	
		Public ColumnName As String
		Public ColumnType As String
		Public LogOperator As String
		Public LikePad As String
		Public DefValue As Object

		Sub New(ByVal ColumnName As String, ByVal ParamsStr As String, ByVal DefValue As Object)
			Me.ColumnName = ColumnName
			If DefValue Is Nothing
				Me.DefValue = DBNull.Value
			Else
				Me.DefValue = DefValue
			End if
			
			Dim Params = New EasyStringDictionary(ParamsStr)
			ColumnType = Params.AsString("type", "text").ToLower
			LogOperator = Params.AsString("operator", "=").ToLower
			LikePad = Params.AsString("pad", "both").ToLower
		End Sub

		Public Function Expression(ByVal Value As String) As String
			Dim ValueStr As String = Value

			If ColumnType = "text"
				If LogOperator = "like"
					If LikePad = "both"
						ValueStr = String.Format("'%{0}%'", ValueStr)
					Else If LikePad = "right"
						ValueStr = String.Format("'{0}%'", ValueStr)
					End if
				Else
					ValueStr = String.Format("'{0}'", ValueStr)
				End if
			End if
			
			Return String.Format("{0} {1} {2}", ColumnName, LogOperator, ValueStr)
		End Function
	End Class

	Public Class QueryBuilder
		
		Public Data As DataTable
		Private Filter As String = ""
		Private Items As Dictionary(Of String, QueryItem)

		Sub New
			Items = New Dictionary(Of String, QueryItem)
		End Sub

		Public Sub StaticFilter(Filter As String)
			Me.Filter = Filter
		End Sub
		
		Public Function Add(ColumnName As String, Optional Params As String = "", Optional Value As Object = Nothing) As QueryItem
			Dim QueryItem As New QueryItem(ColumnName, Params, Value)
		
			Items.Add(ColumnName, QueryItem)
			Return QueryItem
		End Function
		
		Public Function Contains(ColumnName As String) As Boolean
			For Each QueryItem in Items
				If QueryItem.Value.ColumnName = ColumnName
					Return True
				End if
			Next

			Return False
		End Function
		
		Public Sub SetData(Optional ByVal Json As String = "")
			If Json = ""
				Data = New DataTable("Search")
				Data.Rows.Add(Data.NewRow())
				For Each QueryItem in Items
					Dim Item = QueryItem.Value
					Dim DataType As Type = GetType(String)
					
					If Item.ColumnType = "date"
						DataType = GetType(DateTime)
					Else If Item.ColumnType = "numeric"
						DataType = GetType(Integer)
					End if
					
					REM If Data.Columns.Contains(Item.ColumnName)
						Dim Column = Data.Columns.Add(Item.ColumnName, DataType)
						Data.Rows(0).Item(Item.ColumnName) = Item.DefValue
					REM End if
				Next
			Else
				Data = JsonToDatatable(Json)				
			End if
		End Sub
		
		Public Function GetData() As DataRow
			Return Data.Rows(0)
		End Function

		Public Function Json() As String
			Return DatatableToJson(Data, False)
		End Function

		Public Function Expression() As String
			Dim LogOperator As String = "AND"
			Dim ExpressionList As New List(Of String)
			If Data IsNot Nothing
					Dim FuzzySearch As Boolean = False
					For Each QueryItem in Items
						Dim Item = QueryItem.Value
						If Data.Columns.Contains(Item.ColumnName)
							Dim Value = Data.Rows(0).Item(Item.ColumnName).ToString
							If Value <> ""
								ExpressionList.Add(Item.Expression(Value))
							End if
						Else								
							FuzzySearch = True
							Dim Value = Data.Rows(0).Item("filter").ToString
							If Value <> ""
								ExpressionList.Add(Item.Expression(Value))
							End if
						End if
					Next
					
					If FuzzySearch
						LogOperator = "OR"
					End if
			End if
			
			Dim Expr As String = String.Join(" " & LogOperator & " ", ExpressionList.ToArray)
			If Filter <> ""
				If Expr <> ""
					Expr = "(" & Expr & ") AND (" & Filter & ")"
				Else
					Expr = Filter
				End if
			End if
			Return Expr
		End Function
		
	End Class
End Namespace
