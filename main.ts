enum ActionKind {
    RunningLeft,
    RunningRight,
    Idle,
    IdleLeft,
    IdleRight,
    JumpingLeft,
    JumpingRight,
    CrouchLeft,
    CrouchRight,
    Flying,
    Walking,
    Jumping
}
namespace SpriteKind {
    export const Bumper = SpriteKind.create()
    export const Goal = SpriteKind.create()
    export const Coin = SpriteKind.create()
    export const Flier = SpriteKind.create()
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Bumper, function (sprite, otherSprite) {
    if (sprite.vy > 0 && !(sprite.isHittingTile(CollisionDirection.Bottom)) || sprite.y < otherSprite.top) {
        otherSprite.destroy(effects.ashes, 250)
        otherSprite.vy = -50
        sprite.vy = -2 * pixelsToMeters
        info.changeScoreBy(1)
    } else {
        info.changeLifeBy(-1)
        sprite.say("Ow!", invincibilityPeriod)
    }
    pause(invincibilityPeriod)
})
function initializeAnimations () {
    initializeHeroAnimations()
    initializeCoinAnimation()
    initializeFlierAnimations()
}
function giveIntroduction () {
    game.setDialogFrame(img`
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
        2 2 1 1 1 1 1 1 1 1 1 1 1 2 2 . 
        2 1 1 2 2 2 2 2 2 2 2 2 1 1 2 . 
        2 1 2 2 1 1 1 1 1 1 1 2 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 1 1 1 1 1 1 1 1 1 2 1 2 . 
        2 1 2 2 1 1 1 1 1 1 1 2 2 1 2 . 
        2 1 1 2 2 2 2 2 2 2 2 2 1 1 2 . 
        2 2 1 1 1 1 1 1 1 1 1 1 1 2 2 . 
        . 2 2 2 2 2 2 2 2 2 2 2 2 2 . . 
        . . . . . . . . . . . . . . . . 
        `)
    game.setDialogCursor(img`
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . f f 5 5 5 5 f f . . . . 
        . . . . f 5 5 5 5 5 5 f . . . . 
        . . . f 5 5 5 4 4 5 5 5 f . . . 
        . . . f 5 5 5 4 4 5 5 5 f . . . 
        . . . f 5 5 5 4 4 5 5 5 f . . . 
        . . . f 5 5 5 4 4 5 5 5 f . . . 
        . . . . f 5 5 5 5 5 5 f . . . . 
        . . . . f f 5 5 5 5 f f . . . . 
        . . . . . . f f f f . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        . . . . . . . . . . . . . . . . 
        `)
    showInstruction("Move with the left and right buttons.")
    showInstruction("Jump with the up or A button.")
    showInstruction("Double jump by pressing jump again.")
}
controller.up.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
function initializeCoinAnimation () {
    coinAnimation = animation.createAnimation(ActionKind.Idle, 200)
    coinAnimation.addAnimationFrame(img`
        . . . . . . 2 2 2 2 . . . . . . 
        . . . . 2 2 3 3 3 3 2 e . . . . 
        . . . 2 3 d 1 1 d d 3 2 e . . . 
        . . 2 3 1 d 3 3 3 d d 3 e . . . 
        . 2 3 1 3 3 3 3 3 d 1 3 b e . . 
        . 2 1 d 3 3 3 3 d 3 3 1 3 b b . 
        2 3 1 d 3 3 1 1 3 3 3 1 3 4 b b 
        2 d 3 3 d 1 3 1 3 3 3 1 3 4 4 b 
        2 d 3 3 3 1 3 1 3 3 3 1 b 4 4 e 
        2 d 3 3 3 1 1 3 3 3 3 1 b 4 4 e 
        e d 3 3 3 3 d 3 3 3 d d b 4 4 e 
        e d d 3 3 3 d 3 3 3 1 3 b 4 b e 
        e 3 d 3 3 1 d d 3 d 1 b b e e . 
        . e 3 1 1 d d 1 1 1 b b e e e . 
        . . e 3 3 3 3 3 3 b e e e e . . 
        . . . e e e e e e e e e e . . . 
        `)
}
sprites.onOverlap(SpriteKind.Player, SpriteKind.Coin, function (sprite, otherSprite) {
    otherSprite.destroy(effects.trail, 250)
    otherSprite.y += -3
    info.changeScoreBy(1)
})
function attemptJump () {
    // else if: either fell off a ledge, or double jumping
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        hero.vy = -4 * pixelsToMeters
    } else if (canDoubleJump) {
        doubleJumpSpeed = -3 * pixelsToMeters
        // Good double jump
        if (hero.vy >= -40) {
            doubleJumpSpeed = -4.5 * pixelsToMeters
            hero.startEffect(effects.trail, 500)
            scene.cameraShake(2, 250)
        }
        hero.vy = doubleJumpSpeed
        canDoubleJump = false
    }
}
function animateIdle () {
    mainIdleLeft = animation.createAnimation(ActionKind.IdleLeft, 100)
    animation.attachAnimation(hero, mainIdleLeft)
    mainIdleLeft.addAnimationFrame(img`
        . . . 1 1 1 1 1 1 . . . . . . . 
        . . 1 1 8 8 8 8 1 1 1 . . . . . 
        1 1 8 8 a a a a 8 8 1 1 . . . . 
        1 8 a a a a a a a a 8 1 1 . . . 
        8 a a a a a 1 f a a a 8 1 . . . 
        8 a a a a a f f a a a a 1 1 . . 
        8 a a a a a a a a a a a 8 1 . . 
        8 8 9 9 1 9 a a a a a a 7 8 1 . 
        8 a 2 2 2 a 1 1 1 1 1 1 1 1 1 . 
        1 1 1 1 1 1 1 a a a 7 7 7 8 . . 
        . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
        . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
        . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
        . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
        . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
        . . 8 9 9 9 8 7 a a 9 8 . . . . 
        `)
    mainIdleRight = animation.createAnimation(ActionKind.IdleRight, 100)
    animation.attachAnimation(hero, mainIdleRight)
    mainIdleRight.addAnimationFrame(img`
        . . . . . . . 1 1 1 1 1 1 . . . 
        . . . . . 1 1 1 8 8 8 8 1 1 . . 
        . . . . 1 1 8 8 a a a a 8 8 1 1 
        . . . 1 1 8 a a a a a a a a 8 1 
        . . . 1 8 a a a f 1 a a a a a 8 
        . . 1 1 a a a a f f a a a a a 8 
        . . 1 8 a a a a a a a a a a a 8 
        . 1 8 7 a a a a a a 9 1 9 9 8 8 
        . 1 1 1 1 1 1 1 1 1 a 2 2 2 a 8 
        . . 8 7 7 7 a a a 1 1 1 1 1 1 1 
        . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
        8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
        8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
        . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
        . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
        . . . . 8 9 a a 7 8 9 9 9 8 . . 
        `)
}
function setLevelTileMap (level: number) {
    clearGame()
    if (level == 0) {
        tiles.setTilemap(tilemap`level`)
    } else if (level == 1) {
        tiles.setTilemap(tilemap`level_0`)
    } else if (level == 2) {
        tiles.setTilemap(tilemap`level_1`)
    } else if (level == 3) {
        tiles.setTilemap(tilemap`level_2`)
    } else if (level == 4) {
        tiles.setTilemap(tilemap`level_3`)
    } else if (level == 5) {
        tiles.setTilemap(tilemap`level_4`)
    } else if (level == 6) {
        tiles.setTilemap(tilemap`level_5`)
    } else if (level == 7) {
        tiles.setTilemap(tilemap`level_6`)
    }
    initializeLevel(level)
}
function initializeFlierAnimations () {
    flierFlying = animation.createAnimation(ActionKind.Flying, 100)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . 1 1 1 1 1 1 . . 
        . . . . . . . . 1 b 5 b 1 1 . . 
        . . . . . 1 1 1 1 b c . 1 . . . 
        . . . . 1 1 b b b b b b 1 1 . . 
        . . . 1 1 b b 5 5 5 5 5 b 1 1 . 
        . . . 1 b b 5 d 1 f 5 5 d f 1 . 
        . . . 1 b 5 5 1 f f 5 d 4 c 1 . 
        . 1 1 1 b 5 5 d f b d d 4 4 1 1 
        b 1 d d b b d 5 5 5 4 4 4 4 4 1 
        b 1 d 5 5 5 b 5 5 4 4 4 4 4 b 1 
        b 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        c d d c d 5 5 b 5 5 5 5 5 5 b . 
        c b d d c c b 5 5 5 5 5 5 5 b . 
        . c d d d d d d 5 5 5 5 5 d b . 
        . . c b d d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . 1 1 1 1 1 . . . 
        . . . . . 1 1 1 1 b 5 b 1 . . . 
        . . . . . 1 b b b b b b 1 1 . . 
        . . . 1 1 1 b 5 5 5 5 5 b 1 1 . 
        . . . 1 b b 5 d 1 f 5 d 4 c 1 1 
        . . . 1 b 5 5 1 f f d d 4 4 4 1 
        . . . 1 b 5 5 d f b 4 4 4 4 b 1 
        . . 1 b d 5 5 5 5 4 4 4 4 b 1 1 
        . . 1 d d 5 1 1 1 1 1 1 1 1 1 1 
        . b 1 1 1 1 1 5 5 5 5 5 5 5 b . 
        b d d d b b b 5 5 5 5 5 5 5 b . 
        c d d b 5 5 d c 5 5 5 5 5 5 b . 
        c b b d 5 d c d 5 5 5 5 5 5 b . 
        . b 5 5 b c d d 5 5 5 5 5 d b . 
        b b c c c d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        `)
    flierFlying.addAnimationFrame(img`
        . . . . . . . . 1 1 1 1 1 . . . 
        . . . . . 1 1 1 1 b 5 b 1 . . . 
        . . . . 1 1 b b b b b b 1 . . . 
        . . . 1 1 b b 5 5 5 5 5 b 1 . . 
        . . . 1 b b 5 d 1 f 5 d 4 c 1 1 
        . . . 1 b 5 5 1 f f d d 4 4 4 1 
        . . 1 1 b 5 5 d f b 4 4 4 4 1 . 
        . . 1 b d 5 5 5 5 4 4 4 4 1 . . 
        . b 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        b d d d b b b 5 5 5 5 5 5 5 b . 
        c d d b 5 5 d c 5 5 5 5 5 5 b . 
        c b b d 5 d c d 5 5 5 5 5 5 b . 
        c b 5 5 b c d d 5 5 5 5 5 5 b . 
        b b c c c d d d 5 5 5 5 5 d b . 
        . . . . c c d d d 5 5 5 b b . . 
        . . . . . . c c c c c b b . . . 
        `)
    flierIdle = animation.createAnimation(ActionKind.Idle, 100)
    flierIdle.addAnimationFrame(img`
        . . . . . . . . 1 1 1 1 1 . . . 
        . . . . . 1 1 1 1 b 5 b 1 . . . 
        . . . . 1 1 b b b b b b 1 1 . . 
        . . . 1 1 b b 5 5 5 5 5 b 1 1 . 
        . . . 1 b b 5 d 1 f 5 5 d f 1 . 
        . . . 1 b 5 5 1 f f 5 d 4 c 1 . 
        1 1 1 1 b 5 5 d f b d d 4 4 1 1 
        1 b b b d 5 5 5 5 5 4 4 4 4 4 1 
        1 d d d b b d 5 5 4 4 4 4 4 1 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
        c d c 5 5 5 5 d 5 5 5 5 5 5 b . 
        c b d c d 5 5 b 5 5 5 5 5 5 b . 
        . c d d c c b d 5 5 5 5 5 d b . 
        . . c b d d d d d 5 5 5 b b . . 
        . . . c c c c c c c c b b . . . 
        . . . . . . . . . . . . . . . . 
        `)
}
controller.A.onEvent(ControllerButtonEvent.Pressed, function () {
    attemptJump()
})
function animateRun () {
    mainRunLeft = animation.createAnimation(ActionKind.RunningLeft, 100)
    animation.attachAnimation(hero, mainRunLeft)
    for (let index = 0; index < 30; index++) {
        mainRunLeft.addAnimationFrame(img`
            . . . 1 1 1 1 1 1 . . . . . . . 
            . 1 1 1 8 8 8 8 1 1 . . . . . . 
            1 1 8 8 a a a a 8 1 1 1 . . . . 
            1 8 a a a a a a a a 8 1 1 . . . 
            8 a a a a a 1 f a a a 8 1 1 . . 
            8 a a a a a f f a a a a 8 1 . . 
            8 a a a a a a a a a a a 8 1 1 . 
            8 8 9 9 1 9 a a a a a a 1 1 1 . 
            8 a 2 2 2 a a a a a 7 1 1 8 . . 
            1 1 1 1 1 1 1 1 1 1 1 1 7 8 . . 
            . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
            . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
            . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
            . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
            . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
            . . 8 9 9 9 8 7 a a 9 8 . . . . 
            `)
        mainRunLeft.addAnimationFrame(img`
            . 1 1 1 8 8 8 8 8 1 1 . . . . . 
            1 1 8 8 a a a a a 8 1 1 . . . . 
            1 8 a a a a 1 f a a 8 1 1 . . . 
            8 a a a a a f f a a a 8 1 1 . . 
            8 a a a a a a a a a a a 8 1 . . 
            8 8 9 9 1 9 a a a a a a 8 1 . . 
            8 a 2 2 2 a a a a a a a 7 1 . . 
            8 a 2 2 2 a a a a a 7 7 7 1 . . 
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . 8 9 9 8 a a 7 7 7 7 7 8 . . 
            . 8 9 9 8 a a 7 7 7 7 7 7 8 8 8 
            . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
            . . . . 8 8 8 7 a a 7 7 7 7 8 . 
            . . . . . 8 7 a a 7 7 8 8 8 . . 
            . . . . 8 8 8 8 8 8 8 . . . . . 
            . . . . 8 9 9 9 8 . . . . . . . 
            `)
        mainRunLeft.addAnimationFrame(img`
            . . . 1 1 1 1 1 1 . . . . . . . 
            . 1 1 1 8 8 8 8 1 1 1 . . . . . 
            1 1 8 8 a a a a 8 8 1 1 . . . . 
            1 8 a a a a a a a a 8 1 1 . . . 
            8 a a a a a 1 f a a a 8 1 1 . . 
            8 a a a a a f f a a a a 8 1 . . 
            8 a a a a a a a a a a a 8 1 1 . 
            8 8 9 9 1 9 a a a a a a 7 8 1 . 
            8 a 2 2 2 a a a a a 7 7 7 1 . . 
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 . . 
            . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
            . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
            . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
            . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
            . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
            . . 8 9 9 9 8 7 a a 9 8 . . . . 
            `)
        mainRunLeft.addAnimationFrame(img`
            . . . 1 1 1 1 1 1 . . . . . . . 
            . 1 1 1 8 8 8 8 1 1 1 . . . . . 
            1 1 8 8 a a a a 8 8 1 1 . . . . 
            1 8 a a a a a a a a 8 1 1 . . . 
            8 a a a a a 1 f a a a 8 1 1 . . 
            8 a a a a a f f a a a a 8 1 . . 
            8 a a a a a a a a a a a 8 1 1 . 
            8 8 9 9 1 9 a a a a a a 7 8 1 . 
            8 a 2 2 2 a a a a a 7 7 7 8 1 . 
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
            . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
            . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
            . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
            . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
            . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
            . . 8 9 9 9 8 7 a a 9 8 . . . . 
            `)
        mainRunRight = animation.createAnimation(ActionKind.RunningRight, 100)
        animation.attachAnimation(hero, mainRunRight)
        for (let index = 0; index < 30; index++) {
            mainRunRight.addAnimationFrame(img`
                . . . . . . . 1 1 1 1 1 1 . . . 
                . . . . . 1 1 1 8 8 8 8 1 1 . . 
                . . . . 1 1 8 8 a a a a 8 8 1 1 
                . . . 1 1 8 a a a a a a a a 8 1 
                . . . 1 8 a a a f 1 a a a a a 8 
                . . 1 1 a a a a f f a a a a a 8 
                . . 1 8 a a a a a a a a a a a 8 
                . 1 8 7 a a a a a a 9 1 9 9 8 8 
                . 1 1 1 1 1 1 1 1 1 a 2 2 2 a 8 
                . . 8 7 7 7 a a a 1 1 1 1 1 1 1 
                . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
                8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
                8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
                . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
                . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
                . . . . 8 9 a a 7 8 9 9 9 8 . . 
                `)
            mainRunRight.addAnimationFrame(img`
                . . . . . 1 1 8 8 8 8 8 1 1 1 . 
                . . . . 1 1 8 a a a a a 8 8 1 1 
                . . . 1 1 8 a a f 1 a a a a 8 1 
                . . 1 1 8 a a a f f a a a a a 8 
                . . 1 8 a a a a a a a a a a a 8 
                . . 1 8 a a a a a a 9 1 9 9 8 8 
                . . 1 7 a a a a a a a 2 2 2 a 8 
                . . 1 7 7 7 a a a a a 2 2 2 a 8 
                . . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
                . . 8 7 7 7 7 7 a a 8 9 9 8 . . 
                8 8 8 7 7 7 7 7 7 a a 8 9 9 8 . 
                8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
                . 8 7 7 7 7 a a 7 8 8 8 . . . . 
                . . 8 8 8 7 7 a a 7 8 . . . . . 
                . . . . . 8 8 8 8 8 8 8 . . . . 
                . . . . . . . 8 9 9 9 8 . . . . 
                `)
            mainRunRight.addAnimationFrame(img`
                . . . . . . . 1 1 1 1 1 1 . . . 
                . . . . . 1 1 1 8 8 8 8 1 1 . . 
                . . . . 1 1 8 8 a a a a 8 8 1 1 
                . . . 1 1 8 a a a a a a a a 8 1 
                . . . 1 8 a a a f 1 a a a a a 8 
                . . 1 1 a a a a f f a a a a a 8 
                . . 1 8 a a a a a a a a a a a 8 
                . 1 8 7 a a a a a a 9 1 9 9 8 8 
                . 1 1 1 1 1 1 1 1 1 a 2 2 2 a 8 
                . . 8 7 7 7 a a a 1 1 1 1 1 1 1 
                . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
                8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
                8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
                . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
                . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
                . . . . 8 9 a a 7 8 9 9 9 8 . . 
                `)
            mainRunRight.addAnimationFrame(img`
                . . . . . . . 1 1 1 1 1 1 . . . 
                . . . . . 1 1 1 8 8 8 8 1 1 . . 
                . . . . 1 1 8 8 a a a a 8 8 1 1 
                . . . 1 1 8 a a a a a a a a 8 1 
                . . . 1 8 a a a f 1 a a a a a 8 
                . . 1 1 a a a a f f a a a a a 8 
                . . 1 8 a a a a a a a a a a a 8 
                . 1 8 7 a a a a a a 9 1 9 9 8 8 
                . 1 1 1 1 1 1 1 1 1 a 2 2 2 a 8 
                . . 8 7 7 7 a a a 1 1 1 1 1 1 1 
                . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
                8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
                8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
                . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
                . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
                . . . . 8 9 a a 7 8 9 9 9 8 . . 
                `)
        }
    }
}
function animateJumps () {
    // Because there isn't currently an easy way to say "play this animation a single time
    // and stop at the end", this just adds a bunch of the same frame at the end to accomplish
    // the same behavior
    mainJumpLeft = animation.createAnimation(ActionKind.JumpingLeft, 100)
    animation.attachAnimation(hero, mainJumpLeft)
    mainJumpLeft.addAnimationFrame(img`
        . . . 1 1 1 1 1 1 . . . . . . . 
        . 1 1 1 8 8 8 8 1 1 1 . . . . . 
        1 1 8 8 a a a a 8 8 1 1 . . . . 
        1 8 a a a a a a a a 8 1 1 . . . 
        8 a a a a a 1 f a a a 8 1 1 . . 
        8 a a a a a f f a a a a 8 1 1 . 
        8 a a a a a a a a a a a 8 1 1 . 
        8 8 9 9 1 9 a a a a a a 7 8 1 . 
        8 a 2 2 2 a 1 1 1 1 1 1 1 1 1 . 
        1 1 1 1 1 1 1 a a a 7 7 7 8 . . 
        . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
        . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
        . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
        . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
        . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
        . . 8 9 9 9 8 7 a a 9 8 . . . . 
        `)
    mainJumpLeft.addAnimationFrame(img`
        . . . 1 1 1 1 1 1 . . . . . . . 
        . 1 1 1 8 8 8 8 1 1 1 . . . . . 
        1 1 8 8 a a a a 8 8 1 1 . . . . 
        1 8 a a a a a a a a 8 1 1 . . . 
        8 a a a a a 1 f a a a 8 1 1 . . 
        8 a a a a a f f a a a a 8 1 . . 
        8 a a a a a a a a a a a 8 1 1 . 
        8 8 9 9 1 9 a a a a a a 7 8 1 . 
        8 a 2 2 2 a 1 1 1 1 1 1 1 1 1 . 
        1 1 1 1 1 1 1 a a a 7 7 7 8 . . 
        . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
        . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
        . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
        . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
        . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
        . . 8 9 9 9 8 7 a a 9 8 . . . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpLeft.addAnimationFrame(img`
            . . . 1 1 1 1 1 1 . . . . . . . 
            . 1 1 1 8 8 8 8 1 1 1 . . . . . 
            1 1 8 8 a a a a 8 8 1 1 . . . . 
            1 8 a a a a a a a a 8 1 1 . . . 
            8 a a a a a 1 f a a a 8 1 1 . . 
            8 a a a a a f f a a a a 8 1 . . 
            8 a a a a a a a a a a a 8 1 1 . 
            8 8 9 9 1 9 a a a a a a 7 8 1 . 
            8 a 2 2 2 a a a a 1 1 1 1 1 1 . 
            1 1 1 1 1 1 1 1 1 a 7 7 7 8 . . 
            . . 8 9 9 8 a a 9 7 7 7 7 8 8 . 
            . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
            . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
            . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
            . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
            . . 8 9 9 9 8 7 a a 9 8 . . . . 
            `)
    }
    mainJumpRight = animation.createAnimation(ActionKind.JumpingRight, 100)
    animation.attachAnimation(hero, mainJumpRight)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . 1 1 1 1 1 1 . . . 
        . . . . . 1 1 1 8 8 8 8 1 1 1 . 
        . . . . 1 1 8 8 a a a a 8 8 1 1 
        . . . 1 1 8 a a a a a a a a 8 1 
        . . . 1 8 a a a f 1 a a a a a 8 
        . . . 1 a a a a f f a a a a a 8 
        . 1 1 8 a a a a a a a a a a a 8 
        . 1 8 7 a a a a a a 9 1 9 9 8 8 
        . 1 8 7 7 7 a a a a a 2 2 2 a 8 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
        8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
        8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
        . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
        . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
        . . . . 8 9 a a 7 8 9 9 9 8 . . 
        `)
    mainJumpRight.addAnimationFrame(img`
        . . . . . . . 1 1 1 1 1 1 . . . 
        . . . . . 1 1 1 8 8 8 8 1 1 1 . 
        . . . . 1 1 8 8 a a a a 8 8 1 1 
        . . . 1 1 8 a a a a a a a a 8 1 
        . . 1 1 8 a a a f 1 a a a a a 8 
        . . 1 8 a a a a f f a a a a a 8 
        . 1 1 8 a a a a a a a a a a a 8 
        . 1 8 7 a a a a a a 9 1 9 9 8 8 
        . 1 1 1 1 7 a a a a a 2 2 2 a 8 
        . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
        8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
        8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
        . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
        . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
        . . . . 8 9 a a 7 8 9 9 9 8 . . 
        `)
    for (let index = 0; index < 30; index++) {
        mainJumpRight.addAnimationFrame(img`
            . . . . . . . 1 1 1 1 1 1 . . . 
            . . . . . 1 1 1 8 8 8 8 1 1 1 . 
            . . . . 1 1 8 8 a a a a 8 8 1 1 
            . . . 1 1 8 a a a a a a a a 8 1 
            . . 1 1 8 a a a f 1 a a a a a 8 
            . . 1 8 a a a a f f a a a a a 8 
            . 1 1 8 a a a a a a a a a a a 8 
            . 1 8 7 a a a a a a 9 1 9 9 8 8 
            . 1 8 7 7 7 a a a a a 2 2 2 a 8 
            . 1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 
            . 8 8 7 7 7 7 9 a a 8 9 9 8 . . 
            8 7 8 7 7 7 7 9 9 a a 8 9 9 8 . 
            8 7 7 7 7 7 7 7 7 8 8 8 8 8 8 . 
            . 8 7 7 7 9 a a 7 8 8 8 8 . . . 
            . . 8 8 8 9 a a 9 8 8 8 8 8 . . 
            . . . . 8 9 a a 7 8 9 9 9 8 . . 
            `)
    }
}
function animateCrouch () {
    mainCrouchLeft = animation.createAnimation(ActionKind.CrouchLeft, 100)
    animation.attachAnimation(hero, mainCrouchLeft)
    mainCrouchLeft.addAnimationFrame(img`
        1 1 1 1 1 1 1 1 1 . . . . . 
        1 . . . 8 8 8 8 1 1 1 . . . 
        1 . 8 8 a a a a 8 8 1 1 . . 
        1 8 a a a a a a a a 8 1 1 . 
        1 a a a a a 1 f a a a 8 1 1 
        1 a a a a a f f a a a a 8 1 
        1 a a a a a a a a a a a 8 1 
        1 8 9 9 1 9 a a a a a a 7 1 
        1 a 2 2 2 a a a a a 7 7 7 1 
        1 9 a a a a a a a a 7 7 7 1 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        . 8 9 9 8 a a 9 9 7 7 7 1 1 
        . 8 8 8 8 8 8 7 7 7 7 7 7 7 
        . . . 8 8 8 8 7 a a 9 7 7 7 
        `)
    mainCrouchRight = animation.createAnimation(ActionKind.CrouchRight, 100)
    animation.attachAnimation(hero, mainCrouchRight)
    mainCrouchRight.addAnimationFrame(img`
        . . . . . 1 1 1 1 1 1 . . . 
        . . . 1 1 1 8 8 8 8 1 1 1 . 
        . . 1 1 8 8 a a a a 8 8 1 1 
        . 1 1 8 a a a a a a a a 8 1 
        1 1 8 a a a f 1 a a a a a 8 
        1 8 a a a a f f a a a a a 8 
        1 8 a a a a a a a a a a a 8 
        1 7 a a a a a a 9 1 9 9 8 8 
        1 7 7 7 a a a a a 2 2 2 a 8 
        1 1 1 1 1 1 1 1 1 1 1 1 1 1 
        8 7 7 7 7 9 a a 8 9 9 8 . . 
        8 7 7 7 7 9 9 a a 8 9 9 8 . 
        7 7 7 7 7 7 7 8 8 8 8 8 8 . 
        7 7 7 9 a a 7 8 8 8 8 . . . 
        `)
}
function clearGame () {
    for (let value of sprites.allOfKind(SpriteKind.Bumper)) {
        value.destroy()
    }
    for (let value2 of sprites.allOfKind(SpriteKind.Coin)) {
        value2.destroy()
    }
    for (let value3 of sprites.allOfKind(SpriteKind.Goal)) {
        value3.destroy()
    }
    for (let value4 of sprites.allOfKind(SpriteKind.Flier)) {
        value4.destroy()
    }
}
scene.onOverlapTile(SpriteKind.Player, assets.tile`tile1`, function (sprite, location) {
    info.changeLifeBy(1)
    currentLevel += 1
    if (hasNextLevel()) {
        game.splash("Next level unlocked!")
        setLevelTileMap(currentLevel)
    } else {
        game.over(true, effects.confetti)
    }
})
sprites.onOverlap(SpriteKind.Player, SpriteKind.Flier, function (sprite, otherSprite) {
    info.changeLifeBy(-1)
    sprite.say("Ow!", invincibilityPeriod * 1.5)
    pause(invincibilityPeriod * 1.5)
})
function createEnemies () {
    // enemy that moves back and forth
    for (let value5 of tiles.getTilesByType(assets.tile`tile4`)) {
        bumper = sprites.create(img`
            ............111111111...
            ...........11ff2ffff111.
            ..........11ff2feeeeff11
            ..........1ff22feeeeeff1
            .........11feeeeffeeeef1
            .........1fe2222eefffff1
            .........1f2effff222eff1
            .........1fffeeefffffff1
            .........1fee44fbe44efe1
            .........111eddfb4d4eef1
            ..........c1111111111111
            ....ccccccceddee2222f...
            .....dddddcedd44e444f...
            ......ccccc.eeeefffff...
            ..........c...ffffffff..
            ...............ff..fff..
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            ........................
            `, SpriteKind.Bumper)
        tiles.placeOnTile(bumper, value5)
        tiles.setTileAt(value5, assets.tile`tile0`)
        bumper.ay = gravity
        if (Math.percentChance(50)) {
            bumper.vx = Math.randomRange(30, 60)
        } else {
            bumper.vx = Math.randomRange(-60, -30)
        }
    }
    // enemy that flies at player
    for (let value6 of tiles.getTilesByType(assets.tile`tile7`)) {
        flier = sprites.create(img`
            . . . . . . . . 1 1 1 1 1 . . . 
            . . . . . 1 1 1 1 b 5 b 1 . . . 
            . . . . 1 1 b b b b b b 1 1 . . 
            . . . 1 1 b b 5 5 5 5 5 b 1 1 . 
            . . . 1 b b 5 d 1 f 5 5 d f 1 . 
            . . . 1 b 5 5 1 f f 5 d 4 c 1 . 
            1 1 1 1 b 5 5 d f b d d 4 4 1 1 
            1 b b b d 5 5 5 5 5 4 4 4 4 4 1 
            1 d d d b b d 5 5 4 4 4 4 4 1 1 
            1 1 1 1 1 1 1 1 1 1 1 1 1 1 1 . 
            c d c 5 5 5 5 d 5 5 5 5 5 5 b . 
            c b d c d 5 5 b 5 5 5 5 5 5 b . 
            . c d d c c b d 5 5 5 5 5 d b . 
            . . c b d d d d d 5 5 5 b b . . 
            . . . c c c c c c c c b b . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Flier)
        tiles.placeOnTile(flier, value6)
        tiles.setTileAt(value6, assets.tile`tile0`)
        animation.attachAnimation(flier, flierFlying)
        animation.attachAnimation(flier, flierIdle)
    }
}
controller.down.onEvent(ControllerButtonEvent.Pressed, function () {
    if (!(hero.isHittingTile(CollisionDirection.Bottom))) {
        hero.vy += 80
    }
})
function showInstruction (text: string) {
    game.showLongText(text, DialogLayout.Bottom)
    info.changeScoreBy(1)
}
function initializeHeroAnimations () {
    animateRun()
    animateIdle()
    animateCrouch()
    animateJumps()
}
function createPlayer (player2: Sprite) {
    player2.ay = gravity
    scene.cameraFollowSprite(player2)
    controller.moveSprite(player2, 100, 0)
    player2.z = 5
    info.setLife(3)
    info.setScore(0)
}
function initializeLevel (level: number) {
    effects.clouds.startScreenEffect()
    playerStartLocation = tiles.getTilesByType(assets.tile`tile6`)[0]
    tiles.placeOnTile(hero, playerStartLocation)
    tiles.setTileAt(playerStartLocation, assets.tile`tile0`)
    createEnemies()
    spawnGoals()
}
function hasNextLevel () {
    return currentLevel != levelCount
}
function spawnGoals () {
    for (let value7 of tiles.getTilesByType(assets.tile`tile5`)) {
        coin = sprites.create(img`
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . f f 5 5 5 5 f f . . . . 
            . . . . f 5 5 5 5 5 5 f . . . . 
            . . . f 5 5 5 4 4 5 5 5 f . . . 
            . . . f 5 5 5 4 4 5 5 5 f . . . 
            . . . f 5 5 5 4 4 5 5 5 f . . . 
            . . . f 5 5 5 4 4 5 5 5 f . . . 
            . . . . f 5 5 5 5 5 5 f . . . . 
            . . . . f f 5 5 5 5 f f . . . . 
            . . . . . . f f f f . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            . . . . . . . . . . . . . . . . 
            `, SpriteKind.Coin)
        tiles.placeOnTile(coin, value7)
        animation.attachAnimation(coin, coinAnimation)
        animation.setAction(coin, ActionKind.Idle)
        tiles.setTileAt(value7, assets.tile`tile0`)
    }
}
let heroFacingLeft = false
let coin: Sprite = null
let playerStartLocation: tiles.Location = null
let flier: Sprite = null
let bumper: Sprite = null
let mainCrouchRight: animation.Animation = null
let mainCrouchLeft: animation.Animation = null
let mainJumpRight: animation.Animation = null
let mainJumpLeft: animation.Animation = null
let mainRunRight: animation.Animation = null
let mainRunLeft: animation.Animation = null
let flierIdle: animation.Animation = null
let flierFlying: animation.Animation = null
let mainIdleRight: animation.Animation = null
let mainIdleLeft: animation.Animation = null
let doubleJumpSpeed = 0
let canDoubleJump = false
let coinAnimation: animation.Animation = null
let currentLevel = 0
let levelCount = 0
let gravity = 0
let pixelsToMeters = 0
let invincibilityPeriod = 0
let hero: Sprite = null
hero = sprites.create(img`
    . . . 1 1 1 1 1 1 . . . . . . . 
    . 1 1 1 8 8 8 8 1 1 1 . . . . . 
    1 1 8 8 a a a a 8 8 1 1 . . . . 
    1 8 a a a a a a a a 8 1 1 . . . 
    8 a a a a a 1 f a a a 8 1 1 . . 
    8 a a a a a f f a a a a 8 1 1 . 
    8 a a a a a a a a a a a 8 1 1 . 
    8 8 9 9 1 9 a a a a a a 7 8 1 . 
    8 a 2 2 2 a a a a a 7 7 7 8 1 . 
    1 9 a a a a a a a a 7 7 7 1 . . 
    1 1 1 1 1 1 1 1 1 1 1 1 1 1 8 . 
    . 8 9 9 8 a a 9 9 7 7 7 7 8 7 8 
    . 8 8 8 8 8 8 7 7 7 7 7 7 7 7 8 
    . . . 8 8 8 8 7 a a 9 7 7 7 8 . 
    . . 8 8 8 8 8 9 a a 9 8 8 8 . . 
    . . 8 9 9 9 8 7 a a 9 8 . . . . 
    `, SpriteKind.Player)
// how long to pause between each contact with a
// single enemy
invincibilityPeriod = 600
pixelsToMeters = 30
gravity = 9.81 * pixelsToMeters
scene.setBackgroundImage(img`
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff99d99bbbbbcfffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff99ddbdd66168bcccccc9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff999ddbbbd66888111ccccccb99fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9966ddbbbb6688811818ccccccbbc99fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffdd69dddbbb66618881888818818cccccbe9fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffddd96dd6b6dbd68888888888888888cccccc99fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffffffdbbd9666666dbb668886888888cccccccccccccc9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffdbbb99666966d68866888888cccccccccccccccccc69ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffdbbb999669666666888888888ccccbbbcc8bcccccccccc9fffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffdbbb999666666666888888888cbbcbe8bbbcbcccccbbcccb9ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffff9bbb999666666666688888888bccb888888bbbbb88888bcccccfffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffdbbb999669666666866888868bbbbb8888888ccc888b88bbc8cccffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffdbbb9d99ddd666668868888688bbcb888888888bc888bcc8bc886c9fffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffbbbbbbddd966666888688888888888888b88888888888cc8ccc886c9ffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffdbbbbbbdd6966666666868888888888bbdbbebb8888888888bcc8c86c9fffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffff9bbdbddd6666666666888688868888ddddddddde8888888888bccbbccccfffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffff9dbb9dd666666666668868888888bddddddbdbbddcccccd88b8ebccbbbbc9ffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffdd99999666666666668868888888bdddddbbbbbdbbbccccccb8bbbccc8bbb9fffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffff9dd99996696966666666668888bbbdddddbbbddbbbbbbbbbcccc8bcccbb8bbcfffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffff9d999996666966666668688888bbdddbbbbdbbbbbbbbbbbcccccc8bbccc88bc9ffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffff99999999666996696668868868bbdddddbbbdbbbbbbbbbbbbcbccc88bcccc88c6ffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffff999996696669666966d8868666bddbbbddbbdbbbbbbbbbbbbcccccc88bbccc8869fffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffff9999996699669666666d6688668bddbbdbbbbbbbbbbbbbbbbbccccccc88bcccc866fffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffff9dd999669966666666666688668bdddbbbbbbbbbbbbbbbbbbbccccccc888bbccc669ffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffff999999669d69666666666688868bddbbbdbbbbbbbbbbbbbbbbcccccccc888bbcc869ffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff99999996ddd69666666688888868ddbddbbbbbbbbbbbbbbbbbbccccccccc888888866ffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff999999969ddd6669666688688888bbbbbbbbbbbbbbbbbbbbbbbbccbccccc8888888869fffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff99999966ddddd669666688888888bbbbbbbbbbbbbbbbbbbbbbbcbccccccccc88888869fffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff999bb99666dddd6666666668886888bbbbbbbbbbbbbbbbbbbbbbcccccccccccc8888889fffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff99bbbb966696666666666888886888bbbbbbbbbbbbbbbbbbbbbbcbccccccccccc888886fffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff99bbdbb666969666666668888868888bbbbbbbbbbbbbbbbbbbbccbccccccccccc8888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff99dbbbbb6696966666666668886868888bbbbeb888bbbbbbbbbcccccccccccccc8888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff99bbbbbbe6969666666666888888888888888888888bbbbbbbbccccccccccccc88888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbccbc66966666666688888688888888888d888ebbbbbbbcccccccccccbb88888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbbbbcc69996666688668886888888dd88dbbd88bbbbbbbccccccccccceb88888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbbbbccc999966668868888888888ddddbbbbd88cbbbbbbbbccccccccc8888888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9ebbbbcccccccc9966666688888888888888ddbbbb888bbbbbbbbccccccccc8888888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbccccccccc666666888866888888888dddddbdd88bbbbbbccccccccc88888888bb9ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffbbbbbbcccccccccc6666688888888888888888d8888888bbbbbbccccccccc88888888bb9ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9dbbbbccbbccccccb666688868888888888888888888888bbbbbccccccccc888888888b9ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9dbbbbbbbbcccccbb66666688888888888888888888888bbbbccccccccccc88888888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbbbcccccccb666666688888888888888888888888bbbbcccccccccc888888888869ffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff9bbbbbbbccccccbb666666688888888888888888888888bbbbcccccccccc88888888886fffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffff99bbbbbbbbccccb6666668888888888888888888888888bbbbcbcccccccc88888888886fffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff99dbbbcbbccccb6666668888888888888888888888888bbbbbccccccccc888cc888869fffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff99dbbbcccccccc6666668688688888888888888888888bbbbccccccccc8888cc888869fffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff999bbbbbccccbc6666666688688888888888888888888bbbbcccccccc88888dd88886ffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffff969bbbbbbcccc69666666668688868888888888888888bbbbccccccc88888bd888886ffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffff99bbbbcccccc696bb668888888868888888888888888bbbcccccccc8888bbd888869ffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffff9999bbbcccc9666dbbb8888888888888888888888888ccbcccccccc8888bc888886fffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffff699bbbbccc966966bbb8888888888888888888888888bbbbccccc88888bcc88869fffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffff9999bbcccc666666dbbdd88888888688888888888888bbcccccc88888888888669fffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffff9699dbcccc66666666bb6d8888888688888888888888bbcccccc8888888888869ffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffff9696bbbcc66666666dbbd6886868888888888888888bbcbccc8888888888d669ffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffff999ebbccc666666666dbb8868888688888888888888bbbccc8888888889b69fffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffff969ccbcc66996666666bbb868888888888888888888bbbc888888888888b6ffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffff96ccccc966966666666bb8688666888888888888888b8888888888888699ffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffff99ccbc996666666666dbb6888668888888888888888888888888888869fffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffff969ccb9666666666666dbb88866888888888888888888888888888869ffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffff969ccc6696666666666dd8888668888888888888888888888888866fffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffff969cc9669666966d66dd8888868888888888888888888bb8888669fffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffff96ccc66699669dddd888868888888888888888888888be888669ffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffff96c66669966666dd88886666668888888888888888dd888669fffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffff96966669966ddd686886868888888888888888888d888669ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffff969666696666666688686888888888888888888888669ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffff9966966966666666886888888888888886888888669fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9699996666666888888888888888888118888699ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff969996666668888881188888888881888669ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff996999666688881818888888881886669ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9961161186618811188886116699ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff99161111611118111666699fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff9999661166669999ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff999999999fffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    ffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffffff
    `)
initializeAnimations()
createPlayer(hero)
levelCount = 8
currentLevel = 0
setLevelTileMap(currentLevel)
giveIntroduction()
// set up hero animations
game.onUpdate(function () {
    if (hero.vx < 0) {
        heroFacingLeft = true
    } else if (hero.vx > 0) {
        heroFacingLeft = false
    }
    if (hero.isHittingTile(CollisionDirection.Top)) {
        hero.vy = 0
    }
    if (controller.down.isPressed()) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.CrouchLeft)
        } else {
            animation.setAction(hero, ActionKind.CrouchRight)
        }
    } else if (hero.vy < 20 && !(hero.isHittingTile(CollisionDirection.Bottom))) {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.JumpingLeft)
        } else {
            animation.setAction(hero, ActionKind.JumpingRight)
        }
    } else if (hero.vx < 0) {
        animation.setAction(hero, ActionKind.RunningLeft)
    } else if (hero.vx > 0) {
        animation.setAction(hero, ActionKind.RunningRight)
    } else {
        if (heroFacingLeft) {
            animation.setAction(hero, ActionKind.IdleLeft)
        } else {
            animation.setAction(hero, ActionKind.IdleRight)
        }
    }
})
// Flier movement
game.onUpdate(function () {
    for (let value8 of sprites.allOfKind(SpriteKind.Flier)) {
        if (Math.abs(value8.x - hero.x) < 60) {
            if (value8.x - hero.x < -5) {
                value8.vx = 25
            } else if (value8.x - hero.x > 5) {
                value8.vx = -25
            }
            if (value8.y - hero.y < -5) {
                value8.vy = 25
            } else if (value8.y - hero.y > 5) {
                value8.vy = -25
            }
            animation.setAction(value8, ActionKind.Flying)
        } else {
            value8.vy = -20
            value8.vx = 0
            animation.setAction(value8, ActionKind.Idle)
        }
    }
})
// Reset double jump when standing on wall
game.onUpdate(function () {
    if (hero.isHittingTile(CollisionDirection.Bottom)) {
        canDoubleJump = true
    }
})
// bumper movement
game.onUpdate(function () {
    for (let value9 of sprites.allOfKind(SpriteKind.Bumper)) {
        if (value9.isHittingTile(CollisionDirection.Left)) {
            value9.vx = Math.randomRange(30, 60)
        } else if (value9.isHittingTile(CollisionDirection.Right)) {
            value9.vx = Math.randomRange(-60, -30)
        }
    }
})
