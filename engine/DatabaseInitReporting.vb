Imports System.Data
Imports System.Data.SqlTypes

' With DBConnection.NewCommand("GetReportTypes", "GetReportTypes2", CommandType.StoredProcedure)
With DBConnection.NewCommand("GetReportTypes", "SysGetReportTypes", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
	.AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 50)
	.AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
End With 

' With DBConnection.NewCommand("AddReportType", "AddReportType2", CommandType.StoredProcedure)
With DBConnection.NewCommand("AddReportType", "SysAddReportType", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)	
	.AddParameter("report_type", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	' .AddParameter("data_build_view_name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	' .AddParameter("data_details_view_name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	' .AddParameter("report_totals", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("status_code_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetSavedReports", "SysGetSavedReports", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("report_type_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
End With 
    
With DBConnection.NewCommand("AddSavedReportQuery", "SysAddSavedReportQuery", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 500, "")
	.AddParameter("report_type_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("query", SqlDbType.VarChar, ParameterDirection.Input, -1, "")
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 11)
	.AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with
    
With DBConnection.NewCommand("AddSavedReportQueryItem", "SysAddSavedReportQueryItem", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("value", SqlDbType.VarChar, ParameterDirection.Input, 2048, "")
	.AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
End with

' With DBConnection.NewCommand("GetReport", "GetReport2", CommandType.StoredProcedure)
With DBConnection.NewCommand("GetReport", "SysGetReport", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("RunReport", "SysRunReport", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
	.AddParameter("page", SqlDbType.Int, ParameterDirection.Input, 0, 1)
	.AddParameter("pagesize", SqlDbType.Int, ParameterDirection.Input, 0, 50)
	.AddParameter("row_count", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("page_count", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("sort", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
	.AddParameter("order", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
End with 

' With DBConnection.NewCommand("RunReport", "RunReport2", CommandType.StoredProcedure)
	' .AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	' .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
	' .AddParameter("page", SqlDbType.Int, ParameterDirection.Input, 0, 1)
	' .AddParameter("pagesize", SqlDbType.Int, ParameterDirection.Input, 0, 50)
	' .AddParameter("row_count", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("page_count", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("sort", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
	' .AddParameter("order", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
' End with 

' With DBConnection.NewCommand("AddReport", "AddReport", CommandType.StoredProcedure)
	' .AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("report", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
	' .AddParameter("date1_start", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date1_end", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date2_start", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date2_end", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date3_start", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date3_end", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date4_start", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("date4_end", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("creation_start_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("creation_end_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("status_start_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("status_end_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	' .AddParameter("status_code_id", SqlDbType.Int, ParameterDirection.Input, 0, 10)

	' .AddParameter("client_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("insurance_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("broker_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("batch_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("service_type_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("create_user_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("country_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	' .AddParameter("incident_country_ids", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")
	
	' .AddParameter("status_codes", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	' .AddParameter("sub_status_codes", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
	' .AddParameter("allocation_users", SqlDbType.VarChar, ParameterDirection.Input, 2000, "")

	' .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	' .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
' End With 

With DBConnection.NewCommand("FindSavedReport", "

	SELECT
		@id = id
	FROM saved_reports
	WHERE report_type_id = @report_type_id AND user_id = @user_id and name = @name
	
	", CommandType.Text)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("report_type_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("user_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
End With
