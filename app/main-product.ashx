<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.BaseNavigator
	
	Private ProductCode As String = ""
	Private DBProduct As System.Data.DataTable
	
	Protected Overrides Sub InitCallback(ByVal Action As String, ByVal Output As EasyStringDictionary)
		MyBase.InitCallback(Action, Output)
		ProductCode = Request.Params("keyid")
		REM ProductCode = "PANIN"
		DBProduct = DBConnections("DBMedics").OpenData("GetProduct", {"code","visit_id"}, {ProductCode, Session("VisitorID")}, "")

		If Action = "navigator"
			Output.AsString("page_title") = DBProduct.Eval("Product: @code")
			Output.AsString("window_title") = DBProduct.Eval("@product_name") 

			CustomData.AsString("product_code") = ProductCode
			REM CustomData.AsJson("certificate_id") = DBMember.Eval("@certificate_id")
			CustomData.AsJson("data") = DBProduct.AsJson()
		Else If Action = "refresh"
			Output.AsJson("data") = DBProduct.AsJson()
		End if
	End Sub

	Protected Overrides Sub UnloadHandler(ByVal Context As HttpContext)
		MyBase.UnloadHandler(Context)
		DBProduct.Dispose
	End Sub
	
	Protected Overrides Sub InitMenuItems(ByVal MenuItems As Navigator.MenuItems)
		MyBase.InitMenuItems(MenuItems)
		
		MenuItems.Params.AsString("product_code") = ProductCode
		
		Dim Main As Navigator.MenuItem = MenuItems.AddMain("product", "Product")
		
			With Main.SubItems.Add
				.ID = "details"
				.Title = "Details"
				.Icon = "table-edit"
				.Action = "admin"
				.URL = "app/product"
				REM .URL = "app/under-construction"
				REM .Params.AsString("certificate_id") = DBMember.Eval("@certificate_id")
			End with
		
			With Main.SubItems.Add
				.ID = "plans"
				.Title = "Plans"
				.Icon = "table-edit"
				.Action = "admin"
				' .URL = "engine/under-construction"
				.URL = "app/plans"
				.Params.AsString("client_id") = DBProduct.Eval("@client_id")
			End with
	End Sub
End Class
