import { environment } from './environment';

export const USER_ROUTES = {
    LOGIN() {
        return `${environment.apiURL}/auth/login`;
    },
    REGISTER() {
        return `${environment.apiURL}/auth/register`;
    },
    TOKEN() {
        return `${environment.apiURL}/auth/token`;
    },
    UPDATE_ACL_ACTIONS(userId: string) {
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/acl`;
    },
    DELETE_ACL_ACTIONS(userId: string) {
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/acl`;
    },
    GENERATE_KEYS() {
        return `${environment.apiURL}/keys`;
    },
    ADD_API_KEY(userId: string) {
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/keys`;
    },
    UPDATE_API_KEY_PERMISSIONS(userId: string, prefix: string) {
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/keys/${encodeURIComponent(prefix)}/acl`;
    },
    DELETE_API_KEY(userId: string, prefix: string) {
        return `${environment.apiURL}/users/${encodeURIComponent(userId)}/keys/${encodeURIComponent(prefix)}`;
    },
    VALIDATE_ACTIONS() {
        return `${environment.apiURL}/auth/validate`;
    },
};

export const ORGANIZATION_ROUTES = {
    SEARCH_ORGANIZATIONS(queryString: string) {
        return `${environment.cardOrganizationUrl}&text=${queryString}`;
    }
};

export const COMPETENCY_ROUTES = {
    CREATE_COMPETENCY() {
        return `${environment.apiURL}/competencies`;
    },
    UPDATE_ACTOR(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/actor`;
    },
    UPDATE_BEHAVIOR(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/behavior`;
    },
    UPDATE_CONDITION(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/condition`;
    },
    UPDATE_DEGREE(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/degree`;
    },
    UPDATE_EMPLOYABILITY(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/employability`;
    },
    UPDATE_NOTES(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/notes`;
    },
    DELETE_COMPETENCY(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}`;
    },
    CREATE_DOCUMENTATION(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/documentation`;
    },
    UPDATE_ONE_DOCUMENTATION(competencyId: string, documentationId: string) {
        return `${environment.apiURL}/competencies/
        ${encodeURIComponent(competencyId)}/documentation/${encodeURIComponent(documentationId)}`;
    },
    DELETE_DOCUMENTATION(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/documentation`;
    },
    GRAPH_QUERY() {
        return `${environment.apiURL}/graphql`;
    },
    UPLOAD_FILE_LAMBDA(competencyId: string) {
        return `${environment.fileUploadURL}/files?competencyId=${encodeURIComponent(competencyId)}`;
    },
    DELETE_FILE_LAMBDA(competencyId: string, filenames: string) {
        return `${environment.fileUploadURL}/files?competencyId=${
            encodeURIComponent(competencyId)
        }&filename=${
            encodeURIComponent(filenames)
        }`;
    },
    SUBMIT(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/submit`;
    },
    PUBLISH(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/publish`;
    },
    DEPRECATE(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/deprecate`;
    },
    REJECT(competencyId: string) {
        return `${environment.apiURL}/competencies/${encodeURIComponent(competencyId)}/reject`;
    }
};
