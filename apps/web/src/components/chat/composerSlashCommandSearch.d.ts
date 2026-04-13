import type { ComposerCommandItem } from "./ComposerCommandMenu";
export declare function searchSlashCommandItems(
  items: ReadonlyArray<
    Extract<
      ComposerCommandItem,
      {
        type: "slash-command" | "provider-slash-command";
      }
    >
  >,
  query: string,
): Array<
  Extract<
    ComposerCommandItem,
    {
      type: "slash-command" | "provider-slash-command";
    }
  >
>;
