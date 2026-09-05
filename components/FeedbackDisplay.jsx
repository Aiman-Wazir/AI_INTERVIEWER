'use client';

export default function FeedbackDisplay({ feedback }) {
  if (!feedback) {
    return null;
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">
        Interview Feedback
      </h3>
      
      {/* Overall Score */}
      {feedback.averageScore && (
        <div className="mb-6">
          <div className="flex items-center justify-between">
            <span className="text-gray-600">Overall Score</span>
            <span className="text-3xl font-bold text-blue-600">
              {feedback.averageScore}/10
            </span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-3 mt-2">
            <div
              className="bg-blue-500 h-3 rounded-full transition-all duration-500"
              style={{ width: `${(feedback.averageScore / 10) * 100}%` }}
            />
          </div>
        </div>
      )}

      {/* Statistics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-blue-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-blue-600">
            {feedback.totalQuestions || 0}
          </div>
          <div className="text-xs text-gray-600">Total Questions</div>
        </div>
        <div className="bg-green-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-green-600">
            {feedback.answeredQuestions || 0}
          </div>
          <div className="text-xs text-gray-600">Answered</div>
        </div>
        <div className="bg-purple-50 rounded-lg p-3 text-center">
          <div className="text-2xl font-bold text-purple-600">
            {feedback.strengthsCount || 0}
          </div>
          <div className="text-xs text-gray-600">Strengths</div>
        </div>
      </div>

      {/* Strengths */}
      {feedback.strengths && (
        <div className="mb-4">
          <h4 className="font-semibold text-green-600 mb-2"> Strengths</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {Array.isArray(feedback.strengths) ? (
              feedback.strengths.map((strength, index) => (
                <li key={index}>{strength}</li>
              ))
            ) : (
              <li>{feedback.strengths}</li>
            )}
          </ul>
        </div>
      )}

      {/* Areas for Improvement */}
      {feedback.weaknesses && (
        <div className="mb-4">
          <h4 className="font-semibold text-red-600 mb-2"> Areas for Improvement</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {Array.isArray(feedback.weaknesses) ? (
              feedback.weaknesses.map((weakness, index) => (
                <li key={index}>{weakness}</li>
              ))
            ) : (
              <li>{feedback.weaknesses}</li>
            )}
          </ul>
        </div>
      )}

      {/* Suggestions */}
      {feedback.suggestions && (
        <div className="mb-4">
          <h4 className="font-semibold text-blue-600 mb-2">Suggestions</h4>
          <ul className="list-disc list-inside space-y-1 text-gray-700">
            {Array.isArray(feedback.suggestions) ? (
              feedback.suggestions.map((suggestion, index) => (
                <li key={index}>{suggestion}</li>
              ))
            ) : (
              <li>{feedback.suggestions}</li>
            )}
          </ul>
        </div>
      )}

      {/* Overall Feedback */}
      {feedback.overallFeedback && (
        <div className="mt-4 p-4 bg-gray-50 rounded-lg">
          <h4 className="font-semibold text-gray-700 mb-2"> Summary</h4>
          <p className="text-gray-600">{feedback.overallFeedback}</p>
        </div>
      )}
    </div>
  );
}