With DBConnection.NewCommand("GetFloat", "GetFloat", CommandType.StoredProcedure)
    .AddParameter("client_id", SqlDbType.int, ParameterDirection.Input, 10, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 