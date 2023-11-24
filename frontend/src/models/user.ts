export class User {
    eventName: any;
    quantityTickets: any;
    totalPaid: any;
    constructor(
        public name: string,
        public email: string,
        public password: string,
        public password2: string,
        public _id: string,
        public roles?: string,
        public points?: number,
        public createdDate?: Date,
        public promosList?: { promo: string, _id: string }[]
    ) { };
}