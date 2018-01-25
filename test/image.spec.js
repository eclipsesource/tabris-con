import sinon from "sinon";
import fs from "fs";
import mockfs from "mock-fs";
import getImage from "../src/helpers/getImage";
import _ from "lodash";

let expect = require("chai").expect;

const IMAGES_PATH = "../images";
const PLATFORMS_WITH_ICONSETS = ["iOS", "Android"];
const SUPPORTED_DEVICE_PIXEL_RATIOS = [1, 1.5, 2, 3];

describe("image", () => {

  beforeEach(() => global.window = sinon.stub());

  describe("getImage", () => {

    describe("forDevicePlatform", () => {

      before(() => {
        let mockObject = {};
        SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(devicePixelRatio => {
          PLATFORMS_WITH_ICONSETS.forEach(platform => {
            mockObject[getMockedPath(platform, devicePixelRatio)] = new Buffer([]);
          });
        });

        mockfs(mockObject);
      });

      beforeEach(() => global.device = sinon.stub());

      after(() => mockfs.restore());

      it("returns empty string for undefined images", () => {
        let image = getImage.forDevicePlatform(undefined);

        expect(image).to.equal("");
      });

      describe("returns scaled image for supported devicePixelRatio", () => {
        SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(devicePixelRatio => {
          PLATFORMS_WITH_ICONSETS.forEach(platform => {
            it("returns scaled image for devicePixelRatio " + devicePixelRatio, () => {
              device.platform = platform;
              window.devicePixelRatio = devicePixelRatio;

              let image = getImage.forDevicePlatform("foobar");

              expect(image).to.deep.equal({
                src: ["images", platform, "foobar@" + devicePixelRatio + "x.png"].join("/"),
                scale: devicePixelRatio
              });
            });
          });
        });
      });

      describe("returns scaled image for unsupported devicePixelRatio with closest supported scale", () => {
        beforeEach(() => device.platform = "Android");

        it("returns image with scale 3 for devicePixelRatio 4", () => {
          window.devicePixelRatio = 4;

          let image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "images/Android/foobar@3x.png", scale: 3});
        });

        it("returns image with scale 3 for devicePixelRatio 2.6", () => {
          window.devicePixelRatio = 2.6;

          let image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "images/Android/foobar@3x.png", scale: 3});
        });

        it("returns image with scale 2 for devicePixelRatio 2.46", () => {
          window.devicePixelRatio = 2.46;

          let image = getImage.forDevicePlatform("foobar");

          expect(image).to.deep.equal({src: "images/Android/foobar@2x.png", scale: 2});
        });

        it("returns image with explicit image size", () => {
          window.devicePixelRatio = 3;

          let remoteImage = getImage.forDevicePlatform("http://location", 200, 300);

          expect(remoteImage).to.deep.equal({src: "http://location", width: 200, height: 300});
        });

      });

    });

    describe("common", () => {

      it("returns non-platform specific images", () => {
        window.devicePixelRatio = 2.46;

        let image = getImage.common("foobar");

        expect(image).to.deep.equal({src: "images/foobar@2x.png", scale: 2});
      });

    });

  });

  describe("resource", () => {
    let iOSImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH, "iOS"].join("/")))
      .map(extractFilenames)
      .compact()
      .value();
    let androidImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH, "Android"].join("/")))
      .map(extractFilenames)
      .compact()
      .value();
    let commonImageNames = _(fs.readdirSync([__dirname, IMAGES_PATH].join("/")))
      .map(extractFilenames)
      .filter(filename => ["iOS", "Android", "windows"].indexOf(filename) < 0)
      .compact()
      .value();
    _.uniq(iOSImageNames).forEach(assertletiantsExist("iOS"));
    _.uniq(androidImageNames).forEach(assertletiantsExist("Android"));
    _.uniq(commonImageNames).forEach(assertletiantsExist());
  });

});

function assertletiantsExist(platform) {
  return imageName => {
    it(imageName + " has letiants for all supported densities for " + (platform || "both platforms"), () => {
      SUPPORTED_DEVICE_PIXEL_RATIOS.forEach(density => {
        let filePath = [__dirname, IMAGES_PATH];
        if (platform) {
          filePath.push(platform);
        }
        filePath.push(imageName + "@" + density + "x.png");
        let fileExists = fs.statSync(filePath.join("/")).isFile();

        expect(fileExists).to.be.true;
      });
    });
  };
}

function extractFilenames(el) {
  if (el.indexOf("@") > -1) {
    return el.match(/[^@]*/)[0];
  } else {
    return null;
  }
}

function getMockedPath(platform, devicePixelRatio) {
  return [
    __dirname,
    "../../images",
    platform,
    "foobar@" + devicePixelRatio + "x.png"
  ];
}
