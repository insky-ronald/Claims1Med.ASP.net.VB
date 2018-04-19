REM ***************************************************************************************************
REM Last modified on
REM 02-OCT-2014 ihms.0.0.0.9
REM ***************************************************************************************************
Imports System.Data
Imports System.Data.SqlTypes

'***************************************************************************************************
'	SYSTEM 
'***************************************************************************************************
With DBConnection.NewCommand("AddVisit", "System_AddVisit", CommandType.StoredProcedure)
    .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("application_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("session_id", SqlDbType.VarChar, ParameterDirection.Input, 48, "")
    .AddParameter("method", SqlDbType.VarChar, ParameterDirection.Input, 10, "")
    .AddParameter("local_ip", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
    .AddParameter("remote_ip", SqlDbType.VarChar, ParameterDirection.Input, 20, "")
    .AddParameter("remote_host", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
    .AddParameter("user_agent", SqlDbType.VarChar, ParameterDirection.Input, 100, "")
    .AddParameter("referrer_url", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
    .AddParameter("request_url", SqlDbType.VarChar, ParameterDirection.Input, 200, "")
End with

With DBConnection.NewCommand("Login", "System_Login", CommandType.StoredProcedure)
    .AddParameter("user_id", SqlDbType.Int, ParameterDirection.InputOutput, 0, -20)
    .AddParameter("user_name", SqlDbType.VarChar, ParameterDirection.Input, 200, Nothing)
    .AddParameter("password", SqlDbType.VarChar, ParameterDirection.Input, 200, Nothing)
    .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, Nothing)
End with

With DBConnection.NewCommand("LogoutEx", "System_Logout", CommandType.StoredProcedure)
    .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, Nothing)
End with

'====================================================================================================
'	USERS
'====================================================================================================
With DBConnection.NewCommand("AddUser", "AddUser", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("organisation_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("user_name", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("last_name", SqlDbType.varchar, ParameterDirection.Input, 60, "")
    .AddParameter("middle_name", SqlDbType.varchar, ParameterDirection.Input, 60, "")
    .AddParameter("first_name", SqlDbType.varchar, ParameterDirection.Input, 60, "")
    .AddParameter("gender", SqlDbType.char, ParameterDirection.Input, 1, "")
    .AddParameter("dob", SqlDbType.datetime, ParameterDirection.Input, 0, Nothing)
    .AddParameter("email", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("status_code_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("roles", SqlDbType.varchar, ParameterDirection.Input, 100, "")

    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetUsers", "GetUsers", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("mode", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 25)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "user_name")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetUserSessionInfo", "System_GetUserSessionInfo", CommandType.StoredProcedure)
    .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, Nothing)
End with

With DBConnection.NewCommand("GetMyRights", "System_GetMyRights", CommandType.StoredProcedure)
    .AddParameter("action_id", SqlDbType.Int, ParameterDirection.Input, 0, Nothing)
    .AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, Nothing)
    .AddParameter("error_log_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
    .AddParameter("verbose", SqlDbType.TinyInt, ParameterDirection.Input, 0, 1)
End with

With DBConnection.NewCommand("GetUserDetails", "System_GetUserDetails", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
End with

With DBConnection.NewCommand("GetUserActions", "System_GetUserActions", CommandType.StoredProcedure)
	.AddParameter("user_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("role_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.BigInt, ParameterDirection.Input, 0, Nothing)
	.AddParameter("error_log_id", SqlDbType.BigInt, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("verbose", SqlDbType.BigInt, ParameterDirection.Input, 0, 1)
End with

With DBConnection.NewCommand("lookup_users", "GetUsersLookup", CommandType.StoredProcedure)
    .AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "full_name")
	.AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
End With 

'====================================================================================================
'ROLES
'====================================================================================================
With DBConnection.NewCommand("AddRole", "AddRole", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("role", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("description", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("application_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("position", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("status_code_id", SqlDbType.int, ParameterDirection.Input, 0, 0)

    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetRoles", "GetRoles", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("mode", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("application_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 25)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "position")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetUserRoles", "System_GetUserRoles", CommandType.StoredProcedure)
	.AddParameter("user_id", SqlDbType.BigInt, ParameterDirection.Input, 0, 0)
	.AddParameter("error_log_id", SqlDbType.BigInt, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("verbose", SqlDbType.TinyInt, ParameterDirection.Input, 0, 1)
End with

'====================================================================================================
'	 ACTIONS
'====================================================================================================
With DBConnection.NewCommand("AddAction", "AddAction", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 20, "")
    .AddParameter("action_name", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("description", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("action_type_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("application_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("position", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("status_code_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("rights", SqlDbType.varchar, ParameterDirection.Input, 100, "")

    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetActions", "GetActions", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("mode", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("application_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 25)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "position")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

'====================================================================================================
'	RIGHTS
'====================================================================================================
With DBConnection.NewCommand("AddRights", "AddRights", CommandType.StoredProcedure)
    .AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("code", SqlDbType.varchar, ParameterDirection.Input, 20, "")
    .AddParameter("rights", SqlDbType.varchar, ParameterDirection.Input, 100, "")
    .AddParameter("description", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("application_id", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("position", SqlDbType.int, ParameterDirection.Input, 0, 0)
    .AddParameter("status_code_id", SqlDbType.int, ParameterDirection.Input, 0, 0)

    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetRights", "GetRights", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("ids", SqlDbType.varchar, ParameterDirection.Input, 200, "")
    .AddParameter("filter", SqlDbType.varchar, ParameterDirection.Input, 200, "")
	.AddParameter("mode", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("application_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("page", SqlDbType.int, ParameterDirection.Input, 0, 1)
    .AddParameter("pagesize", SqlDbType.int, ParameterDirection.Input, 0, 25)
    .AddParameter("row_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("page_count", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("sort", SqlDbType.varchar, ParameterDirection.Input, 200, "position")
    .AddParameter("order", SqlDbType.varchar, ParameterDirection.Input, 10, "asc")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetActionRights", "GetActionRights", CommandType.StoredProcedure)
	.AddParameter("action_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

'====================================================================================================
'	PERMISSIONS
'====================================================================================================
With DBConnection.NewCommand("AddPermission", "AddPermission", CommandType.StoredProcedure)
	.AddParameter("role_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("action_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("permissions", SqlDbType.varchar, ParameterDirection.Input, 100, "")

    .AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
    .AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
    .AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With 

With DBConnection.NewCommand("GetManagePermissions", "GetManagePermissions", CommandType.StoredProcedure)
	.AddParameter("role_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetPermissions", "GetPermissions", CommandType.StoredProcedure)
	.AddParameter("role_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
	.AddParameter("action_id", SqlDbType.Int, ParameterDirection.Input, 0, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetAllowAction", "GetAllowAction", CommandType.StoredProcedure)
	.AddParameter("action_code", SqlDbType.Varchar, ParameterDirection.Input, 20, "")
	.AddParameter("allow", SqlDbType.Bit, ParameterDirection.InputOutput, 1, 0)
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

With DBConnection.NewCommand("GetMyPermission", "GetMyPermission", CommandType.StoredProcedure)
	.AddParameter("action_code", SqlDbType.Varchar, ParameterDirection.Input, 20, "")
    .AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With 

'====================================================================================================
' 
'====================================================================================================
With DBConnection.NewCommand("GetText", "GetText", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.Input, 0, 0)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
End With

With DBConnection.NewCommand("AddText", "AddText", CommandType.StoredProcedure)
	.AddParameter("id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("label", SqlDbType.varchar, ParameterDirection.Input, 100, "")
	.AddParameter("text", SqlDbType.varchar, ParameterDirection.Input, -1, "")
	.AddParameter("action", SqlDbType.tinyint, ParameterDirection.Input, 0, 10)
	.AddParameter("visit_id", SqlDbType.bigint, ParameterDirection.Input, 0, 0)
	.AddParameter("action_status_id", SqlDbType.int, ParameterDirection.InputOutput, 0, 0)
	.AddParameter("action_msg", SqlDbType.varchar, ParameterDirection.InputOutput, 200, "")
End With
