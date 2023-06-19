<script setup lang="ts">
import { useSubjectStore } from '@/stores/subject';
import { WeekType } from '@/api/subject';
import { ref, watch, watchEffect } from 'vue';
import moment from 'moment';
import { marked } from 'marked';
import DOMPurify from 'dompurify';
const subjectStore = useSubjectStore();
const plainSubject = () => ({ name: '', teacher: '', info: '' });

const plainSubjectTime = () => ({
    subjectId: 0,
    dayNumber: 1,
    timeStart: '08:08:00',
    timeEnd: '09:50:00',
    weekType: WeekType.All
});

const newSubject = ref(plainSubject());
const newSubjectTime = ref(plainSubjectTime());

async function addSubject() {
    try {
        newSubject.value.info = DOMPurify.sanitize(newSubject.value.info);
        await subjectStore.addSubject(newSubject.value);
        newSubject.value = plainSubject();
    } catch (e) {
        console.log(e);
    }
}

function addSubjectTime() {
    try {
        subjectStore.addSubjectTime(newSubjectTime.value);
        newSubjectTime.value = plainSubjectTime();
    } catch (e) {
        console.log(e);
    }
}
watch(newSubjectTime, () => {
    const startTime = moment(newSubjectTime.value.timeStart, 'HH:mm:ss');
    const endTime = moment(newSubjectTime.value.timeEnd, 'HH:mm:ss');
    if (endTime.isBefore(startTime)) {
        newSubjectTime.value.timeEnd = startTime.format('HH:mm:ss');
    }
}, { deep: true });

watchEffect(() => {
    if (!subjectStore.subjects.length)
        return;

    if (!newSubjectTime.value.subjectId) {
        newSubjectTime.value.subjectId = subjectStore.subjects[0].id;
    }
    if (!newSubjectTime.value.dayNumber) {
        newSubjectTime.value.dayNumber = 1;
    }
});

function getSubjectById(id: number) {
    return subjectStore.subjects.find((subject) => subject.id === id);
}
</script>
<template>
    <main>
        <h1>Subjects</h1>
        <ul>
            <li v-for="subject in subjectStore.subjects" :key="subject.id">
                <div>{{ subject.id }}</div>
                <div>{{ subject.name }}</div>
                <div>{{ subject.teacher }}</div>
                <div v-html="DOMPurify.sanitize(marked(subject.info))"></div>
                <button @click="subjectStore.deleteSubject(subject.id)">Delete</button>
                <hr />
            </li>
        </ul>

        <form @submit.prevent="addSubject()">
            <input type="text" v-model="newSubject.name" placeholder="Name" maxlength="64" minlength="3" />
            <br>
            <input type="text" v-model="newSubject.teacher" placeholder="Teacher" maxlength="64" minlength="3" />
            <br>
            <textarea v-model="newSubject.info" placeholder="Info" maxlength="1024" minlength="3"></textarea>
            <br>

            <button type="submit">Add</button>
        </form>
        <hr />
        <h1>Calendar</h1>
        <table>
            <thead>
                <tr>
                    <th v-for="day in 7" :key="day">{{ moment().day(day).format('dddd') }}</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="time in subjectStore.subjectTimes" :key="time.id">
                    <td v-for="day in 7" :key="day">
                        <div v-if="time.dayNumber === day">
                            <div>{{ getSubjectById(time.subjectId)?.name }}</div>
                            <div>{{ time.timeStart }}</div>
                            <div>{{ time.timeEnd }}</div>
                            <div>{{ WeekType[time.weekType] }}</div>
                        </div>
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="7">Total per week: {{ subjectStore.subjectTimes.length }}</td>
                </tr>
            </tfoot>
        </table>
        <form @submit.prevent="addSubjectTime()" v-if="subjectStore.subjects.length > 0">
            <select v-model="newSubjectTime.subjectId">
                <option v-for="subject in subjectStore.subjects" :key="subject.id" :value="subject.id">{{ subject.name }}
                </option>
            </select>
            <br>
            <select v-model="newSubjectTime.dayNumber">
                <option v-for="day in 7" :key="day" :value="day">{{ moment().day(day).format('dddd') }}</option>
            </select>
            <br>
            <input type="time" v-model="newSubjectTime.timeStart" placeholder="Time start" step="15" />
            <br>
            <input type="time" v-model="newSubjectTime.timeEnd" placeholder="Time end" step="15" />
            <br>
            <select v-model="newSubjectTime.weekType">
                <option v-for="weekType in 3" :key="weekType - 1" :value="weekType - 1">{{ WeekType[weekType - 1] }}
                </option>
            </select>
            <br>

            <button type="submit">Add</button>
        </form>

    </main>
</template>