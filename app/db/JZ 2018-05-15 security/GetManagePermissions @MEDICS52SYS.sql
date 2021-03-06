USE [MEDICS52SYS]
GO
/****** Object:  StoredProcedure [dbo].[GetManagePermissions]    Script Date: 5/16/2018 12:02:52 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

ALTER PROCEDURE [dbo].[GetManagePermissions]  (
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
	@role_id as int = 0,
    @visit_id as bigint = 0
)
AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @user_id AS int
	DECLARE @application_id AS int

	SELECT
		@user_id = user_id,
		@application_id = application_id
	FROM visits
	WHERE id = @visit_id

	DECLARE @super_application int = -1
	IF EXISTS(SELECT * FROM user_roles WHERE user_id = @user_id and role_id = 5)
		SET @super_application = 0

	DECLARE @permissions TABLE (
		role_id int,
		action_id int,
		parent_id int,
		position int ,
		code varchar(20) ,
		action_name varchar(100) ,
		action_type_id int ,
		rights varchar(512),
		rights_names varchar(512),
		permissions varchar(512),
		application_id int
	)

	INSERT INTO @permissions (
		action_id,
		parent_id,
		position,
		action_name,
		rights,
		rights_names,
		permissions
	) VALUES (
		1,
		0,
		1,
		'System',
		'',
		'',
		''
	)

	INSERT INTO @permissions (
		action_id,
		parent_id,
		position,
		action_name,
		rights,
		rights_names,
		permissions
	) VALUES (
		2,
		0,
		2,
		'Application',
		'',
		'',
		''
	)

	INSERT INTO @permissions (
		role_id,
		action_id,
		parent_id,
		position,
		code,
		action_name,
		action_type_id,
		rights,
		rights_names,
		permissions,
		application_id
	) SELECT 
		@role_id as role_id,
		id as action_id,
		parent_id,
		position,
		code,
		action_name,
		action_type_id,
		ISNULL(dbo.f_action_rights(id), '') as rights,
		dbo.f_action_rights_names(id) as rights_names,
		dbo.f_permissions(@role_id, id) as permissions,
		application_id
	FROM v_actions 
	WHERE status_code_id = 10 AND application_id in (@super_application, @application_id)

	--/*
	;WITH cte AS (
		SELECT
			action_id,
			cast(row_number() over(partition by parent_id order by position) as varchar(max)) as [path]
		FROM @permissions
		WHERE parent_id = 0
		UNION ALL
		SELECT
			t.action_id,
			[path] + cast(row_number()over(partition by t.parent_id order by t.position) as varchar(max))
		FROM cte
		JOIN @permissions t ON cte.action_id = t.parent_id
	) 
	SELECT 
		--t.path,
		s.*
		--s.permissions as xxx
	FROM cte t
	JOIN @permissions s on t.action_id = s.action_id
	ORDER by t.path 
	--*/
	--SELECT * FROM @permissions ORDER by position
END

