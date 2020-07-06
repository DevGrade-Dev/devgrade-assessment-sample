const https = require("https");
const REPO_FILE = "./repo.txt";
const UNIT_TEST_RESULT_PATH = "../results.json";
const SCORE_PATH = "./scores.json";

const scores = require(SCORE_PATH);
const unitTest = require(UNIT_TEST_RESULT_PATH);
const lineReader = require("line-reader");

const getCommitId = filePath => {
  return new Promise((resolve, reject) => {
    lineReader.eachLine(filePath, line => {
      resolve(line);
    });
  });
};

const postData = async () => {
  const repoName = await getCommitId(REPO_FILE);
  const { testResults, startTime, numTotalTests, success } = unitTest;
  const result = testResults[0].assertionResults;
  console.log(result)

  const summary = {
    date: new Date(startTime),
    numTotalTests,
    success
  };

  const { bugs, features } = scores;
  const bugFixing = bugs.map(testCase => {
    let unitTest = result.find(test => {
      return test.fullName === testCase.desc;
    });
    let testScore = 1;
    if (testCase.score) {
      testScore = testCase.score;
    }
    return {
      fullName: unitTest.fullName,
      success: unitTest.status == "passed" ? true : false,
      score: testScore,
      suite: '',
    };
  });

  const featureImplementation = features.map(testCase => {
    let unitTest = result.find(test => {
      return test.fullName === testCase.desc;
    });
    let testScore = 1;
    if (testCase.score) {
      testScore = testCase.score;
    }
    return {
      fullName: unitTest.fullName,
      success: unitTest.status == "passed" ? true : false,
      suite: '',
      score: testScore
    };
  });
  const params = {
    repoName,
    summary,
    bugFixing,
    featureImplementation
  };
  return params;
};

const sendReportData = async () => {
  const data = await postData();
  console.log(data);
  const options = {
    hostname: "app.devgrade.io",
    path: "/assessments/report",
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Content-Length": Buffer.byteLength(JSON.stringify(data))
    }
  };

  const req = https.request(options, res => {});

  req.write(JSON.stringify(data));
  req.end();
};

sendReportData();
