With DBConnection.NewCommand("lookup_invoice_status", "GetInvoiceStatuses", CommandType.StoredProcedure)
	.AddParameter("status_codes", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_invoice_sub_status", "GetServiceStatusCodes", CommandType.StoredProcedure)
	.AddParameter("service_type", SqlDbType.varchar, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.varchar, ParameterDirection.Input, 1, "")
	.AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 7, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_all_service_types", "GetAllServiceTypes", CommandType.StoredProcedure)
	.AddParameter("codes", SqlDbType.varchar, ParameterDirection.Input, 500, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_claim_type_codes", "GetClaimTypeCodes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("codes", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_policy_no", "GetPolicyNumbers", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("codes", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_provider_ids", "GetProviderIds", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_doctor_ids", "GetDoctorIds", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_customer_service_type_code", "GetCustomerServiceTypeCodes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 4, "")
	.AddParameter("codes", SqlDbType.varchar, ParameterDirection.Input, 500, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_customer_service_sub_status", "GetCustomerServiceSubStatus", CommandType.StoredProcedure)
	.AddParameter("sub_status_code", SqlDbType.varchar, ParameterDirection.Input, 3, "")
	.AddParameter("sub_status_codes", SqlDbType.varchar, ParameterDirection.Input, 500, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_user_names", "GetUserNames", CommandType.StoredProcedure)
	.AddParameter("user_name", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("user_names", SqlDbType.varchar, ParameterDirection.Input, 500, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With