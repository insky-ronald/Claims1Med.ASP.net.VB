SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO


CREATE VIEW [dbo].[claims]
AS
	SELECT
		CLAIM_NO AS id,
		CLAIM_REF AS claim_no,
		IP_ID AS member_id, 
		COMP_ID AS name_id, 
		CLIENT_ID AS client_id,
		POLICY_ID AS policy_id,
		HCM_REF AS hcm_reference,
		REF_NO1 AS reference_no1,
		REF_NO2 AS reference_no2,
		REF_NO3 AS reference_no3,
		rtrim(PROD_CODE) AS product_code, 
		rtrim(SUB_PRODUCT) AS sub_product, 
		rtrim(PLAN_CODE) AS plan_code, 
		rtrim(CLM_TYPE) AS claim_type, 
		INC_DATE AS incident_date, 
		INC_CTRY AS country_of_incident, 
		ACCD_DATE AS accident_date, 
		ACCD_CODE AS accident_code, 
		SYMP1_DATE AS first_symptom_date, 
		CONSULT1_DATE AS first_consultation_date, 
		rtrim(ICD_CODE) AS diagnosis_code, 
		CONDITION AS diagnosis_notes, 
		FINAL_ICD AS final_diagnosis_code, 
		FINAL_CONDITION AS final_diagnosis_notes, 
		BASE_CRCY AS base_currency_code, 
		CLT_CRCY AS client_currency_code, 
		ELG_CRCY AS eligibility_currency_code, 
		REC_DATE AS notification_date, 
		CASE_OWNER AS case_owner, 
		STATUS AS status_code, 
		STATUS_ID AS status_id, 
		ESTIMATE_ID AS estimete_id, 
		IS_ACCIDENT AS is_accident, 
		IsDeleted AS is_deleted, 
		IS_PREEXISTING AS is_prexisting, 
		InsertDate AS create_date, 
		InsertUser AS create_user, 
		UpdateDate AS update_date, 
		UpdateUser AS update_user
	FROM dbo.tb_claims



GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[40] 4[29] 2[11] 3) )"
      End
      Begin PaneConfiguration = 1
         NumPanes = 3
         Configuration = "(H (1 [50] 4 [25] 3))"
      End
      Begin PaneConfiguration = 2
         NumPanes = 3
         Configuration = "(H (1 [50] 2 [25] 3))"
      End
      Begin PaneConfiguration = 3
         NumPanes = 3
         Configuration = "(H (4 [30] 2 [40] 3))"
      End
      Begin PaneConfiguration = 4
         NumPanes = 2
         Configuration = "(H (1 [56] 3))"
      End
      Begin PaneConfiguration = 5
         NumPanes = 2
         Configuration = "(H (2 [66] 3))"
      End
      Begin PaneConfiguration = 6
         NumPanes = 2
         Configuration = "(H (4 [50] 3))"
      End
      Begin PaneConfiguration = 7
         NumPanes = 1
         Configuration = "(V (3))"
      End
      Begin PaneConfiguration = 8
         NumPanes = 3
         Configuration = "(H (1[56] 4[18] 2) )"
      End
      Begin PaneConfiguration = 9
         NumPanes = 2
         Configuration = "(H (1 [75] 4))"
      End
      Begin PaneConfiguration = 10
         NumPanes = 2
         Configuration = "(H (1[66] 2) )"
      End
      Begin PaneConfiguration = 11
         NumPanes = 2
         Configuration = "(H (4 [60] 2))"
      End
      Begin PaneConfiguration = 12
         NumPanes = 1
         Configuration = "(H (1) )"
      End
      Begin PaneConfiguration = 13
         NumPanes = 1
         Configuration = "(V (4))"
      End
      Begin PaneConfiguration = 14
         NumPanes = 1
         Configuration = "(V (2))"
      End
      ActivePaneConfig = 0
   End
   Begin DiagramPane = 
      Begin Origin = 
         Top = 0
         Left = 0
      End
      Begin Tables = 
         Begin Table = "tb_claims"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 374
               Right = 221
            End
            DisplayFlags = 280
            TopColumn = 3
         End
      End
   End
   Begin SQLPane = 
   End
   Begin DataPane = 
      Begin ParameterDefaults = ""
      End
   End
   Begin CriteriaPane = 
      Begin ColumnWidths = 11
         Column = 1440
         Alias = 1935
         Table = 1170
         Output = 720
         Append = 1400
         NewValue = 1170
         SortType = 1350
         SortOrder = 1410
         GroupBy = 1350
         Filter = 1350
         Or = 1350
         Or = 1350
         Or = 1350
      End
   End
End
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'claims'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'claims'
GO
