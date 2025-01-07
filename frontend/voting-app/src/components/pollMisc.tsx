import { Switch } from "./ui/switch";
import { Label } from "@/components/ui/label"


 
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface PollSettingsProps {
  allowMultipleVotes: boolean;
  setAllowMultipleVotes: (value: boolean) => void;
  background: string;
  setBackground: (value: string) => void;
}

function PollSettings({ allowMultipleVotes, setAllowMultipleVotes, background, setBackground }: PollSettingsProps) {
    return ( 
        <div className="flex m-6 h-full flex-col gap-4 w-full">
            <div className="flex flex-col space-y-2">
                <div className="flex items-center space-x-2 mb-2">
                    <Switch onClick={() => setAllowMultipleVotes(!allowMultipleVotes)} id="allow-multiple-votes" checked={allowMultipleVotes} />
                    <Label htmlFor="allow-multiple-votes">Allow multiple votes per user <br /> <span className="text-muted-foreground font-normal text-xs">This could make results invalid</span></Label>
                </div>
                <Select onValueChange={setBackground} value={background}>
                    <SelectTrigger className="w-[180px]">
                        <SelectValue placeholder="Select a background" />
                    </SelectTrigger>
                    <SelectContent>
                        <SelectGroup>
                            <SelectLabel>Backgrounds</SelectLabel>
                            <SelectItem value="none">None</SelectItem>
                            <SelectItem value="paint">Paint Sploches</SelectItem>
                            <SelectItem value="gradient">Gradient</SelectItem>
                        </SelectGroup>
                    </SelectContent>
                </Select>
            </div>
        </div>
     );
}

export default PollSettings;