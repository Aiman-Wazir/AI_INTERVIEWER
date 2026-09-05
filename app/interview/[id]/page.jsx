{interviews.slice(0, 5).map((interview) => (
  <div key={interview.id} className="bg-white/50 border border-[#f0e8e0] rounded-xl p-4 hover:shadow-sm hover:border-[#d4c8bd] transition-all duration-200">
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
      <Link
        href={`/interview/${interview.id}`}
        className="flex items-start sm:items-center gap-3 flex-1 group"
      >
        <div className="w-9 h-9 rounded-lg bg-[#6c5ce7]/10 flex items-center justify-center flex-shrink-0">
          <Briefcase className="w-4 h-4 text-[#6c5ce7]" />
        </div>
        <div>
          <h3 className="text-sm font-medium text-[#1a1a2e] group-hover:text-[#6c5ce7] transition-colors">
            {interview.jobRole || 'Untitled'}
          </h3>
          <div className="flex flex-wrap items-center gap-2 mt-0.5">
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {interview.startTime ? new Date(interview.startTime).toLocaleDateString('en-US', { 
                month: 'short', 
                day: 'numeric'
              }) : 'N/A'}
            </span>
            <span className="text-xs text-gray-300">•</span>
            <span className="text-xs text-gray-400">
              {interview.responses?.length || 0}/{interview.questions?.length || 0}
            </span>
            <span className="text-xs text-gray-300">•</span>
            {getStatusBadge(interview.status)}
          </div>
        </div>
      </Link>
      <div className="flex items-center gap-3 ml-12 sm:ml-0">
        {interview.overallFeedback?.averageScore && (
          <div className={`text-lg font-bold ${getScoreColor(interview.overallFeedback.averageScore)}`}>
            {interview.overallFeedback.averageScore}
          </div>
        )}
        <button
          onClick={async (e) => {
            e.preventDefault();
            e.stopPropagation();
            if (confirm('Delete this interview?')) {
              try {
                const response = await fetch(`/api/interview?action=delete&interviewId=${interview.id}`);
                if (response.ok) {
                  fetchInterviews(); // Refresh the list
                }
              } catch (error) {
                console.error('Error deleting interview:', error);
              }
            }
          }}
          className="text-gray-300 hover:text-red-500 transition-colors"
          title="Delete interview"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M3 6h18" />
            <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
            <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
            <line x1="10" y1="11" x2="10" y2="17" />
            <line x1="14" y1="11" x2="14" y2="17" />
          </svg>
        </button>
        <ChevronRight className="w-4 h-4 text-gray-300 group-hover:text-[#6c5ce7] group-hover:translate-x-0.5 transition-all" />
      </div>
    </div>
  </div>
))}