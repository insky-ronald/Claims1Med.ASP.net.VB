With DBConnection.NewCommand("GetClaimsAuthorisation", "GetClaimsAuthorisation", CommandType.StoredProcedure)
    ' .AddParameter("show_referral", SqlDbType.tinyint, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 50)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
End With 