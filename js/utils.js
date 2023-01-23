//Soubor s různými podmínkami použitými v kódu

function collision({
    object1,
    object2
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
}

function platformCollision({
    object1,
    object2
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y + object1.height <= object2.position.y + object2.height &&
        object1.position.x <= object2.position.x + object2.width &&
        object1.position.x + object1.width >= object2.position.x
    )
}

function doorCollision({
    object1,
    object2
}) {
    return (
        object1.position.y + object1.height >= object2.position.y &&
        object1.position.y <= object2.position.y + object2.height &&
        object1.position.x + object1.width <= object2.position.x + object2.width &&
        object1.position.x >= object2.position.x
    )
}

function staticTargetsCollisionRight({
    a,
    b,
}) {
    return !(
        ((a.position.y + a.height) < (b.position.y)) ||
        (a.position.y > (b.position.y + b.height)) ||
        ((a.position.x + a.width) < b.position.x) ||
        (a.position.x > (b.position.x + b.width))
    )
}

function staticTargetsCollisionLeft({
    a,
    b,
}) {
    return !(
        ((a.position.y + a.height) < (b.position.y)) ||
        (a.position.y > (b.position.y + b.height)) ||
        ((a.position.x + a.width) > b.position.x) ||
        (a.position.x < (b.position.x + b.width))
    )
}