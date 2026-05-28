import {ListView, ListViewHeader} from "@/components/refine-ui/views/list-view.tsx";
import {Search} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useMemo, useState, useEffect, useRef} from "react";
import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.tsx";
import {DataTable} from "@/components/refine-ui/data-table/data-table.tsx";
import {useTable} from "@refinedev/react-table";
import {ClassDetails, Subject, User} from "@/types";
import {ColumnDef} from "@tanstack/react-table";
import {Badge} from "@/components/ui/badge.tsx";
import {useList} from "@refinedev/core";
import {ShowButton} from "@/components/refine-ui/buttons/show.tsx";

const ClassesList = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSubject, setSelectedSubject] = useState('all');
    const [selectedTeacher, setSelectedTeacher] = useState('all');
    
    // Debounce search query to reduce API calls
    const [debouncedSearchQuery, setDebouncedSearchQuery] = useState('');
    const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (debounceTimeoutRef.current) {
            clearTimeout(debounceTimeoutRef.current);
        }
        debounceTimeoutRef.current = setTimeout(() => {
            setDebouncedSearchQuery(searchQuery);
        }, 500); // 500ms debounce

        return () => {
            if (debounceTimeoutRef.current) {
                clearTimeout(debounceTimeoutRef.current);
            }
        };
    }, [searchQuery]);

    // Cache subjects and teachers data with longer stale time
    const { query: subjectsQuery } = useList<Subject>({
        resource: 'subjects',
        pagination: { pageSize: 100 },
        queryOptions: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        }
    });

    const { query: teachersQuery } = useList<User>({
        resource: 'users',
        filters: [{ field: 'role', operator: 'eq', value: 'teacher' }],
        pagination: { pageSize: 100 },
        queryOptions: {
            staleTime: 5 * 60 * 1000, // 5 minutes
            gcTime: 10 * 60 * 1000, // 10 minutes (formerly cacheTime)
        }
    });

    const subjects = useMemo(() => subjectsQuery?.data?.data || [], [subjectsQuery?.data?.data]);
    const teachers = useMemo(() => teachersQuery?.data?.data || [], [teachersQuery?.data?.data]);

    const subjectFilters = selectedSubject === 'all' ? [] : [
        { field: 'subjectId', operator: 'eq' as const, value: selectedSubject}
    ];
    const teacherFilters = selectedTeacher === 'all' ? [] : [
        { field: 'teacherId', operator: 'eq' as const, value: selectedTeacher}
    ];
    const searchFilters = debouncedSearchQuery ? [
        { field: 'name', operator: 'contains' as const, value: debouncedSearchQuery }
    ] : [];

    const classColumns = useMemo<ColumnDef<ClassDetails>[]>(() => [
        {
            id: 'bannerUrl',
            accessorKey: 'bannerUrl',
            size: 80,
            header: () => <p className="column-title ml-2">Banner</p>,
            cell: ({ getValue }) => (
                <div className="flex items-center justify-center ml-2">
                    <img
                        src={getValue<string>() || '/placeholder-class.png'}
                        alt="Class Banner"
                        className="w-10 h-10 rounded object-cover"
                        loading="lazy"
                    />
                </div>
            )
        },
        {
            id: 'name',
            accessorKey: 'name',
            size: 200,
            header: () => <p className="column-title">Class Name</p>,
            cell: ({ getValue }) => <span className="text-foreground font-medium">{getValue<string>()}</span>,
        },
        {
            id: 'status',
            accessorKey: 'status',
            size: 100,
            header: () => <p className="column-title">Status</p>,
            cell: ({ getValue }) => {
                const status = getValue<string>();
                const variantMap: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
                    active: "default",
                    inactive: "secondary",
                    archived: "destructive",
                };
                return (
                    <Badge variant={variantMap[status] || "outline"}>
                        {status.charAt(0).toUpperCase() + status.slice(1)}
                    </Badge>
                );
            }
        },
        {
            id: 'subject',
            accessorKey: 'subject.name',
            size: 150,
            header: () => <p className="column-title">Subject</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'teacher',
            accessorKey: 'teacher.name',
            size: 150,
            header: () => <p className="column-title">Teacher</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<string>()}</span>,
        },
        {
            id: 'capacity',
            accessorKey: 'capacity',
            size: 100,
            header: () => <p className="column-title">Capacity</p>,
            cell: ({ getValue }) => <span className="text-foreground">{getValue<number>()}</span>,
        },
        {
            id: 'details',
            size: 140,
            header: () => <p className="column-title">Details</p>,
            cell: ({ row }) => <ShowButton resource="classes" recordItemId={row.original.id} variant="outline" size="sm">View</ShowButton>
        }
    ], []);

    const classTable = useTable<ClassDetails>({
        columns: classColumns,
        refineCoreProps: {
            resource: 'classes',
            pagination: { pageSize: 10, mode: 'server' },
            sorters: {
                initial: [
                    { field: 'id', order: 'desc' },
                ]
            },
        }
    });

    const {
        refineCore: { setFilters },
    } = classTable;

    useEffect(() => {
        setFilters([
            ...subjectFilters,
            ...teacherFilters,
            ...searchFilters
        ], 'replace');
    }, [debouncedSearchQuery, selectedSubject, selectedTeacher, setFilters]);

    return (
        <ListView>
            <ListViewHeader canCreate />
            <div className="flex flex-col gap-4">
                <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
                    <p className="text-muted-foreground">Manage your classes, subjects, and teachers.</p>
                    <div className="flex flex-col sm:flex-row items-center gap-2 w-full lg:w-auto">
                        <div className="relative w-full sm:w-64">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="text"
                                placeholder="Search by name or code..."
                                className="pl-10 w-full"
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </div>
                        <div className="flex gap-2 w-full sm:w-auto">
                            <Select
                                value={selectedSubject} onValueChange={setSelectedSubject}
                                disabled={subjectsQuery.isLoading}
                            >
                                <SelectTrigger className="w-full sm:w-[160px]">
                                    <SelectValue placeholder={subjectsQuery.isLoading ? "Loading..." : "Subject"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Subjects</SelectItem>
                                    {subjects.map(subject => (
                                        <SelectItem key={subject.id} value={String(subject.id)}>{subject.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            <Select
                                value={selectedTeacher} onValueChange={setSelectedTeacher}
                                disabled={teachersQuery.isLoading}
                            >
                                <SelectTrigger className="w-full sm:w-[160px]">
                                    <SelectValue placeholder={teachersQuery.isLoading ? "Loading..." : "Teacher"} />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Teachers</SelectItem>
                                    {teachers.map(teacher => (
                                        <SelectItem key={teacher.id} value={String(teacher.id)}>{teacher.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
                <DataTable table={classTable} />
            </div>
        </ListView>
    );
};

export default ClassesList;