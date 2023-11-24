export class Event {
    constructor(
        public _id: string,
        public heritageDestiny: string,
        public eventImg: string,
        public name: string,
        public date: Date,
        public typeTicket: string,
        public price: number,
        public totalNumberTickets: number
    ) { };
}