import PromiseHelper from "./PromiseHelper";

export default class RequestQueue<ResultType> {
    private queue: Map<string, PromiseHelper<ResultType>>;
    private token: number;

    public constructor() {
        this.queue = new Map();
        this.token = 1;
    }

    public generateToken(transformer: (i: number) => string = i => `${i}`) {
        return transformer(this.token++);
    }

    public create(token: string): Promise<ResultType> {
        const helper = new PromiseHelper<ResultType>();
        this.queue.set(token, helper);
        return helper.promise;
    }

    public resolve(token: string, data: ResultType) {
        this.queue.get(token)?.resolve(data);
        this.queue.delete(token);
    }
}
