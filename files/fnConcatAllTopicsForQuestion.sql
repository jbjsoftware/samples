if object_id('dbo.fnConcatAllTopicsForQuestion') is not null

	begin

		drop function fnConcatAllTopicsForQuestion

	end
go

CREATE FUNCTION dbo.fnConcatAllTopicsForQuestion
(        @p_QuestionId bigint
)
RETURNS nvarchar(4000)
/********************************************************************************************************
// Purpose:  
//   Format a concatinated pipe-delimited list of all the Topics associated to the QuestionId passed in.
//
//   NOTE:  If the Topic is not active, then append "(inactive)" to the right of the TopicName.
//
// Input:
//   @p_QuestionId - pass in QuestionId to find all Topics associated to that question
//
// Output:
//   Formatted list of TaskNames (pipe-delimited) (nvarchar(4000))
//      
//      
//
// Change History
//---------------
// Date        Developer      Story  Description
// ----------  -------------  -----  ----------------------------------
// 2020-07-16            Created Function
********************************************************************************************************/

BEGIN

	DECLARE @retValue nvarchar(4000)
	      , @rowCount int
       
	DECLARE @TopicList TABLE
	(	  RowNumber bigint identity(1,1)
		, TopicName nvarchar(100)
	)

	-- ===============================================
	-- 1. populate the @TopicList in the ORDER in which topics should be displayed
	--    Format TopicName with "(inactive)" to the right of the name if dbo.Topic.Active = 0
	-- ===============================================

	INSERT INTO @TopicList (TopicName)
	SELECT TopicName = T.TopicName + (CASE WHEN T.Active = 0 THEN ' (inactive)' ELSE '' END)
	FROM dbo.Topic_Question as TQ
	JOIN dbo.Topic as T on TQ.TopicId = T.TopicId AND T.Active = 1
	WHERE TQ.QuestionId = @p_QuestionId
	ORDER BY T.TopicName

	SELECT @rowCount = @@ROWCOUNT


	-- ===============================================
	-- 2. Concatinate the TopicName values with a | (post)
	--     order it by RowNumber 
	-- ===============================================

	;with CTE (RowNumber, FullValue) AS
	(
		SELECT TL.RowNumber
		     , FullValue = cast(TL.TopicName as nvarchar(4000))
		FROM @TopicList as TL
		WHERE TL.RowNumber = 1

		UNION ALL

		SELECT TL.RowNumber
		     , FullValue =  cast(CTE.FullValue + ' | ' + TL.TopicName as nvarchar(4000))
		FROM CTE
		JOIN @TopicList as TL ON TL.RowNumber = CTE.RowNumber+1
	)
	SELECT @retValue = CTE.FullValue
	--FROM (SELECT MAX(CTE.RowNumber) as MaxRowNumber FROM CTE) as MAX_CTE
	FROM CTE
	WHERE CTE.RowNumber = @rowCount

	RETURN (@retValue)

END