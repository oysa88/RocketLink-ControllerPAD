function Rearm () {
    strip.clear()
    strip.show()
    while (pins.digitalReadPin(DigitalPin.P1) == 0) {
        pins.digitalWritePin(DigitalPin.P8, 0)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # . # .
            . # # # .
            . . . . .
            `)
        pins.digitalWritePin(DigitalPin.P8, 1)
        basic.showLeds(`
            . . . . .
            . # # # .
            . # # # .
            . # # # .
            . . . . .
            `)
    }
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        . . . . .
        `)
    basic.pause(200)
    Initialize()
}
radio.onReceivedNumberDeprecated(function (receivedNumber) {
    if (receivedNumber == 11) {
        LinkCheck = true
        lastSeenAlive = input.runningTime()
    }
    if (receivedNumber == 21) {
        IgniterStatusLP = 1
    } else if (receivedNumber == 22) {
        IgniterStatusLP = 0
    }
    if (receivedNumber == 31) {
        ArmStatusLP = 1
    } else if (receivedNumber == 32) {
        ArmStatusLP = 0
    }
})
function StatusCheck () {
    SelfCheckStatus = 1
    ArmStatus = pins.digitalReadPin(DigitalPin.P1)
    if (LinkCheck) {
        LinkStatus = 1
    } else {
        LinkStatus = 0
    }
    if ((SelfCheckStatus && LinkStatus && IgniterStatusLP && ArmStatusLP) == 1 && ArmStatus == 0) {
        Ready = 1
        basic.showLeds(`
            # . . . #
            . # . # .
            . . # . .
            . # . # .
            # . . . #
            `)
    } else {
        Ready = 0
        basic.showLeds(`
            # . . . #
            # # . # #
            # . # . #
            # . . . #
            # . . . #
            `)
    }
    NeoPixels()
}
function NeoPixels () {
    if (SelfCheckStatus == 1) {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(0, neopixel.colors(NeoPixelColors.Red))
    }
    if (LinkStatus == 1) {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(1, neopixel.colors(NeoPixelColors.Red))
    }
    if (IgniterStatusLP == 1) {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(2, neopixel.colors(NeoPixelColors.Red))
    }
    if (ArmStatusLP == 1) {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(3, neopixel.colors(NeoPixelColors.Red))
    }
    if (Ready == 1) {
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Green))
    } else {
        strip.setPixelColor(4, neopixel.colors(NeoPixelColors.Red))
    }
    strip.show()
}
function Launch () {
    if (Ready == 1) {
        BuzzerBlink()
        basic.showLeds(`
            . . # . .
            . # # # .
            # . # . #
            . . # . .
            . . # . .
            `)
        radio.sendNumber(42)
        Ready = 0
        Rearm()
    }
}
function Initialize () {
    SelfCheckStatus = 0
    LinkStatus = 0
    ArmStatus = 0
    Ready = 0
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.showLeds(`
        . . . . .
        . . . . .
        . . # . .
        . . . . .
        . . . . .
        `)
    basic.showLeds(`
        . . . . .
        . # # # .
        . # . # .
        . # # # .
        . . . . .
        `)
    basic.showLeds(`
        # # # # #
        # . . . #
        # . . . #
        # . . . #
        # # # # #
        `)
    basic.showLeds(`
        # . . . #
        # # . # #
        # . # . #
        # . . . #
        # . . . #
        `)
    strip.showColor(neopixel.colors(NeoPixelColors.Purple))
    basic.pause(200)
}
function BuzzerBlink () {
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 1)
    pins.digitalWritePin(DigitalPin.P14, 1)
    basic.pause(100)
    pins.digitalWritePin(DigitalPin.P13, 0)
    pins.digitalWritePin(DigitalPin.P14, 0)
}
let Ready = 0
let LinkStatus = 0
let ArmStatus = 0
let SelfCheckStatus = 0
let ArmStatusLP = 0
let IgniterStatusLP = 0
let lastSeenAlive = 0
let LinkCheck = false
let strip: neopixel.Strip = null
strip = neopixel.create(DigitalPin.P0, 5, NeoPixelMode.RGB)
radio.setGroup(111)
radio.setTransmitPower(7)
pins.digitalWritePin(DigitalPin.P15, 1)
let UpdateFrequency = 200
Initialize()
basic.forever(function () {
    StatusCheck()
    if (pins.digitalReadPin(DigitalPin.P5) == 0) {
        strip.showColor(neopixel.colors(NeoPixelColors.Red))
        basic.pause(100)
        StatusCheck()
    }
    if (pins.digitalReadPin(DigitalPin.P11) == 0) {
        Launch()
    }
    if (Ready == 1) {
        pins.digitalWritePin(DigitalPin.P13, 1)
        pins.digitalWritePin(DigitalPin.P14, 1)
    } else {
        pins.digitalWritePin(DigitalPin.P13, 0)
        pins.digitalWritePin(DigitalPin.P13, 0)
    }
})
control.inBackground(function () {
    while (true) {
        radio.sendNumber(10)
        if (input.runningTime() - lastSeenAlive > 3 * UpdateFrequency) {
            LinkCheck = false
        }
        basic.pause(UpdateFrequency)
    }
})
