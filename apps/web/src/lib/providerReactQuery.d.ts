import { ThreadId } from "@t3tools/contracts";
interface CheckpointDiffQueryInput {
  threadId: ThreadId | null;
  fromTurnCount: number | null;
  toTurnCount: number | null;
  cacheScope?: string | null;
  enabled?: boolean;
}
export declare const providerQueryKeys: {
  all: readonly ["providers"];
  checkpointDiff: (
    input: CheckpointDiffQueryInput,
  ) => readonly [
    "providers",
    "checkpointDiff",
    (string & import("effect/Brand").Brand<"ThreadId">) | null,
    number | null,
    number | null,
    string | null,
  ];
};
export declare function checkpointDiffQueryOptions(
  input: CheckpointDiffQueryInput,
): import("@tanstack/react-query").OmitKeyof<
  import("@tanstack/react-query").UseQueryOptions<
    {
      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      readonly fromTurnCount: number;
      readonly toTurnCount: number;
      readonly diff: string;
    },
    Error,
    {
      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      readonly fromTurnCount: number;
      readonly toTurnCount: number;
      readonly diff: string;
    },
    readonly [
      "providers",
      "checkpointDiff",
      (string & import("effect/Brand").Brand<"ThreadId">) | null,
      number | null,
      number | null,
      string | null,
    ]
  >,
  "queryFn"
> & {
  queryFn?: import("@tanstack/react-query").QueryFunction<
    {
      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      readonly fromTurnCount: number;
      readonly toTurnCount: number;
      readonly diff: string;
    },
    readonly [
      "providers",
      "checkpointDiff",
      (string & import("effect/Brand").Brand<"ThreadId">) | null,
      number | null,
      number | null,
      string | null,
    ],
    never
  >;
} & {
  queryKey: readonly [
    "providers",
    "checkpointDiff",
    (string & import("effect/Brand").Brand<"ThreadId">) | null,
    number | null,
    number | null,
    string | null,
  ] & {
    [dataTagSymbol]: {
      readonly threadId: string & import("effect/Brand").Brand<"ThreadId">;
      readonly fromTurnCount: number;
      readonly toTurnCount: number;
      readonly diff: string;
    };
    [dataTagErrorSymbol]: Error;
  };
};
export {};
