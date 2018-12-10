function panic(msg)
{
    debugger;
    msg = msg || '';
    window.alert("PANIC - " + msg);
    console.error(msg);
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

module.exports = assert