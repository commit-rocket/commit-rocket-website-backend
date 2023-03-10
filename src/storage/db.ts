import CyclicDb from "@cyclic.sh/dynamodb";
import CyclicItem from "@cyclic.sh/dynamodb/dist/cy_db_item";
import CyclicCollection from "@cyclic.sh/dynamodb/dist/cy_db_collection";
import CyclicIndex from "@cyclic.sh/dynamodb/dist/cy_db_index";

interface QueryResults<ResultType extends any> {
    results: ResultType[];
}

interface Collection {
    "constructor": (collection: string, props?: {}) => Collection;

    collection: string;

    item(key: string): CyclicItem;
    get(key: string): Promise<CyclicItem> | null;
    set(key: string, props?: any, opts?: any): Promise<CyclicItem>;
    delete(key: string, props?: any, opts?: any): Promise<boolean>;
    filter(q?: {}, segments?: number, next?: any): Promise<QueryResults<any>>;
    parallel_scan(filter: any, segment: any, total_segments: any, limit?: number, next?: any): Promise<QueryResults<CyclicItem> & {
        length: number;
    }>;
    list(limit?: number, next?: any): Promise<QueryResults<CyclicItem>>;
    latest(): Promise<CyclicItem> | null;
    index(name: string): CyclicIndex;
    find(name: string, value: any): Promise<QueryResults<CyclicItem>>;
}

interface Database {
    /**
     * @type {CyclicItem}
     */
    item(collection: string, key: string): CyclicItem;
    /**
     * @type {Collection}
     */
    collection(collection: string): Collection;
    /**
     * @type {CyclicIndex}
     */
    index(name: string): CyclicIndex;
}

const db = CyclicDb(process.env.CYCLIC_DB) as Database;

export default db;
