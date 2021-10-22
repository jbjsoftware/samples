if object_id('dbo.fnFormatErrorMessage') is not null

	begin

		drop function fnFormatErrorMessage

	end
go

CREATE FUNCTION dbo.fnFormatErrorMessage
(        @p_ErrorProcedure nvarchar(200)
       , @p_ErrorLine int
       , @p_ErrorNumber int
       , @p_StepName nvarchar(2000)
       , @p_ErrorMessage nvarchar(2000)
)
RETURNS nvarchar(4000)
/********************************************************************************************************
// Purpose:  
//   Format an Error Message that will be passed back from all stored procedures that have error handling.
//
// Input:
//   @p_ErrorProcedure - name of the procedure (will be ERROR_PROCEDURE())
//   @p_ErrorLine      - line number of the error (will be ERROR_LINE())
//   @p_ErrorNumber    - SQL error number (will be ERROR_NUMBER())
//   @p_StepName       - the stored procs will use a @stepName variable to set the value for every "step" in the proc to know where the error would have occurred
//   @p_ErrorMessage   - SQL error message (will be ERROR_MESSAGE())
//
// Output:
//   Formatted Error Message (nvarchar(4000))
//      
//      
//
// Change History
//---------------
// Date        Developer      Story  Description
// ----------  -------------  -----  ----------------------------------
// 2021-10-21             Created Function
********************************************************************************************************/

BEGIN

       DECLARE @retValue nvarchar(4000) 
       
       SET @retValue = LEFT('Error in Proc=' + @p_ErrorProcedure + '; Line=' + CAST(@p_ErrorLine as varchar) + '; Number=' + CAST(@p_ErrorNumber as varchar) + '; Step=' + @p_StepName + '; Message=' + @p_ErrorMessage, 4000)

       RETURN (@retValue)
END