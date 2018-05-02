USE [MEDICS52]
GO

/****** Object:  StoredProcedure [dbo].[AddDoctors]    Script Date: 5/1/2018 7:20:31 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


/* =============================================*/
/* Author:		JZ*/
/* Create date: 2014-05-24*/
/* Description:	*/
/* =============================================*/
CREATE PROCEDURE [dbo].[AddHospitals]  
(
	@id int = 0 OUTPUT,
	@code varchar(10) = '',
	@spin_id varchar(20) = '',
	@name varchar(100) = '', 
	--@full_name varchar(100) = '', 
	--@specialisation_code varchar(5) = '', 
	@country_code char(3) = '', 
	@status_code char(1) = 'A',
	@blacklisted int = 0,
	@discount_type_id int = 0, 
	@discount_amount money = 0, 
	@discount_percent smallmoney, 
	@notes varchar(max),

    @action as tinyint = 10, /* 20 = insert; 10 = update; 0 = delete;*/
    @visit_id as bigint = 0, /* if needed, the user will be got from here ... and subsequently, their rights*/
    @action_status_id as int = 0 OUTPUT,
    @action_msg as varchar(200) = '' OUTPUT
) AS
BEGIN
	SET NOCOUNT ON;

    DECLARE @user_id AS int = 0
    DECLARE @update_user AS varchar(10) = ''
    DECLARE @update_date [datetime] = GETDATE()    

	EXEC [dbo].[System_ValidateUser]
		@user_id = @user_id OUTPUT,
		@user_name = @update_user OUTPUT,
		@update_date = @update_date OUTPUT,
		@action = @action,
		@visit_id = @visit_id,
		@action_status_id = @action_status_id OUTPUT,
		@action_msg = @action_msg OUTPUT

	IF @action_status_id <> 0 GOTO DONE

	IF @action = 20 /* insert */
	BEGIN
		INSERT INTO names (
			name_type,
			account_code,
			spin_id,
			name,
			--full_name, 
			--doctor_type, 
			home_country_code, 
			status_code,
			blacklisted,
			create_date,
			create_user
		)
		VALUES(
			'H',
			@code,
			@spin_id,
			@name, 
			--@full_name,
			--@specialisation_code, 
			@country_code, 
			@status_code,
			@blacklisted,
			@update_user, 
			@update_date
		)

		SET @id = CAST(SCOPE_IDENTITY() as int)

		INSERT INTO provider_discount (
			name_id, 
			discount_type_id,
			discount_amount,
			discount_percent,
			notes
		) VALUES (
			@id, 
			@discount_type_id,
			@discount_amount,
			@discount_percent,
			@notes
		)

    END ELSE IF @action = 10 /* update */
    BEGIN
		UPDATE names set
			account_code = @code,
			spin_id = @spin_id,
			name = @name, 
			--full_name = @full_name, 
			--doctor_type = @specialisation_code, 
			home_country_code = @country_code, 
			status_code = @status_code,
			blacklisted = @blacklisted,
			update_user = @update_user,
			update_date = @update_date
        WHERE id = @id

		UPDATE provider_discount SET 
			discount_type_id = @discount_type_id,
			discount_amount = @discount_amount,
			discount_percent = @discount_percent,
			notes = @notes
		WHERE name_id = @id
		
	END ELSE IF @action = 0 /* delete */
	BEGIN
		DELETE names WHERE id = @id
		DELETE provider_discount WHERE name_id = @id
    END

	RETURN	
DONE:
    --IF @action_status_id < 0
    --BEGIN
        --DECLARE @error_log_id AS int
        --EXEC dbo.LogError @error_log_id OUTPUT, @action_status_id, '', 0, @visit_id 
        --SET @action_msg = dbo.F_GetErrorLog(@error_log_id)
    --END    
END







GO


