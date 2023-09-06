export enum DropdownType {
    STATUS = 'status',
    SOURCE = 'framework',
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
