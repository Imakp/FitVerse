import React, { useState, useEffect } from "react";
import { useGoogleFit } from "../hooks/useGoogleFit";

// Challenge definitions with varying difficulty levels and goals
const CHALLENGE_LIBRARY = [
  {
    id: "10k-steps",
    title: "10K Steps Challenge",
    description: "Complete 10,000 steps in a single day",
    category: "Steps",
    difficulty: "medium",
    duration: "daily",
    points: 100,
    icon: "🚶",
    color: "#4CAF50",
    targetValue: 10000,
    measureIn: "steps",
    verifyWith: {
      dataType: "com.google.step_count.delta",
      dataSourceId:
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    },
  },
  {
    id: "weekly-30k",
    title: "Weekly Warrior",
    description: "Achieve 30,000 steps in a week",
    category: "Steps",
    difficulty: "medium",
    duration: "weekly",
    points: 300,
    icon: "👣",
    color: "#4CAF50",
    targetValue: 30000,
    measureIn: "steps",
    verifyWith: {
      dataType: "com.google.step_count.delta",
      dataSourceId:
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    },
  },
  {
    id: "active-streak",
    title: "Active Streak",
    description:
      "Be active for at least 30 minutes every day for 5 consecutive days",
    category: "Active Minutes",
    difficulty: "hard",
    duration: "streak",
    points: 500,
    icon: "⚡",
    color: "#2196F3",
    targetValue: 30,
    measureIn: "minutes",
    daysRequired: 5,
    verifyWith: {
      dataType: "com.google.active_minutes",
      dataSourceId:
        "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    },
  },
  {
    id: "calorie-burn",
    title: "Calorie Crusher",
    description: "Burn 2,500 calories in a week",
    category: "Calories",
    difficulty: "medium",
    duration: "weekly",
    points: 250,
    icon: "🔥",
    color: "#FF5722",
    targetValue: 2500,
    measureIn: "kcal",
    verifyWith: {
      dataType: "com.google.calories.expended",
      dataSourceId:
        "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    },
  },
  {
    id: "weekend-warrior",
    title: "Weekend Warrior",
    description: "Complete 15,000 steps over the weekend (Sat & Sun)",
    category: "Steps",
    difficulty: "medium",
    duration: "weekend",
    points: 200,
    icon: "🏆",
    color: "#4CAF50",
    targetValue: 15000,
    measureIn: "steps",
    verifyWith: {
      dataType: "com.google.step_count.delta",
      dataSourceId:
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    },
  },
  {
    id: "morning-mover",
    title: "Morning Mover",
    description:
      "Be active for at least 10 minutes before 9 AM for 3 days in a week",
    category: "Active Minutes",
    difficulty: "hard",
    duration: "weekly",
    points: 300,
    icon: "🌅",
    color: "#2196F3",
    targetValue: 10,
    measureIn: "minutes",
    daysRequired: 3,
    timeRestriction: { before: "09:00" },
    verifyWith: {
      dataType: "com.google.active_minutes",
      dataSourceId:
        "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    },
  },
  {
    id: "steps-milestone",
    title: "Steps Milestone",
    description: "Reach 100,000 total steps",
    category: "Steps",
    difficulty: "hard",
    duration: "milestone",
    points: 500,
    icon: "🏅",
    color: "#4CAF50",
    targetValue: 100000,
    measureIn: "steps",
    isLifetime: true,
    verifyWith: {
      dataType: "com.google.step_count.delta",
      dataSourceId:
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    },
  },
  {
    id: "active-evenings",
    title: "Active Evenings",
    description:
      "Be active for at least 20 minutes after 6 PM for 4 days in a week",
    category: "Active Minutes",
    difficulty: "medium",
    duration: "weekly",
    points: 250,
    icon: "🌙",
    color: "#2196F3",
    targetValue: 20,
    measureIn: "minutes",
    daysRequired: 4,
    timeRestriction: { after: "18:00" },
    verifyWith: {
      dataType: "com.google.active_minutes",
      dataSourceId:
        "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
    },
  },
  {
    id: "consistency-king",
    title: "Consistency King",
    description: "Complete at least 7,000 steps every day for a week",
    category: "Steps",
    difficulty: "hard",
    duration: "weekly",
    points: 400,
    icon: "👑",
    color: "#4CAF50",
    targetValue: 7000,
    measureIn: "steps",
    daysRequired: 7,
    verifyWith: {
      dataType: "com.google.step_count.delta",
      dataSourceId:
        "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
    },
  },
  {
    id: "calorie-milestone",
    title: "Calorie Milestone",
    description: "Burn a total of 10,000 calories",
    category: "Calories",
    difficulty: "hard",
    duration: "milestone",
    points: 500,
    icon: "🎯",
    color: "#FF5722",
    targetValue: 10000,
    measureIn: "kcal",
    isLifetime: true,
    verifyWith: {
      dataType: "com.google.calories.expended",
      dataSourceId:
        "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
    },
  },
];

// Get badge for difficulty level
const getDifficultyBadge = (difficulty) => {
  switch (difficulty) {
    case "easy":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-green-100 text-green-800">
          Easy
        </span>
      );
    case "medium":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">
          Medium
        </span>
      );
    case "hard":
      return (
        <span className="px-2 py-1 text-xs rounded-full bg-red-100 text-red-800">
          Hard
        </span>
      );
    default:
      return null;
  }
};

const ChallengeCard = ({ challenge, onComplete, status, progress = 0 }) => {
  const {
    id,
    title,
    description,
    difficulty,
    points,
    icon,
    color,
    targetValue,
    measureIn,
  } = challenge;
  const isCompleted = status === "completed";

  // Calculate current value based on progress percentage
  const currentValue = Math.floor((progress / 100) * targetValue);

  // Determine if challenge is complete and ready to be marked as such
  const isReadyToComplete = progress >= 100;

  return (
    <div
      className="bg-white rounded-xl shadow-md overflow-hidden transition-all hover:shadow-lg border-l-4"
      style={{ borderColor: color }}
    >
      <div className="p-5">
        <div className="flex justify-between items-start">
          <span className="text-3xl">{icon}</span>
          <div className="flex items-center space-x-2">
            {getDifficultyBadge(difficulty)}
            <span className="px-2 py-1 text-xs rounded-full bg-blue-100 text-blue-800">
              {points} pts
            </span>
          </div>
        </div>

        <h3 className="mt-2 text-lg font-semibold text-gray-800">{title}</h3>
        <p className="mt-1 text-sm text-gray-600">{description}</p>

        {!isCompleted && (
          <div className="mt-4">
            <div className="flex justify-between mb-1 text-sm">
              <span className="text-gray-600">Progress</span>
              <span className="font-medium">
                {currentValue} / {targetValue} {measureIn}
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="h-2.5 rounded-full transition-all duration-500 ease-out"
                style={{ width: `${progress}%`, backgroundColor: color }}
              ></div>
            </div>

            {/* Tips section */}
            <div className="mt-3 bg-blue-50 p-3 rounded-md">
              <h4 className="text-xs font-medium text-blue-800 mb-1">
                Quick tip:
              </h4>
              <p className="text-xs text-blue-700">
                {challenge.category === "Steps"
                  ? "Try taking the stairs instead of the elevator today!"
                  : challenge.category === "Active Minutes"
                  ? "Set a timer to move for 5 minutes every hour!"
                  : "Stay hydrated to maximize your calorie burn!"}
              </p>
            </div>
          </div>
        )}

        <div className="mt-4 flex justify-between items-center">
          {isCompleted ? (
            <div className="flex items-center text-green-600">
              <svg
                className="h-5 w-5 mr-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                  clipRule="evenodd"
                />
              </svg>
              <span className="font-medium">Completed!</span>
            </div>
          ) : isReadyToComplete ? (
            <button
              onClick={() => onComplete(id)}
              className="px-4 py-2 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 transition-colors w-full flex items-center justify-center"
            >
              <svg
                className="h-5 w-5 mr-2"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
              Mark as Completed
            </button>
          ) : (
            <div className="text-sm text-blue-600 italic">In progress</div>
          )}
        </div>
      </div>
    </div>
  );
};

const ChallengeFilters = ({ activeFilter, onFilterChange }) => {
  const filters = [
    { id: "all", label: "All" },
    { id: "active", label: "Active" },
    { id: "completed", label: "Completed" },
    { id: "steps", label: "Steps" },
    { id: "active-minutes", label: "Activity" },
    { id: "calories", label: "Calories" },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {filters.map((filter) => (
        <button
          key={filter.id}
          onClick={() => onFilterChange(filter.id)}
          className={`px-4 py-2 rounded-md text-sm transition-colors ${
            activeFilter === filter.id
              ? "bg-blue-600 text-white"
              : "bg-gray-100 text-gray-700 hover:bg-gray-200"
          }`}
        >
          {filter.label}
        </button>
      ))}
    </div>
  );
};

const Challenges = () => {
  const { isAuthenticated, fetchFitnessData } = useGoogleFit();
  const [userChallenges, setUserChallenges] = useState([]);
  const [filter, setFilter] = useState("all");
  const [userPoints, setUserPoints] = useState(750);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [completedChallenge, setCompletedChallenge] = useState(null);

  // Initialize user challenges (in a real app, this would come from a database)
  useEffect(() => {
    if (isAuthenticated) {
      // Initialize all challenges as active with various progress levels
      const initialChallenges = CHALLENGE_LIBRARY.map((challenge) => {
        // Generate random progress for each challenge between 0 and 95%
        const randomProgress = Math.floor(Math.random() * 96);

        // Some challenges are already completed
        if (challenge.id === "weekly-30k") {
          return {
            challengeId: challenge.id,
            status: "completed",
            completedDate: new Date(),
          };
        }

        return {
          challengeId: challenge.id,
          status: "active",
          progress: randomProgress,
        };
      });

      setUserChallenges(initialChallenges);

      // Simulate progress updates for active challenges
      const interval = setInterval(() => {
        setUserChallenges((prev) =>
          prev.map((challenge) => {
            if (challenge.status === "active") {
              const newProgress =
                challenge.progress + Math.floor(Math.random() * 5);
              return {
                ...challenge,
                progress: newProgress > 100 ? 100 : newProgress,
              };
            }
            return challenge;
          })
        );
      }, 5000);

      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Get challenge details by ID
  const getChallengeById = (id) => {
    return CHALLENGE_LIBRARY.find((challenge) => challenge.id === id);
  };

  // Complete a challenge
  const handleCompleteChallenge = (challengeId) => {
    const challenge = getChallengeById(challengeId);

    setUserChallenges((prev) =>
      prev.map((c) =>
        c.challengeId === challengeId
          ? { ...c, status: "completed", completedDate: new Date() }
          : c
      )
    );

    setCompletedChallenge(challenge);
    setUserPoints((prev) => prev + challenge.points);
    setShowCompletionModal(true);
  };

  // Filter challenges
  const getFilteredChallenges = () => {
    // Get user's active and completed challenges with progress data
    const userActiveChallenges = userChallenges
      .filter((c) => c.status === "active")
      .map((c) => ({
        ...getChallengeById(c.challengeId),
        status: "active",
        progress: c.progress,
      }));

    const userCompletedChallenges = userChallenges
      .filter((c) => c.status === "completed")
      .map((c) => ({
        ...getChallengeById(c.challengeId),
        status: "completed",
        completedDate: c.completedDate,
      }));

    // Apply filters
    let filteredChallenges = [];

    switch (filter) {
      case "active":
        filteredChallenges = userActiveChallenges;
        break;
      case "completed":
        filteredChallenges = userCompletedChallenges;
        break;
      case "steps":
        filteredChallenges = [
          ...userActiveChallenges,
          ...userCompletedChallenges,
        ].filter((c) => c.category === "Steps");
        break;
      case "active-minutes":
        filteredChallenges = [
          ...userActiveChallenges,
          ...userCompletedChallenges,
        ].filter((c) => c.category === "Active Minutes");
        break;
      case "calories":
        filteredChallenges = [
          ...userActiveChallenges,
          ...userCompletedChallenges,
        ].filter((c) => c.category === "Calories");
        break;
      default:
        filteredChallenges = [
          ...userActiveChallenges,
          ...userCompletedChallenges,
        ];
    }

    return filteredChallenges;
  };

  // Close modal and reset state
  const handleCloseModal = () => {
    setShowCompletionModal(false);
    setCompletedChallenge(null);
  };

  // Calculate user level based on points
  const getUserLevel = () => {
    return Math.floor(userPoints / 1000) + 1;
  };

  // Calculate progress to next level
  const getLevelProgress = () => {
    const currentLevel = getUserLevel();
    const pointsForCurrentLevel = (currentLevel - 1) * 1000;
    const pointsToNextLevel = currentLevel * 1000;
    return (
      ((userPoints - pointsForCurrentLevel) /
        (pointsToNextLevel - pointsForCurrentLevel)) *
      100
    );
  };

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">
              Fitness Challenges
            </h2>
            <p className="mt-1 text-gray-600">
              Complete challenges to earn points and improve your fitness
            </p>
          </div>

          {isAuthenticated && (
            <div className="mt-4 md:mt-0 bg-white rounded-lg shadow px-4 py-3 flex items-center space-x-4">
              <div>
                <div className="text-sm text-gray-500">
                  Level {getUserLevel()}
                </div>
                <div className="font-bold text-lg">{userPoints} points</div>
              </div>
              <div className="w-32">
                <div className="w-full bg-gray-200 rounded-full h-2.5">
                  <div
                    className="bg-blue-600 h-2.5 rounded-full"
                    style={{ width: `${getLevelProgress()}%` }}
                  ></div>
                </div>
                <div className="text-xs text-gray-500 mt-1 text-right">
                  {Math.round(getLevelProgress())}% to Level{" "}
                  {getUserLevel() + 1}
                </div>
              </div>
            </div>
          )}
        </div>

        {isAuthenticated ? (
          <>
            <div className="mb-6">
              <ChallengeFilters
                activeFilter={filter}
                onFilterChange={setFilter}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {getFilteredChallenges().map((challenge) => (
                <ChallengeCard
                  key={challenge.id}
                  challenge={challenge}
                  status={challenge.status}
                  progress={challenge.progress || 0}
                  onComplete={handleCompleteChallenge}
                />
              ))}
            </div>
          </>
        ) : (
          <div className="bg-white rounded-xl shadow-md p-8 text-center">
            <div className="mx-auto h-24 w-24 mb-6 bg-blue-100 rounded-full flex items-center justify-center">
              <svg
                className="h-12 w-12 text-blue-600"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">
              Connect to Start Challenges
            </h2>
            <p className="text-gray-600 mb-6 max-w-md mx-auto">
              Connect your Google Fit account to join challenges, track your
              progress, and earn points for your fitness achievements.
            </p>
          </div>
        )}

        {/* Challenge Completion Modal */}
        {showCompletionModal && completedChallenge && (
          <div className="fixed inset-0 bg-gray-800 bg-opacity-75 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl shadow-xl max-w-md w-full overflow-hidden animate-bounceIn">
              <div className="p-6 text-center">
                <div className="w-20 h-20 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                  <svg
                    className="h-10 w-10 text-green-600"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2">
                  Challenge Complete!
                </h3>
                <div className="text-5xl mb-4">{completedChallenge.icon}</div>
                <p className="text-lg font-medium text-gray-700 mb-2">
                  {completedChallenge.title}
                </p>
                <p className="text-gray-600 mb-4">
                  {completedChallenge.description}
                </p>
                <div className="bg-blue-50 p-3 rounded-lg mb-4 inline-block">
                  <span className="text-blue-800 font-bold">
                    +{completedChallenge.points} points
                  </span>
                </div>
                <button
                  onClick={handleCloseModal}
                  className="w-full py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Awesome!
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Challenges;
