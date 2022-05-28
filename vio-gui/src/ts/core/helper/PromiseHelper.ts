export default class PromiseHelper<ResultType> {
    private _resolve: (value: ResultType) => void;
    private _reject:  (value: ResultType) => void;

    public readonly promise = new Promise<ResultType>((resolve, reject) => {
        [this._resolve, this._reject] = [resolve, reject];
    });

    public resolve(value: ResultType) {
        this._resolve(value);
    }

    public reject(value: ResultType) {
        this._reject(value);
    }
}
