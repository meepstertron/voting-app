"use client"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"

import $ from 'jquery';
import config from './config';

import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
  } from "@/components/ui/form"
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
  } from "@/components/ui/card"
import ProceduralBackground from './background';
import { Helmet } from 'react-helmet';
import { useState, useEffect } from 'react';
import { Separator } from './components/ui/separator';
import { Button } from './components/ui/button';
import { CircleCheckBig } from "lucide-react";


const FormSchema = z.object({
    option: z.string().nonempty("You need to select an option."),
});



function Vote() {
    const form = useForm<z.infer<typeof FormSchema>>({
        resolver: zodResolver(FormSchema),
      })
      
    function onSubmit(data: z.infer<typeof FormSchema>) {
        $.ajax({
            url: `${config.apiUrl}/api/poll/${pollid}/vote`,
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({
                pollid: window.location.pathname.split('/').pop(),
                option: data.option.split("-")[0],
                uuid: localStorage.getItem('uuid')
            }),
            success: () => {
                setPoll(prevPoll => ({ ...prevPoll, hasVoted: true }));
            }
        });
    console.log(data);
    }

    const [poll, setPoll] = useState({
        question: '',
        options: [],
        end: '',
        hasEnded: false,
        background: "" as "paint" | "gradient" | "none",
        hasVoted: false,
    });
    const [timeRemaining, setTimeRemaining] = useState('');


    const pollid = window.location.pathname.split('/').pop();

    useEffect(() => {

        $.ajax({
            url: `${config.apiUrl}/api/poll?id=${pollid}&uuid=${localStorage.getItem('uuid')}`,
            type: 'GET',
            contentType: 'application/json',
            success: (data) => {
                const targetTime = new Date(data.end.replace(" ", "T"));
                const now = new Date();
                setPoll({
                    question: data.question,
                    options: data.options,
                    end: data.end,
                    hasEnded: now > targetTime,
                    background: data.background,
                    hasVoted: data.hasVoted,
                });
                setTimeRemaining(formatTimeRemaining(data.end));
            }
        });

        const interval = setInterval(() => {
            setTimeRemaining(formatTimeRemaining(poll.end));
        }, 1000);

        return () => clearInterval(interval);
    }, [pollid, poll.end]);

    function formatTimeRemaining(endTime: string): string {
        const now = new Date();
        const timeDiff = new Date(endTime).getTime() - now.getTime();

        
        if (timeDiff <= 0) {
            setPoll(prevPoll => ({ ...prevPoll, hasEnded: true }));
            return "0 seconds";
        }

        const seconds = Math.floor((timeDiff / 1000) % 60);
        const minutes = Math.floor((timeDiff / (1000 * 60)) % 60);
        const hours = Math.floor((timeDiff / (1000 * 60 * 60)) % 24);
        const days = Math.floor((timeDiff / (1000 * 60 * 60 * 24)) % 30);
        const months = Math.floor((timeDiff / (1000 * 60 * 60 * 24 * 30)) % 12);
        const years = Math.floor(timeDiff / (1000 * 60 * 60 * 24 * 365));

        const timeParts = [
            { value: years, label: "year" },
            { value: months, label: "month" },
            { value: days, label: "day" },
            { value: hours, label: "hour" },
            { value: minutes, label: "minute" },
            { value: seconds, label: "second" },
        ];

        return timeParts
            .filter(part => part.value > 0)
            .map(part => `${part.value} ${part.label}${part.value > 1 ? 's' : ''}`)
            .join(', ');
    }
    if (!poll.hasVoted) {
        return ( 
            <> 
                <Helmet>
                    <title>Voting App | Cast your vote</title>
                    <meta property="og:title" content="You have been invited to vote on this poll" />
                </Helmet>
                <div className="flex flex-col justify-center items-center min-h-screen height-full relative">
                    <ProceduralBackground type= {poll.background}/>
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                    <h1 className="mb-4 w-full sm:w-3/5 md:w-2/5 text-left text-xl bg-white p-3 rounded-md bg-opacity-50">You have been invited to vote on this poll:</h1>
                    <Card className='w-full sm:w-3/5 md:w-2/5 p-4 '>
                        <CardHeader>
                        <CardTitle>{poll.question}</CardTitle>
                        <CardDescription>Please select one of the following</CardDescription>
                        </CardHeader>
                        <CardContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)} className="">
                                <FormField
                                    control={form.control}
                                    name="option"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel></FormLabel>
                                            <FormControl>
                                                <RadioGroup onValueChange={field.onChange} className="mb-3" defaultValue="none">
                                                    <FormItem>
                                                        {poll.options.map((option, index) => (
                                                        <div key={index} className="flex items-center space-x-2">
                                                            <FormControl>
                                                                <RadioGroupItem value={option + "-" + index} id={"option-" + index} disabled={poll.hasEnded} />
                                                            </FormControl>
                                                            <FormLabel>{option}</FormLabel>
                                                        </div>))}
                                                    </FormItem>
                                                </RadioGroup>
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                    />

                                <Separator className='mt-3 mb-3'/>
                                <Button type="submit" disabled={poll.hasEnded}>Submit</Button>
                            </form>
                        </Form>
                        </CardContent>
                        <CardFooter>
                            {poll.end ? (
                                poll.hasEnded ? (
                                    <p className='text-muted-foreground text-xs'>This poll has ended</p>
                                ) : (
                                    <p className='text-muted-foreground text-xs'>This poll will expire in: {timeRemaining}</p>
                                )
                            ) : (
                                <p className='text-muted-foreground text-xs'>This poll does not expire</p>
                            )}
                        </CardFooter>
                    </Card>
                    </div>
                    <footer className="absolute bottom-0 w-full text-center p-4 bg-white bg-opacity-50 text-muted-foreground">
                        Created using <a className='underline' href="https://github.com/meepstertron/voting-app">votingApp</a>, an opensource live poll creator!
                    </footer>
                </div>
            </>
        );}
    else {
        return ( 
            <> 
                <Helmet>
                    <title>Voting App | Cast your vote</title>
                    <meta property="og:title" content="You have been invited to vote on this poll" />
                </Helmet>
                <div className="flex flex-col justify-center items-center min-h-screen height-full relative">
                    <ProceduralBackground type= {poll.background}/>
                    <div className="absolute inset-0 flex flex-col justify-center items-center">
                    
                    <Card className='w-full sm:w-3/5 md:w-2/5 p-4 '>
                        <CardHeader>
                        <CardTitle>{poll.question}</CardTitle>

                        </CardHeader>
                        <CardContent className="flex flex-col justify-center items-center">
                            <CircleCheckBig className="text-foreground" size={64}/>
                            <p className="mt-4">Thank you for voting on this poll!</p>
                        </CardContent>
                        <CardFooter>
                            <p className="text-muted-foreground text-xs">You have already voted for this poll!</p>

                        </CardFooter>
                    </Card>
                    </div>
                    <footer className="absolute bottom-0 w-full text-center p-4 bg-white bg-opacity-50 text-muted-foreground">
                        Created using <a className='underline' href="https://github.com/meepstertron/voting-app">votingApp</a>, an opensource live poll creator!
                    </footer>
                </div>
            </>
        );
    }

}

export default Vote;