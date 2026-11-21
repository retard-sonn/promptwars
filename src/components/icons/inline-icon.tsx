import type { IconName } from "./definitions";
import { Icon } from "./icon";

export function InlineIcon({ name }: { name: IconName }) {
  return (
    <span className="inline-icon" aria-hidden="true">
      <Icon name={name} size={20} />
    </span>
  );
}
