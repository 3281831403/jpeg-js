var fs = require('fs'),
  path = require('path'),
  assert = require('assert'),
  jpeg = require('..');

function fixture(name) {
  return fs.readFileSync(path.join(__dirname, 'fixtures', name));
}

const SUPER_LARGE_JPEG_BASE64 = '/9j/wfFRBf//BdgC/9p/2P/E4d4=';

const SUPER_LARGE_RESOLUTION_JPEG_BASE64 = '/9j/wfFR2PDh3g==';

const SUPER_LARGE_JPEG_BUFFER = Buffer.from(SUPER_LARGE_JPEG_BASE64, 'base64');
const SUPER_LARGE_RESOLUTION_JPEG_BUFFER = Buffer.from(SUPER_LARGE_RESOLUTION_JPEG_BASE64, 'base64');

it('reads image with a bad e1 marker not preceeded by ff', function () {
    var jpegData = fixture('table-with-bad-e1.jpg');
    var rawImageData = jpeg.decode(jpegData);
    var expected = fixture('table-with-good-e1.jpg');
    var rawExpectedImageData = jpeg.decode(expected);
    expect(rawImageData.data).toEqual(rawExpectedImageData.data);
});

it('decodes a JPEG', function () {
  var jpegData = fixture('grumpycat.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(320);
  expect(rawImageData.height).toEqual(180);
  var expected = fixture('grumpycat.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a JPEG with fill bytes', function () {
  var jpegData = fixture('fillbytes.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(704);
  expect(rawImageData.height).toEqual(576);
});

it('decodes a JPEG with RST intervals', function () {
  var jpegData = fixture('redbox-with-rst.jpg');
  var rawImageData = jpeg.decode(jpegData);
  var expected = fixture('redbox.jpg');
  var rawExpectedImageData = jpeg.decode(expected);
  expect(rawImageData.data).toEqual(rawExpectedImageData.data);
});

it('decodes a JPEG with trailing bytes', function () {
  var jpegData = fixture('redbox-with-trailing-bytes.jpg');
  var rawImageData = jpeg.decode(jpegData);
  var expected = fixture('redbox.jpg');
  var rawExpectedImageData = jpeg.decode(expected);
  expect(rawImageData.data).toEqual(rawExpectedImageData.data);
});

it('decodes a grayscale JPEG', function () {
  var jpegData = fixture('apsara.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(580);
  expect(rawImageData.height).toEqual(599);
  expect(rawImageData.comments).toEqual(['File source: http://commons.wikimedia.org/wiki/File:Apsara-mit-Sitar.jpg']);
  var expected = fixture('apsara.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a 32-bit TrueColor RGB image', function () {
  var jpegData = fixture('truecolor.jpg');
  var rawImageData = jpeg.decode(jpegData, {colorTransform: false});
  expect(rawImageData.width).toEqual(1280);
  expect(rawImageData.height).toEqual(2000);
  var expected = fixture('truecolor.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a CMYK jpeg with correct colors', function () {
  var jpegData = fixture('tree-cmyk.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(400);
  expect(rawImageData.height).toEqual(250);
  var expected = fixture('tree-cmyk.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a CMYK jpeg with correct colors without transform', function () {
  var jpegData = fixture('tree-cmyk-notransform.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(400);
  expect(rawImageData.height).toEqual(250);
  var expected = fixture('tree-cmyk-notransform.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes an RGB jpeg with correct colors', function () {
  var jpegData = fixture('tree-rgb.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(400);
  expect(rawImageData.height).toEqual(250);
  var expected = fixture('tree-rgb.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes an progressive RGB jpeg with correct colors', function () {
  var jpegData = fixture('rgb.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(350);
  expect(rawImageData.height).toEqual(262);
  var expected = fixture('rgb.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a greyscale CMYK jpeg with correct colors', function () {
  var jpegData = fixture('cmyk-grey.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(300);
  expect(rawImageData.height).toEqual(389);
  var expected = fixture('cmyk-grey.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes an adobe CMYK jpeg with correct colors', function () {
  var jpegData = fixture('cmyktest.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(300);
  expect(rawImageData.height).toEqual(111);
  var expected = fixture('cmyktest.rgba');
  expect(rawImageData.data).toEqual(expected);

  var jpegData2 = fixture('plusshelf-drawing.jpg');
  var rawImageData2 = jpeg.decode(jpegData2);
  expect(rawImageData2.width).toEqual(350);
  expect(rawImageData2.height).toEqual(233);
  var expected2 = fixture('plusshelf-drawing.rgba');
  expect(rawImageData2.data).toEqual(expected2);
});

it('decodes a unconventional table JPEG', function () {
  var jpegData = fixture('unconventional-table.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(1920);
  expect(rawImageData.height).toEqual(1200);
});

it('decodes a progressive JPEG', function () {
  var jpegData = fixture('skater-progressive.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(256);
  expect(rawImageData.height).toEqual(256);
  var expected = fixture('skater-progressive.rgba');
  expect(rawImageData.data).toEqual(expected);
});

it('decodes a progressive JPEG the same as non-progressive', function () {
  var jpegData = fixture('skater.jpg');
  var rawImageData = jpeg.decode(jpegData);

  var otherJpegData = fixture('skater-progressive.jpg');
  var otherRawImageData = jpeg.decode(otherJpegData);

  expect(rawImageData.width).toEqual(otherRawImageData.width);
  expect(rawImageData.height).toEqual(otherRawImageData.height);
  expect(rawImageData.data).toEqual(otherRawImageData.data);
});

it('encodes a JPEG', function () {
  var frameData = fixture('grumpycat.rgba');
  var rawImageData = {
    data: frameData,
    width: 320,
    height: 180,
  };
  var jpegImageData = jpeg.encode(rawImageData, 50);
  expect(jpegImageData.width).toEqual(320);
  expect(jpegImageData.height).toEqual(180);
  var expected = fixture('grumpycat-50.jpg');
  expect(jpegImageData.data).toEqual(expected);
});

it('creates a JPEG from an array', function () {
  var width = 320,
    height = 180;
  var frameData = new Buffer(width * height * 4);
  var i = 0;
  while (i < frameData.length) {
    frameData[i++] = 0xff; // red
    frameData[i++] = 0x00; // green
    frameData[i++] = 0x00; // blue
    frameData[i++] = 0xff; // alpha - ignored in JPEGs
  }
  var rawImageData = {
    data: frameData,
    width: width,
    height: height,
  };
  var jpegImageData = jpeg.encode(rawImageData, 50);
  expect(jpegImageData.width).toEqual(width);
  expect(jpegImageData.height).toEqual(height);
  var expected = fixture('redbox.jpg');
  expect(jpegImageData.data).toEqual(expected);
});

it('creates a JPEG from an array with comment', function () {
  var width = 320,
    height = 180;
  var comments = ["First comment", "Second comment"];
  var frameData = new Buffer(width * height * 4);
  var i = 0;
  while (i < frameData.length) {
    frameData[i++] = 0xff; // red
    frameData[i++] = 0x00; // green
    frameData[i++] = 0x00; // blue
    frameData[i++] = 0xff; // alpha - ignored in JPEGs
  }
  var rawImageData = {
    data: frameData,
    width: width,
    height: height,
    comments: comments,
  };
  var jpegImageData = jpeg.encode(rawImageData, 50); 
  expect(jpegImageData.width).toEqual(width);
  expect(jpegImageData.height).toEqual(height);
  var expected = fixture('redbox_comment.jpg');
  expect(jpegImageData.data).toEqual(expected);
  expect(jpeg.decode(jpegImageData.data).comments).toEqual(['First comment', 'Second comment']);
});

it('decodes a JPEG into a typed array', function () {
  var jpegData = fixture('grumpycat.jpg');
  var rawImageData = jpeg.decode(jpegData, {useTArray: true});
  expect(rawImageData.width).toEqual(320);
  expect(rawImageData.height).toEqual(180);
  var expected = fixture('grumpycat.rgba');
  expect(rawImageData.data).toEqual(new Uint8Array(expected));
  assert.ok(rawImageData.data instanceof Uint8Array, 'data is a typed array');
});

it('decodes a JPEG from a typed array into a typed array', function () {
  var jpegData = fixture('grumpycat.jpg');
  var rawImageData = jpeg.decode(new Uint8Array(jpegData), {useTArray: true});
  expect(rawImageData.width).toEqual(320);
  expect(rawImageData.height).toEqual(180);
  var expected = fixture('grumpycat.rgba');
  expect(rawImageData.data).toEqual(new Uint8Array(expected));
  assert.ok(rawImageData.data instanceof Uint8Array, 'data is a typed array');
});

it('decodes a JPEG with options', function () {
  var jpegData = fixture('grumpycat.jpg');
  var rawImageData = jpeg.decode(new Uint8Array(jpegData), {
    useTArray: true,
    colorTransform: false,
  });
  expect(rawImageData.width).toEqual(320);
  expect(rawImageData.height).toEqual(180);
  var expected = fixture('grumpycat-nocolortrans.rgba');
  expect(rawImageData.data).toEqual(new Uint8Array(expected));
  assert.ok(rawImageData.data instanceof Uint8Array, 'data is a typed array');
});

it('decodes a JPEG into RGB', function () {
  var jpegData = fixture('grumpycat.jpg');
  var rawImageData = jpeg.decode(new Uint8Array(jpegData), {useTArray: true, formatAsRGBA: false});
  expect(rawImageData.width).toEqual(320);
  expect(rawImageData.height).toEqual(180);
  var expected = fixture('grumpycat.rgb');
  expect(rawImageData.data).toEqual(new Uint8Array(expected));
  assert.ok(rawImageData.data instanceof Uint8Array, 'data is a typed array');
});

it('encodes/decode image with exif data', function () {
  var jpegData = fixture('grumpycat.jpg');
  var imageData = jpeg.decode(new Uint8Array(jpegData));
  assert.ok(imageData.exifBuffer, 'decodes an exif buffer');
  var encodedData = jpeg.encode(imageData);
  var loopImageData = jpeg.decode(new Uint8Array(encodedData.data));
  expect(loopImageData.exifBuffer).toEqual(imageData.exifBuffer);
});

it('decodes image with ffdc marker', function () {
  var jpegData = fixture('marker-ffdc.jpg');
  var imageData = jpeg.decode(new Uint8Array(jpegData));
  expect(imageData.height).toEqual(200);
  expect(imageData.width).toEqual(200);
});


it('decodes large images within memory limits', () => {
  var jpegData = fixture('black-6000x6000.jpg');
  var rawImageData = jpeg.decode(jpegData);
  expect(rawImageData.width).toEqual(6000);
  expect(rawImageData.height).toEqual(6000);
}, 30000);

// See https://github.com/eugeneware/jpeg-js/issues/53
it('limits resolution exposure', function () {
  expect(() => jpeg.decode(SUPER_LARGE_RESOLUTION_JPEG_BUFFER)).toThrow(
    'maxResolutionInMP limit exceeded by 3405MP',
  );
});

it('limits memory exposure', function () {
  expect(() => jpeg.decode(SUPER_LARGE_JPEG_BUFFER, {maxResolutionInMP: 500})).toThrow(
    /maxMemoryUsageInMB limit exceeded by at least \d+MB/,
  );

  // Make sure the limit resets each decode.
  var jpegData = fixture('grumpycat.jpg');
  expect(() => jpeg.decode(jpegData)).not.toThrow();
}, 30000);

// See https://github.com/jpeg-js/jpeg-js/issues/105
it('errors out invalid sampling factors', function () {
  expect(() => jpeg.decode(Buffer.from('/9j/wfFR2AD/UdgA/9r/3g==', 'base64')).toThrow(
    'Invalid sampling factor, expected values above 0'))
});

// Locate the (marker, offset, segmentLength) triples of a JPEG so tests can
// mutate specific segments in place. Entropy-coded data is skipped over.
function findMarkers(buffer) {
  const data = Buffer.from(buffer);
  const markers = [];
  let i = 2;
  while (i < data.length - 1) {
    if (data[i] !== 0xFF) { i++; continue; }
    const marker = data[i + 1];
    if (marker === 0x00 || marker === 0xFF) { i++; continue; }
    if (marker >= 0xD0 && marker <= 0xD7) { i += 2; continue; }
    if (marker === 0xD8 || marker === 0xD9) { markers.push([marker, i, 0]); i += 2; continue; }
    const length = data.readUInt16BE(i + 2);
    markers.push([marker, i, length]);
    if (marker === 0xDA) {
      let j = i + 2 + length;
      while (j < data.length - 1) {
        if (data[j] === 0xFF && data[j + 1] !== 0x00 &&
            !(data[j + 1] >= 0xD0 && data[j + 1] <= 0xD7) && data[j + 1] !== 0xFF) {
          break;
        }
        j++;
      }
      i = j;
    } else {
      i += 2 + length;
    }
  }
  return markers;
}

// Assert that decoding always rejects with a plain Error (never a TypeError,
// never a returned image) whose message names the expected segment.
function expectStructuralError(buffer, expectedSegment) {
  let threw = false;
  try {
    jpeg.decode(buffer, { useTArray: true });
  } catch (err) {
    threw = true;
    expect(err).toBeInstanceOf(Error);
    expect(err).not.toBeInstanceOf(TypeError);
    expect(err.message).toContain(expectedSegment);
  }
  expect(threw).toBe(true);
}

it('decodes a 4:2:0 progressive JPEG with restart markers', function () {
  var dri = jpeg.decode(fixture('prog-33x33-dri.jpg'));
  expect(dri.width).toEqual(33);
  expect(dri.height).toEqual(33);
  var noDri = jpeg.decode(fixture('prog-33x33-nodri.jpg'));
  expect(dri.data).toEqual(noDri.data);
});

it('decodes a progressive grayscale JPEG with restart markers identically without DRI', function () {
  var dri = jpeg.decode(fixture('gray-33x33-dri.jpg'));
  var noDri = jpeg.decode(fixture('gray-33x33-nodri.jpg'));
  expect(dri.width).toEqual(33);
  expect(dri.height).toEqual(33);
  expect(dri.data).toEqual(noDri.data);
});

it('does not throw a TypeError on grayscale restart images in strict mode', function () {
  var dri = jpeg.decode(fixture('gray-33x33-dri.jpg'), { tolerantDecoding: false });
  var noDri = jpeg.decode(fixture('gray-33x33-nodri.jpg'), { tolerantDecoding: false });
  expect(dri.data).toEqual(noDri.data);
  // Color progressive with RST must also survive strict decoding.
  var color = jpeg.decode(fixture('prog-33x33-dri.jpg'), { tolerantDecoding: false });
  expect(color.width).toEqual(33);
});

it('rejects a missing quantization table with a DQT error', function () {
  var good = fixture('prog-33x33-dri.jpg');
  var dqt = findMarkers(good).find(function (m) { return m[0] === 0xDB; });
  var broken = Buffer.from(good);
  // Rewrite the first DQT segment length to 2, i.e. declare zero tables.
  broken.writeUInt16BE(2, dqt[1] + 2);
  expectStructuralError(broken, 'DQT');
});

it('rejects an out-of-range Huffman selector with an SOS error', function () {
  var good = fixture('prog-33x33-dri.jpg');
  var sos = findMarkers(good).find(function (m) { return m[0] === 0xDA; });
  var broken = Buffer.from(good);
  // First scan component's Td/Ta byte: select AC table 15, which never exists.
  broken[sos[1] + 4 + 1 + 1] = 0x0F;
  expectStructuralError(broken, 'SOS');
});

it('rejects a scan header with zero components with an SOS error', function () {
  var good = fixture('prog-33x33-dri.jpg');
  var sos = findMarkers(good).find(function (m) { return m[0] === 0xDA; });
  var broken = Buffer.from(good);
  broken[sos[1] + 4] = 0;
  expectStructuralError(broken, 'SOS');
});

it('rejects a malformed Huffman table with a DHT error', function () {
  var good = fixture('prog-33x33-dri.jpg');
  var dht = findMarkers(good).find(function (m) { return m[0] === 0xC4; });
  var broken = Buffer.from(good);
  broken[dht[1] + 4] = 0x20; // table class 2 is reserved
  expectStructuralError(broken, 'DHT');
});

it('rejects an unsupported frame precision with an SOF error', function () {
  var good = fixture('prog-33x33-dri.jpg');
  var sof = findMarkers(good).find(function (m) { return m[0] === 0xC2; });
  var broken = Buffer.from(good);
  broken[sof[1] + 4] = 12;
  expectStructuralError(broken, 'SOF');
});

it('rejects truncated streams with plain Errors, never TypeErrors', function () {
  var good = fixture('prog-33x33-dri.jpg');
  [4, 50, 200, good.length - 10].forEach(function (cut) {
    var threw = false;
    try {
      jpeg.decode(good.subarray(0, cut), { useTArray: true });
    } catch (err) {
      threw = true;
      expect(err).toBeInstanceOf(Error);
      expect(err).not.toBeInstanceOf(TypeError);
    }
    expect(threw).toBe(true);
  });
});
