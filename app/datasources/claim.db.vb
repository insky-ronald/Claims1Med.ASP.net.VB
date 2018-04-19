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
