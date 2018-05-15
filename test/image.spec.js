import sinon from "sinon";
import fs from "fs";
import mockfs from "mock-fs";
import getImage from "../src/helpers/getImage";
import _ from "lodash";

let expect = require("chai").expect;

const IMAGES_PATH = "../images";
const SUPPORTED_DEVICE_PIXEL_RATIOS = [1, 1.5, 2, 3];

describe("image", () => {

  beforeEach(() => global.window = sinon.stub());

  describe("getImage", () => {

    before(() => {
      let mockObject = {};
      SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(devicePixelRatio =>
        mockObject[getMockedPath(devicePixelRatio)] = new Buffer([])
      );
      mockfs(mockObject);
    });

    after(() => mockfs.restore());

    it("returns empty string for undefined images", () => {
      let image = getImage(undefined);

      expect(image).to.equal("");
    });

    describe("returns scaled image for supported devicePixelRatio", () => {
      SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(devicePixelRatio => {
        it("returns scaled image for devicePixelRatio " + devicePixelRatio, () => {
          window.devicePixelRatio = devicePixelRatio;

          let image = getImage("foobar");

          expect(image).to.deep.equal({
            src: ["images", "foobar@" + devicePixelRatio + "x.png"].join("/"),
            scale: devicePixelRatio
          });
        });
      });
    });

    describe("returns scaled image for unsupported devicePixelRatio with closest supported scale", () => {
      it("returns image with scale 3 for devicePixelRatio 4", () => {
        window.devicePixelRatio = 4;

        let image = getImage("foobar");

        expect(image).to.deep.equal({src: "images/foobar@3x.png", scale: 3});
      });

      it("returns image with scale 3 for devicePixelRatio 2.6", () => {
        window.devicePixelRatio = 2.6;

        let image = getImage("foobar");

        expect(image).to.deep.equal({src: "images/foobar@3x.png", scale: 3});
      });

      it("returns image with scale 2 for devicePixelRatio 2.46", () => {
        window.devicePixelRatio = 2.46;

        let image = getImage("foobar");

        expect(image).to.deep.equal({src: "images/foobar@2x.png", scale: 2});
      });

      it("returns image with explicit image size", () => {
        window.devicePixelRatio = 3;

        let remoteImage = getImage("http://location", 200, 300);

        expect(remoteImage).to.deep.equal({src: "http://location", width: 200, height: 300});
      });

    });

  });

  describe("resource", () => {
    let imageNames = _(fs.readdirSync([__dirname, IMAGES_PATH].join("/")))
      .map(extractFilenames)
      .compact()
      .value();
    _.uniq(imageNames).forEach(assertVariantsExist);
  });

});

function assertVariantsExist(imageName) {
  it(imageName + " has variants for all supported densities", () => {
    SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(density => {
      let filePath = `${__dirname}/${IMAGES_PATH}/${imageName}@${density}x.png`;
      let fileExists = fs.statSync(filePath).isFile();

      expect(fileExists).to.be.true;
    });
  });
}

function extractFilenames(el) {
  if (el.indexOf("@") > -1) {
    return el.match(/[^@]*/)[0];
  } else {
    return null;
  }
}

function getMockedPath(devicePixelRatio) {
  return [
    __dirname,
    "../../images",
    "foobar@" + devicePixelRatio + "x.png"
  ];
}
