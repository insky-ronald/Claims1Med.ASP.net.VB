DROP PROCEDURE [dbo].[AddUser]
GO
/****** Object:  StoredProcedure [dbo].[AddUser]    Script Date: 3/8/2017 6:09:31 AM ******/
SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE PROCEDURE [dbo].[AddUser]
-- ***************************************************************************************************
-- Last modified on
-- 08-MAR-2017
-- *************************************************************************************************** 
(
    @id as int = 0 OUTPUT,
	@organisation_id as int = 0,
    @user_name as varchar(200) = '' ,
    @last_name as varchar(60) = '' ,
	@middle_name as varchar(60) = '' ,
    @first_name as varchar(60) = '' ,
    --@designation as varchar(60) = '' ,
    @gender as char(1) = '' ,
	@dob as datetime = null,
    @email as varchar(200) = '' ,
    @status_code_id as integer = 10,
    @roles as varchar(100) = '',
    
    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

	DECLARE @application_id int
    DECLARE @this_user_id AS int

	SELECT
		@this_user_id = user_id,
		@application_id = application_id
	FROM visits
	WHERE id = @visit_id

    DECLARE @this_user_name AS varchar(10) = LEFT(dbo.F_VisitUserName(@visit_id), 10)

    SET @action_msg = ''
    SET @action_status_id = 0

	IF NOT @action IN (0, 10, 20)
		SET @action_status_id = -250 /* invalid request*/

	IF @action_status_id >= 0 AND (@this_user_id < 1 or not exists (SELECT * from users WHERE [id] = @this_user_id) ) AND exists (SELECT * from users WHERE [id] > 0) /* skip during DB initialisation */
		SET @action_status_id = -15 /* not logged in*/

	IF @action_status_id < 0 GOTO DONE

	IF @action = 10 and @id > 0
	BEGIN
		UPDATE dbo.users  SET 
			last_name = @last_name,
			middle_name = @middle_name,
			first_name = @first_name,
			gender = @gender,
			dob = @dob,
			email = @email,
			status_code_id = @status_code_id
		WHERE id = @id

		EXEC AddUserRoles @user_id=@id, @role_ids=@roles
	END
	ELSE IF @action = 20 and @id = 0
	BEGIN
		INSERT INTO dbo.users (
			organisation_id,
			last_name,
			middle_name,
			first_name,
			gender,
			dob,
			email,
			status_code_id
		) 
		VALUES (
			@organisation_id,
			@last_name,
			@middle_name,
			@first_name,
			@gender,
			@dob,
			@email,
			@status_code_id
		)

		SET @id = cast(scope_identity() AS int)

		INSERT INTO application_users (
			application_id, 
			user_id
		) values (
			@application_id, 
			@id
		)

		INSERT INTO dbo.user_login_info (
			id,
			user_name,
			password
		) 
		VALUES (
			@id,
			@user_name,
			HASHBYTES ('SHA1', 'pass1234')
		)

		EXEC AddUserRoles @user_id=@id, @role_ids=@roles
	END
	ELSE IF @action = 0
	BEGIN
		DELETE dbo.users WHERE id = @id
		DELETE dbo.user_login_info WHERE id = @id
		DELETE dbo.application_users WHERE user_id = @id
		EXEC AddUserRoles @user_id=@id, @role_ids=''
	END

DONE:
	   
END
