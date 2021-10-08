use EQPScreening
go

IF object_id('dbo.DeleteQuestion') IS NULL
	exec('CREATE PROCEDURE dbo.DeleteQuestion ( @p_QuestionId bigint) AS BEGIN SET NOCOUNT ON; END')
GO

ALTER PROCEDURE dbo.DeleteQuestion
(	 @p_QuestionId bigint              
)
AS
/********************************************************************************************************
// Purpose:  
//   Perform a Hard Delete on a dbo.Question
//
//   PLUS --> delete all dbo.Topic_Question associations for the QuestionId
//   PLUS --> delete all Topic records associated to this Question if this is the ONLY Question associated to the Topic.
//
//
// Input:
//	 @p_QuestionId bigint            --PK on the dbo.Question table
//
// OUTPUT:
//   None 
//
// Change History
//---------------
// Date        Developer	  Story  Description
// ----------  -------------  -----  ----------------------------------
// 2020-07-20  Randy Pfaff	         Created Procedure 
// 
********************************************************************************************************/

-- for error handling
DECLARE @stepName					NVARCHAR(2000)
	  , @messageText				NVARCHAR(4000)

-- for all TaskId's associates to the QuestionId we are deleting 
DECLARE @topicList TABLE
(	  
      TopicId bigint
)

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION

BEGIN TRY

	-- ==============================================
	-- 1. Get list of TopicId(s) to be deleted if THIS is the only Question associated to the Topic 
	-- ==============================================
		
	SET @stepName = 'get list of TopicId(s) to Delete'

	INSERT INTO @topicList (TopicId)
	SELECT TopicDeleteList.TopicId
	FROM
	(	SELECT TopicList.TopicId, count(*) as NbrQuestions
		FROM
		(	SELECT TQ.TopicId
			FROM dbo.Topic_Question as TQ
			WHERE TQ.QuestionId = @p_QuestionId
		) as TopicList
		LEFT JOIN dbo.Topic_Question as TQ
			ON TopicList.TopicId = TQ.TopicId
		GROUP BY TopicList.TopicId
	) as TopicDeleteList
	WHERE TopicDeleteList.NbrQuestions = 1  -- the 1 is the @p_QuestionId passed in meaning that's the only Question the Topic is related to


	-- ==============================================
	-- 2. Delete all Topic_Question rows for the QuestionId
	-- ==============================================

	SET @stepName = 'Delete dbo.Topic_Question'

	DELETE TQ
	FROM dbo.Topic_Question as TQ
	WHERE TQ.QuestionId = @p_QuestionId


	-- ==============================================
	-- 3. Delete Topics(s) from list in Step 1
	-- ==============================================
		
	SET @stepName = 'Delete dbo.Topic'

	DELETE T
	FROM @topicList as LIST
	JOIN dbo.Topic as T
	    ON LIST.TopicId = T.TopicId


	-- ==============================================
	-- 4. Delete the Question
	-- ==============================================

	SET @stepName = 'Delete dbo.Question'

	DELETE Q
	FROM dbo.Question as Q
	WHERE Q.QuestionId = @p_QuestionId


	COMMIT TRANSACTION

END TRY

BEGIN CATCH

	IF XACT_STATE() <> 0
    BEGIN
        ROLLBACK TRANSACTION
    END

	DECLARE @ERROR_SEVERITY as int = ERROR_SEVERITY()
	      , @ERROR_STATE as int = ERROR_STATE()

	SET @messageText = dbo.fnFormatErrorMessage(ERROR_PROCEDURE(), ERROR_LINE(), ERROR_NUMBER(), @stepName, ERROR_MESSAGE())

	RAISERROR (@messageText, @ERROR_SEVERITY, @ERROR_STATE)

END CATCH

GO


