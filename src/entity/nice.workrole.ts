import { Elements } from './nice.elements';
export interface Workrole {
  _id: string
  work_role: string
  work_role_id: string
  description: string
  ksats: []
  special_area: string
  tasks?: Elements[]
}

export function getCompleteWorkRole(id: string) {
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
}

export function getAllTasks() {
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
}

export function getCompleteTask(id: string) {
  return `
    query {
      task(taskId: "${id}") {
        _id
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
}

export function queryTasks(search: string) {
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
}