With DBConnection.NewCommand("GetDiagnosis", "GetDiagnosis", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("version", SqlDbType.VarChar, ParameterDirection.Input, 2, "")
	.AddParameter("is_shortlist", SqlDbType.tinyint, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0) 
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End with

With DBConnection.NewCommand("GetProcedures", "GetProcedures", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("table_code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0) 
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End with

With DBConnection.NewCommand("GetClaimDiagnosis", "GetClaimDiagnosis", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetClaimProcedures", "GetClaimProcedures", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetServiceDiagnosisGroup", "GetServiceDiagnosisGroup", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

' With DBConnection.NewCommand("lookup_diagnosis_group", "GetServiceDiagnosisGroup", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetClaimDiagnosisEdit", "GetClaimDiagnosisEdit", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

With DBConnection.NewCommand("AddClaimDiagnosis", "AddClaimDiagnosis", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("claim_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("service_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("type", SqlDbType.VarChar, ParameterDirection.Input, 1, "")
	.AddParameter("diagnosis_group", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("diagnosis_code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("condition", SqlDbType.Text, ParameterDirection.Input, -1, "")
	.AddParameter("is_default", SqlDbType.bit, ParameterDirection.Input, 0, 0)
	.AddParameter("surgical_type", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("doctor_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With
