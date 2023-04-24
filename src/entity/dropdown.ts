export enum DropdownType {
    STATUS = 'status',
    WORKROLE = 'workrole',
    TASK = 'task',
    ACTOR = 'actor',
    TIME = 'time',
}

export interface DropdownItem {
    _id: string;
    type: DropdownType;
    value: string;
}

export function DropdownObjects(type: string) {
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
