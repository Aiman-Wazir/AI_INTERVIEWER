// lib/storage.js
const fs = require('fs');
const path = require('path');

const STORAGE_FILE = path.join(process.cwd(), '.interview-storage.json');

class InterviewStorage {
  constructor() {
    this.interviews = new Map();
    this.loadFromFile();
  }

  loadFromFile() {
    try {
      if (fs.existsSync(STORAGE_FILE)) {
        const data = fs.readFileSync(STORAGE_FILE, 'utf8');
        const parsed = JSON.parse(data);
        this.interviews = new Map(Object.entries(parsed));
        console.log('Loaded interviews from file:', this.interviews.size);
      }
    } catch (error) {
      console.log('No existing storage file');
    }
  }

  saveToFile() {
    try {
      const data = Object.fromEntries(this.interviews);
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
      console.log('Saved interviews to file:', this.interviews.size);
    } catch (error) {
      console.error('Failed to save storage:', error);
    }
  }

  set(id, data) {
    this.interviews.set(id, data);
    this.saveToFile();
    console.log('Stored interview:', id);
    return true;
  }

  get(id) {
    this.loadFromFile();
    const data = this.interviews.get(id);
    console.log('Retrieving interview:', id, 'Found:', !!data);
    return data;
  }

  // Add delete method
  delete(id) {
    const exists = this.interviews.has(id);
    if (exists) {
      this.interviews.delete(id);
      this.saveToFile();
      console.log('Deleted interview:', id);
      return true;
    }
    console.log('Interview not found for deletion:', id);
    return false;
  }

  getAll() {
    this.loadFromFile();
    const all = [];
    for (const [id, data] of this.interviews) {
      all.push({
        id,
        jobRole: data.jobRole,
        questions: data.questions || [],
        responses: data.responses || [],
        status: data.status,
        startTime: data.startTime,
        overallFeedback: data.overallFeedback || null,
        questionCount: data.questions?.length || 0,
        responseCount: data.responses?.length || 0
      });
    }
    return all;
  }

  size() {
    this.loadFromFile();
    return this.interviews.size;
  }

  clear() {
    this.interviews.clear();
    this.saveToFile();
    console.log('All interviews cleared');
  }
}

const storage = new InterviewStorage();
export default storage;