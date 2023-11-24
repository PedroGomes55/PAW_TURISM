export class Cart {
    constructor(
        public _id: string,
        public userId: string,
        public items: { eventId: string; quantity: number, _id:string }[],
        public usagePromo: boolean,
        public namePromo: string,
        public percentage: number,
        public discount: number,
        public total: number
    ) { }
}