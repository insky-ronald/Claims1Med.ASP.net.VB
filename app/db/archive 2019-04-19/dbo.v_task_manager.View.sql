SET ANSI_NULLS ON
GO
SET QUOTED_IDENTIFIER ON
GO

CREATE VIEW [dbo].[v_task_manager]
AS
	SELECT        
		ACTION_ID AS id,		CLAIM_REF AS claim_no,		CASE_OWNER AS case_owner,		TRANS_REF AS service_no,		TRANS_DATE AS transaction_date,		DAY_OUT AS transaction_end_date,
		ACTION_OWNER AS action_owner,		DUE_DATE AS due_date,		ACTION_CLASS AS action_class_code,		ActionClass AS action_class,		ACTION_CODE AS action_sub_code,
		ActionName AS action,		NAME AS full_name,		FIRST_NAME AS first_name,		MIDDLE_NAME AS middle_name,		LAST_NAME AS last_name,		PROVIDER_NAME AS provider_name,		CLAIM_NO AS claim_id,
		INVOICE_ID AS service_id,		CLM_TYPE AS claim_type,		CLAIM_TYPE AS claim_type_name,		TRANS_TYPE AS service_type,		MODULE_NAME AS service_type_name,		CLM_SUB_TYPE AS service_sub_type,		SUB_TYPE AS service_sub_type_name,		CLIENT_ID AS client_id,
		CLIENT_NAME AS client_name,		PROD_CODE AS product_code,		PRODUCT_NAME AS product_name,		POLICY_NO AS policy_no,		POLICY_HOLDER AS policy_holder,		DAYS AS days,		IS_DUE AS is_due,
		ACTION_SET_BY AS action_set_user,		ACTION_SET_DATE AS action_set_date,		STATUS AS status_code,		STATUS_DESC AS status,		INV_STATUS AS service_status_code,		INV_STATUS_DESC AS service_status,
		INV_STATUS_CODE AS service_sub_status_code,		INV_STATUS_CODE_DESC AS service_sub_status,		rtrim(ICD_CODE) AS diagnosis_code,		SHORT_NAME AS diagnosis
	FROM dbo.vw_task_manager


GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPane1', @value=N'[0E232FF0-B466-11cf-A24F-00AA00A3EFFF, 1.00]
Begin DesignProperties = 
   Begin PaneConfigurations = 
      Begin PaneConfiguration = 0
         NumPanes = 4
         Configuration = "(H (1[25] 4[52] 2[12] 3) )"
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
         Begin Table = "vw_task_manager"
            Begin Extent = 
               Top = 6
               Left = 38
               Bottom = 454
               Right = 254
            End
            DisplayFlags = 280
            TopColumn = 0
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
         Column = 1890
         Alias = 2430
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
' , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'v_task_manager'
GO
EXEC sys.sp_addextendedproperty @name=N'MS_DiagramPaneCount', @value=1 , @level0type=N'SCHEMA',@level0name=N'dbo', @level1type=N'VIEW',@level1name=N'v_task_manager'
GO
