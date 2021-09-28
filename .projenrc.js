const { AwsCdkTypeScriptApp } = require('projen');
const project = new AwsCdkTypeScriptApp({
  cdkVersion: '2.0.0-rc.18',
  defaultReleaseBranch: 'main',
  name: 'custom-resources',
  deps: [
    '@types/aws-lambda',
    '@aws-sdk/client-dynamodb',
    '@aws-sdk/lib-dynamodb',
    '@aws-sdk/util-dynamodb',
    'esbuild',
  ],
  releaseWorkflow: false,        /* Define a GitHub workflow for releasing from "main" when new versions are bumped. */
  buildWorkflow: false,        /* Define a GitHub workflow for releasing from "main" when new versions are bumped. */
  // cdkDependencies: undefined,        /* Which AWS CDK modules (those that start with "@aws-cdk/") this app uses. */
  // deps: [],                          /* Runtime dependencies of this module. */
  // description: undefined,            /* The description is just a string that helps people understand the purpose of the package. */
  // devDeps: [],                       /* Build dependencies for this module. */
  // packageName: undefined,            /* The "name" in package.json. */
  // projectType: ProjectType.UNKNOWN,  /* Which type of project this is (library/app). */
});
project.synth();