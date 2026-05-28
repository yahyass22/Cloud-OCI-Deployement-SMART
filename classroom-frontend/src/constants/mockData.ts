// mockData.ts

import {Subject} from "@/types";

export const MOCK_SUBJECTS: Subject[] = [
    {
        id: 1,
        code: "CS101",
        name: "Introduction to Computer Science",
        departmentId: 1,
        department: {
            id: 1,
            name: "Computer Science",
            code: "CS",
            description: "Computing and programming",
        },
        description: "This course introduces the fundamental concepts of computer science, including programming, data structures, and algorithms.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 2,
        code: "MATH202",
        name: "Calculus II",
        departmentId: 2,
        department: {
            id: 2,
            name: "Mathematics",
            code: "MATH",
            description: "Mathematical sciences",
        },
        description: "This course covers the topics of integration, sequences, and series, with an emphasis on applications in physics and engineering.",
        createdAt: new Date().toISOString(),
    },
    {
        id: 3,
        code: "ENGL303",
        name: "English Literature",
        departmentId: 3,
        department: {
            id: 3,
            name: "English",
            code: "ENGL",
            description: "Language and literature",
        },
        description: "This course explores the major works of English literature from the Renaissance to the present day, including plays, poems, and novels.",
        createdAt: new Date().toISOString(),
    },
];
