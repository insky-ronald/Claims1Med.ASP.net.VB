With DBConnection.NewCommand("lookup_plans", "GetPlans", CommandType.StoredProcedure)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
