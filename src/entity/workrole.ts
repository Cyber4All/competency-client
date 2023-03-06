export interface Workrole {
  _id: string
  work_role: string
  work_role_id: string
  description: string
  ksats: []
  special_area: string
}

export function getCompleteWorkRole(id: string) {
  return `
    query {
      workrole(workroleId:"${id}") {
        work_role,
        work_role_id,
        description,
        ksats,
        special_area
      }
    }
  `;
}

export function getAllWorkRoles() {
  return `
    query {
      workroles {
        _id
        work_role,
        work_role_id,
        description,
        ksats,
        special_area
      }
    }
  `;
}

export function getAllTasks() {
  return `
    query {
      tasks {
        _id
        element
        element_id
        description
      }
    }
  `;
}

export function getCompleteTask(id: string) {
  return `
    query {
      task(taskId: "${id}") {
        element
        element_id
        description
      }
    }
  `;
}

export function queryWorkroles(search: string) {
  return `
    query {
      searchWorkroles(query: "${search}") {
        _id
        work_role,
        work_role_id,
        description,
        ksats,
        special_area
      }
    }
  `;
}

export function queryTasks(search: string) {
  return `
    query {
      searchTasks(query: "${search}") {
        _id
        element
        element_id
        description
      }
    }
  `;
}
