export interface Audience {
  _id?: string;
  type: string;
  details: string;
}

export function getPreReqs() {
  return `
    query {
      prereqSuggestions {
        _id
        element
        element_id
        description
      }
    }
  `;
}
