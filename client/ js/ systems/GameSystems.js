class GameSystems {
    constructor() {
        // ระบบกระเป๋า
        this.inventory = new InventorySystem(40);

        // ระบบอาชีพ
        this.professions = new ProfessionSystem();
        this.professions.load();

        // ระบบต่อสู้
        this.combat = new CombatSystem();

        // ระบบสกิล
        this.skills = new SkillSystem();

        // ระบบคราฟต์
        this.crafting = new CraftingSystem(
            this.inventory,
            this.professions
        );

        // ระบบทำอาหาร
        this.cooking = new CookingSystem(
            this.inventory,
            this.professions
        );

        // ระบบภารกิจ
        this.quests = new QuestSystem(
            this.inventory,
            this.professions
        );
        this.quests.load();

        // ระบบกิลด์
        this.guild = new GuildSystem();
        this.guild.load();

        console.log("ECHO ISLES Game Systems Initialized!");
    }

    saveAll() {
        this.professions.save();
        this.quests.save();
        this.guild.save();
    }
}

window.GameSystems = GameSystems;
