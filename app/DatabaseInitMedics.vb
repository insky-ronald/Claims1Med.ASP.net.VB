REM http://medics5.insky-inc.com/api/tools/dbinit?name=DBMedics
Imports System.Data
Imports System.Data.SqlTypes

With DBConnection.NewCommand("System_ManageSession", "System_ManageSession", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("session_id", SqlDbType.varchar, ParameterDirection.Input, 50, "")
    .AddParameter("user_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("user_name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
End With 

With DBConnection.NewCommand("Sys_GetTables", "Sys_GetTables", CommandType.StoredProcedure)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetUser", "GetUser", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetUsers", "GetUsers", CommandType.StoredProcedure)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
    
With DBConnection.NewCommand("AddUser", "AddUser", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("user_name", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("designation", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("phone_no", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("is_active", SqlDbType.Bit, ParameterDirection.Input, 0, 0)
	.AddParameter("is_supervisor", SqlDbType.Bit, ParameterDirection.Input, 0, 0)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetGroup", "GetGroup", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.char, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetGroups", "GetGroups", CommandType.StoredProcedure)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetUserGroups", "GetUserGroups", CommandType.StoredProcedure)
    .AddParameter("user_name", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetClaimsEnquiry", "GetClaimsEnquiry", CommandType.StoredProcedure)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

' With DBConnection.NewCommand("GetMembersEnquiry", "GetMembersEnquiry", CommandType.StoredProcedure)
    ' .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    ' .AddParameter("client_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("policy_no", SqlDbType.varchar, ParameterDirection.Input, 20, "")
    ' .AddParameter("certificate_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetClaim", "GetClaim", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetMember", "GetMember", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetClaimMemberInfo", "GetClaimMemberInfo", CommandType.StoredProcedure)
	' .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	' .AddParameter("member_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetTaskManager", "GetTaskManager", CommandType.StoredProcedure)
    ' .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetPlan", "GetPlan", CommandType.StoredProcedure)
    ' .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetProduct", "GetProduct", CommandType.StoredProcedure)
    ' .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

With DBConnection.NewCommand("GetClient", "GetClient", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetBanks", "GetBanks", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

' With DBConnection.NewCommand("GetAddress", "GetAddress", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	' .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)	
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 
    
' With DBConnection.NewCommand("AddAddress", "AddAddress", CommandType.StoredProcedure)
	' .AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	' .AddParameter("address_type", SqlDbType.Char, ParameterDirection.Input, 3, "")
	' .AddParameter("street", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	' .AddParameter("city", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("province", SqlDbType.VarChar, ParameterDirection.Input, 30, "")
	' .AddParameter("zip_code", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	' .AddParameter("phone_no1", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("phone_no2", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("fax_no1", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("fax_no2", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("email", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	' .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	' .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
' End with

' With DBConnection.NewCommand("GetContacts", "GetContacts", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("name_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("AddContacts", "AddContacts", CommandType.StoredProcedure)
	' .AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	' .AddParameter("title", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("full_name", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	' .AddParameter("department", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	' .AddParameter("position", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	' .AddParameter("phone", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("mobile", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("fax", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	' .AddParameter("email", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	' .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	' .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
' End with

With DBConnection.NewCommand("AddBanks", "AddBanks", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("name_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("bank_name", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("sort_code", SqlDbType.VarChar, ParameterDirection.Input, 11, "")
	.AddParameter("swift_code", SqlDbType.VarChar, ParameterDirection.Input, 11, "")
	.AddParameter("bank_address1", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("bank_address2", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("bank_address3", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("bank_country_code", SqlDbType.VarChar, ParameterDirection.Input, 2, "")
	.AddParameter("beneficiary_name", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("beneficiary_bank_account", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("beneficiary_address1", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("beneficiary_address2", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("beneficiary_address3", SqlDbType.VarChar, ParameterDirection.Input, 34, "")
	.AddParameter("beneficiary_country_code", SqlDbType.VarChar, ParameterDirection.Input, 2, "")
	
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

DBConnection.NewCommand("AddressTypes", "
	select 
		code, 
		address_type 
	from address_types 
	order by address_type
", CommandType.Text)

' With DBConnection.NewCommand("GetClaimServices", "GetClaimServices", CommandType.StoredProcedure)
    ' .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetService", "GetService", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetServiceSubType", "GetServiceSubType", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    ' .AddParameter("sub_type", SqlDbType.varchar, ParameterDirection.Input, 4, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

With DBConnection.NewCommand("GetCountries", "GetCountries", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")

    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "country")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("AddCountries", "AddCountries", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	.AddParameter("iso_code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
	.AddParameter("country", SqlDbType.VarChar, ParameterDirection.Input, 20, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetCurrencies", "GetCurrencies", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "currency")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddCurrencies", "AddCurrencies", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	.AddParameter("currency", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("no_roundoff", SqlDbType.int, ParameterDirection.Input, 0, 0)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

' With DBConnection.NewCommand("GetAddressTypes", "GetAddressTypes", CommandType.StoredProcedure)
    ' .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    ' .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	' .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("AddAddressTypes", "AddAddressTypes", CommandType.StoredProcedure)
	' .AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	' .AddParameter("address_type", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	' .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	' .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	' .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
' End with 

With DBConnection.NewCommand("GetNationalities", "GetNationalities", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
    .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddNationalities", "AddNationalities", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 10, "")
	.AddParameter("nationality", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

' With DBConnection.NewCommand("GetServiceActions", "GetServiceActions", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetServiceStatusHistory", "GetServiceStatusHistory", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetClaimDiagnosis", "GetClaimDiagnosis", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GeClaimDocuments", "GeClaimDocuments", CommandType.StoredProcedure)
    ' .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("document_source", SqlDbType.char, ParameterDirection.Input, 1, "")
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetClaimDiagnosisEdit", "GetClaimDiagnosisEdit", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

' With DBConnection.NewCommand("GetServiceItems", "GetServiceItems", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With

With DBConnection.NewCommand("GeClaimNotes", "GeClaimNotes", CommandType.StoredProcedure)
    .AddParameter("claim_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("service_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

'------------------------------------------------------------------------------
'PROVIDERS
'------------------------------------------------------------------------------
With DBConnection.NewCommand("GetDoctors", "GetDoctors", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With
    
With DBConnection.NewCommand("AddDoctors", "AddDoctors", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("full_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("specialisation_code", SqlDbType.VarChar, ParameterDirection.Input, 5, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_type_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.Money, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_percent", SqlDbType.SmallMoney, ParameterDirection.Input, 0, 0)
	.AddParameter("notes", SqlDbType.Varchar, ParameterDirection.Input, -1, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetHospitals", "GetHospitals", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddHospitals", "AddHospitals", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_type_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.Money, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_percent", SqlDbType.SmallMoney, ParameterDirection.Input, 0, 0)
	.AddParameter("notes", SqlDbType.Varchar, ParameterDirection.Input, -1, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetClinics", "GetClinics", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddClinics", "AddClinics", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_type_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.Money, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_percent", SqlDbType.SmallMoney, ParameterDirection.Input, 0, 0)
	.AddParameter("notes", SqlDbType.Varchar, ParameterDirection.Input, -1, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetPharmacies", "GetPharmacies", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddPharmacies", "AddPharmacies", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_type_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_amount", SqlDbType.Money, ParameterDirection.Input, 0, 0)
	.AddParameter("discount_percent", SqlDbType.SmallMoney, ParameterDirection.Input, 0, 0)
	.AddParameter("notes", SqlDbType.Varchar, ParameterDirection.Input, -1, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetAirlines", "GetAirlines", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddAirlines", "AddAirlines", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetCreditCards", "GetCreditCards", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddCreditCards", "AddCreditCards", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("code", SqlDbType.Char, ParameterDirection.Input, 10, "")
	.AddParameter("spin_id", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
	.AddParameter("name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("country_code", SqlDbType.Char, ParameterDirection.Input, 3, "")
	.AddParameter("status_code", SqlDbType.Char, ParameterDirection.Input, 1, "")
	.AddParameter("blacklisted", SqlDbType.Int, ParameterDirection.Input, 0, 0)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetDoctorSpecialisation", "GetDoctorSpecialisation", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.char, ParameterDirection.Input, 5, "")
    .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "specialisation_code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetProviderDiscount", "GetProviderDiscount", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

' With DBConnection.NewCommand("GetClients", "GetClients", CommandType.StoredProcedure)
    ' .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "name")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

' With DBConnection.NewCommand("GetProducts", "GetProducts", CommandType.StoredProcedure)
    ' .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
    ' .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "product_name")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

With DBConnection.NewCommand("GetPolicies", "GetPolicies", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("lookup", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "policy_no")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

'---------------------------Claim Tables----------------------------'
With DBConnection.NewCommand("GetClaimTypes", "GetClaimTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("lookup_claim_types", "GetClaimTypes", CommandType.StoredProcedure)
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddClaimTypes", "AddClaimTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("claim_type", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetInvoiceTypes", "GetInvoiceTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddInvoiceTypes", "AddInvoiceTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetCaseFeeTypes", "GetCaseFeeTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddCaseFeeTypes", "AddCaseFeeTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetCustomerServiceTypes", "GetCustomerServiceTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddCustomerServiceTypes", "AddCustomerServiceTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetGOPTypes", "GetGOPTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddGOPTypes", "AddGOPTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetNOCTypes", "GetNOCTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddNOCTypes", "AddNOCTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetRecoveryTypes", "GetRecoveryTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddRecoveryTypes", "AddRecoveryTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetCostContainmentTypes", "GetCostContainmentTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddCostContainmentTypes", "AddCostContainmentTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetFlagTypes", "GetFlagTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)   
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddFlagTypes", "AddFlagTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 4, "")
	.AddParameter("service_description", SqlDbType.VarChar, ParameterDirection.Input, 60, "")
	.AddParameter("display_name", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with 

With DBConnection.NewCommand("GetFlagSubTypes", "GetFlagSubTypes", CommandType.StoredProcedure)
	.AddParameter("flag_code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddFlagSubTypes", "AddFlagSubTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	.AddParameter("flag_code", SqlDbType.VarChar, ParameterDirection.Input, 4, "")
	.AddParameter("flag_sub_type", SqlDbType.VarChar, ParameterDirection.Input, 50, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

DBConnection.NewCommand("GetServiceTypes", "
	select 
		distinct(module) as service_type,
		service_type as code
	from v_service_status_codes
", CommandType.Text)

With DBConnection.NewCommand("GetServiceStatusCodes", "GetServiceStatusCodes", CommandType.StoredProcedure)
	.AddParameter("service_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 7, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "module")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

DBConnection.NewCommand("ClaimNotesTypes", "
	select *
    from notes
	order by id
", CommandType.Text)
' With DBConnection.NewCommand("GetClaimNotesTypes", "GetClaimNotesTypes", CommandType.StoredProcedure)
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 
 
 ' DBConnection.NewCommand("ActionTypes", "
	' select * from v_actions order by id
 ' ", CommandType.Text)
 
 REM http://medics5.insky-inc.com/api/tools/dbinit?name=DBMedics

With DBConnection.NewCommand("AddNoteType", "AddNoteType", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("note_type", SqlDbType.varchar, ParameterDirection.Input, 60, "")
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetNoteTypes", "GetNoteTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "country")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("AddNoteSubType", "AddNoteSubType", CommandType.StoredProcedure)
	.AddParameter("note_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("note_sub_type", SqlDbType.varchar, ParameterDirection.Input, 60, "")
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetNoteSubTypes", "GetNoteSubTypes", CommandType.StoredProcedure)
    .AddParameter("note_type", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "country")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

' With DBConnection.NewCommand("GetMemberClaims", "GetMemberClaims", CommandType.StoredProcedure)
    ' .AddParameter("member_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    ' .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    ' .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    ' .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "claim_no")
    ' .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    ' .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
' End With 

 With DBConnection.NewCommand("GetActionTypes", "GetActionTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "country")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
 End With
 
  With DBConnection.NewCommand("AddActionTypes", "AddActionTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.char, ParameterDirection.InputOutput, 3, "")
	.AddParameter("action_type", SqlDbType.varchar, ParameterDirection.Input, 60, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)
	
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetActionSubTypes", "GetActionSubTypes", CommandType.StoredProcedure)
	.AddParameter("action_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	
    .AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "country")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
 End With
 
  With DBConnection.NewCommand("AddActionSubTypes", "AddActionSubTypes", CommandType.StoredProcedure)
	.AddParameter("action_type", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("code", SqlDbType.char, ParameterDirection.Input, 3, "")
	.AddParameter("action_name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)
	
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 
 
With DBConnection.NewCommand("GetAuditlogTypes", "GetAuditlogTypes", CommandType.StoredProcedure)
    .AddParameter("code", SqlDbType.VarChar, ParameterDirection.Input, 3, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("action", SqlDbType.int, ParameterDirection.Input, 0, 0) 
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "code")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddAuditlogTypes", "AddAuditlogTypes", CommandType.StoredProcedure)
	.AddParameter("code", SqlDbType.VarChar, ParameterDirection.InputOutput, 3, "")
	.AddParameter("description", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
	.AddParameter("log_type", SqlDbType.VarChar, ParameterDirection.Input, 1, "")
	.AddParameter("is_active", SqlDbType.int, ParameterDirection.Input, 0, 1)

	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End with

With DBConnection.NewCommand("GetCustomerServiceData", "GetCustomerServiceData", CommandType.StoredProcedure)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 
