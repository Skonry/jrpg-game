import PositionComponent from "../components/PositionComponent";
import Entity from "./Entity";

export default class CheckboxEntity extends Entity {
  constructor(name, x, y, radius, label) {
    const components = [
      [
        'positionComponent', 
        new PositionComponent(x, y, radius * 2, radius * 2)
      ]
    ];

    super(name, 'checkbox', components);

    this.checked = false;
    this.label = label;
  }
}
