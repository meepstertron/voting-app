import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { useToast } from "@/hooks/use-toast"


import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import QuestionEditor from "./components/questionedit"
import PollSettings from "./components/pollMisc"

import { Label } from "./components/ui/label"
import { ExponentialTimeSlider } from "./components/timeSlider"
import { timeValues, formatTime } from './utils/timeUtils'

function Editor() {
    const { toast } = useToast()
    const [questions, setQuestions] = useState<string[]>(["blue", "red", "green", "yellow"]);
    const [pollTitle, setPollTitle] = useState<string>("");
    const [selectedTime, setSelectedTime] = useState<number>(timeValues[0]);
    const [allowMultipleVotes, setAllowMultipleVotes] = useState(false);
    const [background, setBackground] = useState("");

    function addNewQuestion() {
      setQuestions([...questions, ""]);
    }
  
    function deleteQuestion(index: number) {
      const newQuestions = [...questions];
      newQuestions.splice(index, 1);
      setQuestions(newQuestions);
    }

    function publishPoll() {
        let invalid = false;
        if (pollTitle === "") {
            toast({
                title: "Add a poll title",
                description: "A poll title is required to publish a poll.",
              })
            invalid = true;
        }
        if (questions.length < 2) {
            toast({
                title: "Add more options",
                description: "A poll must have at least 2 options.",
              })
            invalid = true;
        }
        if (selectedTime === 0) {
            toast({
                title: "Invalid expiry time",
                description: "The poll expiry time cannot be zero.",
              })
            invalid = true;
        }
        if (background === "") {
            toast({
                title: "Select background",
                description: "Please select a background for the poll.",
              })
            invalid = true;
        }
        if (invalid) return;
        console.log(questions);
        console.log(pollTitle);
    }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      
      <header className="border-b">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold">Poll Editor</h1>
          <Button onClick={publishPoll}>Publish Poll</Button>
        </div>
      </header>

      
      <div className="flex-1 space-y-6 m-6">
        
        <div className="flex space-x-6">
          <Card className="flex-1 flex flex-col">
            <CardHeader>
              <CardTitle>Poll Details</CardTitle>
            </CardHeader>
            <CardContent className="flex-1">
              <div className="space-y-4">
                <div>
                <Label className="font-normal text-sm">Poll Question</Label>
                  <Input onChange={(e) => setPollTitle(e.target.value)} id="poll-title" placeholder="Enter poll title" />
                </div>
                <div>
                    <Label className="font-normal text-sm">Expiry ({formatTime(selectedTime)})</Label>
                    <ExponentialTimeSlider selectedTime={selectedTime} setSelectedTime={setSelectedTime} />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card className="w-1/2 flex flex-col">
            <CardHeader>
              <CardTitle>Poll Settings</CardTitle>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col">
              <div className="space-y-4 flex-1">
                <p className="text-muted-foreground">Configure your poll settings here.</p>
                
                <div className="h-auto border-2 border-dotted rounded-md flex items-center justify-center flex-1">
                  <PollSettings 
                    allowMultipleVotes={allowMultipleVotes} 
                    setAllowMultipleVotes={setAllowMultipleVotes} 
                    background={background} 
                    setBackground={setBackground} 
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="w-full">
          <CardHeader>
            <CardTitle>Questions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 w-full">
              <p className="text-muted-foreground">Add your poll questions here.</p>
              
              <div className="h-auto p-3 rounded-md flex items-center justify-center">
                <QuestionEditor
                  questions={questions}
                  setQuestions={setQuestions}
                  addNewQuestion={addNewQuestion}
                  deleteQuestion={deleteQuestion}
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default Editor

