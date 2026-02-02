import React, { useState, useEffect } from 'react';
import { Github, ExternalLink } from 'lucide-react';
import { githubService } from '../services/githubServices';

const GitHubStats = ({ isVisible }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [stats, setStats] = useState({
    totalContributions: 0,
    currentStreak: 0,
    currentStreakDates: '',
    longestStreak: 0,
    longestStreakDates: '',
    topLanguages: [],
    profile: null
  });

  useEffect(() => {
    const fetchGitHubData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch all data in parallel
        const [profile, contributionCalendar, languages] = await Promise.all([
          githubService.getUserProfile(),
          githubService.getContributionData(),
          githubService.getMostUsedLanguages()
        ]);

        // Calculate streaks
        const streaks = githubService.calculateStreaks(contributionCalendar);

        console.log('Contribution Data:', contributionCalendar);
        console.log('Streaks:', streaks);

        setStats({
          totalContributions: contributionCalendar.totalContributions,
          currentStreak: streaks.current,
          currentStreakDates: githubService.formatDateRange(streaks.currentStart, streaks.currentEnd),
          longestStreak: streaks.longest,
          longestStreakDates: githubService.formatDateRange(streaks.longestStart, streaks.longestEnd),
          topLanguages: languages,
          profile
        });

        setLoading(false);
      } catch (error) {
        console.error('Error fetching GitHub data:', error);
        setError('Failed to load GitHub stats. Please try again later.');
        setLoading(false);
      }
    };

    if (isVisible) {
      fetchGitHubData();
    }
  }, [isVisible]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-pink-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <p className="text-red-400 mb-4">{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  // Calculate circle progress for current streak
  const streakProgress = stats.longestStreak > 0 
    ? (stats.currentStreak / stats.longestStreak) * 251.2 
    : 0;

  return (
    <div className="flex flex-col items-center space-y-12">
      {/* Contributions Stats - Centered */}
      <div className="flex items-center justify-center space-x-12">
        {/* Total Contributions */}
        <div className="text-center">
          <div className="text-5xl font-bold text-pink-500 mb-2">
            {stats.totalContributions}
          </div>
          <div className="text-sm text-gray-400">Total Contributions</div>
          <div className="text-xs text-gray-500 mt-1">Last Year</div>
        </div>

        {/* Circular Progress for Current Streak */}
        <div className="relative w-24 h-24">
          <svg className="transform -rotate-90 w-24 h-24">
            <circle 
              cx="48" 
              cy="48" 
              r="40" 
              stroke="#1f2937" 
              strokeWidth="8" 
              fill="none" 
            />
            <circle 
              cx="48" 
              cy="48" 
              r="40" 
              stroke="#ec4899" 
              strokeWidth="8" 
              fill="none" 
              strokeDasharray="251.2" 
              strokeDashoffset={251.2 - streakProgress}
              className="transition-all duration-1000"
            />
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="text-center">
              <div className="text-2xl font-bold">{stats.currentStreak}</div>
              <div className="text-xs text-gray-400">Current</div>
            </div>
          </div>
        </div>

        {/* Longest Streak */}
        <div className="text-center">
          <div className="text-5xl font-bold text-pink-500 mb-2">
            {stats.longestStreak}
          </div>
          <div className="text-sm text-gray-400">Longest Streak</div>
          <div className="text-xs text-gray-500 mt-1">
            {stats.longestStreakDates || 'N/A'}
          </div>
        </div>
      </div>

      {/* Most Used Languages - Centered */}
      <div className="bg-gray-800/50 rounded-lg p-6 w-full max-w-2xl">
        <h3 className="text-lg font-semibold mb-4 text-center">Most Used Languages</h3>
        <div className="space-y-3">
          {stats.topLanguages.length > 0 ? (
            stats.topLanguages.map((lang, index) => (
              <div key={lang.language} className="flex items-center space-x-3">
                <div className="w-8 text-gray-400 text-sm">#{index + 1}</div>
                <div className="flex-1 bg-gray-700 rounded-full h-2 overflow-hidden">
                  <div 
                    className="bg-pink-500 h-2 rounded-full transition-all duration-1000"
                    style={{ 
                      width: `${lang.percentage}%` 
                    }}
                  />
                </div>
                <div className="w-24 text-sm text-gray-300">{lang.language}</div>
                <div className="w-12 text-sm text-gray-400 text-right">
                  {lang.percentage}%
                </div>
              </div>
            ))
          ) : (
            <p className="text-gray-400 text-center">No language data available</p>
          )}
        </div>
      </div>

      {/* Follow Button - Centered */}
      <div className="flex flex-col items-center space-y-3">
        <a 
          href={stats.profile?.html_url}
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center space-x-2 px-6 py-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
        >
          <Github className="w-5 h-5" />
          <span>Follow me on GitHub</span>
          <ExternalLink className="w-4 h-4" />
        </a>
        <p className="text-sm text-gray-400 text-center">
          {stats.profile?.public_repos} public repositories • {stats.profile?.followers} followers
        </p>
      </div>
    </div>
  );
};

export default GitHubStats;