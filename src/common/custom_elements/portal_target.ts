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
