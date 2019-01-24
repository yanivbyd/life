function panic(msg)
{
    debugger;
    if (msg === undefined) msg = '';
    console.error(msg);
    window.alert("PANIC - " + msg);
}

assert = function(val, msg)
{
    if (!val) panic(msg);
}

assert.strictEqual = function(v1, v2, msg)
{
    if (v1 !== v2) panic(msg);
}

assert.equal = function(v1, v2, msg)
{
    if (v1 != v2) panic(msg);
}

assert.fail = function(msg)
{
    panic(msg);
}

module.exports = assert