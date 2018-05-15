With DBConnection.NewCommand("GetPlan", "GetPlan", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 15, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetPlans", "GetPlans", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
    .AddParameter("product_code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "product_name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetScheduleHistory", "GetScheduleHistory", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("plan_code", SqlDbType.varchar, ParameterDirection.Input, 15, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetScheduleOfBenefits", "GetScheduleOfBenefits", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetLimits", "GetLimits", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "rule_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetScheduleEligibles", "GetScheduleEligibles", CommandType.StoredProcedure)
    .AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "rule_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetScheduleExclusions", "GetScheduleExclusions", CommandType.StoredProcedure)
    .AddParameter("schedule_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "rule_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("lookup_plans", "GetPlans", CommandType.StoredProcedure)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
