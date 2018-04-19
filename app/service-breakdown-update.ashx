<%@ WebHandler Language="VB" Class="DataProvider" %>

Public Class DataProvider
	Inherits DataHandler.DataProvider
	
	Protected Overrides Function ListDataSource As String
		If Request.Params("section") = 0
			Return "DBMedics.GetServiceBreakdownEligibles"
		Else
			Return "DBMedics.GetServiceBreakdownExclusions"
		End if
	End Function
	
	Protected Overrides Sub ProcessOutput(ByVal Cmd As String, ByVal Output As EasyStringDictionary)
		MyBase.ProcessOutput(Cmd, Output)
		If Cmd = "update-items"
			If Request.Params("Section") = 0
				DatabaseUtils.UpdateMultiRecords("DBMedics.AddEligibleItem", "", "", Request.Params("updateData"), "edit", Session("VisitorID"), Output)
			Else
				DatabaseUtils.UpdateMultiRecords("DBMedics.AddExclusionItem", "", "", Request.Params("updateData"), "edit", Session("VisitorID"), Output)
			End if
		Else
			DatabaseUtils.GetActionPermission("invoice", Crud)
			Crud.AsBoolean("add") = False
			Crud.AsBoolean("edit") = False
			Crud.AsBoolean("delete") = False
		End if
	End Sub
End Class