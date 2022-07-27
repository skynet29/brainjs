(function(){function r(e,n,t){function o(i,f){if(!n[i]){if(!e[i]){var c="function"==typeof require&&require;if(!f&&c)return c(i,!0);if(u)return u(i,!0);var a=new Error("Cannot find module '"+i+"'");throw a.code="MODULE_NOT_FOUND",a}var p=n[i]={exports:{}};e[i][0].call(p.exports,function(r){var n=e[i][1][r];return o(n||r)},p,p.exports,r,e,n,t)}return n[i].exports}for(var u="function"==typeof require&&require,i=0;i<t.length;i++)o(t[i]);return o}return r})()({1:[function(require,module,exports){
const markup = require('./markup');
const peakSample = require('./peak-sample');
const truePeak = require('./true-peak');
const utils = require('./utils');

const defaultConfig = {
  borderSize: 2,
  fontSize: 9,
  backgroundColor: 'black',
  tickColor: '#ddd',
  labelColor: '#ddd',
  gradient: ['red 1%', '#ff0 16%', 'lime 45%', '#080 100%'],
  dbRange: 48,
  dbTickSize: 6,
  maskTransition: '0.1s',
  audioMeterStandard: 'peak-sample', // Could be "true-peak" (ITU-R BS.1770) or "peak-sample"
  refreshEveryApproxMs: 20,
  peakHoldDuration: null,
};

function createMeterNode(sourceNode, audioCtx, options = {}) {
  // eslint-disable-next-line prefer-object-spread
  const config = Object.assign({}, defaultConfig, options);
  const { refreshEveryApproxMs } = config;
  const { channelCount, sampleRate } = sourceNode;

  // Calculate refresh interval
  const resfreshIntervalSamples = (refreshEveryApproxMs / 1000) * sampleRate * channelCount;
  const bufferSize = utils.findAudioProcBufferSize(resfreshIntervalSamples);
  const meterNode = audioCtx.createScriptProcessor(bufferSize, channelCount, channelCount);
  sourceNode.connect(meterNode).connect(audioCtx.destination);
  return meterNode;
}

function updateMeter(audioProcessingEvent, config, meterData) {
  const { inputBuffer } = audioProcessingEvent;
  const { audioMeterStandard, peakHoldDuration } = config;
  let channelMaxes = [];

  // Calculate peak levels
  if (audioMeterStandard === 'true-peak') {
    // This follows ITU-R BS.1770 (True Peak meter)
    channelMaxes = truePeak.calculateTPValues(inputBuffer, meterData);
  } else {
    // Just get the peak level
    channelMaxes = peakSample.calculateMaxValues(inputBuffer);
  }
  // Update peak & text values
  for (let i = 0; i < channelMaxes.length; i += 1) {
    meterData.tempPeaks[i] = channelMaxes[i];
    if (channelMaxes[i] > meterData.heldPeaks[i]) {
      meterData.heldPeaks[i] = channelMaxes[i];
      if (peakHoldDuration) {
        if (meterData.peakHoldTimeouts[i]) {
          clearTimeout(meterData.peakHoldTimeouts[i]);
        }
        meterData.peakHoldTimeouts[i] = setTimeout(() => {
          meterData.heldPeaks[i] = meterData.tempPeaks[i];
        }, peakHoldDuration);
      }
    }
  }
}

function createMeter(domElement, meterNode, options = {}) {
  // eslint-disable-next-line prefer-object-spread
  const config = Object.assign({}, defaultConfig, options);

  const meterElement = markup.createContainerDiv(domElement, config);
  const meterData = markup.createTicks(meterElement, config);

  const { channelCount } = meterNode;

  meterData.tempPeaks = new Array(channelCount).fill(0.0);
  meterData.heldPeaks = new Array(channelCount).fill(0.0);
  meterData.peakHoldTimeouts = new Array(channelCount).fill(null);
  meterData.channelCount = channelCount;

  meterData.channelBars = markup.createBars(meterElement, config, meterData);
  meterData.channelMasks = markup.createMasks(meterElement, config, meterData);
  meterData.textLabels = markup.createPeakLabels(meterElement, config, meterData);

  if (config.audioMeterStandard === 'true-peak') {
    meterData.lpfCoefficients = [];
    meterData.lpfBuffer = [];
    meterData.upsampleFactor = 4;
    meterData.lastChannelTP = [];
    meterData.decayFactor = 0.99999;
  }

  meterNode.onaudioprocess = (evt) => updateMeter(evt, config, meterData);
  meterElement.addEventListener('click', () => {
    meterData.heldPeaks.fill(0.0);
  }, false);
  markup.paintMeter(config, meterData);
}

module.exports = {
  createMeterNode,
  createMeter,
};

},{"./markup":2,"./peak-sample":3,"./true-peak":4,"./utils":5}],2:[function(require,module,exports){
const utils = require('./utils');

function audioClipPath(db, dbRange, vertical) {
  let clipPercent = Math.floor((db * -100) / dbRange);
  if (clipPercent > 100) {
    clipPercent = 100;
  }
  if (clipPercent < 0) {
    clipPercent = 0;
  }
  if (vertical) {
    return `inset(${clipPercent}% 0 0)`;
  }
  return `inset(0 ${clipPercent}% 0 0)`;
}

function createContainerDiv(parent, config) {
  const { clientWidth, clientHeight } = parent;
  const { backgroundColor } = config;
  const meterElement = document.createElement('div');
  meterElement.style.position = 'relative';
  meterElement.style.width = `${clientWidth}px`;
  meterElement.style.height = `${clientHeight}px`;
  meterElement.style.backgroundColor = backgroundColor;
  parent.appendChild(meterElement);
  return meterElement;
}

function createTicks(parent, config) {
  const { clientWidth, clientHeight } = parent;
  const {
    dbRange, dbTickSize, fontSize, borderSize, tickColor,
  } = config;
  const numTicks = Math.floor(dbRange / dbTickSize);
  const tickDivs = Array.from(Array(numTicks).keys()).map((i) => {
    const tickDiv = document.createElement('div');
    parent.appendChild(tickDiv);
    tickDiv.style.position = 'absolute';
    tickDiv.style.color = tickColor;
    tickDiv.style.textAlign = 'right';
    tickDiv.style.fontSize = `${fontSize}px`;
    tickDiv.textContent = `-${dbTickSize * i}`;
    return tickDiv;
  });
  const vertical = clientHeight > clientWidth;
  if (vertical) {
    const tickWidth = fontSize * 2.0;
    const meterTop = fontSize * 1.5 + borderSize;
    const dbTickTop = fontSize + borderSize;
    const meterHeight = clientHeight - meterTop - borderSize;
    const meterWidth = clientWidth - tickWidth - borderSize;
    const tickSpacing = meterHeight / numTicks;
    tickDivs.forEach((tickDiv, i) => {
      tickDiv.style.width = `${tickWidth}px`;
      tickDiv.style.top = `${(tickSpacing * i) + dbTickTop}px`;
    });
    return {
      vertical, tickWidth, meterHeight, meterWidth, meterTop,
    };
  }
  const tickWidth = fontSize * 1.5;
  const meterHeight = (clientHeight - tickWidth) - (borderSize * 2);
  const meterTop = fontSize * 3;
  const meterWidth = (clientWidth - meterTop) - (borderSize * 2);
  const tickSpacing = meterWidth / numTicks;
  tickDivs.forEach((tickDiv, i) => {
    tickDiv.style.width = `${meterTop}px`;
    tickDiv.style.bottom = `${borderSize}px`;
    tickDiv.style.right = `${(tickSpacing * i) + meterTop}px`;
  });
  return {
    vertical, tickWidth, meterHeight, meterWidth, meterTop,
  };
}

function createBars(parent, config, meterData) {
  const { gradient, borderSize } = config;
  const {
    channelCount, vertical, meterWidth, meterHeight, meterTop, tickWidth,
  } = meterData;
  // const initialClipPath = audioClipPath(dbRange, dbRange, vertical);
  const barDivs = Array.from(Array(channelCount).keys()).map(() => {
    const barDiv = document.createElement('div');
    parent.appendChild(barDiv);
    barDiv.style.position = 'absolute';
    // barDiv.style.clipPath = initialClipPath;
    // barDiv.style.WebkitClipPath = initialClipPath;
    return barDiv;
  });
  if (vertical) {
    const barWidth = (meterWidth / channelCount) - borderSize;
    const gradientStyle = `linear-gradient(to bottom, ${gradient.join(', ')})`;
    barDivs.forEach((barDiv, i) => {
      barDiv.style.height = `${meterHeight}px`;
      barDiv.style.width = `${barWidth}px`;
      barDiv.style.backgroundImage = gradientStyle;
      barDiv.style.top = `${meterTop}px`;
      barDiv.style.left = `${((barWidth + borderSize) * i) + tickWidth + borderSize}px`;
    });
  } else {
    const barWidth = (meterHeight / channelCount) - borderSize;
    const gradientStyle = `linear-gradient(to left, ${gradient.join(', ')})`;
    barDivs.forEach((barDiv, i) => {
      barDiv.style.height = `${barWidth}px`;
      barDiv.style.width = `${meterWidth}px`;
      barDiv.style.backgroundImage = gradientStyle;
      barDiv.style.top = `${((barWidth + borderSize) * i) + borderSize}px`;
      barDiv.style.right = `${meterTop}px`;
    });
  }
  return barDivs;
}

function createMasks(parent, config, meterData) {
  const { backgroundColor, borderSize, maskTransition } = config;
  const {
    channelCount, vertical, meterWidth, meterHeight, meterTop, tickWidth,
  } = meterData;
  const barDivs = Array.from(Array(channelCount).keys()).map(() => {
    const barDiv = document.createElement('div');
    parent.appendChild(barDiv);
    barDiv.style.position = 'absolute';
    barDiv.style.backgroundColor = backgroundColor;
    return barDiv;
  });
  if (vertical) {
    const barWidth = (meterWidth / channelCount) - borderSize;
    barDivs.forEach((barDiv, i) => {
      barDiv.style.height = `${meterHeight}px`;
      barDiv.style.width = `${barWidth}px`;
      barDiv.style.top = `${meterTop}px`;
      barDiv.style.left = `${((barWidth + borderSize) * i) + tickWidth + borderSize}px`;
      barDiv.style.transition = `height ${maskTransition}`;
    });
  } else {
    const barWidth = (meterHeight / channelCount) - borderSize;
    barDivs.forEach((barDiv, i) => {
      barDiv.style.height = `${barWidth}px`;
      barDiv.style.width = `${meterWidth}px`;
      barDiv.style.top = `${((barWidth + borderSize) * i) + borderSize}px`;
      barDiv.style.right = `${meterTop}px`;
      barDiv.style.transition = `width ${maskTransition}`;
    });
  }
  return barDivs;
}

function createPeakLabels(parent, config, meterData) {
  const { borderSize, labelColor, fontSize } = config;
  const {
    channelCount, vertical, meterWidth, meterHeight, tickWidth,
  } = meterData;
  const labelDivs = Array.from(Array(channelCount).keys()).map(() => {
    const label = document.createElement('div');
    parent.appendChild(label);
    label.style.textAlign = 'center';
    label.style.color = labelColor;
    label.style.fontSize = `${fontSize}px`;
    label.style.position = 'absolute';
    label.textContent = '-∞';
    return label;
  });
  if (vertical) {
    const barWidth = meterWidth / channelCount;
    labelDivs.forEach((label, i) => {
      label.style.width = `${barWidth}px`;
      label.style.top = `${borderSize}px`;
      label.style.left = `${(barWidth * i) + tickWidth}px`;
    });
  } else {
    const barHeight = meterHeight / channelCount;
    labelDivs.forEach((label, i) => {
      label.style.width = `${fontSize * 2}px`;
      label.style.right = `${borderSize}px`;
      label.style.top = `${(barHeight * i) + tickWidth}px`;
    });
  }
  return labelDivs;
}

function maskSize(floatVal, dbRange, meterDimension) {
  const d = dbRange * -1;
  const numPx = Math.floor((utils.dbFromFloat(floatVal) * meterDimension) / d);
  if (numPx > meterDimension) {
    return meterDimension;
  }
  if (numPx < 0) {
    return 0;
  }
  return numPx;
}

function paintMeter(config, meterData) {
  const { dbRange } = config;
  const {
    tempPeaks, heldPeaks, channelMasks, textLabels, meterHeight, meterWidth, vertical,
  } = meterData;
  // hopefully some day transition will work for clip path.
  // until then we use a mask div.
  // channelBars.forEach((barDiv, i) => {
  //   const tempPeak = utils.dbFromFloat(tempPeaks[i]);
  //   const clipPath = audioClipPath(tempPeak, dbRange, vertical);
  //   barDiv.style.clipPath = clipPath;
  //   barDiv.style.WebkitClipPath = clipPath;
  // });
  const meterDimension = vertical ? meterHeight : meterWidth;
  channelMasks.forEach((maskDiv, i) => {
    const channelSize = maskSize(tempPeaks[i], dbRange, meterDimension);
    if (vertical) {
      maskDiv.style.height = `${channelSize}px`;
    } else {
      maskDiv.style.width = `${channelSize}px`;
    }
  });
  textLabels.forEach((textLabel, i) => {
    if (heldPeaks[i] === 0.0) {
      textLabel.textContent = '-∞';
    } else {
      const heldPeak = utils.dbFromFloat(heldPeaks[i]);
      textLabel.textContent = heldPeak.toFixed(1);
    }
  });
  window.requestAnimationFrame(() => paintMeter(config, meterData));
}

module.exports = {
  audioClipPath,
  createContainerDiv,
  createTicks,
  createBars,
  createMasks,
  createPeakLabels,
  maskSize,
  paintMeter,
};

},{"./utils":5}],3:[function(require,module,exports){
function calculateMaxValues(inputBuffer) {
  const channelMaxes = [];
  const { numberOfChannels } = inputBuffer;

  for (let c = 0; c < numberOfChannels; c += 1) {
    channelMaxes[c] = 0.0;
    const channelData = inputBuffer.getChannelData(c);
    for (let s = 0; s < channelData.length; s += 1) {
      if (Math.abs(channelData[s]) > channelMaxes[c]) {
        channelMaxes[c] = Math.abs(channelData[s]);
      }
    }
  }
  return channelMaxes;
}

module.exports = {
  calculateMaxValues,
};

},{}],4:[function(require,module,exports){
const utils = require('./utils');

function findAudioProcBufferSize(numSamplesIn) {
  return [256, 512, 1024, 2048, 4096, 8192, 16384].reduce((a, b) => (
    Math.abs(b - numSamplesIn) < Math.abs(a - numSamplesIn) ? b : a));
}

function calculateLPFCoefficients(numCoefficients, upsampleFactor) {
  const retCoefs = [];
  const fcRel = 1.0 / (4.0 * upsampleFactor);
  const coefsLim = Math.floor((numCoefficients - 1) / 2);
  for (let n = -coefsLim; n <= coefsLim; n += 1) {
    const wn = 0.54 + 0.46 * Math.cos((2.0 * Math.PI * n) / numCoefficients);
    let hn = 0.0;
    if (n === 0) {
      hn = 2.0 * fcRel;
    } else {
      hn = Math.sin(2.0 * Math.PI * fcRel * n) / (Math.PI * n);
    }
    // Adapt windows & upsampler factor
    hn = (wn * hn) * upsampleFactor;
    retCoefs.push(hn);
  }
  return retCoefs;
}

function filterSample(sample, meterData) {
  const { lpfBuffer, lpfCoefficients, upsampleFactor } = meterData;
  const ret = [];
  lpfBuffer.push(sample);
  if (lpfBuffer.length >= lpfCoefficients.length) {
    lpfBuffer.shift();
  }
  for (let nA = 0; nA < upsampleFactor; nA += 1) {
    let nT = 0;
    let retVal = 0;
    for (let nc = nA; nc < lpfCoefficients.length; nc += upsampleFactor) {
      retVal += (lpfCoefficients[nc] * lpfBuffer[lpfBuffer.length - 1 - nT]);
      nT += 1;
    }
    ret.push(retVal);
  }
  return ret;
}

function audioOverSampleAndFilter(channelData, inputFs, meterData) {
  let res = [];
  // Initialize filter coefficients and buffer
  if (meterData.lpfCoefficients.length <= 0) {
    utils.log(`Initialing filter components for ITU-R BS.1770, fs: ${inputFs}`);
    if (inputFs >= 96000) {
      meterData.upsampleFactor = 2;
    }
    meterData.lpfCoefficients = calculateLPFCoefficients(33, meterData.upsampleFactor);
    meterData.lpfBuffer = new Array(meterData.lpfCoefficients.length).fill(0.0);
    utils.log(`Initialized lpfCoefficients lpfCoefficients=[${meterData.lpfCoefficients.join(',')}], and lpfBuffer: [${meterData.lpfBuffer.join(',')}]`);
  }
  for (let ni = 0; ni < channelData.length; ni += 1) {
    // 1 input sample -> generated upsampleFactor samples
    const samplesOut = filterSample(channelData[ni], meterData);
    res = res.concat(samplesOut);
  }
  return res;
}

function calculateTPValues(inputBuffer, meterData) {
  const { lastChannelTP, channelCount } = meterData;
  const { sampleRate } = inputBuffer;
  // Ini TP values
  if (lastChannelTP.length <= 0) {
    utils.log(`Initialing TP values for ${channelCount}channels`);
    meterData.lastChannelTP = new Array(channelCount).fill(0.0);
    // Decay time ms = 1700 and -20Db
    const attFactor = Math.pow(10.0, -20 / 10.0);
    const decayTimeS = 1700 / 1000;
    meterData.decayFactor = Math.pow(attFactor, 1.0 / (sampleRate * decayTimeS));
    utils.log(`Initialized with decayFactor ${meterData.decayFactor}`);
  }
  for (let c = 0; c < channelCount; c += 1) {
    const channelData = inputBuffer.getChannelData(c);
    // Process according to ITU-R BS.1770
    const overSampledAndLPF = audioOverSampleAndFilter(channelData, sampleRate, meterData);
    for (let s = 0; s < overSampledAndLPF.length; s += 1) {
      lastChannelTP[c] *= meterData.decayFactor;
      if (Math.abs(overSampledAndLPF[s]) > lastChannelTP[c]) {
        lastChannelTP[c] = Math.abs(overSampledAndLPF[s]);
      }
    }
  }
  return lastChannelTP;
}

module.exports = {
  findAudioProcBufferSize,
  calculateLPFCoefficients,
  filterSample,
  audioOverSampleAndFilter,
  calculateTPValues,
};

},{"./utils":5}],5:[function(require,module,exports){
const debugMode = false;

function log(...args) {
  if (debugMode) {
    console.log(...args);
  }
}

function getBaseLog(x, y) {
  return Math.log(y) / Math.log(x);
}

function dbFromFloat(floatVal) {
  return getBaseLog(10, floatVal) * 20;
}

function findAudioProcBufferSize(numSamplesIn) {
  return [256, 512, 1024, 2048, 4096, 8192, 16384].reduce((a, b) => (
    Math.abs(b - numSamplesIn) < Math.abs(a - numSamplesIn) ? b : a));
}

module.exports = {
  log,
  dbFromFloat,
  findAudioProcBufferSize,
};

},{}],6:[function(require,module,exports){
"use strict";

//@ts-check
(function () {
  'use strict';

  var webAudioPeakMeter = require('web-audio-peak-meter');

  $$.control.registerControl('brainjs.audiopeakmeter', {
    props: {
      sourceNode: null,
      audioCtx: null
    },
    init: function init(elt) {
      console.log('props', this.props);
      var _this$props = this.props,
          sourceNode = _this$props.sourceNode,
          audioCtx = _this$props.audioCtx;
      update();

      function update() {
        if (sourceNode && audioCtx) {
          var meterNode = webAudioPeakMeter.createMeterNode(sourceNode, audioCtx);
          webAudioPeakMeter.createMeter(elt.get(0), meterNode, {});
        }
      }

      this.setData = function (data) {
        console.log('setData', data);

        if (data.sourceNode) {
          sourceNode = data.sourceNode;
        }

        if (data.audioCtx) {
          audioCtx = data.audioCtx;
        }

        update();
      };
    }
  });
})();

},{"web-audio-peak-meter":1}]},{},[6]);
