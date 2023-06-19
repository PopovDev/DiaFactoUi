import { api } from "./provider";


export async function getSubjects(): Promise<SubjectDisplay[]> {
    const response = await api().get('subject');
    return response.data as SubjectDisplay[];
}

export async function createSubject(request: CreateSubjectRequest): Promise<SubjectDisplay> {
    const response = await api().post('subject/create', request);
    return response.data as SubjectDisplay;
}

export async function deleteSubject(id: number) {
    await api().delete(`subject/${id}`);
}


export async function getSubjectTimes(): Promise<SubjectTimeDisplay[]> {
    const response = await api().get(`subjectTime`);
    return response.data as SubjectTimeDisplay[];
}

export async function createSubjectTime(request: CreateSubjectTimeRequest): Promise<SubjectTimeDisplay> {
    const response = await api().post(`subjectTime/create`, request);
    return response.data as SubjectTimeDisplay;
}


export interface SubjectDisplay {
    readonly id: number;
    readonly name: string;
    readonly teacher: string;
    readonly info: string;
}


export interface CreateSubjectRequest {
    readonly name: string;
    readonly teacher: string;
    readonly info: string;
}



export interface SubjectTimeDisplay {
    readonly id: number;
    readonly subjectId: number;
    readonly dayNumber: number;
    readonly timeStart: string;
    readonly timeEnd: string;
    readonly weekType: WeekType;
}


export enum WeekType {
    All = 0,
    Nominator = 1,
    Denominator = 2,
}



export interface CreateSubjectTimeRequest {
    readonly subjectId: number;
    readonly dayNumber: number;
    readonly timeStart: string;
    readonly timeEnd: string;
    readonly weekType: WeekType;
}