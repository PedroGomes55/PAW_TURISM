export class Purchases {
    constructor(
        public _id: string,
        public userId: string,
        public items: { quantityItem: number, nameItem: string, typeItem : string}[],
        public total: number,
        public winningPoints: number
    ) { }
}