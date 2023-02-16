export default class EquipmentSlotsComponent {
  helmSlot = {
    x: 720,
    y: 101,
    width: 64,
    height: 64,
    type: 'helm'
  };

  armorSlot = {
    x: 720,
    y: 173,
    width: 64,
    height: 64,
    type: 'armor'
  };

  bootsSlot = {
    x: 720,
    y: 245,
    width: 64,
    height: 64,
    type: 'boots'
  };

  weaponSlot = {
    x: 632,
    y: 161,
    width: 64,
    height: 64,
    type: 'weapon'
  };
  
  shieldSlot = {
    x: 814,
    y: 161,
    width: 64,
    height: 64,
    type: 'shield'
  };

  slots = [this.helmSlot, this.armorSlot, this.bootsSlot, this.weaponSlot, this.shieldSlot];
};