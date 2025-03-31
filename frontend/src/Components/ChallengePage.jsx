import React, {
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import axios from "axios";
import { useGoogleFit } from "../hooks/useGoogleFit";
import { useAuth } from "../context/AuthContext";
import { motion } from "framer-motion";
import { Target, CheckCircle, Award, Coins, Clock } from "lucide-react";

export default function Challenge() {
  const { isAuthenticated, fetchFitnessData } = useGoogleFit();
  const { user } = useAuth();

  const [fitnessData, setFitnessData] = useState({
    stepCount: 0,
    activeMinutes: 0,
    caloriesBurned: 0,
  });
  const [balance, setBalance] = useState(0);

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRef = useRef(false);

  const processFitnessData = useCallback((data, metricKey) => {
    return (
      data?.bucket?.reduce((sum, bucket) => {
        const point = bucket.dataset?.[0]?.point?.[0];
        return sum + (point?.value?.[0]?.[metricKey] || 0);
      }, 0) || 0
    );
  }, []);

  useEffect(() => {
    if (!isAuthenticated || fetchRef.current) return;
    fetchRef.current = true;
    setLoading(true);

    const getFitnessData = async () => {
      try {
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(endDate.getDate() - 7);

        const [stepData, activeMinutesData, calorieData] = await Promise.all([
          fetchFitnessData(
            "com.google.step_count.delta",
            "derived:com.google.step_count.delta:com.google.android.gms:estimated_steps",
            startDate,
            endDate
          ),
          fetchFitnessData(
            "com.google.active_minutes",
            "derived:com.google.active_minutes:com.google.android.gms:merge_active_minutes",
            startDate,
            endDate
          ),
          fetchFitnessData(
            "com.google.calories.expended",
            "derived:com.google.calories.expended:com.google.android.gms:merge_calories_expended",
            startDate,
            endDate
          ),
        ]);

        const newFitnessData = {
          stepCount: processFitnessData(stepData, "intVal"),
          activeMinutes: processFitnessData(activeMinutesData, "intVal"),
          caloriesBurned: Math.round(processFitnessData(calorieData, "fpVal")),
        };

        setFitnessData(newFitnessData);
      } catch (err) {
        console.error("Error fetching fitness data:", err);
      } finally {
        setLoading(false);
      }
    };

    getFitnessData();
  }, [isAuthenticated, fetchFitnessData, processFitnessData]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [balanceRes, challengesRes] = await Promise.all([
          user?._id
            ? axios.get(`http://localhost:3000/api/users/balance/${user._id}`)
            : Promise.resolve({ data: { balance: 0 } }),
          axios.get("http://localhost:3000/api/challenges"),
        ]);

        setBalance(balanceRes.data.balance);
        setChallenges(challengesRes.data.challenges || []);
      } catch (err) {
        console.error("Error fetching initial data:", err);
      } finally {
        if (!isAuthenticated || !fetchRef.current) {
          setLoading(false);
        }
      }
    };

    fetchData();
  }, [user?._id, isAuthenticated]);

  const addCoins = async (challengeId, reward) => {
    if (!user?._id) {
      console.error("User not logged in, cannot redeem coins.");
      return;
    }

    try {
      setChallenges((prevChallenges) =>
        prevChallenges.map((ch) =>
          ch._id === challengeId ? { ...ch, redeemed: true } : ch
        )
      );
      setBalance((prevBalance) => prevBalance + reward);

      await axios.patch(
        `http://localhost:3000/api/challenges/${challengeId}`,
        { redeemed: true },
        { headers: { "Content-Type": "application/json" } }
      );

      // Capture the response from add-coins API
      const addCoinsResponse = await axios.post(
        `http://localhost:3000/api/users/add-coins`,
        { userId: user._id, amount: reward },
        { headers: { "Content-Type": "application/json" } }
      );

      if (addCoinsResponse.data && addCoinsResponse.data.success) {
        window.dispatchEvent(
          new CustomEvent("balanceUpdated", {
            detail: { balance: addCoinsResponse.data.newBalance },
          })
        );
        console.log(
          `Challenge ${challengeId} redeemed successfully. New balance: ${addCoinsResponse.data.newBalance}`
        );
      } else {
        console.error(
          "Failed to add coins according to API response:",
          addCoinsResponse.data
        );
        throw new Error(
          addCoinsResponse.data?.message || "Failed to update balance on server"
        );
      }
    } catch (error) {
      console.error(
        "Error redeeming challenge:",
        error.response?.data || error.message
      );
      setChallenges((prevChallenges) =>
        prevChallenges.map((ch) =>
          ch._id === challengeId ? { ...ch, redeemed: false } : ch
        )
      );
      setBalance((prevBalance) => prevBalance - reward);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[calc(100vh-10rem)] bg-gray-50">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full"
        ></motion.div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Challenges</h1>
          <p className="mt-1 text-gray-600">
            Complete tasks to earn coins and boost your fitness journey!
          </p>
        </motion.header>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {challenges.map((challenge) => {
            const progress = fitnessData[challenge.metric] || 0;
            const isCompleted = progress >= challenge.target;
            const isRedeemed = challenge.redeemed;
            const percentage = Math.min(
              challenge.target > 0
                ? Math.round((progress / challenge.target) * 100)
                : 0,
              100
            );

            return (
              <motion.div
                key={challenge._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.3 }}
                className="bg-white rounded-xl shadow-lg p-6 border-t-4 border-blue-500 flex flex-col justify-between overflow-hidden"
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h5 className="text-lg font-semibold tracking-tight text-gray-800">
                      {challenge.title}
                    </h5>
                    <Target className="h-6 w-6 text-blue-500 flex-shrink-0" />
                  </div>
                  <p className="text-sm text-gray-600 mb-4 min-h-[40px]">
                    {challenge.description}
                  </p>

                  <div className="mb-5">
                    <div className="flex justify-between text-xs text-gray-500 mb-1">
                      <span>
                        Progress: {progress.toLocaleString()} /{" "}
                        {challenge.target.toLocaleString()} {challenge.unit}
                      </span>
                      <span>{percentage}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        animate={{ width: `${percentage}%` }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className={`h-2.5 rounded-full transition-colors duration-500 ${
                          isCompleted ? "bg-green-500" : "bg-blue-500"
                        }`}
                      ></motion.div>
                    </div>
                  </div>
                </div>

                <div className="mt-auto pt-4 border-t border-gray-100">
                  <div className="flex items-center justify-between">
                    <span className="text-md font-semibold text-green-600 flex items-center">
                      <Award size={18} className="mr-1.5 flex-shrink-0" />
                      {challenge.reward} Coins
                    </span>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center space-x-1.5 text-white font-medium rounded-md text-sm px-4 py-2 text-center transition-colors duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 whitespace-nowrap ${
                        isRedeemed
                          ? "bg-gray-400 cursor-not-allowed focus:ring-gray-400"
                          : isCompleted
                          ? "bg-green-600 hover:bg-green-700 focus:ring-green-500"
                          : "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500"
                      }`}
                      onClick={() => addCoins(challenge._id, challenge.reward)}
                      disabled={isRedeemed || !isCompleted}
                    >
                      {isRedeemed ? (
                        <>
                          <CheckCircle size={16} /> <span>Redeemed</span>
                        </>
                      ) : isCompleted ? (
                        <>
                          <Coins size={16} /> <span>Collect</span>
                        </>
                      ) : (
                        <>
                          <Clock size={16} /> <span>In Progress</span>
                        </>
                      )}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>

        {challenges.length === 0 && !loading && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-16 px-6 bg-white rounded-xl shadow-lg border border-gray-100 mt-8"
          >
            <Target size={48} className="mx-auto text-gray-400 mb-4" />
            <h3 className="text-xl font-semibold text-gray-800 mb-2">
              No Challenges Available
            </h3>
            <p className="text-gray-500">
              Check back later for new challenges!
            </p>
          </motion.div>
        )}
      </div>
    </div>
  );
}
