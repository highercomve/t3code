export declare function useCopyToClipboard<TContext = void>({
  timeout,
  onCopy,
  onError,
}?: {
  timeout?: number;
  onCopy?: (ctx: TContext) => void;
  onError?: (error: Error, ctx: TContext) => void;
}): {
  copyToClipboard: (value: string, ctx: TContext) => void;
  isCopied: boolean;
};
