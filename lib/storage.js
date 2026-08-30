// This will store interviews in memory and persist to file

const fs = require('fs');
const path = require('path');

// File path for storing interviews
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
        console.log('📂 Loaded interviews from file:', this.interviews.size);
      } else {
        console.log('📂 No existing storage file, starting fresh');
      }
    } catch (error) {
      console.log('⚠️ Error loading storage:', error.message);
    }
  }

  saveToFile() {
    try {
      const data = Object.fromEntries(this.interviews);
      fs.writeFileSync(STORAGE_FILE, JSON.stringify(data, null, 2));
      console.log('💾 Saved interviews to file:', this.interviews.size);
    } catch (error) {
      console.error('❌ Failed to save storage:', error);
    }
  }

  set(id, data) {
    this.interviews.set(id, data);
    this.saveToFile();
    console.log('💾 Stored interview:', id);
    console.log('📊 Total interviews:', this.interviews.size);
    return true;
  }

  get(id) {
    // Reload from file to ensure we have latest data
    this.loadFromFile();
    const data = this.interviews.get(id);
    console.log('🔍 Retrieving interview:', id);
    console.log('📊 Found:', !!data);
    return data;
  }

  getAll() {
    this.loadFromFile();
    const all = [];
    for (const [id, data] of this.interviews) {
      all.push({
        id,
        jobRole: data.jobRole,
        questionCount: data.questions?.length || 0,
        responseCount: data.responses?.length || 0,
        status: data.status,
        createdAt: data.startTime,
        hasOverallFeedback: !!data.overallFeedback
      });
    }
    return all;
  }

  size() {
    this.loadFromFile();
    return this.interviews.size;
  }

  delete(id) {
    const result = this.interviews.delete(id);
    this.saveToFile();
    return result;
  }

  clear() {
    this.interviews.clear();
    this.saveToFile();
    console.log('🗑️ All interviews cleared');
  }
}

// Create a singleton instance
const storage = new InterviewStorage();

// Log initial state
console.log('🚀 Storage initialized with', storage.size(), 'interviews');

export default storage;