var Message_Event = (function (options) {

    var message = options.text
    var period = options.period * 1000
    var call = options.call
    var finished = options.finished

    if (!message
        || !call
        || !finished)
        return console.error("Message function must contain the properties: text, period, call, and finished.")

    if (!period)
        period = 0

    var chars = message.split('')
    var offset = period
    var result = ""

    function build() {
        for (const i of chars) {
            setTimeout(() => {
                result += i
                call(i, result)
            }, offset)

            offset += period;
        }

        setTimeout(() => {
            finished(result, offset / 1000)
        }, offset);
    }

    return {
        result,
        build
    }
})

var Generic_Event = (function (options) {
    var text = options.text
    var period = options.period * 1000
    var finished = options.finished

    if (!text
        || !finished)
        return console.error("Wait function must contain the properties: text, period, and finished");

    if (!period)
        period = 0

    function exec() {
        setTimeout(() => {
            finished(period / 1000)
        }, period)
    }

    return { exec }
})

var dialogue = (function () {
    var buffer = []

    // data storage object
    var data = {
        string: "",
        DONE: 0
    }

    data.wait = function (p) {
        buffer.push(Generic_Event({
            text: 'wait',
            period: p,
            finished(elapsed) {
                buffer.shift()
                data.run()
            }
        }))

        return data
    }
    data.sleep = data.wait

    data.append = function (m, p = 0.0) {
        buffer.push(Message_Event({
            text: m,
            period: p,
            call(char, result) {
                data.string += char
            },
            finished(result, elapsed) {
                buffer.shift()
                data.run()
            }
        }))

        return data
    }
    data.text = data.append
    data.scroll = data.append

    data.clear = function (p = 0.0) {
        buffer.push(Generic_Event({
            text: 'clear',
            period: p,
            finished(elapsed) {
                data.string = ""
                buffer.shift()
                data.run()
            }
        }))

        return data
    }

    data.run = function () {
        var ele = buffer[0]

        if (buffer.length == 0)
            data.DONE = 1

        if (!ele) return


        // is message event
        if (ele.hasOwnProperty('build')) {
            ele.build()
        }

        // generic event
        if (ele.hasOwnProperty('exec')) {
            ele.exec()
        }
    }

    data.start = function () {
        data.DONE = 0
        data.run();
    }

    return data
})()