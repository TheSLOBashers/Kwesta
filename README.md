# Kwesta

Backend CI:
[![CI Testing](https://github.com/TheSLOBashers/Kwesta/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/TheSLOBashers/Kwesta/actions/workflows/ci-testing.yml)

Frontend CI:
[![CI Testing](https://github.com/TheSLOBashers/Kwesta-mobile/actions/workflows/ci-testing.yml/badge.svg)](https://github.com/TheSLOBashers/Kwesta-mobile/actions/workflows/ci-testing.yml)

ExpoGo Frontend Repo:
https://github.com/TheSLOBashers/Kwesta-mobile

Azure Deployment:
https://portal.azure.com/?Microsoft_Azure_Education_correlationId=6950e8e3-a10a-4116-824a-0380d150bdf0&Microsoft_Azure_Education_newA4E=true&Microsoft_Azure_Education_asoSubGuid=d3580a58-bb30-4a61-9a70-d50ee59ba525&feature.tokencaching=true&feature.internalgraphapiversion=true#@cpslo.onmicrosoft.com/resource/subscriptions/d3580a58-bb30-4a61-9a70-d50ee59ba525/resourcegroups/Kwesta_group/providers/Microsoft.Web/sites/Kwesta/appServices

No Frontend Deployment (We run on Expo Go currently so cannot deploy on Azure)
Running on Expo Go: Download Expo Go on a mobile device. On your local Kwesta-mobile frontend repository, type 'npx expo start --tunnel'. Scan the ensuing QR code on your phone to open the app through Expo.

CI/CD: Integration and deployment are automatic, simply merge to main to deploy to Azure backend. 

Testing: For backend testing, run 'npm test' in the express-backend directory. For frontend testing, run the same command at the root.

Style Guide:
https://www.npmjs.com/package/prettier-airbnb-config

Tech Spec:
https://docs.google.com/document/d/1V4y0tETkm5it_NeF6lsYGKSNmDVOfJxu_tAClnmbRXw/edit?usp=sharing 

WireFrame:
https://www.figma.com/design/vIJz5Ic5fPsytRZv2OmnAW/Kwesta-WireFrame?node-id=0-1&t=vkRvYFXJI38qhGUj-1

Class Diagram:
https://docs.google.com/presentation/d/1dmzq3xeTC0SYu1JxJ3COm338a2zMQutCBzLJ3dsb2Kk/edit?usp=sharing

Video Demos:
Fetching/Moving Demo:
https://drive.google.com/file/d/1dsyasGvmEdiVQqBIgejliJTX-MH2ar79/view?usp=sharing 

Badges and Store Demo:
https://drive.google.com/file/d/1ZxzyYKJT_yc9P3tmW8qo6hKxthkR8-rj/view?usp=sharing 

Posts/Interactivity Demo:
https://drive.google.com/file/d/1RmSu-H56LaVpZpWhQZfC6_bIa-eyO3Rq/view?usp=sharing 

Final Project Review Slides:
https://docs.google.com/presentation/d/1v_WXARrZn30IfWm8PLPMiCVL1l0722yKmzE9NL2a7IU/edit?usp=sharing 

Halfway Project Review Slides:
https://docs.google.com/presentation/d/10wOHxZfP8yCFYVyZTwTtdKyZ9rbHlbcMGy1eXjpHqO0/edit?usp=sharing

Code Coverage:

ℹ tests 120
ℹ suites 9
ℹ pass 120
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 2779.6765
ℹ start of coverage report
ℹ -------------------------------------------------------------------------------------------------------------
ℹ file                                     | line % | branch % | funcs % | uncovered lines
ℹ -------------------------------------------------------------------------------------------------------------
ℹ models                                   |        |          |         | 
ℹ  badges.js                               | 100.00 |   100.00 |  100.00 | 
ℹ  comment-services.js                     | 100.00 |   100.00 |  100.00 | 
ℹ  comment.js                              | 100.00 |   100.00 |  100.00 | 
ℹ  event-services.js                       | 100.00 |   100.00 |  100.00 | 
ℹ  event.js                                | 100.00 |   100.00 |  100.00 | 
ℹ  quest-services.js                       |  85.95 |   100.00 |   82.35 | 20-37 39-57 111-115
ℹ  quest.js                                | 100.00 |   100.00 |  100.00 | 
ℹ  user-services.js                        |  98.95 |    97.65 |   97.37 | 22-26
ℹ  user.js                                 | 100.00 |   100.00 |  100.00 | 
ℹ routes                                   |        |          |         | 
ℹ  auth.js                                 | 100.00 |   100.00 |   95.00 | 
ℹ tests                                    |        |          |         | 
ℹ  auth.test.js                            |  97.85 |    98.31 |   75.34 | 111-112 272-280 283 286-287 593 606
ℹ  comment-services.test.js                |  99.63 |   100.00 |   97.67 | 501-502
ℹ  event-services.test.js                  | 100.00 |   100.00 |  100.00 | 
ℹ  helpers                                 |        |          |         | 
ℹ   query-builder.js                       | 100.00 |   100.00 |  100.00 | 
ℹ  mockingoose-comment-services.test.js    | 100.00 |   100.00 |  100.00 | 
ℹ  mockingoose-event-services.test.js      |  98.48 |    90.91 |  100.00 | 27
ℹ  mockingoose-quest-services.test.js      |  98.91 |    91.67 |  100.00 | 53
ℹ  mockingoose-user-services.test.js       |  96.55 |    77.14 |  100.00 | 37-38 73 102 139 162
ℹ  quest-services.test.js                  | 100.00 |   100.00 |  100.00 | 
ℹ  user-services.test.js                   |  99.74 |    98.36 |  100.00 | 50 115
ℹ -------------------------------------------------------------------------------------------------------------
ℹ all files                                |  98.54 |    97.78 |   94.67 | 
ℹ -------------------------------------------------------------------------------------------------------------
