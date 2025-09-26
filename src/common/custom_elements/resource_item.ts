import { ResourceItemData } from "../../types";

export default class ResourceItem extends HTMLElement {
  props: ResourceItemData;

  constructor(id: string, props: ResourceItemData) {
    super();
    this.props = props;
    this.id = id;
  }

  connectedCallback() {
    this.attachShadow({ mode: "open" });
  }
}

customElements.define("resource-item", ResourceItem);
