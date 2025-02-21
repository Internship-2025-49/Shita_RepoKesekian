/** @type {import('ts-jest').JestConfigWithTsJest} **/
export default {
  testEnvironment: "node",
  transform: {
     "^.+\\.ts?$": "ts-jest"
  },
  moduleNameMapper: {
    "~src/(.*)": "<rootDir>/src/$1"
  },
  testMatch: ["**/?(*.)+(test|spec).[jt]s?(x)"]
};