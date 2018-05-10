With DBConnection.NewCommand("GetPlan", "GetPlan", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 10, "")
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

With DBConnection.NewCommand("lookup_plans", "GetPlans", CommandType.StoredProcedure)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
