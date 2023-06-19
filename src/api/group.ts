import { api } from "./provider";

export async function getAnonGroups() {
    const response = await api().get('group/anon');
    return response.data as AnonGroupsResponse;
}
export async function getMyGroup() {
    const response = await api().get('group/my');
    return response.data as MyGroupResponse;
}



export interface AnonGroupsResponse {
    readonly groups: AnonGroup[];
}

export interface AnonGroup {
    readonly id: number;
    readonly name: string;
    readonly students: AnonStudent[];
}

export interface AnonStudent {
    readonly id: number;
    readonly shortName: string;
}



export interface MyGroupResponse {
    readonly name: string;
    readonly info: string;
    readonly students: MyStudent[];
}

export interface MyStudent {
    readonly id: number;
    readonly name: string;
    readonly shortName: string;
    readonly info: string;
}


