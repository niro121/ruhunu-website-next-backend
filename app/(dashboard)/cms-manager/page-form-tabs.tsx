"use client";

import { useToast } from "@/components/hooks/use-toast";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Page } from "@/types/page";
import { useRouter } from "next/navigation";
import React from "react";
import PageForm from "./tabs/page-form";
import HeroForm from "./tabs/hero-Form";
import ContentTable from "./tabs/content-table";


type PageFormProps = {
    page: Page | null;
    sessionRole?: string | undefined;
    order: number
};

const DISABLED_HINT =
    "Create the pages in Details first. Other tabs unlock after the pages is saved.";

export default function PageFormTabs({ page, sessionRole, order}: PageFormProps) {
    const { toast } = useToast()

    const [currentPage, setCurrentPage] = React.useState<Page | null>(page);
    const [tab, setTab] = React.useState<
        "details" | "hero" | "content"
    >("details");
    const router = useRouter();

    const hasId = Boolean(currentPage?.id);

    const styleClasses = React.useMemo(
        () => ({
            parentDiv: "grid grid-cols-1 items-center gap-4 sm:grid-cols-4 mb-2 px-3",
            labelClassName: "text-sm text-black font-semibold capitalize",
            inputClassName: "col-span-full sm:col-span-3 mb-2 w-full",
        }),
        []
    );

    // After a successful details save, enable other tabs and advance
    const handleCreated = (page: Page) => {
            setCurrentPage(page);
            toast({
                variant: "success",
                title: "page",
                description: "careers page. You can now fill the other tabs.",
            });
            router.push(`/cms-manager/${page.id}`);
    };
        
    // Generic “updated” handler used by other tabs
    const handleUpdated = (updated: Page, jumpTo?: typeof tab) => {            
        setCurrentPage(updated);
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
                    value="hero"
                    disabled={!hasId}
                    title={!hasId ? DISABLED_HINT : ""}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Hero
                </TabsTrigger>
                <TabsTrigger
                    value="content"
                    disabled={!hasId}
                    title={!hasId ? DISABLED_HINT : ""}
                    className="px-4 py-2 rounded-lg text-sm font-medium transition-all
                    text-muted-foreground
                    hover:text-primary hover:bg-primary/10
                    data-[state=active]:bg-black data-[state=active]:text-white
                    focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50"
                >
                    Contents
                </TabsTrigger>
            </TabsList>

            {/* Content with card wrapper */}
            <TabsContent value="details" className="mt-0">
                <Card className="border shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl">Page Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <PageForm 
                            page={page} 
                            sessionRole={sessionRole}
                            styleClasses={styleClasses} 
                            onCreated={handleCreated} 
                            onUpdated={(m: any) => handleUpdated(m, "hero")} 
                            order={order}                       
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="hero" className="mt-0">
                <Card className="border shadow-sm">
                    <CardHeader className="border-b">
                        <CardTitle className="text-xl">Hero Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <HeroForm 
                            pageId={currentPage?.id || ''}
                            sessionRole={sessionRole}
                            styleClasses={styleClasses}
                            onUpdated={function (page: any): void {} }
                            //onUpdated={} 
                        />
                    </CardContent>
                </Card>
            </TabsContent>

            <TabsContent value="content" className="mt-0">
                <Card className="border shadow-sm">
                     <CardHeader className="border-b">
                        <CardTitle className="text-xl">Content Details</CardTitle>
                    </CardHeader>
                    <CardContent className="pt-6">
                        <ContentTable
                            currentPageId={currentPage?.id || ""}
                            sessionRole={sessionRole} 
                            styleClasses={styleClasses}
                        />
                    </CardContent>
                </Card>
            </TabsContent>

        </Tabs>
    )
}