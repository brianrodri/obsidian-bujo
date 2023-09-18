import { Interval } from "luxon";
import { describe, expect, it } from "vitest";
import { PeriodicLog } from "src/collections/periodic-log";

describe("PeriodicLog", () => {
	const common = {
		kind: "periodic-log" as const,
		folder: "Logs",
		period: "P1D",
	};

	describe("Validating input", () => {
		it.each([null, undefined, ""])(
			"throws when kind is %j",
			(kind: "periodic-log") => {
				expect(() => new PeriodicLog({ ...common, kind })).toThrowError(
					'kind must be "periodic-log"',
				);
			},
		);

		it.each([null, undefined, ""])(
			"throws when folder is %j",
			(folder: string) => {
				expect(
					() => new PeriodicLog({ ...common, folder }),
				).toThrowError("folder is required");
			},
		);

		it.each(["1 hour", { hour: 1 }, null, undefined])(
			"throws when period is %j",
			(period: string) => {
				expect(
					() => new PeriodicLog({ ...common, period }),
				).toThrowError("period must be valid");
			},
		);

		it.each(["1 hour", { hour: 1 }])(
			"throws when offset is %j",
			(offset: string) => {
				expect(
					() => new PeriodicLog({ ...common, offset }),
				).toThrowError("offset must be valid");
			},
		);
	});

	describe("Defining periods", () => {
		// September 2023
		// ==============
		// |     | Mon | Tue | Wed | Thu | Fri | Sat | Sun |
		// | --- | --- | --- | --- | --- | --- | --- | --- |
		// | W35 |     |     |     |     |   1 |   2 |   3 |
		// | W36 |   4 |   5 |   6 |   7 |   8 |   9 |  10 |
		// | W37 |  11 |  12 |  13 |  14 |  15 |  16 |  17 |
		// | W38 |  18 |  19 |  20 |  21 |  22 |  23 |  24 |
		// | W39 |  25 |  26 |  27 |  28 |  29 |  30 |     |

		it("supports daily intervals", () => {
			const log = new PeriodicLog({ ...common, period: "P1D" });
			expect(log.getInterval("2023-09-11")).toEqual(
				Interval.fromISO("2023-09-11/2023-09-12"),
			);
		});

		it("supports weekly intervals", () => {
			const log = new PeriodicLog({ ...common, period: "P1W" });
			expect(log.getInterval("2023-W37")).toEqual(
				Interval.fromISO("2023-09-11/2023-09-18"),
			);
		});

		it("supports sprint intervals (2 weeks long, starts on thursday)", () => {
			const log = new PeriodicLog({
				...common,
				period: "P2W",
				offset: "P3D",
			});
			expect(log.getInterval("2023-W37")).toEqual(
				Interval.fromISO("2023-09-14/2023-09-28"),
			);
		});

		it("supports monthly intervals", () => {
			const log = new PeriodicLog({ ...common, period: "P1M" });
			expect(log.getInterval("2023-09")).toEqual(
				Interval.fromISO("2023-09-01/2023-10-01"),
			);
		});
	});
});
