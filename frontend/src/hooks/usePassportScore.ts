import axios from 'axios';
import { useEffect, useState } from 'react';

// API URL 및 API 키를 상수로 정의
const API_URL = 'https://api.scorer.gitcoin.co';
const API_KEY = '00L2p5jB.pPvjcjiUqlxRbotG8R1psrvnrzoMp0jV';

interface StampScores {
  [key: string]: number;
}

interface ScoreResponse {
  address: string;
  score: string;
  status: string;
  last_score_timestamp: string;
  expiration_date: string | null;
  evidence: any;
  error: any;
  stamp_scores: StampScores;
}

const POLLING_INTERVAL = 5000; // 5초

export const usePassportScore = (scorerId: string, address: string) => {
  const [score, setScore] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScore = async () => {
      try {
        setLoading(true);
        const response = await axios.post<ScoreResponse>(
          `${API_URL}/registry/submit-passport`,
          { address, scorer_id: scorerId },
          { headers: { 'X-API-KEY': API_KEY } },
        );

        if (response.data.status === 'DONE') {
          setScore(parseFloat(response.data.score));
          setLoading(false);
        } else {
          throw new Error('Score is not ready yet');
        }
      } catch (err: any) {
        setError(err.message);
        setLoading(false);
      }
    };

    const pollScore = () => {
      const intervalId = setInterval(async () => {
        try {
          const response = await axios.get<ScoreResponse>(
            `${API_URL}/registry/score/${scorerId}/${address}`,
            { headers: { 'X-API-KEY': API_KEY } },
          );

          if (response.data.status === 'DONE') {
            setScore(parseFloat(response.data.score));
            clearInterval(intervalId);
          }
        } catch (err: any) {
          setError(err.message);
        }
      }, POLLING_INTERVAL);

      return intervalId;
    };

    fetchScore().then(() => {
      const intervalId = pollScore();
      return () => clearInterval(intervalId);
    });
  }, [scorerId, address]);

  return { score, loading, error };
};
