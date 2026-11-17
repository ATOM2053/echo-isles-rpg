// ======================================
// ECHO ISLES RPG
// CHARACTER CREATOR SCENE
// ======================================

class CharacterCreatorScene extends Phaser.Scene {

    constructor() {
        super({ key: 'CharacterCreatorScene' });

        this.character = {
            name: '',
            race: 'Human',
            job: 'Swordsman',
            hairColor: '#3b2418',
            gender: 'Male'
        };
    }

    create() {

        const width = this.scale.width;
        const height = this.scale.height;

        // Background
        this.cameras.main.setBackgroundColor('#101522');

        // Title
        this.add.text(width / 2, 45, 'CREATE YOUR CHARACTER', {
            fontSize: '25px',
            color: '#f3d28a',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        this.add.text(width / 2, 80, 'Begin your adventure in ECHO ISLES', {
            fontSize: '12px',
            color: '#aebbd0'
        }).setOrigin(0.5);

        // Character preview panel
        const panel = this.add.rectangle(
            width / 2,
            height * 0.34,
            width * 0.82,
            height * 0.34,
            0x202b3d
        );

        panel.setStrokeStyle(2, 0xc5a568);

        this.add.text(width / 2, height * 0.23,
            'CHARACTER PREVIEW', {
                fontSize: '15px',
                color: '#f3d28a'
            }).setOrigin(0.5);

        this.previewText = this.add.text(
            width / 2,
            height * 0.35,
            'Character Sprite\\nComing Soon', {
                fontSize: '20px',
                color: '#d9dfeb',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Name
        this.add.text(width / 2, height * 0.55, 'CHARACTER NAME', {
            fontSize: '13px',
            color: '#f3d28a'
        }).setOrigin(0.5);

        this.nameInput = document.createElement('input');

        this.nameInput.placeholder = 'Enter character name';
        this.nameInput.maxLength = 16;

        Object.assign(this.nameInput.style, {
            position: 'absolute',
            width: '220px',
            height: '35px',
            left: '50%',
            top: '59%',
            transform: 'translate(-50%, -50%)',
            background: '#202b3d',
            color: 'white',
            border: '1px solid #c5a568',
            borderRadius: '6px',
            padding: '5px 10px',
            zIndex: '1000',
            fontSize: '14px'
        });

        document.body.appendChild(this.nameInput);

        // Race selection
        this.add.text(width / 2, height * 0.65, 'RACE', {
            fontSize: '13px',
            color: '#f3d28a'
        }).setOrigin(0.5);

        this.createOptionButtons(
            ['Human', 'Elf', 'Dwarf'],
            height * 0.69,
            'race'
        );

        // Job selection
        this.add.text(width / 2, height * 0.76, 'CLASS', {
            fontSize: '13px',
            color: '#f3d28a'
        }).setOrigin(0.5);

        this.createOptionButtons(
            ['Swordsman', 'Archer', 'Mage'],
            height * 0.80,
            'job'
        );

        // Start button
        const startButton = this.add.rectangle(
            width / 2,
            height * 0.91,
            190,
            48,
            0x94713b
        );

        startButton.setInteractive({ useHandCursor: true });
        startButton.setStrokeStyle(2, 0xf3d28a);

        this.add.text(
            width / 2,
            height * 0.91,
            'START ADVENTURE', {
                fontSize: '15px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        startButton.on('pointerdown', () => {
            this.saveCharacter();
        });

        this.events.once('shutdown', () => {
            this.nameInput.remove();
        });
    }

    createOptionButtons(options, y, property) {

        const width = this.scale.width;
        const spacing = 105;

        options.forEach((option, index) => {

            const x = width / 2 +
                (index - (options.length - 1) / 2) * spacing;

            const button = this.add.rectangle(
                x, y, 95, 35, 0x29364a
            );

            button.setStrokeStyle(1, 0xc5a568);
            button.setInteractive({ useHandCursor: true });

            const label = this.add.text(x, y, option, {
                fontSize: '11px',
                color: '#ffffff'
            }).setOrigin(0.5);

            button.on('pointerdown', () => {

                this.character[property] = option;

                this.updatePreview();

                options.forEach((_, i) => {
                    button.scene.children.list
                        .filter(child =>
                            child.type === 'Rectangle'
                        );
                });

                label.setColor('#f3d28a');
            });
        });
    }

    updatePreview() {

        this.previewText.setText(
            'Race: ' + this.character.race +
            '\\nClass: ' + this.character.job
        );
    }

    saveCharacter() {

        const name = this.nameInput.value.trim();

        if (!name) {
            alert('Please enter your character name!');
            return;
        }

        this.character.name = name;

        localStorage.setItem(
            'echoIslesCharacter',
            JSON.stringify(this.character)
        );

        alert('Character created successfully!');

        // WorldScene will be added in the next step.
        if (this.scene.manager.keys['WorldScene']) {
            this.scene.start('WorldScene');
        }
    }
          }
