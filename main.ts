//% color=#1E90FF icon="\uf108" block="LCD 16x02 2C"
namespace lcd16x02 {
    let i2cAddr = 0x27 // Endereço padrão da maioria dos módulos I2C
    let BK = 0x08
    let RS = 0x00

    function setReg(dat: number): void {
        pins.i2cWriteNumber(i2cAddr, dat, NumberFormat.UInt8BE)
    }

    function send(dat: number): void {
        let d = dat | BK
        setReg(d | 0x04)
        setReg(d & 0xFB)
    }

    function write(dat: number, mode: number): void {
        RS = mode
        send((dat & 0xF0) | RS)
        send(((dat << 4) & 0xF0) | RS)
    }

    //% block="inicializar LCD no endereço %addr"
    export function init(addr: number): void {
        i2cAddr = addr
        basic.pause(50)
        write(0x33, 0)
        write(0x32, 0)
        write(0x28, 0)
        write(0x0C, 0)
        write(0x06, 0)
        clear()
    }

    //% block="limpar LCD"
    export function clear(): void {
        write(0x01, 0)
        basic.pause(2)
    }

    //% block="exibir texto %s na linha %l coluna %c"
    export function showString(s: string, l: number, c: number): void {
        let addr = (l == 1 ? 0 : 0x40) + c
        write(0x80 | addr, 0)
        for (let i = 0; i < s.length; i++) {
            write(s.charCodeAt(i), 1)
        }
    }

    //% block="desligar luz de fundo"
    export function backlightOff(): void {
        BK = 0x00
        write(0, 0)
    }

    //% block="ligar luz de fundo"
    export function backlightOn(): void {
        BK = 0x08
        write(0, 0)
    }
}