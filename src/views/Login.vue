<script setup lang="ts">
import { useAuthStore } from '@/stores/auth';
import { computed, ref, watchEffect } from 'vue';
const authStore = useAuthStore();

const selectedGroup = computed(() => authStore.anonGroups.find((group) => group.id === authStore.currentGroupId));
const selectedStudent = computed(() => selectedGroup.value?.students.find((student) => student.id === authStore.currentStudentId));

watchEffect(() => {
    if (!authStore.anonGroups.length)
        return;

    if (!selectedGroup.value) {
        authStore.currentGroupId = authStore.anonGroups[0].id;
    }

    if (!selectedStudent.value && selectedGroup.value) {
        authStore.currentStudentId = selectedGroup.value.students[0].id;
    }
});

const password = ref('');

function login() {
    authStore.login(password.value);
}

</script>
<template>
    <form v-if="authStore.anonGroups.length > 0" @submit.prevent="login">
        <h1>Groups</h1>
        <select v-model="authStore.currentGroupId">
            <option v-for="group in authStore.anonGroups" :key="group.id" :value="group.id">{{ group.name }}</option>
        </select>
        <select v-model="authStore.currentStudentId" v-if="selectedGroup">
            <option v-for="student in selectedGroup.students" :key="student.id" :value="student.id">{{ student.shortName }}
            </option>
        </select>
        <br/>
        <input type="password" v-model="password" />

        <button type="submit">Login</button>
    </form>
</template>