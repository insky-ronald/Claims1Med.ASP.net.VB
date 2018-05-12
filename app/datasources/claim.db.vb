With DBConnection.NewCommand("GetClaim", "GetClaim", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("AddClaim", "AddClaim", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("claim_no" , SqlDbType.VarChar, ParameterDirection.InputOutput, 200, 0)
	.AddParameter("member_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("policy_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("client_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("product_code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("plan_code", SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("plan_code2", SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("sub_product", SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("claim_type", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
	.AddParameter("base_currency_code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("client_currency_code" , SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("eligibility_currency_code" , SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("notification_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("country_of_incident", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("case_owner" , SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("status_code" , SqlDbType.VarChar, ParameterDirection.InputOutput, 1, "")
	.AddParameter("status" , SqlDbType.VarChar, ParameterDirection.InputOutput, 20, "")
	.AddParameter("hcm_reference" , SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("reference_no1" , SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("reference_no2" , SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("reference_no3" , SqlDbType.VarChar, ParameterDirection.Input, 15, "")
	.AddParameter("third_party", SqlDbType.Int, ParameterDirection.Input, 0, 0)

	.AddParameter("diagnosis_code" , SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("is_accident", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("accident_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("accident_code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	
	.AddParameter("is_preexisting", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("first_symptom_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("travel_return_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)

	.AddParameter("travel_departure_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	.AddParameter("first_consultation_date", SqlDbType.DateTime, ParameterDirection.Input, 0, Nothing)
	
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("GetNewClaimInfo", "GetNewClaimInfo", CommandType.StoredProcedure)
	.AddParameter("claim_type", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
	.AddParameter("member_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetClaimMemberInfo", "GetClaimMemberInfo", CommandType.StoredProcedure)
	.AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("member_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetClaimDiagnosisSummary", "GetClaimDiagnosisSummary", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetClaimStatusHistory", "GetClaimStatusHistory", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddClaimStatusHistory", "AddClaimStatusHistory", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("status_code", SqlDbType.varchar, ParameterDirection.Input, 1, "")
	.AddParameter("action", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("CanDeleteClaim", "CanDeleteClaim", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("change_plan", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.VarChar, ParameterDirection.InputOutput, 200, "")
End With

With DBConnection.NewCommand("lookup_service_sub_types", "GetServiceSubTypes", CommandType.StoredProcedure)
    .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
