import chai from "chai";
import sinonChai from "sinon-chai";
import sinon from "sinon";

const { expect } = chai;

chai.use(sinonChai);

global.expect = expect;
global.sinon = sinon;
