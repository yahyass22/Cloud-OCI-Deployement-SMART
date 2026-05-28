import React from 'react'
import {useShow} from "@refinedev/core";
import {ShowView, ShowViewHeader} from "@/components/refine-ui/views/show-view.tsx";
import {ClassDetails} from "@/types";
import {boolean} from "zod";
import {Card} from "@/components/ui/card.tsx";
import {Badge} from "@/components/ui/badge.tsx";
import {Separator} from "@/components/ui/separator.tsx";
import {Button} from "@/components/ui/button.tsx";
import { getBannerUrl } from "@/lib/cloudinary";

const Show = () => {
    const { query } = useShow<ClassDetails>({ resource: 'classes' });
    const { data, isLoading, isError } = query;
    const classDetails = data?.data;

    if (isLoading) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader />
                <div className="flex items-center justify-center h-64">
                    <p className="text-muted-foreground animate-pulse">Loading class details...</p>
                </div>
            </ShowView>
        );
    }

    if (isError || !classDetails) {
        return (
            <ShowView className="class-view class-show">
                <ShowViewHeader />
                <div className="flex items-center justify-center h-64">
                    <p className="text-destructive">
                        {isError ? 'Failed to load class details.' : 'Class details not found.'}
                    </p>
                </div>
            </ShowView>
        );
    }

    const teacherName = classDetails.teacher?.name ?? 'Unknown';
    const teachersInitials =
        teacherName.split(' ').filter(boolean)
            .slice(0, 2)
            .map((part)=>part[0]?.toUpperCase())
            .join('')

    const { id, name, description, status, capacity, courseCode, courseName, bannerUrl, bannerCldPubId, subject,
        teacher, department, schedules, inviteCode} = classDetails;

    // Get the banner URL using the helper function
    const bannerSrc = getBannerUrl(bannerUrl, bannerCldPubId, teacherName);

    // Get teacher placeholder URL
    const teacherPlaceholderUrl = `https://placehold.co/100x100?text=${encodeURIComponent(teachersInitials || 'NA')}`;


    return (
        <ShowView className="class-show class-view">
            <ShowViewHeader />
            <div className="flex flex-col gap-6">
                <div className="banner relative group overflow-hidden rounded-xl">
                    <img
                        src={bannerSrc}
                        alt={name}
                        className="w-full h-72 object-cover rounded-xl transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent flex flex-col justify-end p-8">
                        <div className="flex items-center gap-3 mb-2">
                             <Badge className="bg-primary/20 text-white border-primary/30 backdrop-blur-sm">
                                {subject?.code}
                             </Badge>
                             <Badge variant={status === 'active' ? 'default' : 'secondary'} className="uppercase font-bold tracking-wider">
                                {status}
                             </Badge>
                        </div>
                        <h1 className="text-5xl font-extrabold text-white drop-shadow-2xl tracking-tight">{name}</h1>
                    </div>
                </div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 space-y-6">
                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">About this class</h2>
                            <p className="text-lg text-muted-foreground leading-relaxed">
                                {description || "No description provided for this class."}
                            </p>
                            
                            <Separator className="my-6" />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Instructor</h3>
                                    <div className="flex items-center gap-4 p-3 rounded-lg bg-accent/50 border border-border">
                                        <img 
                                            src={teacher?.image ?? teacherPlaceholderUrl} 
                                            alt={teacherName} 
                                            className="h-12 w-12 rounded-full object-cover ring-2 ring-primary/20"
                                        />
                                        <div>
                                            <p className="font-bold text-foreground">{teacherName}</p>
                                            <p className="text-xs text-muted-foreground">{teacher?.email || 'No email provided'}</p>
                                        </div>
                                    </div>
                                </div>
                                
                                <div className="space-y-4">
                                    <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Department</h3>
                                    <div className="p-3 rounded-lg bg-accent/50 border border-border">
                                        <p className="font-bold text-foreground">{department?.name || 'General'}</p>
                                        <p className="text-xs text-muted-foreground line-clamp-1">{department?.description || 'Core academic department'}</p>
                                    </div>
                                </div>
                            </div>
                        </Card>

                        <Card className="p-6">
                            <h2 className="text-xl font-bold mb-4">Subject Information</h2>
                            <div className="bg-primary/5 rounded-xl p-6 border border-primary/10">
                                <div className="flex items-center gap-3 mb-3">
                                    <Badge variant="outline" className="text-primary border-primary/30 font-mono">
                                        {subject?.code}
                                    </Badge>
                                    <h3 className="text-xl font-bold">{subject?.name}</h3>
                                </div>
                                <p className="text-muted-foreground leading-relaxed">
                                    {subject?.description}
                                </p>
                            </div>
                        </Card>
                    </div>

                    <div className="space-y-6">
                        <Card className="p-6 flex flex-col gap-6 border-primary/20 shadow-lg shadow-primary/5">
                            <div className="flex items-center justify-between">
                                <h3 className="font-bold">Class Details</h3>
                                <Badge variant="outline" className="font-bold">
                                    {capacity} Students Max
                                </Badge>
                            </div>
                            
                            <div className="space-y-4">
                                <div className="join bg-accent/30 p-4 rounded-xl border border-border">
                                    <h4 className="font-bold mb-3 flex items-center gap-2">
                                        <span className="flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] text-primary-foreground">!</span>
                                        How to Join
                                    </h4>
                                    <ol className="text-sm space-y-2 text-muted-foreground list-decimal list-inside">
                                        <li>Ask teacher for invite code</li>
                                        <li>Click "Join Class" below</li>
                                        <li>Enter code and confirm</li>
                                    </ol>
                                </div>
                                
                                <Button size="lg" className="w-full font-bold shadow-md shadow-primary/20">
                                    Join Class
                                </Button>
                                
                                <p className="text-[10px] text-center text-muted-foreground">
                                    By joining, you agree to the classroom terms of conduct.
                                </p>
                            </div>
                        </Card>
                    </div>
                </div>
            </div>
        </ShowView>
    )
}
export default Show
