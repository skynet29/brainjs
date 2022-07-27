//@ts-check
(function () {

    'use strict'

    const webAudioPeakMeter = require('web-audio-peak-meter');


    $$.control.registerControl('brainjs.audiopeakmeter', {

        props: {
            sourceNode: null,
            audioCtx: null
        },

        init: function (elt) {

            console.log('props', this.props)
            let { sourceNode, audioCtx } = this.props

            update()


            function update() {
                if (sourceNode && audioCtx) {
                    const meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx)
                    webAudioPeakMeter.createMeter(elt.get(0), meterNode, {});
                }
            }

            this.setData = function (data) {
                console.log('setData', data)
                if (data.sourceNode) {
                    sourceNode = data.sourceNode
                }
                if (data.audioCtx) {
                    audioCtx = data.audioCtx
                }
                update()
            }
        }

    })

})();
