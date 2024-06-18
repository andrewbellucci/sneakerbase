import * as RadixSelect from "@radix-ui/react-select";

export default function Select() {
  return (
    <RadixSelect.Root value={"1"}>
      <RadixSelect.Trigger>
        <RadixSelect.Value />
        <RadixSelect.Icon />
      </RadixSelect.Trigger>

      <RadixSelect.Portal>
        <RadixSelect.Content>
          <RadixSelect.ScrollUpButton />
          <RadixSelect.Viewport>
            <RadixSelect.Item value={"1"}>
              <RadixSelect.ItemText>Hello</RadixSelect.ItemText>
              <RadixSelect.ItemIndicator />
            </RadixSelect.Item>

            <RadixSelect.Group>
              <RadixSelect.Label />
              <RadixSelect.Item value={"2"}>
                <RadixSelect.ItemText />
                <RadixSelect.ItemIndicator />
              </RadixSelect.Item>
            </RadixSelect.Group>

            <RadixSelect.Separator />
          </RadixSelect.Viewport>
          <RadixSelect.ScrollDownButton />
          <RadixSelect.Arrow />
        </RadixSelect.Content>
      </RadixSelect.Portal>
    </RadixSelect.Root>
  );
}
