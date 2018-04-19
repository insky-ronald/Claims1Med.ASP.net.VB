With DBConnection.NewCommand("GetCaseHistory", "GetCaseHistory", CommandType.StoredProcedure)
    .AddParameter("member_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "claim_no")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
