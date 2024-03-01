export class Creature {
    health: number;
    type: number;
    actions: CreatureAction[];

    constructor(type: number, health: number, actions: CreatureAction[]) {
        this.type = type;
        this.health = health;
        this.actions = actions;
    }

    cycle(): void {
        for (let i=0;i<this.actions.length;i++) {
            this.actions[i].cycle();
            if (this.health <= 0) {
                return;
            }
        }
    }

}