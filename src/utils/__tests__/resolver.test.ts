import { describe, expect, it, jest } from "@jest/globals";
import { Resolver } from "utils/resolver";

type TestRecord = Record<string, unknown>;

describe("Resolver", () => {
    it("starts with provided value", () => {
        expect(
            new Resolver<TestRecord>(
                async () => ({}),
                async () => {},
                { a: 1 },
            ).get(),
        ).toEqual({ a: 1 });
    });

    it("loads with provider", async () => {
        const providerMock = jest.fn(async () => ({ a: "new" }));
        const resolver = new Resolver<TestRecord>(providerMock, async () => {}, { a: "old" });

        await resolver.load();

        expect(resolver.get()).toEqual({ a: "new" });
        expect(providerMock).toHaveBeenCalled();
    });

    it("saves with consumer", async () => {
        const consumerMock = jest.fn(async () => {});
        const resolver = new Resolver<TestRecord>(async () => ({}), consumerMock, { a: 1 });

        await resolver.save();

        expect(consumerMock).toHaveBeenCalledWith(resolver.get());
    });

    it("updates by merging", () => {
        const resolver = new Resolver<TestRecord>(
            async () => ({}),
            async () => {},
            { nested: { a: 1 } },
        );

        resolver.update({ nested: { b: 2 } });

        expect(resolver.get()).toEqual({ nested: { a: 1, b: 2 } });
    });
});
