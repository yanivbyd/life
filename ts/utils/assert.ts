export function assertEquals(a: number, b: number) {
    if (a != b) {
        console.error("not equals", a, b);
        debugger;
        alert("not equal " + a + " " + b);
    }
}

export function assertNotNull(a: Object) {
    if (a == null || a === undefined) {
        console.error("null/undefined");
        debugger;
        alert("null/undefined");
    }
}

export function assertNotNegative(a: number) {
    if (a < 0) {
        console.error("negative " + a);
        debugger;
        alert("negative " + a);
    }
}

export function assertNotHigher(a: number, b: number) {
    if (a > b) {
        console.error("higher " + a + " : " + b);
        debugger;
        alert("higher " + a + " : " + b);
    }
}
