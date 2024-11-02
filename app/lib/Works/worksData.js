"use client";
import Works from "@/app/ui/works/Works";
import { useEffect, useState } from "react";

export default function WorksData() {
  const [works, setWorks] = useState([]);
  const [loading, setLoading] = useState(true);
  // https://livingbranddashboard.vercel.app
  useEffect(() => {
    const fetchWorks = async () => {
      try {
        const response = await fetch("https://livingbranddashboard.vercel.app/api/works", {
          mode: "cors",
          cache: "no-store",
        });
        const data = await response.json();
        setWorks(data); // Assuming your API returns an array of works
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchWorks();
  }, []);

  if (loading) return <p>Loading...</p>;

  return (
    <div>
      <Works works={works} />
    </div>
  );
}
