import { DCWF_Element } from './dcwf.elements';
export interface DCWF_Workrole {
  _id: string,
  category: string,
  work_role: string,
  dcwf_id: string,
  description: string,
  tasks?: [DCWF_Element]
}

export function getCompleteWorkRole(id: string) {
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

export function getAllWorkRoles() {
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

export function getAllTasks() {
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

export function getCompleteTask(id: string) {
  return `
    query {
      dcwf_task(taskId: "${id}") {
        _id
        type
        description
        element_id
      }
    }
  `;
}

export function queryWorkroles(search: string) {
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

export function queryTasks(search: string) {
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
