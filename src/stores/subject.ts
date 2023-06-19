import { defineStore } from 'pinia'
import { onBeforeMount, ref } from 'vue';
import { CreateSubjectRequest, getSubjects, createSubject, SubjectTimeDisplay, getSubjectTimes, createSubjectTime, CreateSubjectTimeRequest } from '@/api/subject';
import { SubjectDisplay } from '@/api/subject';
import { api } from '@/api/provider';
export const useSubjectStore = defineStore('subject', () => {
    const subjects = ref<SubjectDisplay[]>([]);
    const subjectTimes = ref<SubjectTimeDisplay[]>([]);

    async function loadSubjects() {
        const response = await getSubjects();
        subjects.value = response;
    }

    async function loadSubjectTimes() {
        const response = await getSubjectTimes();
        subjectTimes.value = response;
    }

    async function addSubject(request: CreateSubjectRequest) {
        const response = await createSubject(request);
        subjects.value.push(response);
        updateAll();
    }
    
    async function deleteSubject(id: number) {
        await api().delete(`subject/${id}`);
        subjects.value = subjects.value.filter(s => s.id != id);
        updateAll();

    }

    async function addSubjectTime(request: CreateSubjectTimeRequest) {
        const response = await createSubjectTime(request);
        subjectTimes.value.push(response);
        loadSubjectTimes();
    }

    async function updateAll() {
        await Promise.all([
            loadSubjects(),
            loadSubjectTimes(),
        ]);
    }
    
    

    onBeforeMount(async () => {
        await updateAll();
    });
    

    return {
        subjects,
        addSubject,
        deleteSubject,
        subjectTimes,
        addSubjectTime,
        
    }
}, { persist: true });


