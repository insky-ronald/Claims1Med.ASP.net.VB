' *****************************************************************************************************
' Last modified on
' 12:20 PM Friday, October 6, 2017
' *****************************************************************************************************
With DBConnection.NewCommand("GetServiceItems", "GetServiceItems", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetServiceBreakdownEligibles", "GetServiceBreakdownEligibles", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("GetServiceBreakdownExclusions", "GetServiceBreakdownExclusions", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
