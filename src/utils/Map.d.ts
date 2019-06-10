
declare interface MapData {
    tileset: string;
    ground: Array<Array<number>>;
    invalidFrame: number[];
    start: Coord;
    end: Coord;
}