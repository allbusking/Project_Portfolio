import axios from 'axios';

const GITHUB_USERNAME = 'onnoi10'; // CHANGE THIS to your GitHub username
const GITHUB_API = 'https://api.github.com';

// Optional: Add GitHub Personal Access Token for higher rate limits
const GITHUB_TOKEN = ''; // Leave empty or add token

const api = axios.create({
  baseURL: GITHUB_API,
  headers: GITHUB_TOKEN ? {
    'Authorization': `token ${GITHUB_TOKEN}`
  } : {}
});

export const githubService = {
  // Get user profile data
  async getUserProfile() {
    try {
      const response = await api.get(`/users/${GITHUB_USERNAME}`);
      return response.data;
    } catch (error) {
      console.error('Error fetching user profile:', error);
      throw error;
    }
  },

  // Get user's repositories
  async getRepositories() {
    try {
      const response = await api.get(`/users/${GITHUB_USERNAME}/repos`, {
        params: {
          sort: 'updated',
          per_page: 100
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching repositories:', error);
      throw error;
    }
  },

  // Get contribution data using GitHub's contribution API
  async getContributionData() {
    try {
      // Use GitHub's GraphQL API for accurate contribution data
      const query = `
        query($username: String!) {
          user(login: $username) {
            contributionsCollection {
              contributionCalendar {
                totalContributions
                weeks {
                  contributionDays {
                    contributionCount
                    date
                  }
                }
              }
            }
          }
        }
      `;

      const response = await axios.post(
        'https://api.github.com/graphql',
        {
          query,
          variables: { username: GITHUB_USERNAME }
        },
        {
          headers: GITHUB_TOKEN ? {
            'Authorization': `bearer ${GITHUB_TOKEN}`,
            'Content-Type': 'application/json'
          } : {
            'Content-Type': 'application/json'
          }
        }
      );

      return response.data.data.user.contributionsCollection.contributionCalendar;
    } catch (error) {
      console.error('Error fetching contribution data:', error);
      // Fallback to simpler API if GraphQL fails
      return this.getContributionDataFallback();
    }
  },

  // Fallback method using third-party API
  async getContributionDataFallback() {
    try {
      const response = await axios.get(
        `https://github-contributions-api.jogruber.de/v4/${GITHUB_USERNAME}?y=last`
      );
      return this.transformContributionData(response.data);
    } catch (error) {
      console.error('Error in fallback:', error);
      return { totalContributions: 0, weeks: [] };
    }
  },

  // Transform third-party API data to match GraphQL format
  transformContributionData(data) {
    if (!data?.contributions) {
      return { totalContributions: 0, weeks: [] };
    }

    const contributions = data.contributions;
    const total = contributions.reduce((sum, day) => sum + day.count, 0);

    // Group by weeks
    const weeks = [];
    let currentWeek = [];

    contributions.forEach((day, index) => {
      currentWeek.push({
        contributionCount: day.count,
        date: day.date
      });

      if (currentWeek.length === 7 || index === contributions.length - 1) {
        weeks.push({ contributionDays: currentWeek });
        currentWeek = [];
      }
    });

    return {
      totalContributions: total,
      weeks
    };
  },

  // Calculate streak from contribution calendar
  calculateStreaks(contributionCalendar) {
    const { weeks } = contributionCalendar;
    
    // Flatten all days
    const allDays = weeks.flatMap(week => week.contributionDays);
    
    // Sort by date (most recent first)
    allDays.sort((a, b) => new Date(b.date) - new Date(a.date));

    let currentStreak = 0;
    let longestStreak = 0;
    let tempStreak = 0;
    let currentStreakStart = null;
    let currentStreakEnd = null;
    let longestStreakStart = null;
    let longestStreakEnd = null;

    // Calculate current streak (from today backwards)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    for (let i = 0; i < allDays.length; i++) {
      const day = allDays[i];
      const dayDate = new Date(day.date);
      dayDate.setHours(0, 0, 0, 0);

      if (day.contributionCount > 0) {
        tempStreak++;
        
        // Update current streak (only if it's continuous from today)
        if (i === 0 || (currentStreak > 0 && currentStreak === tempStreak - 1)) {
          currentStreak = tempStreak;
          if (!currentStreakStart) currentStreakStart = day.date;
          currentStreakEnd = day.date;
        }

        // Update longest streak
        if (tempStreak > longestStreak) {
          longestStreak = tempStreak;
          longestStreakStart = day.date;
          longestStreakEnd = allDays[i - tempStreak + 1]?.date || day.date;
        }
      } else {
        tempStreak = 0;
      }
    }

    return {
      current: currentStreak,
      currentStart: currentStreakEnd, // Note: reversed because we went backwards
      currentEnd: currentStreakStart,
      longest: longestStreak,
      longestStart: longestStreakEnd, // Note: reversed because we went backwards
      longestEnd: longestStreakStart
    };
  },

  // Get most used languages
  async getMostUsedLanguages() {
    try {
      const repos = await this.getRepositories();
      const languageStats = {};
      let totalBytes = 0;

      // Get language data for each repo
      for (const repo of repos.slice(0, 30)) { // Limit to 30 repos to avoid rate limits
        if (repo.language) {
          try {
            const langResponse = await api.get(`/repos/${GITHUB_USERNAME}/${repo.name}/languages`);
            const languages = langResponse.data;

            Object.entries(languages).forEach(([lang, bytes]) => {
              languageStats[lang] = (languageStats[lang] || 0) + bytes;
              totalBytes += bytes;
            });
          } catch (error) {
            // Skip if language data not available
            continue;
          }
        }
      }

      // Convert to percentages and sort
      return Object.entries(languageStats)
        .map(([language, bytes]) => ({
          language,
          bytes,
          percentage: ((bytes / totalBytes) * 100).toFixed(1)
        }))
        .sort((a, b) => b.bytes - a.bytes)
        .slice(0, 5);
    } catch (error) {
      console.error('Error calculating languages:', error);
      throw error;
    }
  },

  // Format date range
  formatDateRange(startDate, endDate) {
    if (!startDate || !endDate) return '';
    
    const start = new Date(startDate);
    const end = new Date(endDate);
    
    const formatDate = (date) => {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return `${formatDate(start)} - ${formatDate(end)}`;
  }
};