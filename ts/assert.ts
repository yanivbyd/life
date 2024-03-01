export function assertEquals(a: number, b: number) {
    if (a != b) {
        console.error("not equals", a, b);
        alert("not equal " + a + " " + b);
    }
}