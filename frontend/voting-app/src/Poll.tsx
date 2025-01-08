"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Bar, BarChart, ResponsiveContainer, XAxis, YAxis } from "recharts"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import ProceduralBackground from "./background"
import { useEffect } from "react";

import $ from 'jquery';
import config from './config';

interface PollOption {
    name: string;
    votes: number;
}

interface PollData {
    question: string;
    options: PollOption[];
    hasEnded: boolean;
    background: string;
}

interface FetchPollResultsResponse {
    question: string;
    options: { [key: string]: number };
    hasEnded: boolean;
    background: string;
}

function fetchPollResults(setPollData: React.Dispatch<React.SetStateAction<PollData>>): void {
    $.ajax({
        url: config.apiUrl + "/api/poll/" + window.location.pathname.split("/").pop() + "/results",
        type: "GET",
        success: function(data: FetchPollResultsResponse) {
            setPollData({
                question: data.question,
                options: Object.keys(data.options).map(key => ({
                    name: key,
                    votes: data.options[key]
                })),
                hasEnded: data.hasEnded,
                background: data.background,
            });
            // Update background if needed
            if (data.background !== "none") {
                document.body.style.background = data.background;
            }
        },
        error: function() {
            console.log("error");
        }
    });
}


const initialPollData: PollData = {
  question: "Loading Data...",
  options: [],
  hasEnded: false,
}

const Poll = () => {
  const [hoveredOption, setHoveredOption] = useState<string | null>(null)
  const [pollData, setPollData] = useState(initialPollData)
  const totalVotes = pollData.options.reduce((sum, option) => sum + option.votes, 0)

  const chartData = pollData.options.map((option) => ({
    name: option.name,
    votes: option.votes,
    percentage: totalVotes > 0 ? ((option.votes / totalVotes) * 100).toFixed(1) : "0.0",
  }))

  useEffect(() => {
    const interval = setInterval(() => {
        if (!pollData.hasEnded) {
            fetchPollResults(setPollData);
        } else {
            clearInterval(interval);
        }
    }, 5000);

    fetchPollResults(setPollData); // Initial fetch

    return () => clearInterval(interval);
  }, [pollData.hasEnded]);


  return (
    <>
      <ProceduralBackground type={pollData.background} />
      <div className="flex items-center justify-center min-h-screen py-8 relative" style={{ zIndex: 1 }}>
        <Card className="w-full max-w-3xl mx-auto">
          <CardHeader>
            <CardTitle>{pollData.question}</CardTitle>
            <CardDescription>Total votes: {totalVotes}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              <ChartContainer
                config={{
                  votes: {
                    label: "Votes",
                    color: "#4C51BF",
                  },
                }}
                className="h-[300px]"
              >
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData}>
                    <XAxis dataKey="name" />
                    <YAxis />
                    <ChartTooltip content={<ChartTooltipContent />} />
                    <Bar dataKey="votes" fill="var(--color-votes)" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartContainer>
              <div className="space-y-2">
                {pollData.options.map((option) => (
                  <div
                    key={option.name}
                    className="flex items-center justify-between p-2 rounded hover:bg-gray-100 transition-colors"
                    onMouseEnter={() => setHoveredOption(option.name)}
                    onMouseLeave={() => setHoveredOption(null)}
                  >
                    <span className="font-medium">{option.name}</span>
                    <span className="text-gray-600">
                      {option.votes} votes
                      {hoveredOption === option.name && (
                        <span className="ml-2 text-sm text-gray-500">
                          ({((option.votes / totalVotes) * 100).toFixed(1)}%)
                        </span>
                      )}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}

export default Poll;


