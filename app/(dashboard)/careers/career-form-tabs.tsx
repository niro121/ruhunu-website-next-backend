"use client";

import { useToast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Career } from "@/types/career";
import { useRouter } from "next/navigation";
import React from "react";
import CareersForm from "./tabs/career-form";
import ApplicationTable from "./tabs/application-table";

type CareerFormProps = {
    career: Career | null;
    sessionRole?: string | undefined;
    order: number
};

const DISABLED_HINT =
    "Create the careers in Details first. Other tabs unlock after the careers is saved.";

export default function CareerFormTabs({ career, sessionRole, order}: CareerFormProps) {
    const { toast } = useToast()

    // Track career across tabs; once Details creates it, others unlock
    const [currentCareer, setCurrentCareer] = React.useState<Career | null>(career);
    const [tab, setTab] = React.useState<
        "details" | "application"
    >("details");
    const router = useRouter();
    
    const hasId = Boolean(currentCareer?.id);
        
    const styleClasses = React.useMemo(
        () => ({
            parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
            labelClassName: "text-sm text-black font-semibold capitalize",
            inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
        }),
        []
    );
    
    // After a successful details save, enable other tabs and advance
    const handleCreated = (created: Career) => {
        setCurrentCareer(created);
        toast({
            variant: "success",
            title: "Created",
            description: "careers created. You can now fill the other tabs.",
        });
        router.push(`/careers/${created.id}`);
    };
    
    // Generic “updated” handler used by other tabs
    const handleUpdated = (updated: Career, jumpTo?: typeof tab) => {
        setCurrentCareer(updated);
        if (jumpTo) setTab(jumpTo);
    };
    
    return (
        <Tabs
            value={tab}
            onValueChange={(v) => setTab(v as any)}
            className="w-full"
        >
            {/* Tab header across the top */}
            <TabsList className="mb-2 flex justify-start gap-2 rounded-xl bg-muted p-1 bg-gray-200">
                <TabsTrigger
                    value="details"
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Details
                </TabsTrigger>
                <TabsTrigger
                    value="application"
                    disabled={!hasId}
                    title={!hasId ? DISABLED_HINT : ""}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Applications
                </TabsTrigger>
            </TabsList>

            {/* Content with card wrapper */}
            <TabsContent value="details" className="mt-0">
                <Card className="border shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl">Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <CareersForm 
                            career={career} 
                            sessionRole={sessionRole}
                            styleClasses={styleClasses}
                            onCreated={handleCreated} 
                            onUpdated={(m: any) => handleUpdated(m, "application")} 
                            order={order}/>
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="menuitems" className="mt-0">
                <Card className="border shadow-sm">
                    <CardContent className="pt-6">
                        {/* <ApplicationTable
                            sessionRole={undefined}
                            currentMenuId={undefined}
                        /> */}
                        <>
                        
                        </>
                    </CardContent>
                </Card>
            </TabsContent>
        </Tabs>
    )
}
