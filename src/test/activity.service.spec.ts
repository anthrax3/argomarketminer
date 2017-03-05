"use strict";

describe("activityService", () => {
    const api = "/api/transactions";

    let $httpBackend,
        sessionService,
        activityService;

    beforeEach(angular.mock.module("components"));

    beforeEach(inject($injector => {
        const environment = "my environment",
            token = "my token",
            accountId = "my account id";

        $httpBackend = $injector.get("$httpBackend");
        activityService = $injector.get("activityService");
        sessionService = $injector.get("sessionService");

        sessionService.setCredentials({
            environment,
            token,
            accountId
        });

        $httpBackend
            .when("POST", api)
            .respond([
                {
                    accountBalance: 100000,
                    accountId: 6765103,
                    id: 176403879,
                    instrument: "EUR_USD",
                    interest: 0,
                    pl: 0,
                    price: 1.25325,
                    side: "buy",
                    time: "2014-04-07T18:31:05Z",
                    tradeOpened: {
                        id: 176403879,
                        units: 2
                    },
                    type: "MARKET_ORDER_CREATE",
                    units: 2
                }
            ]);

        $httpBackend.whenGET(/^app\/.*\.html$/).respond(200);
    }));

    afterEach(() => {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
    });

    describe("getActivities", () => {
        it("test", () => {
            activityService.getActivities().then(activities => {

                const assert = chai.assert;

                assert.lengthOf(activities, 1);

                assert.equal("176403879", activities[0].id);
                assert.equal("MARKET_ORDER_CREATE", activities[0].type);
                assert.equal("EUR_USD", activities[0].instrument);
                assert.equal("2", activities[0].units);
                assert.equal("1.25325", activities[0].price);
                assert.equal("0", activities[0].interest);
                assert.equal("0", activities[0].pl);
                assert.equal("100000", activities[0].accountBalance);
                assert.equal("2014-04-07T18:31:05Z", activities[0].time);
            });
            $httpBackend.flush();
        });
    });
});
