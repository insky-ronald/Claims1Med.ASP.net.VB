USE [MEDICS52]
GO

/****** Object:  View [dbo].[v_report_2005]    Script Date: 6/18/2018 7:02:37 PM ******/
SET ANSI_NULLS ON
GO

SET QUOTED_IDENTIFIER ON
GO


ALTER VIEW [dbo].[v_report_2005] AS
select
 note_id as id,
 invoice_id,
 ip_id,
 client_id, 
 ReferenceNo as reference_no,
 CallDate as call_date,
 note_code,
 NoteCategory as note_category,
 sub_code,
 NoteSubCategory as note_sub_category,
 notes,
 NoteInsertDate as note_insert_date,
 NoteInsertUser as note_insert_user,
 service_type,
 ServiceType as service_type_desc,
 MemberName as member_name,
 CallerName as caller_name,
 relationship,
 ClientName as client_name,
 status,
 MainStatus as main_status,
 status_code,
 SubStatus as sub_status,
 CountryCode as country_code,
 town,
 place,
 PhoneNo as phone_no,
 email
from vw_report_2005

GO


