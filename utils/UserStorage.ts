import * as fs from 'fs';
import * as path from 'path';

/**
 * User data structure
 */
export interface UserData {
  email: string;
  password: string;
  timestamp: number;
  createdAt?: string; // ISO date string
  date?: string; // Date in YYYY-MM-DD format
  time?: string; // Time in HH:MM:SS format
  day?: string; // Day of week (Monday, Tuesday, etc.)
  dateTime?: string; // Full date and time string
}

/**
 * Users data structure
 */
export interface UsersData {
  users: UserData[];
}

/**
 * User Storage Utility
 * Handles reading and writing user credentials to JSON file
 */
export class UserStorage {
  // Use absolute path resolution to ensure it works in all contexts
  private static readonly USERS_FILE_PATH = path.resolve(process.cwd(), 'data', 'users.json');

  /**
   * Ensure data directory exists
   */
  private static ensureDataDirectory(): void {
    const dataDir = path.dirname(this.USERS_FILE_PATH);
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
  }

  /**
   * Read users from JSON file
   * @returns Users data object
   */
  static readUsers(): UsersData {
    this.ensureDataDirectory();

    if (fs.existsSync(this.USERS_FILE_PATH)) {
      try {
        const fileContent = fs.readFileSync(this.USERS_FILE_PATH, 'utf-8');
        return JSON.parse(fileContent) as UsersData;
      } catch (error) {
        console.warn('⚠️ Failed to read users file, creating new one:', error);
        return { users: [] };
      }
    }

    return { users: [] };
  }

  /**
   * Save user to JSON file
   * @param userData - User data to save
   */
  static saveUser(userData: UserData): void {
    console.log(`📝 UserStorage.saveUser called with email: ${userData.email}`);
    console.log(`📁 File path: ${this.USERS_FILE_PATH}`);
    
    this.ensureDataDirectory();

    // Ensure timestamp is a valid number (use current time if invalid or not provided)
    let timestamp: number;
    if (typeof userData.timestamp === 'number' && userData.timestamp > 0 && !isNaN(userData.timestamp)) {
      timestamp = userData.timestamp;
    } else {
      // If timestamp is invalid or not provided, use current time
      timestamp = Date.now();
    }
    
    // Create date object from timestamp
    const dateObj = new Date(timestamp);
    
    // Format date components
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');
    
    // Day names
    const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const dayName = dayNames[dateObj.getDay()];
    
    // Format date and time strings
    const dateStr = `${year}-${month}-${day}`;
    const timeStr = `${hours}:${minutes}:${seconds}`;
    const dateTimeStr = `${dateStr} ${timeStr}`;
    
    // Add all date/time information for readability
    const userDataWithDate: UserData = {
      ...userData,
      timestamp,
      createdAt: dateObj.toISOString(),
      date: dateStr,
      time: timeStr,
      day: dayName,
      dateTime: dateTimeStr,
    };

    const usersData = this.readUsers();
    console.log(`📊 Current users count: ${usersData.users.length}`);
    usersData.users.push(userDataWithDate);
    console.log(`📊 New users count: ${usersData.users.length}`);

    try {
      const fileContent = JSON.stringify(usersData, null, 2);
      fs.writeFileSync(
        this.USERS_FILE_PATH,
        fileContent,
        'utf-8'
      );
      console.log(`✅ User credentials saved successfully: ${userData.email} (${dateTimeStr}, ${dayName})`);
      console.log(`📁 File written to: ${this.USERS_FILE_PATH}`);
    } catch (error) {
      console.error('❌ Failed to save user credentials:', error);
      console.error(`❌ Error details:`, error instanceof Error ? error.message : String(error));
      throw error;
    }
  }

  /**
   * Get all users
   * @returns Array of all users
   */
  static getAllUsers(): UserData[] {
    return this.readUsers().users;
  }

  /**
   * Get the latest user
   * @returns Latest user or null if no users exist
   */
  static getLatestUser(): UserData | null {
    const users = this.getAllUsers();
    return users.length > 0 ? users[users.length - 1] : null;
  }
}
