function assert(val, text)
{
    if (!val) panic(text);
}

function assertSamePointer(p1, p2, text)
{
    if (p1 !== p2) panic(text);
}

function panic(text)
{
    debugger;
    if (!text) text = "";
    alert("PANIC - " + text);
    console.error(text);
}