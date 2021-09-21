import { environment } from './environment';
export const USER_ROUTES = {
    LOGIN() {
        return `${environment.apiURL}/users/login`;
    },
    CREATE_USER() {
        return `${environment.apiURL}/users`
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
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/competencies`;
    },
    EDIT_COMPETENCY(competency: any) {
        return `${environment.apiURL}/users/${encodeURIComponent(competency.author)}/competencies/${encodeURIComponent(competency._id)}`;
    },
    LOCK_COMPETENCY(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/lock`;
    }
}