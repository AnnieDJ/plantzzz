// src/components/LeaderBoard.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import styles from "../styles/LeaderBoard.module.css"; 
import backendUrl from "../config"; 

interface LeaderboardEntry {
  user_id: number;
  name: string;
  email: string;
  total_score: number;
  rank: number;
}

const LeaderBoard: React.FC = () => {
  const navigate = useNavigate();
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
  const [userRank, setUserRank] = useState<number | null>(null);
  const [userScore, setUserScore] = useState<number>(0);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLeaderboard = async () => {
      const token = localStorage.getItem("access_token");
      const userId = parseInt(localStorage.getItem("user_id") || "0");

      if (!token) {
        setError("can't find login info,please login again。");
        setLoading(false);
        return;
      }

      try {
        // Step 1: Calculate total score
        await axios.post(
          `${backendUrl}/api/score/calculate_total`,
          {},
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        // Step 2: Fetch leaderboard
        const leaderboardResponse = await axios.get(
          `${backendUrl}/api/score/leaderboard`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );

        const fetchedLeaderboard: LeaderboardEntry[] = leaderboardResponse.data.leaderboard;
        setLeaderboard(fetchedLeaderboard);

        // Step 3: Find current user's rank and score
        const currentUser = fetchedLeaderboard.find(
          (entry) => entry.user_id === userId
        );

        if (currentUser) {
          setUserScore(currentUser.total_score);
          setUserRank(currentUser.rank);
        }

        setLoading(false);
      } catch (error: any) {
        console.error("Error fetching leaderboard data:", error);
        setError("fetching ranking data error,please come later.");
        setLoading(false);
        
      }
    };

    fetchLeaderboard();
  }, []);

  if (loading) {
    return <div className={styles.loading}>Loading...</div>;
  }

  if (error) {
    return <div className={styles.error}>{error}</div>;
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <button
          className={styles.backButton}
          onClick={() => navigate("/LoggedHome")}
        >
          <i className="fas fa-arrow-left"></i>
        </button>
        <h1 className={styles.title}>Ranking</h1>
      </div>

      <div className={styles.timePeriod}>
        <span className={styles.timeLabel}>All Time</span>
      </div>

      <table className={styles.leaderboardTable}>
        <thead>
          <tr>
            <th>Rank</th>
            <th>Name</th>
            <th>Score</th>
          </tr>
        </thead>
        <tbody>
          {leaderboard.map((entry) => (
            <tr key={entry.user_id}>
              <td>{entry.rank}</td>
              <td>{entry.name}</td>
              <td>{entry.total_score} point</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.userRow}>
        <span className={styles.userRank}>{userRank}</span>
        <span className={styles.userName}>You</span>
        <span className={styles.userPoints}>{userScore} </span>
      </div>
    </div>
  );
};

export default LeaderBoard;
