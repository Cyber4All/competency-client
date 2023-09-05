import { Source } from '../../../entity/behavior';

export class GraphQueries {
    constructor() {}

    /**
     * Query to get a user
     *
     * @param id user id
     * @returns Formatted string for GraphQL query to get a user
     */
    public static getUserGraphQuery(id: string): string {
        return `
            {
                user(userId: "${id}") {
                    _id
                    name
                    email
                    username
                    emailVerified
                }
            }
        `;
    }

    /**
     * Query to get a complete competency
     *
     * @param id competency id
     * @returns Formatted string for GraphQL query to get a complete competency
     */
    public static competencyGraph(id: string): string {
        return `
            {
                competency(competencyId:"${id}") {
                _id
                status
                authorId
                version
                actor {
                    _id
                    type
                    details
                }
                behavior {
                    _id
                    tasks
                    details
                    work_role
                    source
                }
                condition {
                    _id
                    scenario
                    tech
                    limitations
                    documentation {
                        _id
                        conditionId
                        description
                        uri
                    }
                }
                degree {
                    _id
                    complete
                    correct
                    time
                }
                employability {
                    _id
                    details
                },
                notes {
                    _id
                    details
                }
                }
            }
        `;
    }

    /**
     * Query to search competencies
     *
     * @param query object with search parameters
     * @returns Formatted string for GraphQL query to search competencies
     */
    public static competencySearch(
        query?: {
            text?: string,
            page?: number,
            limit?: number,
            author?: string,
            status?: string[],
            workrole?: string[],
            task?: string[],
            version?: number
        }
    ) {
        return `
            {
                search(
                text:"${query?.text ?? ''}",
                page:${query?.page ?? 0},
                limit:${query?.limit ?? 0}, ${query?.author ? `\nauthor: "${query?.author}",` : ''}
                status:[${query?.status ?? 'DRAFT'}],
                ${query?.workrole && query.workrole.length > 0 ? `workrole:["${query.workrole.join('","')+'"'}],`: ''}
                ${query?.task && query.task.length > 0 ? `task:["${query.task.join('","')+'"'}],`: ''}
                version:${query?.version ?? 0}
                ) { 
                    competencies {
                         _id
                    }
                    total
                    page
                    limit
                }
            }
        `;
    }

    /**
     * Query to retrieve attributes of a competency for the competency card
     *
     * @param id competency id
     * @returns Formatted string for GraphQL query on competency cards
     */
    public static competencyCardSearch(id: string) {
        return `
            {
                competency(competencyId:"${id}") {
                
                    status
                    actor {
                        type
                    }
                    behavior {
                        tasks
                        details
                        work_role
                        source
                    }
                }
            }
        `;
    }

    /**
     * Query to get dropdown items
     *
     * @param type dropdown type
     * @returns Formatted string for GraphQL query to get dropdown items
     */
    public static dropdownObjects(type: string) {
        return `
            {
                dropdownItems(type: ${type}) {
                    _id
                    type
                    value
                }
            }
        `;
    }

    /////////////////////////////////
    // WORKFORCE FRAMEWORK QUERIES //
    /////////////////////////////////

    /**
     * Query to get all workroles
     *
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to get all workroles from a framework
     */
    public static getAllWorkRoles(source: Source) {
        switch (source) {
            case Source.NICE:
                return `
                    query {
                        workroles {
                            _id
                            work_role,
                            work_role_id,
                            description,
                            ksats,
                            special_area,
                            tasks {
                                _id
                                element
                                element_id
                                description
                            }
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_workroles {
                            _id
                            work_role,
                            dcwf_id,
                            description,
                            category,
                            tasks {
                                _id
                                type
                                description
                                element_id
                            }
                        }
                    }
                `;
        }
    }

    /**
     * Query to get all tasks
     *
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to get all tasks from a framework
     */
    public static getAllTasks(source: Source) {
        switch (source) {
            case Source.NICE:
                return `
                    query {
                        tasks {
                            _id
                            element
                            element_id
                            description
                            work_roles {
                                _id
                                work_role
                                work_role_id
                                description
                                special_area
                            }
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_tasks {
                            _id
                            type
                            description
                            element_id
                            work_roles {
                                _id
                                work_role,
                                dcwf_id,
                                description,
                                category
                            }
                        }
                    }
                `;
        }
    }

    /**
     * Query to get a complete workrole
     *
     * @param id workrole id
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to get a complete workrole from a framework
     */
    public static getCompleteWorkRole(id: string, source: Source) {
        switch(source) {
            case Source.NICE:
                return `
                    query {
                        workrole(workroleId:"${id}") {
                            _id
                            work_role,
                            work_role_id,
                            description,
                            ksats,
                            special_area
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_workrole(workroleId:"${id}") {
                            _id
                            work_role,
                            dcwf_id,
                            description,
                            category,
                            tasks {
                                _id
                                type
                                description
                                element_id
                            }
                        }
                    }
                `;
        }
    }

    /**
     * Query to get a complete task
     *
     * @param id task id
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to get a complete task from a framework
     */
    public static getCompleteTask(id: string, source: Source) {
        switch(source) {
            case Source.NICE:
                return `
                    query {
                        task(taskId:"${id}") {
                            _id
                            element
                            element_id
                            description
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_task(taskId:"${id}") {
                            _id
                            type
                            description
                            element_id
                        }
                    }
                `;
        }
    }

    /**
     * Query to search workroles
     *
     * @param search text search query
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to search workroles from a framework
     */
    public static queryWorkroles(search: string, source: Source) {
        switch(source) {
            case Source.NICE:
                return `
                    query {
                        searchWorkroles(query: "${search}") {
                            _id
                            work_role,
                            work_role_id,
                            description,
                            ksats,
                            special_area,
                            tasks {
                                _id
                                element
                                element_id
                                description
                            }
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_searchWorkroles(query: "${search}") {
                            _id
                            work_role,
                            dcwf_id,
                            description,
                            category,
                            tasks {
                                _id
                                type
                                description
                                element_id
                            }
                        }
                    }
                `;
        }
    }

    /**
     * Query to search tasks
     *
     * @param search text search query
     * @param source workforce framework source
     * @returns Formatted string for GraphQL query to search tasks from a framework
     */
    public static queryTasks(search: string, source: Source) {
        switch(source) {
            case Source.NICE:
                return `
                    query {
                        searchTasks(query: "${search}") {
                            _id
                            element
                            element_id
                            description,
                            work_roles {
                                _id
                                work_role
                                work_role_id
                                description
                                special_area
                            }
                        }
                    }
                `;
            case Source.DCWF:
                return `
                    query {
                        dcwf_searchTasks(query: "${search}") {
                            _id
                            type
                            description
                            element_id
                            work_roles {
                                _id
                                work_role,
                                dcwf_id,
                                description,
                                category,
                            }
                        }
                    }
                `;
        }
    }
}
