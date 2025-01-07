import { Button } from "./ui/button";
import { PlusCircle, Trash } from "lucide-react";
import { Card } from "./ui/card";
import { Input } from "./ui/input";

interface QuestionEditorProps {
  questions: string[];
  setQuestions: (questions: string[]) => void;
  addNewQuestion: () => void;
  deleteQuestion: (index: number) => void;
}

function QuestionEditor({ questions, setQuestions, addNewQuestion, deleteQuestion }: QuestionEditorProps) {
  return (
    <div className="flex flex-col gap-4 w-full">
      {questions.map((question, index) => (
        <Card key={index} className="p-4 w-full flex items-center gap-4 shadow-none">
          <Input
            className="flex-grow border-t-0 border-x-0 shadow-none rounded-none"
            placeholder="Enter question"
            
            value={question}
            onChange={(e) => {
              const newQuestions = [...questions];
              newQuestions[index] = e.target.value;
              setQuestions(newQuestions);
            }}
          />
          <Button onClick={() => deleteQuestion(index)} className="flex-shrink-0"><Trash /></Button>
        </Card>
      ))}
      <Button onClick={addNewQuestion} className="mt-4"><PlusCircle />New</Button>
    </div>
  );
}

export default QuestionEditor;