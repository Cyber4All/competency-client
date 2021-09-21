import { environment } from './environment';
export const USER_ROUTES = {
    LOGIN() {
        return `${environment.apiURL}/users/login`;
    },
    GET_ALL_USERS() {
        return `${environment.apiURL}/users`;
    },
    GET_KEY_PAIR() {
        return `${environment.apiURL}/keys`;
    }
}

export const COMPETENCY_ROUTES = {
    GET_ALL_COMPETENCIES(){
        return `${environment.apiURL}/competencies`;
    },
    CREATE_COMPETENCY(userId: string) {
        return `${environment.apiURL}/users/${encodeURIComponent("611d65aaa22d7ca85295a4a9")}/competencies`;
    },
    EDIT_COMPETENCY(competency: any) {
        return `${environment.apiURL}/users/${encodeURIComponent("611d65aaa22d7ca85295a4a9")}/competencies/${encodeURIComponent(competency._id)}`;
    },
    LOCK_COMPETENCY(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/lock`;
    }
}