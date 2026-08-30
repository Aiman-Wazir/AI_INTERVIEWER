export class Interview {
  constructor(data) {
    this.id = data.id || null;
    this.userId = data.userId || '';
    this.jobRole = data.jobRole || '';
    this.experience = data.experience || 0;
    this.skills = data.skills || [];
    this.questions = data.questions || [];
    this.responses = data.responses || [];
    this.currentQuestion = data.currentQuestion || 0;
    this.status = data.status || 'in-progress';
    this.startTime = data.startTime || new Date().toISOString();
    this.endTime = data.endTime || null;
  }

  addResponse(question, answer, feedback) {
    this.responses.push({
      question,
      answer,
      feedback,
      timestamp: new Date().toISOString()
    });
    this.currentQuestion = this.responses.length;
    if (this.currentQuestion >= this.questions.length) {
      this.status = 'completed';
      this.endTime = new Date().toISOString();
    }
  }

  getProgress() {
    if (this.questions.length === 0) return 0;
    return (this.responses.length / this.questions.length) * 100;
  }

  getAverageScore() {
    const scores = this.responses
      .map(r => r.feedback?.score)
      .filter(s => s !== undefined && s !== null);
    if (scores.length === 0) return 0;
    return scores.reduce((a, b) => a + b, 0) / scores.length;
  }

  isComplete() {
    return this.status === 'completed';
  }

  toJSON() {
    return {
      id: this.id,
      userId: this.userId,
      jobRole: this.jobRole,
      experience: this.experience,
      skills: this.skills,
      questions: this.questions,
      responses: this.responses,
      currentQuestion: this.currentQuestion,
      status: this.status,
      startTime: this.startTime,
      endTime: this.endTime
    };
  }
}