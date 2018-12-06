function assert(val, text)
{
    if (!val) {
        debugger;
        alert("PANIC - " + text);
        console.error(text);
    }
}