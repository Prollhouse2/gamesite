- name: Unity - Test runner
  # You may pin to the exact commit or the version.
  # uses: game-ci/unity-test-runner@3d5d2f58348b293ae1fe6b7cca24deccaf505b2f
  uses: game-ci/unity-test-runner@v2.0.3
  with:
    # Version of unity to use for testing the project. Use "auto" to get from your ProjectSettings/ProjectVersion.txt
    unityVersion: # optional, default is auto
    # Specific docker image that should be used for testing the project
    customImage: # optional, default is 
    # Path to the Unity project to be tested.
    projectPath: # optional
    # Extra parameters to configure the Unity editor run.
    customParameters: # optional
    # The type of tests to be run by the test runner.
    testMode: # optional, default is all
    # Optional coverage parameters for the -coverageOptions argument.
    coverageOptions: # optional, default is generateAdditionalMetrics;generateHtmlReport;generateBadgeReport
    # Path where test artifacts should be stored.
    artifactsPath: # optional, default is artifacts
    # Initialises Docker using the host network.
    useHostNetwork: # optional
    # SSH Agent path to forward to the container.
    sshAgent: # optional, default is 
    # GitHub Private Access Token (PAT) to pull from GitHub.
    gitPrivateToken: # optional, default is 
    # Token to authorize access to the GitHub REST API. If provided, a check run will be created with the test results.
    githubToken: # optional, default is 
    # Name for the check run that is created when a github token is provided.
    checkName: # optional, default is Test Results
    # User and optionally group (user or user:group or uid:gid) to give ownership of the resulting build artifacts
    chownFilesTo: # optional, default is 
