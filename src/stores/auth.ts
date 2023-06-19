import { defineStore } from 'pinia'
import { onBeforeMount, ref } from 'vue';
import router from '@/router';
import { LoginRequestMode, tryLogin, tryLogout, tryExtendSession } from '@/api/auth';
import { AnonGroup, getAnonGroups } from '@/api/group';
export const useAuthStore = defineStore('auth', () => {
    const anonGroups = ref<AnonGroup[]>([]);
    const currentStudentId = ref<number>(-1);
    const currentGroupId = ref<number>(-1);


    const isLoggedIn = ref(false);
    const loggedExpiresAt = ref<Date | null>(null);


    const login = async (password: string) => {
        try {
            const response = await tryLogin({
                groupId: currentGroupId.value,
                userId: currentStudentId.value,
                password: password, loginMode:
                    LoginRequestMode.Web
            });

            loggedExpiresAt.value = new Date(response.expiresAt);
            currentStudentId.value = response.userId;
            currentGroupId.value = response.groupId;
            isLoggedIn.value = true;

        } catch (e) {
            console.log('login error', e);
            isLoggedIn.value = false;
            loggedExpiresAt.value = null;
            return false;
        }
        router.push('/');
        return true;
    }

    const logout = async () => {
        await tryLogout();
        isLoggedIn.value = false;
        router.push('/login');
    }

    async function loadAnonGroups() {
        const response = await getAnonGroups();
        anonGroups.value = response.groups;
    }
    async function extendSession() {
        try {
            const response = await tryExtendSession();
            loggedExpiresAt.value = new Date(response.expiresAt);
            currentStudentId.value = response.userId;
            currentGroupId.value = response.groupId;
            if (isLoggedIn.value == false) {
                router.push('/');
            }
            isLoggedIn.value = true;
            console.log('the session has been expired', response.expiresAt);
        } catch (e) {
            console.log('extendSession error', e);
            if (isLoggedIn.value == true) {
                router.push('/login');
            }
            isLoggedIn.value = false;
            loggedExpiresAt.value = null;
        }
    }


    onBeforeMount(async () => {
        await Promise.all([
            loadAnonGroups(),
            extendSession()
        ]);
        
    
    })
    return {
        login,
        logout,
        isLoggedIn,
        anonGroups,
        currentStudentId,
        currentGroupId,
        loggedExpiresAt
    }
}, { persist: true });
