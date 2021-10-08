use EQPScreening
go

IF object_id('dbo.DeleteTopic') IS NULL
	exec('CREATE PROCEDURE dbo.DeleteTopic ( @p_TopicId bigint) AS BEGIN SET NOCOUNT ON; END')
GO

ALTER PROCEDURE dbo.DeleteTopic
(	 @p_TopicId bigint              
)
AS
/********************************************************************************************************
// Purpose:  
//   Perform a Hard Delete on a dbo.Topic
//
//   PLUS --> delete all dbo.Topic_Question associations for the TopicId
//   PLUS --> delete all Question records associated to this Topic if this is the ONLY Topic associated to the Question.
//
//
// Input:
//	 @p_TopicId bigint            --PK on the dbo.Topic table
//
// OUTPUT:
//   None 
//
// Change History
//---------------
// Date        Developer	  Story  Description
// ----------  -------------  -----  ----------------------------------
// 2020-07-06  	         Created Procedure 
// 
********************************************************************************************************/

DECLARE @locked table (Id bigint) -- for Update locking
DECLARE @canDelete bit = 0

-- for error handling
DECLARE @stepName					NVARCHAR(2000)
	  , @messageText				NVARCHAR(4000)

-- for all QuestionId's associates to the TopicId we are deleting and the # of Topics
DECLARE @questionList TABLE
(	  
      QuestionId bigint
)

SET NOCOUNT ON
SET XACT_ABORT ON

BEGIN TRANSACTION

BEGIN TRY

	-- ==============================================
	-- 1. Get list of QuestionId(s) to be deleted if THIS is the only Topic associated to the Question 
	-- ==============================================
		
	SET @stepName = 'get list of QuestionId(s) to Delete'

	INSERT INTO @questionList (QuestionId)
	SELECT QuestionDeleteList.QuestionId
	FROM
	(	SELECT QuestionList.QuestionId, count(*) as NbrTopics
		FROM
		(	SELECT TQ.QuestionId
			FROM dbo.Topic_Question as TQ
			WHERE TQ.TopicId = @p_TopicId
		) as QuestionList
		LEFT JOIN dbo.Topic_Question as TQ
			ON QuestionList.QuestionId = TQ.QuestionId
		GROUP BY QuestionList.QuestionId
	) as QuestionDeleteList
	WHERE QuestionDeleteList.NbrTopics = 1  -- the 1 is the @p_TopicId passed in


	-- ==============================================
	-- 2. Delete all Topic_Question rows for the TopicId
	-- ==============================================

	SET @stepName = 'Delete dbo.Topic_Question'

	DELETE TQ
	FROM dbo.Topic_Question as TQ
	WHERE TQ.TopicId = @p_TopicId


	-- ==============================================
	-- 3. Delete Question(s) from list in Step 1
	-- ==============================================
		
	SET @stepName = 'Delete dbo.Question'

	DELETE Q
	FROM @questionList as LIST
	JOIN dbo.Question as Q
	    ON LIST.QuestionId = Q.QuestionId


	-- ==============================================
	-- 4. Delete the Topic
	-- ==============================================

	SET @stepName = 'Delete dbo.Topic'

	DELETE T
	FROM dbo.Topic as T
	WHERE T.TopicId = @p_TopicId


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


