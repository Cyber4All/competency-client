export interface Behavior {
  _id?: string,
  tasks: string[],
  details: string,
  work_role: string,
  source: Source
}

export enum Source {
  NICE = 'nice',
  DCWF = 'dcwf'
}
