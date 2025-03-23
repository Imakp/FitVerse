import React, { useEffect, useState, useCallback, useMemo } from "react";
import axios from "axios";
import { useGoogleFit } from "../hooks/useGoogleFit";
import { useAuth } from "../context/AuthContext";

export default function Challenges2() {
  const { isAuthenticated, fetchFitnessData } = useGoogleFit();
  const { user } = useAuth();

  const [fitnessData, setFitnessData] = useState({
    stepCount: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
  });
  const [balance, setBalance] = useState(0);
  const [redeemedChallenges, setRedeemedChallenges] = useState({});
  const [challenges, setChallenges] = useState([]);

  const processFitnessData = useCallback((data, metricKey) => {
    return (
      data?.bucket?.reduce(
        (sum, bucket) =>
          sum +
          bucket.dataset.reduce(
            (innerSum, dataset) =>
              innerSum +
              dataset.point.reduce(
                (pointSum, point) =>
                  pointSum + (point.value?.[0]?.[metricKey] || 0),
                0
              ),
            0
          ),
        0
      ) || 0
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated) return;

    const getFitnessData = async () => {
      try {
        const [stepData, activeMinutesData, calorieData] = await Promise.all([
          fetchFitnessData("com.google.step_count.delta"),
          fetchFitnessData("com.google.active_minutes"),
          fetchFitnessData("com.google.calories.expended"),
        ]);

        setFitnessData({
          stepCount: processFitnessData(stepData, "intVal"),
          activeMinutes: Math.round(
            processFitnessData(activeMinutesData, "intVal") / 7
          ),
          caloriesBurned: Math.round(processFitnessData(calorieData, "fpVal")),
        });
      } catch (err) {
        console.error("Error fetching fitness data:", err);
      }
    };

    getFitnessData();
  }, [isAuthenticated, fetchFitnessData, processFitnessData]);

  useEffect(() => {
    if (user?._id) {
      axios
        .get(`http://localhost:3000/api/users/balance/${user._id}`)
        .then(({ data }) => setBalance(data.balance))
        .catch((err) => console.error("Failed to fetch balance:", err));
    }
  }, [user]);

  useEffect(() => {
    axios
      .get("http://localhost:3000/api/challenges")
      .then(({ data }) => setChallenges(data.challenges))
      .catch((err) => console.error("Failed to fetch challenges:", err));
  }, []);

  const addCoins = useCallback(
    async (challengeId, reward) => {
      if (!user?._id || redeemedChallenges[challengeId]) return;

      try {
        const { data } = await axios.post(
          "http://localhost:3000/api/transactions/reward",
          { userId: user._id, challengeId, amount: reward }
        );

        setBalance(data.balance);
        if (data.redeemed) {
          setRedeemedChallenges((prev) => ({ ...prev, [challengeId]: true }));
        }
      } catch (error) {
        console.error("Error adding coins:", error);
      }
    },
    [user, redeemedChallenges]
  );

  return (
    <div className="bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-2xl font-bold text-gray-900">Challenges</h1>

        <div className="grid grid-cols-3 my-8 gap-6">
          {challenges.map((challenge) => {
            const progress = fitnessData[challenge.metric];
            const isCompleted = progress >= challenge.target;
            const isRedeemed = redeemedChallenges[challenge._id];

            return (
              <div
                key={challenge._id}
                className="w-full max-w-sm bg-white border border-gray-200 rounded-lg shadow-sm p-5"
              >
                <h5 className="text-xl font-semibold tracking-tight text-gray-900">
                  {challenge.title}
                </h5>
                <p>{challenge.description}</p>
                <div className="flex items-center mt-2.5 mb-5">
                  <span className="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded-sm">
                    {progress} / {challenge.target} {challenge.unit}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg text-green-600">
                    Earn {challenge.reward} Coins
                  </span>
                  <button
                    className={`text-white font-medium rounded-lg text-sm px-5 py-2.5 text-center ${
                      isRedeemed
                        ? "bg-gray-400 cursor-not-allowed"
                        : isCompleted
                        ? "bg-green-600 hover:bg-green-700"
                        : "bg-blue-700 hover:bg-blue-800"
                    }`}
                    onClick={() => addCoins(challenge._id, challenge.reward)}
                    disabled={isRedeemed || !isCompleted}
                  >
                    {isRedeemed
                      ? "Coins Redeemed"
                      : isCompleted
                      ? "Collect Coins"
                      : "In Progress"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <div className="mt-6 text-xl font-semibold">
          Your Balance: {balance} Coins
        </div>
      </div>
    </div>
  );
}
