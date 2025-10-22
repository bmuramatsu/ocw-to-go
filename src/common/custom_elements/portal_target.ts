// We render react components from the outer app into the iframe using portals.
// The portal is always contained in a custom element that extends this class.
// The 'props' attribute will be picked up by react and passed
// into the relevant component.
export default abstract class PortalTarget<TProps> extends HTMLElement {
  props: TProps;

  constructor(id: string, props: TProps) {
    super();
    this.id = id;
    this.props = props;
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
  }

  abstract get type(): string;
}
