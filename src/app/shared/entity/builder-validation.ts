export class BuilderValidation {
    type?: string;
    attribute?: string;
    isValid?: boolean;
    message?: string;
}

export class BuilderError extends BuilderValidation {
    constructor(
        public type: string,
        public attribute: string,
        public isValid: boolean,
        public message: string,
        public errors: BuilderValidation[]
    ) {
        super();
    }
}
