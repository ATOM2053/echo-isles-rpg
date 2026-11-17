class CookingSystem {
    constructor(inventory, professions) {
        this.inventory = inventory;
        this.professions = professions;

        this.recipes = {
            grilled_fish: {
                name: "Grilled Fish",
                requiredLevel: 1,
                materials: {
                    raw_fish: 2,
                    salt: 1
                },
                result: {
                    id: "grilled_fish",
                    name: "Grilled Fish",
                    type: "food",
                    maxStack: 20,
                    buff: {
                        type: "health",
                        value: 30,
                        duration: 300
                    }
                },
                exp: 20
            },

            mushroom_soup: {
                name: "Mushroom Soup",
                requiredLevel: 2,
                materials: {
                    mushroom: 3,
                    water: 1
                },
                result: {
                    id: "mushroom_soup",
                    name: "Mushroom Soup",
                    type: "food",
                    maxStack: 20,
                    buff: {
                        type: "mana",
                        value: 25,
                        duration: 300
                    }
                },
                exp: 30
            },

            royal_feast: {
                name: "Royal Feast",
                requiredLevel: 5,
                materials: {
                    meat: 3,
                    carrot: 2,
                    mushroom: 2
                },
                result: {
                    id: "royal_feast",
                    name: "Royal Feast",
                    type: "food",
                    maxStack: 10,
                    buff: {
                        type: "attack",
                        value: 15,
                        duration: 600
                    }
                },
                exp: 80
            }
        };
    }

    getRecipes() {
        return this.recipes;
    }

    getRecipe(id) {
        return this.recipes[id] || null;
    }

    canCook(id) {
        const recipe = this.getRecipe(id);

        if (!recipe) return false;

        if (!this.professions.canCraft(
            "chef",
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

    cook(id) {
        const recipe = this.getRecipe(id);

        if (!recipe || !this.canCook(id)) {
            return {
                success: false,
                message: "Not enough ingredients or Chef level."
            };
        }

        // ตรวจสอบพื้นที่ก่อนใช้วัตถุดิบ
        const added = this.inventory.addItem(
            recipe.result,
            1
        );

        if (!added) {
            return {
                success: false,
                message: "Inventory is full."
            };
        }

        // ใช้วัตถุดิบเมื่อทำอาหารสำเร็จ
        for (const material in recipe.materials) {
            this.inventory.removeItem(
                material,
                recipe.materials[material]
            );
        }

        this.professions.gainExp("chef", recipe.exp);
        this.professions.save();

        return {
            success: true,
            message: `Cooked ${recipe.name}!`,
            item: recipe.result
        };
    }
}

window.CookingSystem = CookingSystem;
