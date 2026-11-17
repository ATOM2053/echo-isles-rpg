class CraftingSystem {
    constructor(inventory, professions) {
        this.inventory = inventory;
        this.professions = professions;

        this.recipes = {
            iron_sword: {
                name: "Iron Sword",
                profession: "blacksmith",
                requiredLevel: 1,
                materials: {
                    iron_ore: 5,
                    wood: 2
                },
                result: {
                    id: "iron_sword",
                    name: "Iron Sword",
                    type: "weapon",
                    slot: "weapon",
                    rarity: "common",
                    attack: 15,
                    maxStack: 1
                },
                exp: 25
            },

            iron_helmet: {
                name: "Iron Helmet",
                profession: "blacksmith",
                requiredLevel: 2,
                materials: {
                    iron_ore: 4
                },
                result: {
                    id: "iron_helmet",
                    name: "Iron Helmet",
                    type: "armor",
                    slot: "helmet",
                    rarity: "common",
                    defense: 8,
                    maxStack: 1
                },
                exp: 30
            },

            health_potion: {
                name: "Health Potion",
                profession: "alchemist",
                requiredLevel: 1,
                materials: {
                    red_herb: 3,
                    water: 1
                },
                result: {
                    id: "health_potion",
                    name: "Health Potion",
                    type: "consumable",
                    effect: "heal",
                    value: 50,
                    maxStack: 99
                },
                exp: 20
            },

            wooden_bow: {
                name: "Wooden Bow",
                profession: "blacksmith",
                requiredLevel: 1,
                materials: {
                    wood: 5,
                    iron_ore: 1
                },
                result: {
                    id: "wooden_bow",
                    name: "Wooden Bow",
                    type: "weapon",
                    slot: "weapon",
                    rarity: "common",
                    attack: 10,
                    maxStack: 1
                },
                exp: 20
            }
        };
    }

    getRecipes() {
        return this.recipes;
    }

    getRecipe(id) {
        return this.recipes[id] || null;
    }

    canCraft(id) {
        const recipe = this.getRecipe(id);

        if (!recipe) return false;

        if (!this.professions.canCraft(
            recipe.profession,
            recipe.requiredLevel
        )) {
            return false;
        }

        for (const material in recipe.materials) {
            if (!this.inventory.hasItem(
                material,
                recipe.materials[material]
            )) {
                return false;
            }
        }

        return true;
    }

    craft(id) {
        const recipe = this.getRecipe(id);

        if (!recipe || !this.canCraft(id)) {
            return {
                success: false,
                message: "Not enough materials or profession level."
            };
        }

        for (const material in recipe.materials) {
            this.inventory.removeItem(
                material,
                recipe.materials[material]
            );
        }

        const added = this.inventory.addItem(
            recipe.result,
            recipe.result.amount || 1
        );

        if (!added) {
            for (const material in recipe.materials) {
                this.inventory.addItem(
                    {
                        id: material,
                        name: material,
                        maxStack: 99
                    },
                    recipe.materials[material]
                );
            }

            return {
                success: false,
                message: "Inventory is full."
            };
        }

        this.professions.gainExp(
            recipe.profession,
            recipe.exp
        );

        this.professions.save();

        return {
            success: true,
            message: `Crafted ${recipe.name}!`,
            item: recipe.result
        };
    }
}

window.CraftingSystem = CraftingSystem;
