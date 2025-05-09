import { Box, Grid, Paper, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import { useNavigate } from "react-router-dom";
import { collection, query, where, getDocs } from "firebase/firestore";
import { auth, db } from "../../components/util/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, updateDoc } from "firebase/firestore";

function page() {
  const [videoCount, setVideoCount] = useState(0);

  const leaderboardData = [
    { name: "Alice Johnson", rank: 1, earnings: 200 },
    { name: "Bob Williams", rank: 2, earnings: 120 },
    { name: "Charlie Brown", rank: 3, earnings: 60 },
    { name: "Diana Prince", rank: 4, earnings: 20 },
    { name: "Sofi Monaf", rank: 5, earnings: 2}, // Highlight user's position
  ];

  useEffect(() => {
    const fetchVideoCount = async (userId) => {
      try {
        const contentsRef = collection(db, "videos");
        const q = query(contentsRef, where("userId", "==", userId));
        const querySnapshot = await getDocs(q);
        setVideoCount(querySnapshot.size); // Get the number of videos
      } catch (error) {
        console.error("Error fetching video count:", error);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchVideoCount(user.uid);
      } else {
        setVideoCount(0);
      }
    });

    return () => unsubscribe();
  }, []);

  return (
    <div>
      {/* Leaderboard Chart */}
      <Box sx={{ p: 3, background: "#fff", minHeight: "100vh" }}>
      
        <Typography variant="h5" gutterBottom align="center" sx={{ fontWeight: "600", color: "#012b11", mb: 3 }}>
          Tutor's Leaderboard
              </Typography>
              <ResponsiveContainer width="100%" height={300}>
  <BarChart data={leaderboardData} layout="vertical">
    <XAxis type="number" hide />
    <YAxis type="category" dataKey="name" width={100} />
    <Tooltip
      contentStyle={{ backgroundColor: '#000', color: '#fff', borderRadius: '8px' }}
      labelStyle={{ color: '#fff' }}
    />
    <Bar dataKey="earnings" fill="#FFD700" barSize={30} />
  </BarChart>
</ResponsiveContainer>

      </Box>
    </div>
  );
}

export default page;
