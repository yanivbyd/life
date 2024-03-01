
export class RandomMinMax {
    min: number;
    max: number;
}
export class Environment {
    maxVeg: number;
    rain: RandomMinMax;
}

export class WorldParams {
    env: Environment;
};
export var globalParams: WorldParams = {
    env: {
        maxVeg: 20,
        rain: { min: 1, max: 4}
    }
};
