class InventorySystem {
    constructor(maxSlots = 40) {
        this.maxSlots = maxSlots;
        this.items = [];
        this.equipment = {
            weapon: null,
            helmet: null,
            armor: null,
            gloves: null,
            boots: null,
            accessory: null
        };
    }

    addItem(item, amount = 1) {
        if (!item || amount <= 0) return false;

        const existing = this.items.find(
            slot => slot.id === item.id && slot.amount < (item.maxStack || 99)
        );

        if (existing) {
            const space = (item.maxStack || 99) - existing.amount;
            const added = Math.min(space, amount);

            existing.amount += added;
            amount -= added;
        }

        while (amount > 0) {
            if (this.items.length >= this.maxSlots) {
                return false;
            }

            const added = Math.min(amount, item.maxStack || 99);

            this.items.push({
                ...item,
                amount: added
            });

            amount -= added;
        }

        return true;
    }

    removeItem(itemId, amount = 1) {
        let remaining = amount;

        for (let i = this.items.length - 1; i >= 0; i--) {
            const item = this.items[i];

            if (item.id !== itemId) continue;

            const removed = Math.min(item.amount, remaining);

            item.amount -= removed;
            remaining -= removed;

            if (item.amount <= 0) {
                this.items.splice(i, 1);
            }

            if (remaining <= 0) return true;
        }

        return false;
    }

    hasItem(itemId, amount = 1) {
        const total = this.items
            .filter(item => item.id === itemId)
            .reduce((sum, item) => sum + item.amount, 0);

        return total >= amount;
    }

    equipItem(itemId) {
        const index = this.items.findIndex(item => item.id === itemId);

        if (index === -1) return false;

        const item = this.items[index];
        const slot = item.slot;

        if (!slot || !(slot in this.equipment)) return false;

        if (this.equipment[slot]) {
            this.items.push(this.equipment[slot]);
        }

        this.equipment[slot] = {
            ...item,
            amount: 1
        };

        item.amount--;

        if (item.amount <= 0) {
            this.items.splice(index, 1);
        }

        return true;
    }

    unequipItem(slot) {
        const item = this.equipment[slot];

        if (!item || this.items.length >= this.maxSlots) {
            return false;
        }

        this.items.push(item);
        this.equipment[slot] = null;

        return true;
    }

    getItems() {
        return this.items;
    }

    getEquipment() {
        return this.equipment;
    }

    getFreeSlots() {
        return this.maxSlots - this.items.length;
    }

    clearInventory() {
        this.items = [];
    }
}

window.InventorySystem = InventorySystem;
