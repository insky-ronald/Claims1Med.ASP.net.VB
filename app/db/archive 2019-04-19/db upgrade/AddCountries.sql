/* =============================================*/
/* Author:		JZ*/
/* Create date: 2014-05-24*/
/* Description:	*/
/* =============================================*/
ALTER PROCEDURE [dbo].[AddCountries]  
(
	@code char(3) = '' OUTPUT,
    @iso_code as char(3) = '',
    @country varchar(20) = '',
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
		--@update_date datetime = NULL OUTPUT,
		@action = @action,
		@visit_id = @visit_id,
		@action_status_id = @action_status_id OUTPUT,
		@action_msg = @action_msg OUTPUT

	DECLARE @cnt AS int = 0



	IF @action = 20 /* insert */
	BEGIN
		SET NOCOUNT ON;

		SELECT @cnt = count(*) from countries where code = @code

		IF @cnt > 0
		BEGIN
		   SET @action_msg = 'Country code <B>' + @code + '</B> already exist.'
		   SET @action_status_id = -1
		END

		SELECT @cnt = count(*) from countries where UPPER(country) = UPPER(@country)

		IF @cnt > 0
		BEGIN
		   IF @action_msg = ''
		      SET @action_msg = 'Country <B>' + @country + '</B> already exist.'
		   ELSE
		      SET @action_msg = @action_msg + ' </BR> Country <B>' + @country + '</B> already exist.' 

		   SET @action_status_id = -1
		END

		IF NOT @action_msg = '' GOTO DONE

		INSERT INTO countries(code, iso_code, country, create_user, create_date)
		VALUES(@code, @iso_code, @country, @update_user, @update_date)
    END ELSE IF @action = 10 /* update */
    BEGIN
		UPDATE countries set
			iso_code = @iso_code,
			country = @country,
			update_user = @update_user,
			update_date = @update_date
        WHERE code = @code
	END ELSE IF @action = 0 /* delete */
	BEGIN
		DELETE countries WHERE code = @code
    END
    
DONE:
    IF @action_status_id < 0
    BEGIN
        DECLARE @error_log_id AS int
        --EXEC dbo.LogError @error_log_id OUTPUT, @action_status_id, '', 0, @visit_id 
        --SET @action_msg = dbo.F_GetErrorLog(@error_log_id)
    END
    
END






