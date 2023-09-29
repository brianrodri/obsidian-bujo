import { merge } from "lodash";

export class Resolver<T extends Record<string, unknown>> {
    constructor(
        private readonly provider: () => Promise<T>,
        private readonly consumer: (current: T) => Promise<void>,
        private current: T,
    ) {}

    get(): T {
        return this.current;
    }

    update(partial: Partial<T>) {
        this.current = merge(this.current, partial);
    }

    async load() {
        this.current = await this.provider();
        return this.current;
    }

    async save() {
        await this.consumer(this.current);
    }
}
