import { ResourceItemData } from "../../types";
import PortalTarget from "./portal_target";

export interface ResourceItemProps {
  item: ResourceItemData;
}

export default class ResourceItem extends PortalTarget<ResourceItemProps> {
  get type() {
    return "resource-item";
  }
}

customElements.define("resource-item", ResourceItem);
